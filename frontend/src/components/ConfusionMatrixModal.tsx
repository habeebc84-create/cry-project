import React from 'react';
import { X, BrainCircuit, CheckCircle2, AlertTriangle, Info, HelpCircle } from 'lucide-react';

interface ConfusionMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelName?: string;
  metrics?: {
    tp: number;
    tn: number;
    fp: number;
    fn: number;
    accuracy: string;
    precision: string;
    recall: string;
    f1: string;
  };
}

export const ConfusionMatrixModal: React.FC<ConfusionMatrixModalProps> = ({
  isOpen,
  onClose,
  modelName = 'Random Forest Classifier',
  metrics = {
    tp: 9789,
    tn: 11842,
    fp: 90,
    fn: 211,
    accuracy: '98.2%',
    precision: '97.6%',
    recall: '97.9%',
    f1: '97.7%'
  }
}) => {
  if (!isOpen) return null;

  const total = metrics.tp + metrics.tn + metrics.fp + metrics.fn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl soc-card p-6 sm:p-7 border-cyan-700/60 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-borderMuted">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Confusion Matrix & Diagnostic Verification
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Model: <span className="text-cyan-300 font-bold">{modelName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2x2 Matrix Visualization */}
        <div className="my-6">
          <div className="text-center mb-3 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Predicted Class
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            {/* Actual Class Label Vertical */}
            <div className="col-span-2 text-center text-xs font-mono font-bold text-slate-300 uppercase tracking-wider -rotate-90">
              Actual Class
            </div>

            {/* Matrix Cells */}
            <div className="col-span-10 grid grid-cols-2 gap-3">
              
              {/* True Positive */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border-2 border-emerald-600/70 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-300 font-bold">TRUE POSITIVE (TP)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-200">Correct Attack</span>
                </div>
                <div className="text-2xl font-black text-white font-mono my-2">{metrics.tp.toLocaleString()}</div>
                <div className="text-[11px] text-slate-400">Malicious traffic accurately detected and quarantined.</div>
              </div>

              {/* False Positive */}
              <div className="p-4 rounded-xl bg-amber-950/40 border-2 border-amber-600/70 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-300 font-bold">FALSE POSITIVE (FP)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900 text-amber-200">Type I Error</span>
                </div>
                <div className="text-2xl font-black text-white font-mono my-2">{metrics.fp.toLocaleString()}</div>
                <div className="text-[11px] text-slate-400">Normal benign flow erroneously flagged as threat.</div>
              </div>

              {/* False Negative */}
              <div className="p-4 rounded-xl bg-rose-950/40 border-2 border-rose-600/70 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-300 font-bold">FALSE NEGATIVE (FN)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900 text-rose-200">Type II Error</span>
                </div>
                <div className="text-2xl font-black text-white font-mono my-2">{metrics.fn.toLocaleString()}</div>
                <div className="text-[11px] text-slate-400">Real intrusion bypassed undetected into network.</div>
              </div>

              {/* True Negative */}
              <div className="p-4 rounded-xl bg-blue-950/40 border-2 border-blue-600/70 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-blue-300 font-bold">TRUE NEGATIVE (TN)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900 text-blue-200">Correct Normal</span>
                </div>
                <div className="text-2xl font-black text-white font-mono my-2">{metrics.tn.toLocaleString()}</div>
                <div className="text-[11px] text-slate-400">Authorized traffic correctly allowed through.</div>
              </div>

            </div>
          </div>
        </div>

        {/* Calculated Metrics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block">Accuracy</span>
            <span className="text-sm font-bold text-cyan-400">{metrics.accuracy}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Precision</span>
            <span className="text-sm font-bold text-purple-400">{metrics.precision}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Recall (Sens.)</span>
            <span className="text-sm font-bold text-emerald-400">{metrics.recall}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">F1 Score</span>
            <span className="text-sm font-bold text-blue-400">{metrics.f1}</span>
          </div>
        </div>

        {/* Explanation Alert */}
        <div className="mt-4 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 font-sans">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            <strong>Evaluation Summary:</strong> A high Precision minimizes false alarms and analyst fatigue, while high Recall guarantees zero-day payloads cannot sneak past perimeter defenses.
          </p>
        </div>

      </div>
    </div>
  );
};
