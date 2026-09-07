import React from 'react';
import { Layers, ShieldAlert, Clock, BellOff, BrainCircuit, AlertTriangle, ChevronRight } from 'lucide-react';

export const ProblemStatementSection: React.FC = () => {
  const problems = [
    {
      id: 1,
      title: 'High-Volume Traffic',
      icon: Layers,
      description: 'Modern networks generate complex and high-volume traffic that is difficult to monitor manually, saturating traditional single-threaded packet inspectors.',
      tag: 'Scale Bottleneck',
      accent: 'border-blue-500/40 text-blue-400 bg-blue-950/20'
    },
    {
      id: 2,
      title: 'Unknown Attacks',
      icon: ShieldAlert,
      description: 'Signature-based systems fail to identify zero-day vulnerabilities and previously unknown attack patterns without pre-compiled byte rules.',
      tag: 'Zero-Day Vulnerability',
      accent: 'border-rose-500/40 text-rose-400 bg-rose-950/20'
    },
    {
      id: 3,
      title: 'Manual Monitoring',
      icon: Clock,
      description: 'Analyzing massive amounts of continuous flow traffic manually is time-consuming, expensive, and prone to human cognitive fatigue.',
      tag: 'Operational Fatigue',
      accent: 'border-amber-500/40 text-amber-400 bg-amber-950/20'
    },
    {
      id: 4,
      title: 'False Alerts',
      icon: BellOff,
      description: 'Large numbers of false positives overwhelm security analysts, leading to alarm desensitization and missed critical intrusions.',
      tag: 'Alert Fatigue',
      accent: 'border-purple-500/40 text-purple-400 bg-purple-950/20'
    },
    {
      id: 5,
      title: 'Need for Intelligence',
      icon: BrainCircuit,
      description: 'Machine Learning can learn subtle statistical traffic patterns, generalize unseen behavioral anomalies, and identify suspicious behavior automatically.',
      tag: 'Adaptive Solution',
      accent: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20'
    }
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Problem Statement</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Why Traditional Intrusion Detection Falls Short
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-md font-sans">
          Static signatures struggle in modern decentralized environments. Machine Learning bridges the latency and adaptability gap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {problems.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="soc-card-interactive p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${p.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                    {p.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-display">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                <span>Vulnerability Vector #{p.id}</span>
                <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
