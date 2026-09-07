import React from 'react';
import { useMode } from '../context/ModeContext';
import { HeartPulse, CheckCircle2, XCircle, RefreshCw, Cpu, Server, Database, Radio, Network } from 'lucide-react';
import { formatTimestamp } from '../utils/formatters';

export const SystemHealthGrid: React.FC = () => {
  const { statusData, suricataConnected, wsConnected, mode, refreshStatus } = useMode();

  const services = [
    {
      name: 'Suricata Engine',
      status: mode === 'demo' ? true : suricataConnected,
      icon: Cpu,
      detail: statusData?.suricata?.path || 'C:/ProgramData/Suricata/log/eve.json',
      connectedText: mode === 'demo' ? 'Simulated Connected' : 'Connected',
      disconnectedText: 'Disconnected (No EVE log)'
    },
    {
      name: 'FastAPI Backend',
      status: statusData?.fastapi === 'running',
      icon: Server,
      detail: 'REST Endpoints operational',
      connectedText: 'Running',
      disconnectedText: 'Stopped'
    },
    {
      name: 'WebSocket Broadcaster',
      status: wsConnected,
      icon: Radio,
      detail: 'Real-time telemetry stream active',
      connectedText: 'Connected',
      disconnectedText: 'Disconnected'
    },
    {
      name: 'SQLite Database',
      status: statusData?.database === 'connected',
      icon: Database,
      detail: 'sentinel_ids.db persistent log',
      connectedText: 'Connected',
      disconnectedText: 'Offline'
    },
    {
      name: 'Network Monitor',
      status: !!statusData?.network?.monitoring,
      icon: Network,
      detail: `Interface: ${statusData?.network?.interface || 'Default'}`,
      connectedText: 'Monitoring',
      disconnectedText: 'Paused'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="soc-card p-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white font-mono tracking-tight flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            SYSTEM HEALTH DIAGNOSTICS
          </h3>
          <p className="text-xs text-slate-400">Live operational component status & service checks</p>
        </div>
        <button
          onClick={refreshStatus}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Health
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div key={idx} className="soc-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <Icon className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="font-mono text-sm font-bold text-white">{srv.name}</span>
                </div>
                
                {srv.status ? (
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-full">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {srv.connectedText}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400 bg-rose-950/70 border border-rose-800 px-2 py-0.5 rounded-full">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    {srv.disconnectedText}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 font-mono truncate">{srv.detail}</p>
            </div>
          );
        })}
      </div>

      {/* System Metrics Panel */}
      <div className="soc-card p-5 font-mono text-xs space-y-4">
        <h4 className="font-bold text-white uppercase text-xs">Runtime Diagnostics Summary</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">System Mode</span>
            <span className="text-white font-bold uppercase text-sm mt-0.5 block">{statusData?.mode || 'live'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Parsed EVE Events</span>
            <span className="text-emerald-400 font-bold text-sm mt-0.5 block">{statusData?.suricata?.parsed_alerts_count || 0}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Last Event Time</span>
            <span className="text-slate-300 font-bold text-sm mt-0.5 block">
              {statusData?.suricata?.last_event_time ? formatTimestamp(statusData.suricata.last_event_time) : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">EVE JSON Path</span>
            <span className="text-cyan-400 font-bold truncate block text-xs mt-0.5" title={statusData?.suricata?.path || 'N/A'}>
              {statusData?.suricata?.path || 'N/A'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
