import React from 'react';
import { Target, Radio, Sparkles, Filter, Cpu, BarChart3, ShieldCheck, ChevronRight } from 'lucide-react';

export const ObjectivesSection: React.FC = () => {
  const objectives = [
    {
      num: '01',
      title: 'Collect Network Traffic',
      icon: Radio,
      description: 'Stream and ingest real-time packet headers, IP payloads, flow durations, and raw socket metadata across diverse network interfaces.',
      accent: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/30'
    },
    {
      num: '02',
      title: 'Clean and Prepare Data',
      icon: Filter,
      description: 'Sanitize incoming flows, handle missing bytes, filter malformed network frames, and normalize packet vectors for statistical consistency.',
      accent: 'border-blue-500/50 text-blue-400 bg-blue-950/30'
    },
    {
      num: '03',
      title: 'Extract Important Features',
      icon: Sparkles,
      description: 'Calculate crucial temporal and statistical flow attributes including protocol flags, packet rates, byte ratios, and inter-arrival time deltas.',
      accent: 'border-purple-500/50 text-purple-400 bg-purple-950/30'
    },
    {
      num: '04',
      title: 'Train ML Models',
      icon: Cpu,
      description: 'Train supervised Decision Trees, Random Forests, Support Vector Machines, and K-Nearest Neighbors on normalized benign and adversarial datasets.',
      accent: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30'
    },
    {
      num: '05',
      title: 'Compare Model Performance',
      icon: BarChart3,
      description: 'Evaluate classifiers across standard metrics: Accuracy, Precision, Recall, F1 Score, Confusion Matrices, and inference latency benchmarks.',
      accent: 'border-amber-500/50 text-amber-400 bg-amber-950/30'
    },
    {
      num: '06',
      title: 'Reduce False Positives',
      icon: ShieldCheck,
      description: 'Tune ensemble thresholds to suppress harmless traffic anomalies and eliminate alert fatigue for SOC security analysts.',
      accent: 'border-rose-500/50 text-rose-400 bg-rose-950/30'
    }
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>Core Objectives</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Strategic Research & Engineering Goals
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-md font-sans">
          End-to-end operational pipeline designed to transform raw network packets into deterministic threat classifications.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {objectives.map((obj) => {
          const Icon = obj.icon;
          return (
            <div
              key={obj.num}
              className="soc-card-interactive p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${obj.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono font-extrabold text-slate-600 group-hover:text-cyan-400 transition-colors">
                    {obj.num}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-display">
                  {obj.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {obj.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                <span>Phase Objective {obj.num}</span>
                <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
