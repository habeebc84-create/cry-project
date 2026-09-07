import React, { useState, useMemo } from 'react';
import { AlertItem } from '../types';
import { getSeverityInfo, formatTimestamp, maskIp } from '../utils/formatters';
import { ShieldAlert, Info, Radio, ExternalLink, Search, Filter, Eye, EyeOff, Download, Sparkles, Flame, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { useMode } from '../context/ModeContext';

interface LiveAlertFeedProps {
  alerts: AlertItem[];
  onSelectAlert: (alert: AlertItem) => void;
  maskIps?: boolean;
}

export const LiveAlertFeed: React.FC<LiveAlertFeedProps> = ({ alerts, onSelectAlert, maskIps: initialMask = false }) => {
  const { mode, setMode } = useMode();
  const [search, setSearch] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<number>(0);
  const [isMasked, setIsMasked] = useState<boolean>(initialMask);
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<number>>(new Set());

  // Realistic sample fallback alerts if buffer is currently empty
  const fallbackAlerts: AlertItem[] = useMemo(() => [
    {
      id: 901,
      timestamp: new Date(Date.now() - 15000).toISOString(),
      severity: 1,
      source_ip: '192.168.1.105',
      source_port: 52140,
      destination_ip: '10.0.0.1',
      destination_port: 80,
      protocol: 'TCP',
      attack_type: 'DoS / Flood Attack',
      signature: 'ET DOS Potential SYN Flood Attack Detected Inbound',
      detection_engine: 'ML Random Forest / Suricata',
      is_investigated: 0
    },
    {
      id: 902,
      timestamp: new Date(Date.now() - 45000).toISOString(),
      severity: 2,
      source_ip: '172.16.4.88',
      source_port: 48920,
      destination_ip: '10.0.0.5',
      destination_port: 22,
      protocol: 'TCP',
      attack_type: 'Brute Force Attack',
      signature: 'ET SCAN Potential SSH Brute Force Login Attempt',
      detection_engine: 'ML Random Forest',
      is_investigated: 0
    },
    {
      id: 903,
      timestamp: new Date(Date.now() - 110000).toISOString(),
      severity: 3,
      source_ip: '192.168.5.21',
      source_port: 39124,
      destination_ip: '10.0.0.8',
      destination_port: 8080,
      protocol: 'TCP',
      attack_type: 'Port Scanning Recon',
      signature: 'ET SCAN Nmap Scripting Engine Reconnaissance Detected',
      detection_engine: 'Suricata NIDS',
      is_investigated: 0
    },
    {
      id: 904,
      timestamp: new Date(Date.now() - 240000).toISOString(),
      severity: 4,
      source_ip: '10.0.0.45',
      source_port: 53,
      destination_ip: '192.168.1.1',
      destination_port: 5353,
      protocol: 'UDP',
      attack_type: 'Protocol Anomaly',
      signature: 'GPL DNS Non-Standard High-Entropy Query Pattern',
      detection_engine: 'Decision Tree Heuristics',
      is_investigated: 0
    }
  ], []);

  const activeAlertsList = alerts.length > 0 ? alerts : fallbackAlerts;

  const filteredAlerts = useMemo(() => {
    return activeAlertsList.filter(a => {
      if (severityFilter > 0 && a.severity !== severityFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          a.signature.toLowerCase().includes(s) ||
          a.attack_type.toLowerCase().includes(s) ||
          a.source_ip.toLowerCase().includes(s) ||
          a.destination_ip.toLowerCase().includes(s) ||
          a.protocol.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [activeAlertsList, severityFilter, search]);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeAlertsList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentinel_alerts_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleAcknowledge = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAcknowledgedIds(prev => new Set(prev).add(id));
  };

  return (
    <div className="soc-card overflow-hidden">
      
      {/* Header bar with controls */}
      <div className="p-4 border-b border-borderMuted flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-950/60">
        
        {/* Left: Title and streaming badge */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-cyan-950/80 border border-cyan-700/80 flex items-center justify-center text-cyan-400 shadow-glow-cyan shrink-0">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono tracking-tight uppercase">
                REAL-TIME LIVE ALERT FEED
              </h3>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                STREAMING
              </span>
            </div>
            <p className="text-xs text-slate-400">Incoming NIDS event stream over high-speed WebSocket connection</p>
          </div>
        </div>

        {/* Right: Filters & Tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search alert / IP / attack..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-48"
            />
          </div>

          {/* Severity filter selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs font-mono">
            {[
              { id: 0, label: 'All' },
              { id: 1, label: '🔴 Crit' },
              { id: 2, label: '🟠 High' },
              { id: 3, label: '🟡 Med' },
              { id: 4, label: '🔵 Low' },
            ].map((sev) => (
              <button
                key={sev.id}
                onClick={() => setSeverityFilter(sev.id)}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  severityFilter === sev.id
                    ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev.label}
              </button>
            ))}
          </div>

          {/* Mask IP Toggle */}
          <button
            onClick={() => setIsMasked(!isMasked)}
            title="Toggle IP Masking"
            className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
              isMasked
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {isMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            title="Export Alerts as JSON"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            {filteredAlerts.length} buffered
          </span>
        </div>

      </div>

      {/* Alert Feed Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left soc-table border-collapse">
          <thead>
            <tr>
              <th>Time</th>
              <th>Severity</th>
              <th>Source (Origin)</th>
              <th>Destination (Target)</th>
              <th>Protocol</th>
              <th>Attack Type</th>
              <th>Signature & Payload</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-14 text-slate-500 font-mono">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Radio className="w-8 h-8 text-cyan-500 animate-pulse" />
                    <span className="text-sm font-semibold text-slate-300">Listening for Network Intrusion Events...</span>
                    <span className="text-xs text-slate-500 max-w-sm">
                      Events detected by Suricata NIDS or generated in Demo mode stream live here.
                    </span>
                    {mode !== 'demo' && (
                      <button
                        onClick={() => setMode('demo')}
                        className="mt-2 px-3 py-1 rounded bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 text-xs font-mono transition-colors"
                      >
                        Enable Demo Mode for Simulated Threat Stream
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredAlerts.map((alert, idx) => {
                const sev = getSeverityInfo(alert.severity);
                const isAck = acknowledgedIds.has(alert.id);
                return (
                  <tr
                    key={alert.id || idx}
                    onClick={() => onSelectAlert(alert)}
                    className={`cursor-pointer transition-colors font-mono text-xs group ${
                      isAck ? 'bg-slate-950/40 opacity-70' : 'hover:bg-slate-800/70'
                    }`}
                  >
                    <td className="text-slate-300 whitespace-nowrap font-semibold">
                      {formatTimestamp(alert.timestamp)}
                    </td>
                    <td>
                      <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold ${sev.badge}`}>
                        {sev.label}
                      </span>
                    </td>
                    <td className="text-emerald-400 font-semibold whitespace-nowrap">
                      {maskIp(alert.source_ip, isMasked)}:{alert.source_port}
                    </td>
                    <td className="text-blue-400 font-semibold whitespace-nowrap">
                      {maskIp(alert.destination_ip, isMasked)}:{alert.destination_port}
                    </td>
                    <td className="text-slate-200 font-bold">
                      {alert.protocol}
                    </td>
                    <td className="font-bold text-white whitespace-nowrap">
                      {alert.attack_type}
                    </td>
                    <td className="text-slate-300 truncate max-w-xs" title={alert.signature}>
                      {alert.signature}
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => handleAcknowledge(alert.id, e)}
                          title="Acknowledge Alert"
                          className={`px-2 py-1 rounded text-[10px] font-mono border transition-colors ${
                            isAck
                              ? 'bg-slate-900 border-slate-800 text-slate-500'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          }`}
                        >
                          {isAck ? 'Acked' : 'Ack'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAlert(alert);
                          }}
                          className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Inspect
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
