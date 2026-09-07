import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieIcon, BarChart3, ShieldAlert, Zap } from 'lucide-react';

interface ThreatCategoryChartProps {
  categories?: Record<string, number>;
  totalAlerts?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Network Scanning': '#3b82f6',        // Electric Blue
  'Brute Force Indicators': '#f59e0b',  // Amber/Yellow
  'DoS/DDoS Indicators': '#ef4444',     // Bright Red
  'Malware Indicators': '#ec4899',       // Pink/Magenta
  'Suspicious DNS': '#a855f7',           // Purple
  'Web Attack Indicators': '#06b6d4',   // Cyan
  'Protocol Anomalies': '#10b981',      // Emerald Green
  'Other IDS Alerts': '#64748b'          // Slate
};

export const ThreatCategoryChart: React.FC<ThreatCategoryChartProps> = ({
  categories = {},
  totalAlerts = 0
}) => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  // Convert categories object to chart array format
  const data = Object.entries(categories).map(([name, count]) => ({
    name,
    count,
    color: CATEGORY_COLORS[name] || '#8b5cf6'
  })).sort((a, b) => b.count - a.count);

  // Fallback demo data if no categories logged yet
  const chartData = data.length > 0 ? data : [
    { name: 'Network Scanning', count: 18, color: '#3b82f6' },
    { name: 'Brute Force Indicators', count: 12, color: '#f59e0b' },
    { name: 'DoS/DDoS Indicators', count: 8, color: '#ef4444' },
    { name: 'Web Attack Indicators', count: 15, color: '#06b6d4' },
    { name: 'Suspicious DNS', count: 9, color: '#a855f7' },
    { name: 'Malware Indicators', count: 5, color: '#ec4899' }
  ];

  const effectiveTotal = totalAlerts || chartData.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="soc-card p-4 flex flex-col justify-between">
      
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono tracking-wider text-white uppercase flex items-center gap-2">
              THREAT CATEGORY MATRIX DISTRIBUTION
            </h3>
            <p className="text-[11px] text-slate-400">
              Categorized NIDS signatures across attack vectors
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-950 border border-slate-800 p-0.5 rounded-lg text-xs font-mono">
          <button
            onClick={() => setChartType('pie')}
            className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1.5 ${
              chartType === 'pie'
                ? 'bg-slate-800 text-purple-300 font-bold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Donut Matrix
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1.5 ${
              chartType === 'bar'
                ? 'bg-slate-800 text-emerald-300 font-bold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Bar Breakdown
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[240px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="count"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f8fafc',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.8)'
                }}
                formatter={(value: any, name: string) => [
                  `${value} Events (${((Number(value) / Math.max(1, effectiveTotal)) * 100).toFixed(1)}%)`,
                  name
                ]}
              />
            </PieChart>
          ) : (
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 35, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#64748b"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                width={130}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f8fafc',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.8)'
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`bar-cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>

        {/* Center Ring Stat for Donut */}
        {chartType === 'pie' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold font-mono text-white">{effectiveTotal}</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Total Events</span>
          </div>
        )}
      </div>

      {/* Legend Badge Grid */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2 bg-slate-950/70 p-1.5 rounded-lg border border-slate-800/80">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
            <span className="text-slate-300 truncate text-[11px]" title={item.name}>{item.name}</span>
            <span className="text-slate-400 font-bold ml-auto">{item.count}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
