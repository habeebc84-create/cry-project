import os

TARGET_FILE = r"C:\Users\habee\frontend\src\services\api.ts"

with open(TARGET_FILE, "r", encoding="utf-8") as f:
    text = f.read()

addition = '''
// ALL-INDIA EXCEL DATASET REAL RECORDS SEARCH (970,339 ROWS)
export interface WeatherSearchParams {
  q?: string;
  state?: string;
  district?: string;
  season?: string;
  min_rainfall?: number;
  max_rainfall?: number;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_dir?: string;
  page?: number;
  limit?: number;
}

export interface WeatherRecord {
  date_of_record: string;
  month: string;
  season: string;
  station_name: string;
  state: string;
  district: string;
  avg_temp: number;
  min_temp: number;
  max_temp: number;
  wind_speed: number;
  air_pressure: number;
  elevation: number;
  latitude: number;
  longitude: number;
  rainfall: number;
}

export interface WeatherSearchResponse {
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
  summary: {
    total_records: number;
    avg_rainfall_mm: number;
    max_rainfall_mm: number;
    avg_temp_c: number;
    max_temp_c: number;
    avg_wind_kmh: number;
    unique_districts: number;
    unique_stations: number;
  };
  records: WeatherRecord[];
}

export const weatherRecordsApi = {
  getFilters: async () => {
    const res = await api.get('/weather/records/filters');
    return res.data;
  },
  search: async (params: WeatherSearchParams): Promise<WeatherSearchResponse> => {
    const res = await api.get('/weather/records/search', { params });
    return res.data;
  }
};
'''

if "weatherRecordsApi" not in text:
    # Insert before export default api;
    text = text.replace("export default api;", addition + "\nexport default api;")
    with open(TARGET_FILE, "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated api.ts successfully!")
else:
    print("weatherRecordsApi already present in api.ts.")
