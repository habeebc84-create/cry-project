import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Check, Eye, CheckCheck, RefreshCw, Filter, Bell, Flame, Shield, X } from 'lucide-react';
import { AlertItem } from '../types';
import { getSeverityInfo, formatTimestamp, maskIp } from '../utils/formatters';
import { useMode } from '../context/ModeContext';
import { AlertDetailsModal } from './AlertDetailsModal';

interface ThreatAlertCenterProps {
  onSelectAlert?: (alert: AlertItem) => void;
}

export const ThreatAlertCenter: React.FC<ThreatAlertCenterProps> = ({ onSelectAlert }) => {
  const { liveAlerts, mode } = useMode();
  const [selectedSevFilter, setSelectedSevFilter] = useState<number>(0);
  const [selectedAlertForModal, setSelectedAlertForModal] = useState<AlertItem | null>(null);
  
  // Local state for acknowledged and resolved IDs
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<number>>(new Set());
  const [resolvedIds, setResolvedIds] = useState<Set<number>>(new Set());

  // Demo alert fallback list if no active alerts
  const defaultAlerts: AlertItem[] = [
    {
      id: 101,
      timestamp: new Date(Date.now() - 1000 * 30).toISOString(),
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
      id: 102,
      timestamp: new Date(Date.now() - 1000 * 120).toISOString(),
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
      id: 103,
      timestamp: new Date(Date.now() - 1000 * 340).toISOString(),
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
      id: 104,
      timestamp: new Date(Date.now() - 1000 * 800).toISOString(),
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
  ];

  const displayAlerts = liveAlerts.length > 0 ? liveAlerts : defaultAlerts;

  const filteredAlerts = displayAlerts.filter(a => {
    if (selectedSevFilter > 0 && a.severity !== selectedSevFilter) return false;
    return true;
  });

  const handleAcknowledge = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAcknowledgedIds(prev => new Set(prev).add(id));
  };

  const handleResolve = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setResolvedIds(prev => new Set(prev).add(id));
  };

  const criticalCount = displayAlerts.filter(a => a.severity === 1).length;
  const highCount = displayAlerts.filter(a => a.severity === 2).length;
  const mediumCount = displayAlerts.filter(a => a.severity === 3).length;
  const lowCount = displayAlerts.filter(a => a.severity === 4).length;

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-400 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Incident Response</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Threat Alert Center & Security Triage
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            {displayAlerts.length} Active Incidents
          </span>
        </div>
      </div>

      {/* Severity Filter Banner Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <button
          onClick={() => setSelectedSevFilter(selectedSevFilter === 1 ? 0 : 1)}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedSevFilter === 1
              ? 'bg-rose-950/80 border-rose-500 shadow-glow-red'
              : 'bg-slate-950/70 border-rose-900/40 hover:border-rose-700/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono text-rose-400">
            <span className="font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              CRITICAL
            </span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1">{criticalCount}</div>
          <div className="text-[11px] text-slate-400">Immediate DoS & Exploits</div>
        </button>

        <button
          onClick={() => setSelectedSevFilter(selectedSevFilter === 2 ? 0 : 2)}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedSevFilter === 2
              ? 'bg-amber-950/80 border-amber-500 shadow-glow-amber'
              : 'bg-slate-950/70 border-amber-900/40 hover:border-amber-700/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono text-amber-400">
            <span className="font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              HIGH
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1">{highCount}</div>
          <div className="text-[11px] text-slate-400">Brute-force & Abnormalities</div>
        </button>

        <button
          onClick={() => setSelectedSevFilter(selectedSevFilter === 3 ? 0 : 3)}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedSevFilter === 3
              ? 'bg-yellow-950/80 border-yellow-500'
              : 'bg-slate-950/70 border-yellow-900/40 hover:border-yellow-700/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono text-yellow-400">
            <span className="font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              MEDIUM
            </span>
            <Bell className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1">{mediumCount}</div>
          <div className="text-[11px] text-slate-400">Reconnaissance & Scans</div>
        </button>

        <button
          onClick={() => setSelectedSevFilter(selectedSevFilter === 4 ? 0 : 4)}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedSevFilter === 4
              ? 'bg-blue-950/80 border-blue-500'
              : 'bg-slate-950/70 border-blue-900/40 hover:border-blue-700/60'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono text-blue-400">
            <span className="font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              LOW
            </span>
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1">{lowCount}</div>
          <div className="text-[11px] text-slate-400">Protocol Anomalies</div>
        </button>
      </div>

      {/* Alert Feed List with Action Triage */}
      <div className="soc-card overflow-hidden">
        <div className="p-4 border-b border-borderMuted bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
              Live Threat Alert Stream
            </h3>
          </div>
          {selectedSevFilter > 0 && (
            <button
              onClick={() => setSelectedSevFilter(0)}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear Filter
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              No threat alerts matching current criteria.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const sev = getSeverityInfo(alert.severity);
              const isAck = acknowledgedIds.has(alert.id);
              const isResolved = resolvedIds.has(alert.id);

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlertForModal(alert)}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors cursor-pointer group ${
                    isResolved
                      ? 'bg-slate-950/30 opacity-60'
                      : isAck
                      ? 'bg-slate-900/40'
                      : 'hover:bg-slate-900/70'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${sev.badge}`}>
                        {sev.label}
                      </span>
                      <span className="text-slate-400">{formatTimestamp(alert.timestamp)}</span>
                      <span className="text-cyan-400 font-semibold">{alert.protocol}</span>
                      <span className="text-slate-500 font-bold">•</span>
                      <span className="text-white font-bold">{alert.attack_type}</span>
                      {isResolved && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px]">
                          RESOLVED
                        </span>
                      )}
                      {isAck && !isResolved && (
                        <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-700 text-blue-300 text-[10px]">
                          ACKNOWLEDGED
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {alert.signature}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                      <div>
                        Src: <span className="text-emerald-400 font-semibold">{alert.source_ip}:{alert.source_port}</span>
                      </div>
                      <div>
                        Dst: <span className="text-blue-400 font-semibold">{alert.destination_ip}:{alert.destination_port}</span>
                      </div>
                      <div className="text-slate-500 hidden sm:inline">
                        Engine: {alert.detection_engine}
                      </div>
                    </div>
                  </div>

                  {/* Triage Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAlertForModal(alert);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      Details
                    </button>

                    {!isResolved && (
                      <>
                        <button
                          onClick={(e) => handleAcknowledge(alert.id, e)}
                          disabled={isAck}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
                            isAck
                              ? 'bg-slate-900 text-slate-500 border border-slate-800'
                              : 'bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-blue-300'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          {isAck ? 'Acked' : 'Acknowledge'}
                        </button>

                        <button
                          onClick={(e) => handleResolve(alert.id, e)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Resolve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedAlertForModal && (
        <AlertDetailsModal
          alert={selectedAlertForModal}
          onClose={() => setSelectedAlertForModal(null)}
          onUpdate={() => {}}
        />
      )}
    </section>
  );
};
