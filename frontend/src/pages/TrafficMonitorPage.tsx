import React, { useState } from 'react';
import { useMode } from '../context/ModeContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { LiveTrafficTable } from '../components/LiveTrafficTable';
import { ThreeDNetworkGraph } from '../components/ThreeDNetworkGraph';
import { Activity, Clock, BarChart2, Shield, ArrowDown, ArrowUp, Wifi, Box } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export const TrafficMonitorPage: React.FC = () => {
  const { mode, trafficHistory, liveAlerts } = useMode();
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [show3d, setShow3d] = useState<boolean>(false);

  // Generate extended historical points for selected time range
  const generateRangeData = () => {
    const pointsCount = timeRange === '1h' ? 20 : timeRange === '6h' ? 30 : timeRange === '24h' ? 40 : 50;
    const result = [];
    const now = Date.now();
    const intervalMs = timeRange === '1h' ? 3 * 60 * 1000 : timeRange === '6h' ? 12 * 60 * 1000 : timeRange === '24h' ? 36 * 60 * 1000 : 3.5 * 3600 * 1000;

    for (let i = pointsCount; i >= 0; i--) {
      const time = new Date(now - i * intervalMs);
      const timeStr = timeRange === '7d' 
        ? `${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:00` 
        : `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
      
      const basePackets = 300 + Math.floor(Math.sin(i * 0.4) * 180) + Math.floor(Math.random() * 80);
      const baseDownMB = Number((2.4 + Math.sin(i * 0.3) * 1.5 + Math.random() * 0.8).toFixed(2));
      const baseUpMB = Number((0.8 + Math.cos(i * 0.3) * 0.5 + Math.random() * 0.3).toFixed(2));

      result.push({
        time: timeStr,
        packets: basePackets,
        downMB: baseDownMB,
        upMB: baseUpMB,
        bandwidthMbps: Number(((baseDownMB + baseUpMB) * 8).toFixed(1))
      });
    }
    return result;
  };

  const chartData = generateRangeData();
  const latestPoint = trafficHistory.length > 0 ? trafficHistory[trafficHistory.length - 1] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telemetry & Stream Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Live Network Traffic Activity & Monitor
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* 3D WebGL Toggle */}
          <button
            onClick={() => setShow3d(!show3d)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
              show3d
                ? 'bg-purple-950 border-purple-600 text-purple-300 shadow-glow-purple'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            {show3d ? 'Hide 3D View' : 'Show 3D WebGL'}
          </button>

          {/* Time Filter Buttons */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs font-mono">
            {(['1h', '6h', '24h', '7d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  timeRange === r
                    ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D WebGL Visualizer on toggle */}
      {show3d && (
        <ThreeDNetworkGraph
          trafficData={trafficHistory}
          alerts={liveAlerts}
          height="420px"
        />
      )}

      {/* Large Interactive Network Traffic Activity Line/Area Chart */}
      <div className="soc-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-borderMuted">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-white">
                Network Traffic Activity Over Time ({timeRange.toUpperCase()})
              </h3>
              <p className="text-[11px] text-slate-400">
                Throughput rate (Mbps) and packet rate trends
              </p>
            </div>
          </div>

          {latestPoint && (
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <ArrowDown className="w-3.5 h-3.5" />
                <span>{latestPoint.download_speed_formatted || '2.4 MB/s'}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400 font-bold">
                <ArrowUp className="w-3.5 h-3.5" />
                <span>{latestPoint.upload_speed_formatted || '0.8 MB/s'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradMbps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradPackets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f8fafc',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.8)'
                }}
                formatter={(val: any, name: string) => {
                  if (name === 'bandwidthMbps') return [`${val} Mbps`, 'Aggregated Bandwidth'];
                  if (name === 'packets') return [`${val} p/s`, 'Packet Rate'];
                  if (name === 'downMB') return [`${val} MB/s`, 'Inbound Rate'];
                  if (name === 'upMB') return [`${val} MB/s`, 'Outbound Rate'];
                  return [val, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }} />
              <Area
                type="monotone"
                dataKey="bandwidthMbps"
                name="Aggregated Bandwidth (Mbps)"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#gradMbps)"
              />
              <Area
                type="monotone"
                dataKey="packets"
                name="Packet Rate (p/s)"
                stroke="#a855f7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradPackets)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <span>Active Interface: Default Ethernet/Wi-Fi</span>
          <span className="text-cyan-400">Live Telemetry Synchronized</span>
        </div>
      </div>

      {/* Live Traffic Flow Connection Table */}
      <LiveTrafficTable />

    </div>
  );
};
