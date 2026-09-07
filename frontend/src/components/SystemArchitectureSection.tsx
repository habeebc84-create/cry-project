import React, { useState } from 'react';
import { Layers, Network, Server, Cpu, ShieldAlert, Radio, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const SystemArchitectureSection: React.FC = () => {
  const [activeNode, setActiveNode] = useState<number>(5);

  const architectureNodes = [
    {
      id: 0,
      name: 'Network Traffic',
      sub: 'Ingress Stream',
      icon: Network,
      color: 'border-cyan-500 text-cyan-400 bg-cyan-950/40',
      description: 'Physical & virtual NIC interfaces tapping live raw Ethernet frames and wireless packet flows.'
    },
    {
      id: 1,
      name: 'Data Collection',
      sub: 'Packet Sniffer',
      icon: Radio,
      color: 'border-blue-500 text-blue-400 bg-blue-950/40',
      description: 'Suricata NIDS / Async Socket Tailer aggregating socket buffers into structured JSON event logs.'
    },
    {
      id: 2,
      name: 'Preprocessing',
      sub: 'Data Sanitizer',
      icon: Layers,
      color: 'border-indigo-500 text-indigo-400 bg-indigo-950/40',
      description: 'Handling missing protocol flags, one-hot encoding categorical data, and robust feature normalization.'
    },
    {
      id: 3,
      name: 'Feature Extraction',
      sub: 'Statistical Vectors',
      icon: Sparkles,
      color: 'border-purple-500 text-purple-400 bg-purple-950/40',
      description: 'Computing temporal window variances, packet byte ratios, duration deltas, and entropy signatures.'
    },
    {
      id: 4,
      name: 'Feature Selection',
      sub: 'Gini Dimension Reduction',
      icon: Layers,
      color: 'border-pink-500 text-pink-400 bg-pink-950/40',
      description: 'Ranking top 15 most discriminative features to reduce model inference latency below 1 millisecond.'
    },
    {
      id: 5,
      name: 'ML Model Engine',
      sub: 'Ensemble Core',
      icon: Cpu,
      color: 'border-emerald-500 text-emerald-400 bg-emerald-950/40',
      description: 'Supervised Random Forest, Decision Tree, SVM, and KNN classifiers performing parallel scoring.'
    },
    {
      id: 6,
      name: 'Classification',
      sub: 'Class Probability',
      icon: CheckCircle2,
      color: 'border-teal-500 text-teal-400 bg-teal-950/40',
      description: 'Assigning class labels: Normal, DoS Flood, Port Scan Probe, R2L, or U2R with confidence scores.'
    },
    {
      id: 7,
      name: 'Threat Detection',
      sub: 'Anomaly Threshold',
      icon: ShieldAlert,
      color: 'border-amber-500 text-amber-400 bg-amber-950/40',
      description: 'Evaluating risk severity (Critical, High, Medium, Low) and matching against CVE signature rules.'
    },
    {
      id: 8,
      name: 'Alert Generation',
      sub: 'Async WebSocket',
      icon: Radio,
      color: 'border-rose-500 text-rose-400 bg-rose-950/40',
      description: 'Publishing structured JSON alert payloads over high-speed WebSocket channels to active SOC clients.'
    },
    {
      id: 9,
      name: 'SOC Dashboard',
      sub: '3D WebGL & React UI',
      icon: Server,
      color: 'border-cyan-400 text-cyan-300 bg-cyan-950/40',
      description: 'Rendering real-time 3D network topology graphs, live traffic telemetry, and threat triage workbench.'
    }
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Full-Stack Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Animated End-to-End System Architecture
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-md font-sans">
          Click on any architectural node to inspect its internal data transformation responsibilities.
        </p>
      </div>

      <div className="soc-card p-6 overflow-hidden">
        
        {/* Animated Connected Nodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative mb-6">
          {architectureNodes.map((node, idx) => {
            const Icon = node.icon;
            const isSelected = activeNode === idx;
            return (
              <button
                key={node.id}
                onClick={() => setActiveNode(idx)}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all group relative ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-glow-cyan scale-105 z-10'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg border ${node.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 group-hover:text-cyan-400">
                    0{idx + 1}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white font-display line-clamp-1 group-hover:text-cyan-300">
                    {node.name}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                    {node.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Node Details Box */}
        <div className="rounded-xl border border-cyan-800/60 bg-slate-950/90 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500 text-slate-950">
                STAGE 0{activeNode + 1}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white font-display">
                {architectureNodes[activeNode].name} —{' '}
                <span className="text-cyan-400">{architectureNodes[activeNode].sub}</span>
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-2xl">
              {architectureNodes[activeNode].description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 shrink-0 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero-Latency Stream Sync</span>
          </div>
        </div>

      </div>
    </section>
  );
};
