import React from 'react';
import { HelpCircle, Radio, Filter, BrainCircuit, ShieldAlert, BellRing, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Collect',
      sub: 'Gather Network Traffic',
      icon: Radio,
      desc: 'Sniff incoming raw packets from physical Ethernet, Wi-Fi, or Suricata eve.json stream in real time.',
      accent: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/30'
    },
    {
      num: '02',
      title: 'Prepare',
      sub: 'Clean and Transform',
      icon: Filter,
      desc: 'Sanitize packet headers, impute null socket values, encode categorical protocols, and scale numerical ranges.',
      accent: 'border-blue-500/50 text-blue-400 bg-blue-950/30'
    },
    {
      num: '03',
      title: 'Learn',
      sub: 'Train ML Models',
      icon: BrainCircuit,
      desc: 'Fit Decision Trees, Random Forests, SVMs, and KNNs on multi-dimensional benign and malicious traffic vectors.',
      accent: 'border-purple-500/50 text-purple-400 bg-purple-950/30'
    },
    {
      num: '04',
      title: 'Detect',
      sub: 'Classify Traffic Flow',
      icon: ShieldAlert,
      desc: 'Evaluate live connection flows in sub-millisecond cycles to detect DoS bursts, port scans, and malware probes.',
      accent: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30'
    },
    {
      num: '05',
      title: 'Alert',
      sub: 'Generate Security Alerts',
      icon: BellRing,
      desc: 'Broadcast structured incident notifications over WebSockets to SOC operators with actionable remediation steps.',
      accent: 'border-rose-500/50 text-rose-400 bg-rose-950/30'
    }
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Workflow Lifecycle</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            How the System Works in 5 Steps
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-md font-sans">
          A seamless flow from physical packet capture to real-time machine learning threat triage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="soc-card-interactive p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${s.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono font-extrabold text-slate-600 group-hover:text-cyan-400 transition-colors">
                    {s.num}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-display">
                    {s.title}
                  </h3>
                  <span className="text-xs text-cyan-400 font-mono block mt-0.5">{s.sub}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                <span>Phase {s.num}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
