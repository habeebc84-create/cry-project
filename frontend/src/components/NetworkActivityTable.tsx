import React, { useState, useEffect } from 'react';
import { NetworkConnection } from '../types';
import { maskIp, formatBytes } from '../utils/formatters';
import { useMode } from '../context/ModeContext';
import { Eye, EyeOff, RefreshCw, Network, Lock } from 'lucide-react';

export const NetworkActivityTable: React.FC = () => {
  const { mode } = useMode();
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [maskIps, setMaskIps] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchConnections = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/network');
      if (res.ok) {
        const data = await res.json();
        setConnections(data.connections || []);
      }
    } catch (e) {
      console.error('Failed to fetch network activity:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
    const interval = setInterval(fetchConnections, 5000);
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="soc-card overflow-hidden">
      
      {/* Header bar */}
      <div className="p-4 border-b border-borderMuted bg-slate-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white font-mono tracking-tight flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-400" />
            AUTHORIZED NETWORK OBSERVATIONS
          </h3>
          <p className="text-xs text-slate-400">Live active connection flow table & throughput</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mask IP Toggle button */}
          <button
            onClick={() => setMaskIps(!maskIps)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              maskIps
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'
            }`}
          >
            {maskIps ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {maskIps ? 'IP Masking: ON (192.168.1.xxx)' : 'IP Masking: OFF'}
          </button>

          <button
            onClick={fetchConnections}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Connection Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left soc-table border-collapse">
          <thead>
            <tr>
              <th>Source IP</th>
              <th>Source Port</th>
              <th>Destination IP</th>
              <th>Dest Port</th>
              <th>Protocol</th>
              <th>Status</th>
              <th>Packets</th>
              <th>Bytes</th>
            </tr>
          </thead>
          <tbody>
            {connections.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-500 font-mono text-xs">
                  No active network connections observed
                </td>
              </tr>
            ) : (
              connections.map((conn, idx) => (
                <tr key={idx} className="font-mono text-xs hover:bg-slate-900/60 transition-colors">
                  <td className="text-emerald-400 font-semibold">
                    {maskIp(conn.source_ip, maskIps)}
                  </td>
                  <td className="text-slate-400">{conn.source_port}</td>
                  <td className="text-blue-400 font-semibold">
                    {maskIp(conn.destination_ip, maskIps)}
                  </td>
                  <td className="text-slate-400">{conn.destination_port}</td>
                  <td className="text-slate-200 font-bold">{conn.protocol}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      conn.status === 'ESTABLISHED' || conn.status === 'ACTIVE'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {conn.status}
                    </span>
                  </td>
                  <td className="text-slate-300">{conn.packets}</td>
                  <td className="text-slate-300">{formatBytes(conn.bytes)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
