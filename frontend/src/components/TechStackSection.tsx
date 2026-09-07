import React from 'react';
import { Code2, Cpu, Database, Server, Layout, FileCode, Palette, Globe, Layers, ArrowUpRight } from 'lucide-react';

export const TechStackSection: React.FC = () => {
  const technologies = [
    {
      name: 'Python 3.10+',
      role: 'Core Backend & ML Engine',
      category: 'Backend Core',
      icon: Code2,
      desc: 'Asynchronous event loops, socket tailing, and data transformation pipeline.',
      accent: 'border-blue-500/50 text-blue-400 bg-blue-950/20'
    },
    {
      name: 'Scikit-Learn',
      role: 'Machine Learning Library',
      category: 'ML / AI',
      icon: Cpu,
      desc: 'Ensemble Random Forests, Support Vector Classifiers, and stratified evaluation.',
      accent: 'border-orange-500/50 text-orange-400 bg-orange-950/20'
    },
    {
      name: 'Pandas & NumPy',
      role: 'Vectorized Data Processing',
      category: 'Data Science',
      icon: Database,
      desc: 'High-speed array manipulation, missing value imputation, and feature scaling.',
      accent: 'border-indigo-500/50 text-indigo-400 bg-indigo-950/20'
    },
    {
      name: 'FastAPI & WebSockets',
      role: 'Real-Time REST & Socket Hub',
      category: 'API & Streaming',
      icon: Server,
      desc: 'Sub-millisecond endpoint responses, bidirectional telemetry broadcasting.',
      accent: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/20'
    },
    {
      name: 'React 18 & TypeScript',
      role: 'Interactive SOC Interface',
      category: 'Frontend UI',
      icon: Layout,
      desc: 'Strictly-typed reactive state components, modular views, and custom hooks.',
      accent: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/20'
    },
    {
      name: 'Tailwind CSS',
      role: 'Modern SOC Design System',
      category: 'Styling & FX',
      icon: Palette,
      desc: 'Dark cybersecurity glassmorphism, responsive grid layouts, and custom glowing tokens.',
      accent: 'border-teal-500/50 text-teal-400 bg-teal-950/20'
    },
    {
      name: 'Three.js WebGL',
      role: '3D Network Topology Engine',
      category: '3D Graphics',
      icon: Globe,
      desc: 'Hardware-accelerated 3D node meshes, real-time particle flows, and camera orbit controls.',
      accent: 'border-purple-500/50 text-purple-400 bg-purple-950/20'
    },
    {
      name: 'Suricata NIDS 7.0+',
      role: 'Open-Source Detection Engine',
      category: 'Security Engine',
      icon: Layers,
      desc: 'Real-time multi-threaded packet sniffing, signature matching, and eve.json generation.',
      accent: 'border-rose-500/50 text-rose-400 bg-rose-950/20'
    }
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Technology Stack</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Underlying Engineering Frameworks & Libraries
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-md font-sans">
          Built on a production-grade, open-source stack with zero proprietary cloud lock-in.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {technologies.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.name}
              className="soc-card-interactive p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${t.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                    {t.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-display">
                    {t.name}
                  </h3>
                  <span className="text-xs text-cyan-400 font-mono block mt-0.5">{t.role}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {t.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Integrated Module</span>
                <span className="text-cyan-400 font-semibold">Active</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
