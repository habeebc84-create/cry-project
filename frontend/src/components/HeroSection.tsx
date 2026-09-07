import React from 'react';
import { Shield, Sparkles, Activity, Cpu, ArrowRight, Radio, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useMode } from '../context/ModeContext';

interface HeroSectionProps {
  onExploreClick?: () => void;
  onDashboardClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onDashboardClick }) => {
  const { mode, suricataConnected } = useMode();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-borderMuted bg-gradient-to-b from-surfaceLight/90 via-surface/95 to-background p-6 sm:p-10 lg:p-12 mb-8 shadow-soc">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle Grid overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-60 pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading & Copy */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 text-xs font-mono">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-semibold tracking-wide">NEXT-GEN INTELLIGENT CYBER DEFENSE</span>
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display leading-tight">
              Intrusion Detection in Network Traffic
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-display">
              The Machine Learning Frontier
            </h2>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
            An intelligent Machine Learning-based system for detecting, classifying, and monitoring suspicious network traffic with adaptive threat analysis. Protects modern high-throughput architectures through real-time packet inspection and predictive anomaly identification.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onDashboardClick}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm font-mono flex items-center gap-2 shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
            >
              <Activity className="w-4 h-4 text-slate-950" />
              View Dashboard
            </button>
            <button
              onClick={onExploreClick}
              className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm font-mono flex items-center gap-2 transition-all hover:border-cyan-500/50"
            >
              Explore System
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* KPI Indicators */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-mono">
                <span className="text-[10px] text-slate-400 uppercase">Benchmark</span>
                <Sparkles className="w-3 h-3 text-cyan-400" />
              </div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">99.2%</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                Demo Accuracy <span className="text-[9px] text-purple-400 font-mono">[Demo]</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-purple-400 font-mono">
                <span className="text-[10px] text-slate-400 uppercase">Ensemble</span>
                <Cpu className="w-3 h-3 text-purple-400" />
              </div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">4 Models</div>
              <div className="text-[11px] text-slate-400">ML Classifiers</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
                <span className="text-[10px] text-slate-400 uppercase">Telemetry</span>
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              </div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">24/7</div>
              <div className="text-[11px] text-slate-400">Active Monitoring</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-blue-400 font-mono">
                <span className="text-[10px] text-slate-400 uppercase">Precision</span>
                <ShieldCheck className="w-3 h-3 text-blue-400" />
              </div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">-86%</div>
              <div className="text-[11px] text-slate-400">Reduced False Alarms</div>
            </div>
          </div>

        </div>

        {/* Right Column: Animated Network Flow Canvas */}
        <div className="lg:col-span-5">
          <div className="relative rounded-xl border border-cyan-900/50 bg-slate-950/80 p-5 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-200 font-semibold">LIVE THREAT & PACKET SIMULATOR</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                100 Gbps Link
              </span>
            </div>

            {/* SVG Visual Network Flow */}
            <div className="relative h-64 w-full flex items-center justify-center my-2">
              <svg className="w-full h-full" viewBox="0 0 400 240">
                <defs>
                  <linearGradient id="gradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="gradRed" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="gradGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                  </filter>
                </defs>

                {/* Connection lines */}
                <path d="M 50 60 Q 150 40 200 120" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 50 180 Q 150 200 200 120" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 200 120 L 350 70" fill="none" stroke="#1e293b" strokeWidth="2" />
                <path d="M 200 120 L 350 170" fill="none" stroke="#1e293b" strokeWidth="2" />

                {/* Normal packet animation */}
                <path d="M 50 60 Q 150 40 200 120 L 350 70" fill="none" stroke="url(#gradGreen)" strokeWidth="2.5" strokeDasharray="10 14" opacity="0.85">
                  <animate attributeName="stroke-dashoffset" values="400;0" dur="3s" repeatCount="indefinite" />
                </path>

                {/* Attack packet animation */}
                <path d="M 50 180 Q 150 200 200 120 L 350 170" fill="none" stroke="url(#gradRed)" strokeWidth="2.5" strokeDasharray="10 14" opacity="0.9">
                  <animate attributeName="stroke-dashoffset" values="400;0" dur="2s" repeatCount="indefinite" />
                </path>

                {/* Source Nodes */}
                <g transform="translate(50, 60)">
                  <circle r="16" fill="#0f172a" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
                  <text y="4" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">CLI-1</text>
                  <text y="28" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">192.168.1.12</text>
                </g>

                <g transform="translate(50, 180)">
                  <circle r="16" fill="#0f172a" stroke="#ef4444" strokeWidth="2" filter="url(#glow)" />
                  <text y="4" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">ATTK</text>
                  <text y="28" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="monospace">10.45.2.89</text>
                </g>

                {/* Central ML Engine Node */}
                <g transform="translate(200, 120)">
                  <rect x="-35" y="-22" width="70" height="44" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" filter="url(#glow)" />
                  <text y="-4" textAnchor="middle" fill="#06b6d4" fontSize="10" fontFamily="monospace" fontWeight="bold">ML ENGINE</text>
                  <text y="10" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">Random Forest</text>
                </g>

                {/* Destination Nodes */}
                <g transform="translate(350, 70)">
                  <circle r="16" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" />
                  <text y="4" textAnchor="middle" fill="#3b82f6" fontSize="9" fontFamily="monospace" fontWeight="bold">GATE</text>
                  <text y="28" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">PASSED</text>
                </g>

                <g transform="translate(350, 170)">
                  <circle r="16" fill="#0f172a" stroke="#ef4444" strokeWidth="2" filter="url(#glow)" />
                  <text y="4" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">QUAR</text>
                  <text y="28" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="monospace">ISOLATED</text>
                </g>
              </svg>
            </div>

            {/* Dynamic Status Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Normal Traffic: Approved</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-400">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>Malicious Flow: Blocked</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
