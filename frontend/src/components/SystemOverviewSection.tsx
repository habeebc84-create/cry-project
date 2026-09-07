import React, { useState } from 'react';
import { Shield, BrainCircuit, Check, X, ArrowRight, Layers, Sparkles, Scale } from 'lucide-react';

export const SystemOverviewSection: React.FC = () => {
  const [selectedAspect, setSelectedAspect] = useState<number | null>(null);

  const comparisonRows = [
    {
      feature: 'Detection Paradigm',
      traditional: 'Signature-based (Exact string & hash match)',
      ml: 'Pattern-based learning (Statistical & feature vectors)',
      traditionalBadge: 'Rigid',
      mlBadge: 'Adaptive',
      description: 'Traditional looks for explicit pre-recorded bit strings; ML looks at behavioral feature relationships across protocols and flow timings.'
    },
    {
      feature: 'Detection Rulebase',
      traditional: 'Static rules & hand-crafted heuristics',
      ml: 'Adaptive multi-parameter models (Trees & SVM)',
      traditionalBadge: 'Deterministic',
      mlBadge: 'Probabilistic',
      description: 'Static rules break on minor packet mutation. ML trees and boundary kernels naturally tolerate noise and polymorphic permutations.'
    },
    {
      feature: 'Threat Scope',
      traditional: 'Strictly known attacks with published CVEs',
      ml: 'Known attacks + Zero-day unknown anomalies',
      traditionalBadge: 'Reactive',
      mlBadge: 'Proactive',
      description: 'Novel zero-day exploits slip past static pattern checkers until a signature is authored and distributed.'
    },
    {
      feature: 'Update & Maintenance',
      traditional: 'Manual rule authoring & slow updates',
      ml: 'Automated feature retraining & model pipelines',
      traditionalBadge: 'High Overhead',
      mlBadge: 'Continuous Flow',
      description: 'Security teams spend hundreds of hours maintaining rulesets; ML pipelines automate ingestion and model tuning.'
    },
    {
      feature: 'Network Adaptability',
      traditional: 'Limited adaptability across topology shifts',
      ml: 'High throughput scalability & real-time inference',
      traditionalBadge: 'Low Flexibility',
      mlBadge: 'Autonomous',
      description: 'ML models generalize seamlessly across diverse enterprise subnets, cloud VPCs, and IoT topologies.'
    }
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            <span>Architecture Foundations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            System Overview & Comparative Paradigm
          </h2>
        </div>
      </div>

      {/* Intro Box */}
      <div className="soc-card p-6 sm:p-7 mb-6 border-cyan-900/40 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-400 shrink-0 hidden sm:block">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white font-display">
              The Need for Machine Learning at the Network Edge
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Network systems continuously exchange massive amounts of data, creating critical opportunities for adversaries to exploit subtle communication vulnerabilities. Intrusion Detection Systems help identify suspicious activities, but traditional approaches mainly depend on predefined signatures. Machine Learning provides an adaptive approach by learning traffic patterns, extracting multi-dimensional statistical features, and detecting malicious behavior automatically with high precision.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Comparison Matrix */}
      <div className="soc-card overflow-hidden">
        <div className="p-4 border-b border-borderMuted bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
              Interactive Paradigm Matrix: Traditional vs. ML-Based IDS
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Click any dimension to reveal architecture insights
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left soc-table border-collapse">
            <thead>
              <tr>
                <th className="w-1/4">Evaluation Dimension</th>
                <th className="w-3/8 text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Shield className="w-3.5 h-3.5 text-rose-400" />
                    <span>Traditional Signature IDS (Snort/Static)</span>
                  </div>
                </th>
                <th className="w-3/8 text-cyan-400">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ML-Based Intelligent IDS (Sentinel Frontier)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => {
                const isSelected = selectedAspect === idx;
                return (
                  <React.Fragment key={idx}>
                    <tr
                      onClick={() => setSelectedAspect(isSelected ? null : idx)}
                      className={`cursor-pointer transition-colors font-mono text-xs ${
                        isSelected ? 'bg-cyan-950/30' : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <td className="font-bold text-white flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        {row.feature}
                      </td>
                      <td className="text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="p-0.5 rounded bg-rose-950/60 border border-rose-800 text-rose-400">
                            <X className="w-3 h-3" />
                          </span>
                          <span>{row.traditional}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 ml-auto">
                            {row.traditionalBadge}
                          </span>
                        </div>
                      </td>
                      <td className="text-cyan-200 font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="p-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-400">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>{row.ml}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 ml-auto">
                            {row.mlBadge}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {isSelected && (
                      <tr className="bg-cyan-950/20 border-b border-cyan-900/40">
                        <td colSpan={3} className="p-3 text-xs text-slate-300 font-sans pl-8">
                          <div className="flex items-center gap-2 text-cyan-300 font-mono text-[11px] mb-1">
                            <ArrowRight className="w-3 h-3 text-cyan-400" />
                            <span>Analytical Deep Dive:</span>
                          </div>
                          <p>{row.description}</p>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
