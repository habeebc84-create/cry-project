import React from 'react';
import { ModelComparisonSection } from '../components/ModelComparisonSection';
import { BarChart3, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';

export const ModelComparisonPage: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <ModelComparisonSection />

      {/* Model Selection Decision Matrix Guide */}
      <section className="soc-card p-6 border-cyan-900/40">
        <div className="flex items-center gap-3 pb-4 border-b border-borderMuted mb-4">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Operational Decision Matrix: Which Classifier to Choose?
            </h3>
            <p className="text-xs text-slate-400">
              Guidance for network engineers deploying machine learning at line rate.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span>RANDOM FOREST (RECOMMENDED)</span>
              <span className="text-emerald-400">98.2% ACC</span>
            </div>
            <p className="text-slate-300 font-sans">
              Best overall trade-off between ultra-low false alarms (90 FP) and zero-day detection recall (97.9%). Perfect for high-consequence enterprise SOC environments.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-blue-400 font-bold">
              <span>DECISION TREE</span>
              <span className="text-blue-300">0.12ms LAT</span>
            </div>
            <p className="text-slate-300 font-sans">
              Sub-millisecond latency. Best when hardware resources are constrained (e.g. IoT edge gateways, low-power routers) where CPU cycles are critical.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-purple-400 font-bold">
              <span>SUPPORT VECTOR MACHINE</span>
              <span className="text-purple-300">MAX MARGIN</span>
            </div>
            <p className="text-slate-300 font-sans">
              Excels at high-dimensional feature spaces where subtle non-linear boundary separations exist between protocol flag anomalies.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>K-NEAREST NEIGHBORS</span>
              <span className="text-emerald-300">ZERO TRAINING</span>
            </div>
            <p className="text-slate-300 font-sans">
              Adapts dynamically to local neighborhood shifts. Ideal for initial exploratory cluster validation and anomaly density estimation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
