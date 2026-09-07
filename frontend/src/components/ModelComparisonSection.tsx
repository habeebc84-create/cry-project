import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell } from 'recharts';
import { BarChart3, Trophy, CheckCircle, Info, Sparkles, Filter, Eye } from 'lucide-react';
import { ConfusionMatrixModal } from './ConfusionMatrixModal';

export const ModelComparisonSection: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'accuracy' | 'precision' | 'recall' | 'f1'>('all');
  const [isMatrixOpen, setIsMatrixOpen] = useState<boolean>(false);
  const [selectedModelName, setSelectedModelName] = useState<string>('Random Forest');

  const modelData = [
    {
      name: 'Decision Tree',
      accuracy: 94.8,
      precision: 93.5,
      recall: 92.9,
      f1: 93.2,
      latencyMs: 0.12,
      memoryMb: 8.4,
      isBest: false
    },
    {
      name: 'Random Forest',
      accuracy: 98.2,
      precision: 97.6,
      recall: 97.9,
      f1: 97.7,
      latencyMs: 0.85,
      memoryMb: 34.2,
      isBest: true
    },
    {
      name: 'SVM',
      accuracy: 95.6,
      precision: 94.8,
      recall: 94.1,
      f1: 94.4,
      latencyMs: 1.42,
      memoryMb: 18.6,
      isBest: false
    },
    {
      name: 'KNN',
      accuracy: 93.9,
      precision: 92.7,
      recall: 93.2,
      f1: 92.9,
      latencyMs: 4.10,
      memoryMb: 48.0,
      isBest: false
    }
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Empirical Benchmarks</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Model Performance Comparison & Evaluation
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-mono">
          <Info className="w-3.5 h-3.5 text-purple-400" />
          <span>Illustrative Demo Benchmarks</span>
        </div>
      </div>

      {/* Top Best Model Highlight Card */}
      <div className="soc-card p-5 mb-6 border-cyan-500/60 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-blue-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glow-cyan">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500 text-slate-950 shadow-glow-cyan shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                RECOMMENDED PRODUCTION MODEL
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">★ 98.2% Accuracy</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display mt-0.5">
              Random Forest Meta-Classifier Outperforms All Baselines
            </h3>
            <p className="text-xs text-slate-300">
              Achieved highest F1-score (97.7%) and lowest false positive rate across diverse payload anomalies.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedModelName('Random Forest');
            setIsMatrixOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shrink-0 transition-all shadow-md"
        >
          <Eye className="w-4 h-4 text-slate-950" />
          Inspect Confusion Matrix
        </button>
      </div>

      {/* Grid: Comparison Table & Multi-Metric Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Comparison Table */}
        <div className="lg:col-span-6 soc-card overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-borderMuted bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
                  Comprehensive Metric Matrix
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">4 Algorithms</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left soc-table border-collapse">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th className="text-right">Accuracy</th>
                    <th className="text-right">Precision</th>
                    <th className="text-right">Recall</th>
                    <th className="text-right">F1 Score</th>
                  </tr>
                </thead>
                <tbody>
                  {modelData.map((m) => (
                    <tr
                      key={m.name}
                      onClick={() => {
                        setSelectedModelName(m.name);
                        setIsMatrixOpen(true);
                      }}
                      className={`cursor-pointer font-mono text-xs transition-colors group ${
                        m.isBest ? 'bg-cyan-950/30' : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <td className="font-bold text-white flex items-center gap-2">
                        {m.isBest && <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />}
                        <span>{m.name}</span>
                        {m.isBest && (
                          <span className="text-[9px] px-1 rounded bg-cyan-500 text-slate-950 font-extrabold ml-1">
                            BEST
                          </span>
                        )}
                      </td>
                      <td className="text-right text-cyan-400 font-bold">{m.accuracy}%</td>
                      <td className="text-right text-purple-400 font-bold">{m.precision}%</td>
                      <td className="text-right text-emerald-400 font-bold">{m.recall}%</td>
                      <td className="text-right text-blue-400 font-bold">{m.f1}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Evaluation Set: 20,000 Verified Test Packets</span>
            <span className="text-cyan-400">Click row for full breakdown</span>
          </div>
        </div>

        {/* Right: Multi-Metric Comparison Bar Chart */}
        <div className="lg:col-span-6 soc-card p-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-borderMuted">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
                  Visual Metric Comparison
                </h3>
              </div>

              {/* Metric filter buttons */}
              <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs font-mono">
                <button
                  onClick={() => setSelectedMetric('all')}
                  className={`px-2 py-0.5 rounded ${
                    selectedMetric === 'all' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedMetric('accuracy')}
                  className={`px-2 py-0.5 rounded ${
                    selectedMetric === 'accuracy' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  Acc
                </button>
                <button
                  onClick={() => setSelectedMetric('f1')}
                  className={`px-2 py-0.5 rounded ${
                    selectedMetric === 'f1' ? 'bg-slate-800 text-blue-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  F1
                </button>
              </div>
            </div>
          </div>

          <div className="h-[260px] w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis domain={[90, 100]} stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.8)'
                  }}
                  formatter={(val: any, name: string) => [`${val}%`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                {(selectedMetric === 'all' || selectedMetric === 'accuracy') && (
                  <Bar dataKey="accuracy" name="Accuracy %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                )}
                {selectedMetric === 'all' && (
                  <Bar dataKey="precision" name="Precision %" fill="#a855f7" radius={[4, 4, 0, 0]} />
                )}
                {selectedMetric === 'all' && (
                  <Bar dataKey="recall" name="Recall %" fill="#10b981" radius={[4, 4, 0, 0]} />
                )}
                {(selectedMetric === 'all' || selectedMetric === 'f1') && (
                  <Bar dataKey="f1" name="F1 Score %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>Domain bounded [90% - 100%] for relative variance display</span>
            <span className="text-purple-400">Illustrative Demo Data</span>
          </div>
        </div>

      </div>

      {isMatrixOpen && (
        <ConfusionMatrixModal
          isOpen={isMatrixOpen}
          onClose={() => setIsMatrixOpen(false)}
          modelName={selectedModelName}
        />
      )}
    </section>
  );
};
