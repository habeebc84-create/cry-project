import React, { useState } from 'react';
import { Layers, Network, Clock, HardDrive, Hash, Activity, Compass, Cpu, BarChart2, Info } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export const FeatureAnalysisSection: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const featureCards = [
    {
      name: 'Protocol',
      icon: Network,
      type: 'Categorical',
      role: 'Transport Layer Identifier',
      desc: 'TCP, UDP, ICMP, or GRE packet encapsulation flags that dictate socket behavior.',
      importance: '92%',
      accent: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/20'
    },
    {
      name: 'Packet Size',
      icon: HardDrive,
      type: 'Continuous',
      role: 'Volumetric Metric',
      desc: 'Mean, min, max, and standard deviation of frame byte sizes across bidirectional streams.',
      importance: '87%',
      accent: 'border-blue-500/50 text-blue-400 bg-blue-950/20'
    },
    {
      name: 'Connection Duration',
      icon: Clock,
      type: 'Continuous',
      role: 'Temporal Metric',
      desc: 'Elapsed duration from initial SYN packet to connection teardown/FIN handshake.',
      importance: '81%',
      accent: 'border-purple-500/50 text-purple-400 bg-purple-950/20'
    },
    {
      name: 'Packet Count',
      icon: Hash,
      type: 'Discrete',
      role: 'Rate Metric',
      desc: 'Total packet count exchanged within the conversation window delta.',
      importance: '76%',
      accent: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/20'
    },
    {
      name: 'Port Information',
      icon: Compass,
      type: 'Discrete',
      role: 'Service Identifier',
      desc: 'Source ephemeral port and destination well-known service port (e.g. 22, 80, 443, 8080).',
      importance: '71%',
      accent: 'border-amber-500/50 text-amber-400 bg-amber-950/20'
    },
    {
      name: 'Source IP Address',
      icon: Network,
      type: 'Spatial Network',
      role: 'Origin Vector',
      desc: 'Originating host subnet, geolocation coordinates, and CIDR block classification.',
      importance: '65%',
      accent: 'border-rose-500/50 text-rose-400 bg-rose-950/20'
    },
    {
      name: 'Destination IP Address',
      icon: Network,
      type: 'Spatial Network',
      role: 'Target Vector',
      desc: 'Destination host internal/external boundary classification and service role.',
      importance: '62%',
      accent: 'border-indigo-500/50 text-indigo-400 bg-indigo-950/20'
    },
    {
      name: 'Flow Statistics',
      icon: Activity,
      type: 'Composite Vector',
      role: 'Behavioral Signature',
      desc: 'Inter-arrival time variance, SYN-to-ACK latency ratios, and push-flag entropy.',
      importance: '89%',
      accent: 'border-teal-500/50 text-teal-400 bg-teal-950/20'
    }
  ];

  const chartData = [
    { feature: 'Protocol', score: 92, color: '#06b6d4' },
    { feature: 'Flow Statistics', score: 89, color: '#14b8a6' },
    { feature: 'Packet Size', score: 87, color: '#3b82f6' },
    { feature: 'Duration', score: 81, color: '#a855f7' },
    { feature: 'Packet Count', score: 76, color: '#10b981' },
    { feature: 'Port Numbers', score: 71, color: '#f59e0b' },
    { feature: 'Source IP Block', score: 65, color: '#ef4444' },
    { feature: 'Dest IP Block', score: 62, color: '#6366f1' }
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Feature Engineering</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Network Traffic Features & Importance Analysis
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-mono">
          <Info className="w-3.5 h-3.5 text-purple-400" />
          <span>Illustrative Demo Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 8 Feature Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {featureCards.map((f) => {
            const Icon = f.icon;
            const isSelected = selectedFeature === f.name;
            return (
              <div
                key={f.name}
                onClick={() => setSelectedFeature(isSelected ? null : f.name)}
                className={`soc-card-interactive p-4 flex flex-col justify-between cursor-pointer ${
                  isSelected ? 'border-cyan-400 shadow-glow-cyan' : ''
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg border ${f.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {f.importance}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                      {f.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">{f.role}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 font-sans">
                    {f.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Type: {f.type}</span>
                  <span className="text-cyan-400 font-semibold">Gini Ranked</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Feature Importance Horizontal Bar Chart */}
        <div className="lg:col-span-5 soc-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-borderMuted">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
                  Feature Importance Ranking (Gini Index)
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 mb-4">
              Relative predictive weight of input features calculated during tree-based ensemble training.
            </p>
          </div>

          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                <YAxis
                  dataKey="feature"
                  type="category"
                  stroke="#64748b"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  width={110}
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
                  formatter={(val: any) => [`${val}% Relative Importance`, 'Gini Importance']}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`feat-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>Method: Mean Decrease in Impurity (MDI)</span>
            <span className="text-purple-400">Illustrative Demo Data</span>
          </div>
        </div>

      </div>
    </section>
  );
};
