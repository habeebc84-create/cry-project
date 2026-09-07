import React, { useState } from 'react';
import { Cpu, GitFork, Network, Layers, ShieldCheck, ArrowRight, Eye, Zap, Info, BarChart } from 'lucide-react';
import { ConfusionMatrixModal } from './ConfusionMatrixModal';

export const MLModelsSection: React.FC = () => {
  const [activeModalModel, setActiveModalModel] = useState<any | null>(null);

  const models = [
    {
      name: 'Decision Tree',
      type: 'Tree Classifier',
      icon: GitFork,
      desc: 'Simple and interpretable hierarchical classification using recursive binary partitioning.',
      accuracy: '94.8%',
      precision: '93.5%',
      recall: '92.9%',
      f1: '93.2%',
      accent: 'border-blue-500/50 text-blue-400 bg-blue-950/20',
      badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
      strengths: 'Fastest training and inference latency; human-readable decision rules.',
      limitations: 'Susceptible to overfitting on noisy or imbalanced packet data.',
      matrix: {
        tp: 9290,
        tn: 11620,
        fp: 312,
        fn: 710,
        accuracy: '94.8%',
        precision: '93.5%',
        recall: '92.9%',
        f1: '93.2%'
      }
    },
    {
      name: 'Random Forest',
      type: 'Ensemble Meta-Estimator',
      icon: Layers,
      desc: 'Combines multiple decision trees with bootstrap aggregation for highly robust, noise-resilient predictions.',
      accuracy: '98.2%',
      precision: '97.6%',
      recall: '97.9%',
      f1: '97.7%',
      accent: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/20',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      isBest: true,
      strengths: 'Exceptional generalization; handles complex non-linear feature interactions without overfitting.',
      limitations: 'Higher memory footprint during live multi-gigabit inference.',
      matrix: {
        tp: 9790,
        tn: 11842,
        fp: 90,
        fn: 210,
        accuracy: '98.2%',
        precision: '97.6%',
        recall: '97.9%',
        f1: '97.7%'
      }
    },
    {
      name: 'Support Vector Machine (SVM)',
      type: 'Kernel Classifier',
      icon: Cpu,
      desc: 'Separates network traffic classes using optimized maximum-margin hyperplanes in high-dimensional space.',
      accuracy: '95.6%',
      precision: '94.8%',
      recall: '94.1%',
      f1: '94.4%',
      accent: 'border-purple-500/50 text-purple-400 bg-purple-950/20',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
      strengths: 'Effective in clear boundary margins; memory efficient via support vector subset.',
      limitations: 'Quadratic scaling complexity with very large traffic record counts.',
      matrix: {
        tp: 9410,
        tn: 11710,
        fp: 222,
        fn: 590,
        accuracy: '95.6%',
        precision: '94.8%',
        recall: '94.1%',
        f1: '94.4%'
      }
    },
    {
      name: 'K-Nearest Neighbors (KNN)',
      type: 'Instance-Based Classifier',
      icon: Network,
      desc: 'Classifies network traffic based on Euclidean distance similarities between known feature clusters.',
      accuracy: '93.9%',
      precision: '92.7%',
      recall: '93.2%',
      f1: '92.9%',
      accent: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/20',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      strengths: 'Zero training phase required; adapts naturally to local manifold shifts.',
      limitations: 'Slower query phase on high-throughput packet streams.',
      matrix: {
        tp: 9320,
        tn: 11480,
        fp: 452,
        fn: 680,
        accuracy: '93.9%',
        precision: '92.7%',
        recall: '93.2%',
        f1: '92.9%'
      }
    }
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Machine Learning Frontier</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Core Machine Learning Threat Detection Models
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-mono">
          <Info className="w-3.5 h-3.5 text-purple-400" />
          <span>Benchmark Demonstration Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {models.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.name}
              className={`soc-card-interactive p-6 flex flex-col justify-between group relative overflow-hidden ${
                m.isBest ? 'border-cyan-500/60 shadow-glow-cyan' : ''
              }`}
            >
              {m.isBest && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-600 text-slate-950 font-mono font-extrabold text-[10px] uppercase px-3 py-0.5 rounded-bl-lg">
                  ★ TOP PERFORMER (98.2%)
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl border ${m.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-display">
                      {m.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">{m.type}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {m.desc}
                </p>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center font-mono">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Accuracy</span>
                    <span className="text-sm font-bold text-cyan-400">{m.accuracy}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Precision</span>
                    <span className="text-sm font-bold text-purple-400">{m.precision}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Recall</span>
                    <span className="text-sm font-bold text-emerald-400">{m.recall}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">F1 Score</span>
                    <span className="text-sm font-bold text-blue-400">{m.f1}</span>
                  </div>
                </div>
              </div>

              {/* Action and Deep Dive Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  {m.strengths.split(';')[0]}
                </span>
                <button
                  onClick={() => setActiveModalModel(m)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/70 hover:border-cyan-500 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  View Details & Matrix
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confusion Matrix Modal Trigger */}
      {activeModalModel && (
        <ConfusionMatrixModal
          isOpen={!!activeModalModel}
          onClose={() => setActiveModalModel(null)}
          modelName={activeModalModel.name}
          metrics={activeModalModel.matrix}
        />
      )}
    </section>
  );
};
