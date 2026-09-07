import React, { useState, useEffect } from 'react';
import { AlertItem } from '../types';
import { getSeverityInfo, formatTimestamp, maskIp } from '../utils/formatters';
import { AlertDetailsModal } from '../components/AlertDetailsModal';
import { useMode } from '../context/ModeContext';
import { Database, Search, Filter, Download, RefreshCw, FileSpreadsheet, Code } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { mode } = useMode();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [query, setQuery] = useState<string>('');
  const [severity, setSeverity] = useState<number>(0);
  const [attackType, setAttackType] = useState<string>('All');
  const [ipFilter, setIpFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const categories = [
    'All',
    'Network Scanning',
    'Brute Force Indicators',
    'DoS/DDoS Indicators',
    'Malware Indicators',
    'Suspicious DNS',
    'Web Attack Indicators',
    'Protocol Anomalies',
    'Other IDS Alerts'
  ];

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (severity > 0) params.append('severity', severity.toString());
      if (attackType !== 'All') params.append('attack_type', attackType);
      if (ipFilter) params.append('ip', ipFilter);
      params.append('mode', mode);
      params.append('limit', '200');

      const res = await fetch(`/api/alerts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (e) {
      console.error('Failed to fetch historical alerts:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [severity, attackType, mode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  const exportAllCsv = () => {
    if (alerts.length === 0) return;
    const headers = ["id", "timestamp", "severity", "source_ip", "source_port", "destination_ip", "destination_port", "protocol", "attack_type", "signature"];
    const rows = alerts.map(a => [
      a.id,
      a.timestamp,
      a.severity,
      a.source_ip,
      a.source_port,
      a.destination_ip,
      a.destination_port,
      a.protocol,
      `"${(a.attack_type || '').replace(/"/g, '""')}"`,
      `"${(a.signature || '').replace(/"/g, '""')}"`
    ].join(","));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `sentinel-alerts-history.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportAllJson = () => {
    if (alerts.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alerts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentinel-alerts-history.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Export Actions */}
      <div className="soc-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white font-mono tracking-tight flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            HISTORICAL IDS ALERT DATABASE (SQLITE)
          </h3>
          <p className="text-xs text-slate-400">Search, filter, and export persistent NIDS events (Newest First)</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportAllCsv}
            disabled={alerts.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 disabled:opacity-50 text-slate-300 font-mono text-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={exportAllJson}
            disabled={alerts.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 disabled:opacity-50 text-slate-300 font-mono text-xs transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="soc-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
        
        {/* Keyword Search */}
        <div>
          <label className="text-slate-400 block mb-1 text-[11px]">Keyword Search</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Signature, Attack type..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-2 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* IP Filter */}
        <div>
          <label className="text-slate-400 block mb-1 text-[11px]">IP Address Filter</label>
          <input
            type="text"
            value={ipFilter}
            onChange={(e) => setIpFilter(e.target.value)}
            placeholder="e.g. 192.168.1.105"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Severity Filter */}
        <div>
          <label className="text-slate-400 block mb-1 text-[11px]">Severity</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value={0}>All Severities</option>
            <option value={1}>1 - Critical</option>
            <option value={2}>2 - High</option>
            <option value={3}>3 - Medium</option>
            <option value={4}>4 - Low</option>
          </select>
        </div>

        {/* Attack Category Filter */}
        <div>
          <label className="text-slate-400 block mb-1 text-[11px]">Attack Category</label>
          <select
            value={attackType}
            onChange={(e) => setAttackType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Submit & Reset Button */}
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white transition-colors"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSeverity(0);
              setAttackType('All');
              setIpFilter('');
            }}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </form>

      {/* Results Table */}
      <div className="soc-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left soc-table border-collapse">
            <thead>
              <tr>
                <th>ID</th>
                <th>Time</th>
                <th>Severity</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Protocol</th>
                <th>Attack Type</th>
                <th>Signature</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-500 font-mono text-xs">
                    {isLoading ? 'Loading historical database events...' : 'No historical alerts matched your criteria'}
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => {
                  const sev = getSeverityInfo(alert.severity);
                  return (
                    <tr
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className="cursor-pointer transition-colors hover:bg-slate-900/70 font-mono text-xs"
                    >
                      <td className="text-slate-500 font-bold">#{alert.id}</td>
                      <td className="text-slate-300 whitespace-nowrap">{formatTimestamp(alert.timestamp)}</td>
                      <td>
                        <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold ${sev.badge}`}>
                          {sev.label}
                        </span>
                      </td>
                      <td className="text-emerald-400 font-semibold whitespace-nowrap">{alert.source_ip}:{alert.source_port}</td>
                      <td className="text-blue-400 font-semibold whitespace-nowrap">{alert.destination_ip}:{alert.destination_port}</td>
                      <td className="text-slate-200 font-bold">{alert.protocol}</td>
                      <td className="text-white font-medium whitespace-nowrap">{alert.attack_type}</td>
                      <td className="text-slate-300 truncate max-w-xs" title={alert.signature}>{alert.signature}</td>
                      <td>
                        {alert.is_investigated ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            RESOLVED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-800">
                            NEW
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDetailsModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onUpdate={fetchHistory}
      />

    </div>
  );
};
