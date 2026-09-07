import os

# Create the air quality API file
aq_code = '''"""OpenAQ Air Quality API - Real-time air quality data for Indian cities."""
import httpx
from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from app.config import settings

router = APIRouter(prefix="/air-quality", tags=["Air Quality (OpenAQ)"])

OPENAQ_HEADERS = {
    "X-API-Key": settings.OPENAQ_API_KEY,
    "Accept": "application/json",
}

# Major Indian city coordinates
INDIA_CITIES = {
    "Mumbai": {"lat": 19.076, "lon": 72.8777},
    "Delhi": {"lat": 28.6139, "lon": 77.209},
    "Bangalore": {"lat": 12.9716, "lon": 77.5946},
    "Hyderabad": {"lat": 17.385, "lon": 78.4867},
    "Chennai": {"lat": 13.0827, "lon": 80.2707},
    "Kolkata": {"lat": 22.5726, "lon": 88.3639},
    "Pune": {"lat": 18.5204, "lon": 73.8567},
    "Ahmedabad": {"lat": 23.0225, "lon": 72.5714},
    "Jaipur": {"lat": 26.9124, "lon": 75.7873},
    "Lucknow": {"lat": 26.8467, "lon": 80.9462},
}


class AQMeasurement(BaseModel):
    parameter: str
    value: float
    unit: str
    last_updated: Optional[str] = None


class AQStation(BaseModel):
    location_id: Optional[int] = None
    name: str
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    measurements: List[AQMeasurement] = []


class AQResponse(BaseModel):
    city: str
    country: str
    stations: List[AQStation] = []
    aqi_summary: Optional[dict] = None


@router.get("/locations", summary="Search OpenAQ locations in India")
async def search_locations(
    city: Optional[str] = Query(None, description="City name (e.g., Mumbai, Delhi)"),
    limit: int = Query(10, ge=1, le=100),
):
    """Search for air quality monitoring locations in India via OpenAQ v3."""
    params = {
        "limit": limit,
        "countries_id": 13,
        "order_by": "name",
    }
    if city:
        coords = INDIA_CITIES.get(city)
        if coords:
            params["coordinates"] = f"{coords['lat']},{coords['lon']}"
            params["radius"] = 50000
    params = {k: v for k, v in params.items() if v is not None}

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{settings.OPENAQ_BASE_URL}/locations",
                params=params,
                headers=OPENAQ_HEADERS,
            )
        if resp.status_code != 200:
            return {"results": [], "message": f"OpenAQ returned {resp.status_code}", "raw": resp.text[:500]}
        data = resp.json()
        results = data.get("results", [])
        return {
            "count": len(results),
            "results": [
                {
                    "id": loc.get("id"),
                    "name": loc.get("name"),
                    "city": loc.get("locality") or loc.get("city"),
                    "latitude": loc.get("coordinates", {}).get("latitude") if loc.get("coordinates") else None,
                    "longitude": loc.get("coordinates", {}).get("longitude") if loc.get("coordinates") else None,
                    "parameters": [p.get("name") or p.get("parameter") for p in loc.get("sensors", loc.get("parameters", []))],
                    "last_updated": loc.get("datetimeLast", {}).get("utc") if isinstance(loc.get("datetimeLast"), dict) else loc.get("datetimeLast"),
                }
                for loc in results
            ],
        }
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="OpenAQ API timeout")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OpenAQ request failed: {str(e)}")


@router.get("/latest", summary="Get latest air quality measurements")
async def get_latest_measurements(
    city: str = Query("Delhi", description="Indian city name"),
    limit: int = Query(5, ge=1, le=50),
):
    """Get latest air quality readings for a city using OpenAQ v3."""
    coords = INDIA_CITIES.get(city, INDIA_CITIES["Delhi"])
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            loc_resp = await client.get(
                f"{settings.OPENAQ_BASE_URL}/locations",
                params={
                    "coordinates": f"{coords['lat']},{coords['lon']}",
                    "radius": 30000,
                    "limit": limit,
                    "countries_id": 13,
                },
                headers=OPENAQ_HEADERS,
            )
        if loc_resp.status_code != 200:
            return {"city": city, "stations": [], "error": f"OpenAQ status {loc_resp.status_code}"}

        locations = loc_resp.json().get("results", [])
        stations = []
        for loc in locations:
            sensors = loc.get("sensors", loc.get("parameters", []))
            measurements = []
            for s in sensors:
                param_name = s.get("name") or s.get("parameter", "unknown")
                latest = s.get("latest") or s.get("lastValue")
                if latest is not None:
                    measurements.append(AQMeasurement(
                        parameter=param_name,
                        value=float(latest) if latest else 0.0,
                        unit=s.get("units", {}).get("name", "") if isinstance(s.get("units"), dict) else s.get("unit", ""),
                        last_updated=s.get("datetimeLast", {}).get("utc") if isinstance(s.get("datetimeLast"), dict) else None,
                    ))
            coord_data = loc.get("coordinates", {})
            stations.append(AQStation(
                location_id=loc.get("id"),
                name=loc.get("name", "Unknown Station"),
                city=loc.get("locality") or city,
                latitude=coord_data.get("latitude") if coord_data else None,
                longitude=coord_data.get("longitude") if coord_data else None,
                measurements=measurements,
            ))

        # Build AQI summary from PM2.5
        aqi_summary = None
        for st in stations:
            for m in st.measurements:
                if "pm25" in m.parameter.lower() or "pm2.5" in m.parameter.lower():
                    pm25_val = m.value
                    if pm25_val <= 12:
                        category, color = "Good", "#00e400"
                    elif pm25_val <= 35.4:
                        category, color = "Moderate", "#ffff00"
                    elif pm25_val <= 55.4:
                        category, color = "Unhealthy for Sensitive Groups", "#ff7e00"
                    elif pm25_val <= 150.4:
                        category, color = "Unhealthy", "#ff0000"
                    elif pm25_val <= 250.4:
                        category, color = "Very Unhealthy", "#8f3f97"
                    else:
                        category, color = "Hazardous", "#7e0023"
                    aqi_summary = {"pm25": pm25_val, "category": category, "color": color, "station": st.name}
                    break
            if aqi_summary:
                break

        return AQResponse(city=city, country="India", stations=stations, aqi_summary=aqi_summary)
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="OpenAQ API timeout")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OpenAQ request failed: {str(e)}")


@router.get("/cities", summary="List supported Indian cities")
async def list_supported_cities():
    """List all pre-configured Indian cities with coordinates."""
    return {
        "cities": [
            {"name": name, "latitude": coords["lat"], "longitude": coords["lon"]}
            for name, coords in sorted(INDIA_CITIES.items())
        ]
    }
'''

path = r'C:\\Users\\habee\\backend\\app\\api\\air_quality.py'
with open(path, 'w', encoding='utf-8') as f:
    f.write(aq_code)
print(f"Created: {path}")

# 2. Register the router in main.py
main_path = r'C:\\Users\\habee\\backend\\app\\main.py'
with open(main_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Add import
text = text.replace(
    'reports, predictions_history, admin, weather_live, core',
    'reports, predictions_history, admin, weather_live, core, air_quality'
)

# Add router registration
text = text.replace(
    'app.include_router(weather_live.router, prefix=settings.API_V1_STR)',
    'app.include_router(weather_live.router, prefix=settings.API_V1_STR)\napp.include_router(air_quality.router, prefix=settings.API_V1_STR)'
)

with open(main_path, 'w', encoding='utf-8') as f:
    f.write(text)
print(f"Updated: {main_path} — added air_quality router")
