import React, { useState } from 'react';
import { BrainCircuit, Play, RotateCcw, AlertTriangle, ShieldCheck, Zap, Info, Sliders, CheckCircle2, Flame, Layers } from 'lucide-react';

export const TrafficClassifierWorkbench: React.FC = () => {
  const [protocol, setProtocol] = useState<string>('TCP');
  const [packetSize, setPacketSize] = useState<number>(1280);
  const [duration, setDuration] = useState<number>(0.04);
  const [packetCount, setPacketCount] = useState<number>(450);
  const [port, setPort] = useState<number>(80);
  const [trafficType, setTrafficType] = useState<string>('SYN Flood Burst');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>({
    prediction: 'POTENTIAL ATTACK',
    isAttack: true,
    confidence: '96.4%',
    riskLevel: 'HIGH',
    detectedClass: 'DoS / Flood Attack',
    topFactors: [
      { name: 'Packet Rate Burst', weight: '42%' },
      { name: 'Abnormal Duration (0.04s)', weight: '31%' },
      { name: 'SYN Flag Asymmetry', weight: '23%' }
    ]
  });

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Intelligent heuristic simulation based on inputs
      let attack = false;
      let detectedClass = 'Normal Authorized Flow';
      let riskLevel = 'LOW';
      let confidence = 98.2;
      let factors: { name: string; weight: string }[] = [];

      if (trafficType.includes('Flood') || packetCount > 500 || (packetCount > 100 && duration < 0.1)) {
        attack = true;
        detectedClass = 'DoS / Flood Attack';
        riskLevel = packetCount > 1000 ? 'CRITICAL' : 'HIGH';
        confidence = Math.min(99.4, 91.5 + (packetCount / 200));
        factors = [
          { name: `High Packet Burst (${packetCount} pkts)`, weight: '45%' },
          { name: `Low Session Duration (${duration}s)`, weight: '33%' },
          { name: `Protocol ${protocol} Header Entropy`, weight: '18%' }
        ];
      } else if (trafficType.includes('Probe') || trafficType.includes('Scan') || [21, 22, 23, 3389, 445, 1433].includes(port)) {
        attack = true;
        detectedClass = 'Probe / Port Scan';
        riskLevel = 'MEDIUM';
        confidence = 94.7;
        factors = [
          { name: `Sensitive Port Target (${port})`, weight: '48%' },
          { name: 'Sequential SYN Scan Pattern', weight: '28%' },
          { name: `Small Frame Size (${packetSize} B)`, weight: '20%' }
        ];
      } else if (trafficType.includes('Malware') || packetSize > 8000) {
        attack = true;
        detectedClass = 'Malware Payload Injection';
        riskLevel = 'CRITICAL';
        confidence = 97.8;
        factors = [
          { name: `Oversized Payload (${packetSize} B)`, weight: '52%' },
          { name: 'High Byte Entropy Variance', weight: '31%' },
          { name: 'Anomalous Push Flags', weight: '14%' }
        ];
      } else {
        attack = false;
        detectedClass = 'Normal Authorized Flow';
        riskLevel = 'LOW';
        confidence = 99.1;
        factors = [
          { name: 'Valid Bidirectional Handshake', weight: '50%' },
          { name: `Balanced Packet Size (${packetSize} B)`, weight: '30%' },
          { name: `Standard Protocol Latency (${duration}s)`, weight: '18%' }
        ];
      }

      setResult({
        prediction: attack ? 'POTENTIAL ATTACK' : 'NORMAL TRAFFIC',
        isAttack: attack,
        confidence: `${confidence.toFixed(1)}%`,
        riskLevel,
        detectedClass,
        topFactors: factors
      });
      setIsAnalyzing(false);
    }, 450);
  };

  const handleReset = () => {
    setProtocol('TCP');
    setPacketSize(512);
    setDuration(1.2);
    setPacketCount(12);
    setPort(443);
    setTrafficType('HTTPS Web Session');
    setResult(null);
  };

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive ML Playground</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Analyze Network Traffic in Real-Time
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-mono">
          <Info className="w-3.5 h-3.5 text-purple-400" />
          <span>Demo Prediction Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Input Form Parameters */}
        <div className="lg:col-span-7 soc-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-borderMuted mb-5">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
                Network Flow Parameter Vectors
              </h3>
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Protocol */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5 font-semibold">
                Protocol:
              </label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="TCP">TCP (Transmission Control Protocol)</option>
                <option value="UDP">UDP (User Datagram Protocol)</option>
                <option value="ICMP">ICMP (Internet Control Message)</option>
                <option value="GRE">GRE / Encapsulated</option>
              </select>
            </div>

            {/* Destination Port */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5 font-semibold">
                Destination Port:
              </label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. 80, 443, 22"
              />
            </div>

            {/* Packet Size */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                <span className="font-semibold">Mean Packet Size:</span>
                <span className="text-cyan-400">{packetSize} Bytes</span>
              </div>
              <input
                type="range"
                min="40"
                max="9000"
                step="20"
                value={packetSize}
                onChange={(e) => setPacketSize(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Duration */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                <span className="font-semibold">Connection Duration:</span>
                <span className="text-purple-400">{duration} Seconds</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="10.0"
                step="0.01"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            {/* Packet Count */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                <span className="font-semibold">Packet Count Delta:</span>
                <span className="text-emerald-400">{packetCount} Packets</span>
              </div>
              <input
                type="range"
                min="1"
                max="2000"
                step="10"
                value={packetCount}
                onChange={(e) => setPacketCount(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Traffic Type Preset */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5 font-semibold">
                Simulated Pattern Preset:
              </label>
              <select
                value={trafficType}
                onChange={(e) => setTrafficType(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="SYN Flood Burst">SYN Flood Burst (DoS Vector)</option>
                <option value="Port Scanning Recon">Port Scanning Recon (Probe)</option>
                <option value="HTTPS Web Session">HTTPS Web Session (Normal)</option>
                <option value="DNS Resolution Query">DNS Query (Normal UDP)</option>
                <option value="Malware C2 Beacon">Malware C2 Beacon (Malicious)</option>
                <option value="SSH Brute Attempt">SSH Brute Attempt (R2L)</option>
              </select>
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              Inference Mode: Ensemble Random Forest (n=100)
            </span>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-glow-cyan transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 text-slate-950 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Evaluating Vectors...' : 'Analyze Traffic'}
            </button>
          </div>
        </div>

        {/* Right: Real-time Prediction Output Card */}
        <div className="lg:col-span-5 soc-card p-6 flex flex-col justify-between border-cyan-800/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-borderMuted">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
                  ML Inference Classification Result
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                Lat: 0.82ms
              </span>
            </div>

            {result ? (
              <div className="space-y-4 my-4">
                
                {/* Status Hero Box */}
                <div
                  className={`p-4 rounded-xl border-2 flex items-center justify-between ${
                    result.isAttack
                      ? 'bg-rose-950/40 border-rose-600/80 text-rose-300 shadow-glow-red'
                      : 'bg-emerald-950/40 border-emerald-600/80 text-emerald-300 shadow-glow-emerald'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${result.isAttack ? 'bg-rose-900/60 text-rose-400' : 'bg-emerald-900/60 text-emerald-400'}`}>
                      {result.isAttack ? <AlertTriangle className="w-6 h-6 animate-pulse" /> : <ShieldCheck className="w-6 h-6" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-75">
                        Classifier Verdict
                      </span>
                      <h4 className="text-lg font-black font-display tracking-tight text-white">
                        {result.prediction}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] uppercase opacity-75 block">Risk Level</span>
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                      result.riskLevel === 'CRITICAL' || result.riskLevel === 'HIGH'
                        ? 'bg-rose-900 text-rose-200'
                        : 'bg-emerald-900 text-emerald-200'
                    }`}>
                      {result.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Classification Details */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Confidence Score</span>
                    <span className="text-base font-bold text-cyan-400">{result.confidence}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Detected Class</span>
                    <span className="text-xs font-bold text-white truncate block mt-0.5">{result.detectedClass}</span>
                  </div>
                </div>

                {/* Important Features Breakdown */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                    Top Contributing Feature Weights:
                  </span>
                  {result.topFactors.map((factor: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-mono bg-slate-950/80 p-2 rounded border border-slate-800/80">
                      <span className="text-slate-300">{factor.name}</span>
                      <span className="text-cyan-400 font-bold">{factor.weight}</span>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 font-mono text-xs">
                Configure parameters and click "Analyze Traffic" to trigger model inference.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-purple-300/80 bg-purple-950/20 p-2.5 rounded-lg border border-purple-900/40">
            ⚠️ <strong>Notice:</strong> Demo Prediction — Connect trained ML model / API for real production predictions.
          </div>
        </div>

      </div>
    </section>
  );
};
