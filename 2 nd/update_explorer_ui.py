import os

TARGET_FILE = r"C:\Users\habee\frontend\src\components\ui\AllIndiaRainfallExplorer.tsx"

explorer_code = '''import React, { useEffect, useState, useCallback } from 'react';
import { 
  CloudRain, Search, Zap, Compass, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Thermometer, Wind, Gauge, 
  MapPin, Calendar, Loader2, ArrowUpDown, Filter, BarChart3
} from 'lucide-react';
import { weatherRecordsApi, type WeatherRecord, type WeatherSearchResponse } from '../../services/api';
import { Badge } from './Badge';

export const AllIndiaRainfallExplorer: React.FC = () => {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [summary, setSummary] = useState<WeatherSearchResponse['summary']>({
    total_records: 0,
    avg_rainfall_mm: 0,
    max_rainfall_mm: 0,
    avg_temp_c: 0,
    max_temp_c: 0,
    avg_wind_kmh: 0,
    unique_districts: 0,
    unique_stations: 0,
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedSeason, setSelectedSeason] = useState<string>('ALL');
  const [rainfallFilter, setRainfallFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('date_of_record');
  const [sortDir, setSortDir] = useState<string>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);

  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load filter options on mount
  useEffect(() => {
    weatherRecordsApi.getFilters().then((res) => {
      if (res.states) setAvailableStates(res.states);
      if (res.seasons) setAvailableSeasons(res.seasons);
    }).catch(console.error);
  }, []);

  // Fetch search records
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      let minRain: number | undefined = undefined;
      let maxRain: number | undefined = undefined;

      if (rainfallFilter === 'RAIN_ONLY') minRain = 0.1;
      else if (rainfallFilter === 'MODERATE') { minRain = 10; maxRain = 50; }
      else if (rainfallFilter === 'HEAVY') { minRain = 50; maxRain = 100; }
      else if (rainfallFilter === 'VERY_HEAVY') { minRain = 100; }

      const res = await weatherRecordsApi.search({
        q: searchQuery.trim() || undefined,
        state: selectedState !== 'ALL' ? selectedState : undefined,
        season: selectedSeason !== 'ALL' ? selectedSeason : undefined,
        min_rainfall: minRain,
        max_rainfall: maxRain,
        sort_by: sortBy,
        sort_dir: sortDir,
        page: currentPage,
        limit: rowsPerPage,
      });

      setRecords(res.records || []);
      setTotalCount(res.total_count || 0);
      setTotalPages(res.total_pages || 1);
      if (res.summary) setSummary(res.summary);
    } catch (err) {
      console.error('Failed to query weather records:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedState, selectedSeason, rainfallFilter, sortBy, sortDir, currentPage, rowsPerPage]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecords();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchRecords]);

  // Reset to page 1 on filter changes
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStateChange = (val: string) => {
    setSelectedState(val);
    setCurrentPage(1);
  };

  const handleSeasonChange = (val: string) => {
    setSelectedSeason(val);
    setCurrentPage(1);
  };

  const handleRainfallFilterChange = (val: string) => {
    setRainfallFilter(val);
    setCurrentPage(1);
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
    setCurrentPage(1);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 bg-gradient-to-br from-navy-950 via-navy-900 to-teal-950/30 space-y-5 shadow-glass">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-glow shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white tracking-tight">All-India Weather & Rainfall Search Engine</h2>
              <Badge variant="green" size="sm">
                <Zap className="w-3 h-3 text-emerald-400 inline mr-1" />
                970,339 Records Ingested
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live indexed query across 10 years of daily station observations from <code className="text-emerald-400 font-mono">india_weather_rainfall_data.xlsx</code>
            </p>
          </div>
        </div>

        {/* Rows per page & Status */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">Rows:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-navy-900 text-xs font-bold text-emerald-300 border border-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value={15}>15 Rows</option>
              <option value={25}>25 Rows</option>
              <option value={50}>50 Rows</option>
              <option value={100}>100 Rows</option>
            </select>
          </div>
        </div>
      </div>

      {/* Real-time Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-navy-900/90 border border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> Matched Records
          </div>
          <div className="text-lg font-black text-white mt-1">
            {totalCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            across {summary.unique_districts} districts
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-900/90 border border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> Average Rainfall
          </div>
          <div className="text-lg font-black text-cyan-300 mt-1">
            {summary.avg_rainfall_mm} <span className="text-xs font-normal text-slate-400">mm</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Peak: <strong className="text-amber-400">{summary.max_rainfall_mm} mm</strong>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-900/90 border border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Avg Temperature
          </div>
          <div className="text-lg font-black text-amber-300 mt-1">
            {summary.avg_temp_c} <span className="text-xs font-normal text-slate-400">°C</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Max: <strong className="text-rose-400">{summary.max_temp_c}°C</strong>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-900/90 border border-slate-800/80">
          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
            <Wind className="w-3.5 h-3.5 text-teal-400" /> Avg Wind Speed
          </div>
          <div className="text-lg font-black text-teal-300 mt-1">
            {summary.avg_wind_kmh} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Atmospheric airflow</div>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-900/90 border border-slate-800/80 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
            <MapPin className="w-3.5 h-3.5 text-violet-400" /> Active Stations
          </div>
          <div className="text-lg font-black text-violet-300 mt-1">
            {summary.unique_stations} <span className="text-xs font-normal text-slate-400">stations</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Observatory network</div>
        </div>
      </div>

      {/* Multi-Filter Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search district, station, or state (e.g. Hyderabad, Mumbai, Colaba)..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-semibold text-white placeholder:text-slate-500 border border-slate-700 bg-navy-950 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* State Dropdown */}
        <div>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 text-xs font-semibold text-emerald-300 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">All States / UTs ({availableStates.length})</option>
            {availableStates.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Season Dropdown */}
        <div>
          <select
            value={selectedSeason}
            onChange={(e) => handleSeasonChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 text-xs font-semibold text-cyan-300 border border-slate-700 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Seasons</option>
            {availableSeasons.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Rainfall Intensity Filter */}
        <div>
          <select
            value={rainfallFilter}
            onChange={(e) => handleRainfallFilterChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 text-xs font-semibold text-amber-300 border border-slate-700 focus:border-amber-500 focus:outline-none"
          >
            <option value="ALL">All Rainfall Levels</option>
            <option value="RAIN_ONLY">Rain Occurred (&gt;0 mm)</option>
            <option value="MODERATE">Moderate (10 - 50 mm)</option>
            <option value="HEAVY">Heavy (50 - 100 mm)</option>
            <option value="VERY_HEAVY">Very Heavy (&gt;100 mm)</option>
          </select>
        </div>
      </div>

      {/* Live Records Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-navy-950/80 min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Querying 970k Records...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CloudRain className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-300">No records found matching your search.</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for a different district name (e.g. Pune, Jaipur, Hyderabad) or reset your filters.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 sticky top-0 z-10">
              <tr>
                <th className="p-3 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => toggleSort('date_of_record')}>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => toggleSort('station_name')}>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Station Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="p-3">District & State</th>
                <th className="p-3">Season</th>
                <th className="p-3 cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => toggleSort('rainfall')}>
                  <div className="flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Rainfall</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:text-amber-400 transition-colors" onClick={() => toggleSort('avg_temp')}>
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Temp (Avg / Min / Max)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="p-3">
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                    <span>Wind & Pressure</span>
                  </div>
                </th>
                <th className="p-3">Elevation & Coord</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {records.map((row, idx) => {
                const isHeavy = row.rainfall >= 50;
                const isModerate = row.rainfall >= 10 && row.rainfall < 50;
                const isLight = row.rainfall > 0 && row.rainfall < 10;

                return (
                  <tr key={idx} className="hover:bg-navy-800/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-300 whitespace-nowrap">
                      {row.date_of_record}
                    </td>
                    <td className="p-3 font-bold text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                        <span>{row.station_name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-200">{row.district}</span>
                      <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        {row.state}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.season === 'Monsoon' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                        row.season === 'Summer' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        row.season === 'Winter' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {row.season}
                      </span>
                    </td>
                    <td className="p-3 font-mono">
                      <span className={`px-2 py-0.5 rounded font-extrabold text-xs inline-flex items-center gap-1 ${
                        isHeavy ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                        isModerate ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                        isLight ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        'text-slate-400'
                      }`}>
                        <CloudRain className="w-3 h-3" />
                        {row.rainfall} mm
                      </span>
                    </td>
                    <td className="p-3 font-mono">
                      <span className="font-bold text-amber-300">{row.avg_temp}°C</span>
                      <span className="text-slate-500 text-[11px] ml-1.5">
                        ({row.min_temp}° - {row.max_temp}°)
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-300 text-[11px]">
                      <span>{row.wind_speed} km/h</span>
                      {row.air_pressure > 0 && (
                        <span className="text-slate-500 ml-1.5">• {row.air_pressure} mb</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      <span>{row.elevation}m elev</span>
                      <span className="text-slate-500 text-[10px] block">
                        {row.latitude?.toFixed(2)}°N, {row.longitude?.toFixed(2)}°E
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800 pt-4 text-xs font-semibold text-slate-400">
        <div>
          Showing page <strong className="text-emerald-400">{currentPage}</strong> of{' '}
          <strong className="text-white">{totalPages.toLocaleString()}</strong> ({totalCount.toLocaleString()} total observations)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage <= 1 || loading}
            className="p-1.5 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage <= 1 || loading}
            className="px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono">
            {currentPage}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages || loading}
            className="px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage >= totalPages || loading}
            className="p-1.5 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
'''

with open(TARGET_FILE, "w", encoding="utf-8") as f:
    f.write(explorer_code)

print("Updated AllIndiaRainfallExplorer.tsx successfully!")
