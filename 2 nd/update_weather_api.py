import os

TARGET_FILE = r"C:\Users\habee\backend\app\api\weather_live.py"

content = '''from typing import Dict, List, Any, Optional
from fastapi import APIRouter, Query
import sqlite3
import os
from app.config import settings
from app.utils.india_geo import (
    INDIA_STATES_AND_DISTRICTS, 
    INDIA_STATES_CAPITALS_DISTRICTS, 
    get_live_google_weather, 
    prefetch_all_india_weather
)

router = APIRouter(tags=["All-India Weather & Geography"])

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "water_intelligence.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@router.get("/geo/india", response_model=Dict[str, List[str]])
def get_india_states_and_districts():
    """Returns all Indian States, Union Territories, and Districts."""
    return INDIA_STATES_AND_DISTRICTS

@router.get("/geo/india/details", response_model=Dict[str, Any])
def get_india_states_capitals_and_districts():
    """Returns all Indian States & UTs with their respective Capitals and Districts."""
    return INDIA_STATES_CAPITALS_DISTRICTS

@router.get("/weather/live", response_model=Dict[str, Any])
def get_live_weather(
    state: str = Query("Maharashtra", description="Indian State or Union Territory"),
    district: str = Query("Mumbai", description="District Name")
):
    """Fetches live weather reports for any Indian State & District."""
    return get_live_google_weather(state=state, district=district)

@router.get("/weather/prefetched", response_model=Dict[str, Dict[str, Any]])
def get_all_prefetched_weather():
    """Returns prefetched live weather reports for ALL Indian States, Capitals & Districts."""
    return prefetch_all_india_weather()

@router.get("/weather/records/filters")
def get_weather_records_filters():
    """Returns available filter options (states, seasons, date bounds) from the Excel dataset."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        states = [r[0] for r in cursor.execute("SELECT DISTINCT state FROM weather_records WHERE state IS NOT NULL ORDER BY state").fetchall()]
        seasons = [r[0] for r in cursor.execute("SELECT DISTINCT season FROM weather_records WHERE season IS NOT NULL ORDER BY season").fetchall()]
        date_min_max = cursor.execute("SELECT MIN(date_of_record), MAX(date_of_record), COUNT(*) FROM weather_records").fetchone()
        
        return {
            "states": states,
            "seasons": seasons,
            "date_range_start": date_min_max[0] if date_min_max else None,
            "date_range_end": date_min_max[1] if date_min_max else None,
            "total_records": date_min_max[2] if date_min_max else 0
        }
    finally:
        conn.close()

@router.get("/weather/records/search")
def search_weather_records(
    q: Optional[str] = Query(None, description="Search query for district, station name, or state"),
    state: Optional[str] = Query(None, description="Filter by State"),
    district: Optional[str] = Query(None, description="Filter by District"),
    season: Optional[str] = Query(None, description="Filter by Season"),
    min_rainfall: Optional[float] = Query(None, description="Minimum rainfall in mm"),
    max_rainfall: Optional[float] = Query(None, description="Maximum rainfall in mm"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    sort_by: str = Query("date_of_record", description="Field to sort by"),
    sort_dir: str = Query("desc", description="Sort direction (asc or desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(25, ge=1, le=500, description="Records per page")
):
    """
    Lightning-fast indexed search across the 970,339 rows from india_weather_rainfall_data.xlsx.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        conditions = []
        params = []

        if q and q.strip():
            clean_q = f"%{q.strip()}%"
            conditions.append("(district LIKE ? OR station_name LIKE ? OR state LIKE ?)")
            params.extend([clean_q, clean_q, clean_q])

        if state and state.strip() and state != "ALL":
            conditions.append("state = ?")
            params.append(state.strip())

        if district and district.strip() and district != "ALL":
            conditions.append("district LIKE ?")
            params.append(f"%{district.strip()}%")

        if season and season.strip() and season != "ALL":
            conditions.append("season = ?")
            params.append(season.strip())

        if min_rainfall is not None:
            conditions.append("rainfall >= ?")
            params.append(min_rainfall)

        if max_rainfall is not None:
            conditions.append("rainfall <= ?")
            params.append(max_rainfall)

        if start_date and start_date.strip():
            conditions.append("date_of_record >= ?")
            params.append(start_date.strip())

        if end_date and end_date.strip():
            conditions.append("date_of_record <= ?")
            params.append(end_date.strip())

        where_clause = ""
        if conditions:
            where_clause = "WHERE " + " AND ".join(conditions)

        # 1. Get Count and Aggregate Summary
        summary_query = f"""
            SELECT 
                COUNT(*) as count,
                COALESCE(ROUND(AVG(rainfall), 2), 0) as avg_rainfall,
                COALESCE(ROUND(MAX(rainfall), 2), 0) as max_rainfall,
                COALESCE(ROUND(AVG(avg_temp), 1), 0) as avg_temp,
                COALESCE(ROUND(MAX(max_temp), 1), 0) as max_temp,
                COALESCE(ROUND(AVG(wind_speed), 1), 0) as avg_wind,
                COUNT(DISTINCT district) as unique_districts,
                COUNT(DISTINCT station_name) as unique_stations
            FROM weather_records
            {where_clause}
        """
        summary_row = cursor.execute(summary_query, params).fetchone()
        total_count = summary_row["count"] if summary_row else 0

        # Validate sorting
        valid_sort_fields = {
            "date_of_record": "date_of_record",
            "rainfall": "rainfall",
            "avg_temp": "avg_temp",
            "max_temp": "max_temp",
            "wind_speed": "wind_speed",
            "station_name": "station_name",
            "district": "district",
            "state": "state"
        }
        order_col = valid_sort_fields.get(sort_by, "date_of_record")
        order_dir = "ASC" if sort_dir.lower() == "asc" else "DESC"

        # 2. Query Paginated Records
        offset = (page - 1) * limit
        records_query = f"""
            SELECT 
                date_of_record, month, season, station_name, state, district,
                avg_temp, min_temp, max_temp, wind_speed, air_pressure,
                elevation, latitude, longitude, rainfall
            FROM weather_records
            {where_clause}
            ORDER BY {order_col} {order_dir}
            LIMIT ? OFFSET ?
        """
        records_params = params + [limit, offset]
        rows = cursor.execute(records_query, records_params).fetchall()

        records = [dict(r) for r in rows]
        total_pages = (total_count + limit - 1) // limit if limit > 0 else 1

        return {
            "total_count": total_count,
            "page": page,
            "limit": limit,
            "total_pages": total_pages,
            "summary": {
                "total_records": total_count,
                "avg_rainfall_mm": summary_row["avg_rainfall"] if summary_row else 0,
                "max_rainfall_mm": summary_row["max_rainfall"] if summary_row else 0,
                "avg_temp_c": summary_row["avg_temp"] if summary_row else 0,
                "max_temp_c": summary_row["max_temp"] if summary_row else 0,
                "avg_wind_kmh": summary_row["avg_wind"] if summary_row else 0,
                "unique_districts": summary_row["unique_districts"] if summary_row else 0,
                "unique_stations": summary_row["unique_stations"] if summary_row else 0
            },
            "records": records
        }
    finally:
        conn.close()
'''

with open(TARGET_FILE, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated:", TARGET_FILE)
