import React, { useState } from 'react';
import { GitCommit, ArrowDown, ArrowRight, Layers, CheckCircle2, Info, Sparkles } from 'lucide-react';

export const DataPipelineSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      title: 'Network Traffic',
      short: 'Raw Packets',
      stage: 'Ingress Stage',
      description: 'Continuous stream of raw network packets captured via promiscuous mode socket interfaces, PCAP dump streams, or live Suricata EVE telemetry.',
      tech: 'Promiscuous NIC / AF_PACKET',
      example: 'TCP SYN 192.168.1.15:443 -> 10.0.0.8:58210 (64 bytes)'
    },
    {
      id: 1,
      title: 'Data Collection',
      short: 'Metadata Aggregation',
      stage: 'Capture Stage',
      description: 'Aggregation of connection sessions into structured bidirection flow records, collecting timestamps, IP endpoints, protocol flags, and byte counters.',
      tech: 'NetFlow / IPFIX / EVE Tailer',
      example: '{ proto: "TCP", src: "192.168.1.15", dst_port: 80, pkts: 42 }'
    },
    {
      id: 2,
      title: 'Data Cleaning',
      short: 'Sanitization',
      stage: 'Preprocessing 1',
      description: 'Removal of corrupted payloads, deduplication of retransmitted probe packets, and pruning of incomplete socket handshakes.',
      tech: 'Pandas / NumPy Vectorization',
      example: 'Dropping 0.4% corrupted packet headers & TCP retransmissions'
    },
    {
      id: 3,
      title: 'Missing Value Handling',
      short: 'Imputation',
      stage: 'Preprocessing 2',
      description: 'Handling unassigned port services, null duration metrics on fragmented packets, and zero-byte payload flows via median/mode imputation.',
      tech: 'SimpleImputer / Iterative SVD',
      example: 'Imputing missing TCP window sizes with median value 65,535'
    },
    {
      id: 4,
      title: 'Categorical Encoding',
      short: 'One-Hot / Target',
      stage: 'Encoding Stage',
      description: 'Transforming categorical string attributes (e.g. Protocol: TCP/UDP/ICMP, Service: HTTP/SSH/DNS, Flag: SF/REJ/S0) into numerical vectors.',
      tech: 'OneHotEncoder / Scikit-Learn',
      example: 'Protocol: [1, 0, 0] (TCP), [0, 1, 0] (UDP), [0, 0, 1] (ICMP)'
    },
    {
      id: 5,
      title: 'Normalization',
      short: 'Feature Scaling',
      stage: 'Scaling Stage',
      description: 'Scaling features with wildly different ranges (e.g., Duration 0.001s vs Packet Size 1,500,000 bytes) using MinMax or StandardScaler.',
      tech: 'StandardScaler / RobustScaler',
      example: 'x_scaled = (x - mean) / std_dev -> range normalized to [-1, 1]'
    },
    {
      id: 6,
      title: 'Feature Selection',
      short: 'Dimensionality Reduction',
      stage: 'Feature Engineering',
      description: 'Selecting optimal predictive features using Mutual Information, Random Forest Gini Importance, and Correlation Heatmaps to eliminate noise.',
      tech: 'SelectKBest / Gini Feature Ranking',
      example: 'Retained top 15 most discriminative statistical flow features'
    },
    {
      id: 7,
      title: 'Train / Test Split',
      short: 'Stratified Validation',
      stage: 'Evaluation Ready',
      description: 'Splitting normalized dataset into 80% Training and 20% Testing sets using Stratified K-Fold to maintain exact class attack proportions.',
      tech: 'train_test_split(stratify=y, test_size=0.2)',
      example: 'Train: 80,000 samples | Test: 20,000 samples (Class balanced)'
    }
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Engineering Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Data Preprocessing & Preparation Pipeline
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-md font-sans">
          Hover or click on any stage along the pipeline to view real-time data transformations and engineering specifics.
        </p>
      </div>

      {/* Interactive Pipeline Track */}
      <div className="soc-card p-6 overflow-hidden">
        
        {/* Horizontal Flow Line (Desktop) */}
        <div className="hidden lg:grid grid-cols-8 gap-2 relative mb-6">
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 -z-0 opacity-40" />
          
          {steps.map((s, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(idx)}
                onMouseEnter={() => setActiveStep(idx)}
                className={`relative z-10 flex flex-col items-center text-center group transition-all ${
                  isCurrent ? 'scale-105' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all shadow-md ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan border-2 border-white'
                      : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-cyan-400'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className={`text-[11px] font-mono mt-2 transition-colors font-bold ${
                  isCurrent ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  {s.title}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">{s.short}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile / Tablet Horizontal Scroll */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-4">
          {steps.map((s, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(idx)}
                className={`shrink-0 px-3 py-2 rounded-lg font-mono text-xs flex items-center gap-2 border transition-all ${
                  isCurrent
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-glow-cyan'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="font-bold">{idx + 1}.</span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Detail Panel of Selected Pipeline Step */}
        <div className="rounded-xl border border-cyan-800/40 bg-slate-950/90 p-5 sm:p-6 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-cyan-500 text-slate-950 font-mono font-bold text-xs">
                STAGE 0{steps[activeStep].id + 1}
              </span>
              <h3 className="text-lg font-bold text-white font-display">
                {steps[activeStep].title} — <span className="text-cyan-400">{steps[activeStep].stage}</span>
              </h3>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              Tool: {steps[activeStep].tech}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 items-center">
            <div className="md:col-span-7 space-y-2">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {steps[activeStep].description}
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Deterministic Transformation Verified</span>
              </div>
            </div>

            <div className="md:col-span-5 bg-slate-900/80 rounded-lg border border-slate-800 p-3 font-mono text-xs space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Example Payload / Transform</div>
              <div className="text-cyan-300 text-[11px] break-all">
                {steps[activeStep].example}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
