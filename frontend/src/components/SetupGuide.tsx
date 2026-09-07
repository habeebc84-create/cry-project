import React, { useState } from 'react';
import { useMode } from '../context/ModeContext';
import { BookOpen, CheckCircle, Terminal, Settings, Copy, Check, ShieldCheck } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const { statusData, refreshStatus } = useMode();

  const [evePath, setEvePath] = useState<string>(statusData?.suricata?.path || 'C:/ProgramData/Suricata/log/eve.json');
  const [netInterface, setNetInterface] = useState<string>(statusData?.network?.interface || 'Default');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMsg, setSaveMsg] = useState<string>('');
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  React.useEffect(() => {
    if (statusData) {
      if (statusData.suricata?.path) setEvePath(statusData.suricata.path);
      if (statusData.network?.interface) setNetInterface(statusData.network.interface);
    }
  }, [statusData]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eve_json_path: evePath,
          network_interface: netInterface
        })
      });
      if (res.ok) {
        setSaveMsg('Configuration updated successfully!');
        setTimeout(() => setSaveMsg(''), 4000);
        await refreshStatus();
      }
    } catch (err) {
      console.error('Failed to update config:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const copyCode = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      step: 1,
      title: 'Install Suricata NIDS on your Authorized Host',
      desc: 'Install open-source Suricata engine on Linux (Ubuntu/Debian) or Windows.',
      cmd: '# Ubuntu / Debian\nsudo add-apt-repository ppa:oisf/suricata-stable\nsudo apt-get update && sudo apt-get install suricata\n\n# Windows\nDownload installer from https://suricata.io/download/'
    },
    {
      step: 2,
      title: 'Select Network Interface to Monitor',
      desc: 'List active network interfaces to bind Suricata for packet listening.',
      cmd: '# Linux\nip link show\n\n# Windows PowerShell\nGet-NetAdapter'
    },
    {
      step: 3,
      title: 'Configure Suricata EVE JSON Logging Output',
      desc: 'Open suricata.yaml and ensure outputs -> eve-log is enabled.',
      cmd: '# suricata.yaml excerpt:\noutputs:\n  - eve-log:\n      enabled: yes\n      filetype: regular\n      filename: eve.json\n      types:\n        - alert\n        - dns\n        - http'
    },
    {
      step: 4,
      title: 'Configure EVE JSON Path in Sentinel IDS',
      desc: 'Use the configuration card below to enter the exact absolute path to eve.json on your host.',
      cmd: 'Linux default: /var/log/suricata/eve.json\nWindows default: C:/ProgramData/Suricata/log/eve.json'
    },
    {
      step: 5,
      title: 'Start the Python FastAPI Backend',
      desc: 'Run the backend service. It will asynchronously tail eve.json and listen for WebSocket clients.',
      cmd: 'cd backend\npython -m venv venv\n.\\venv\\Scripts\\activate   # (or source venv/bin/activate)\npip install -r requirements.txt\npython run_backend.py'
    },
    {
      step: 6,
      title: 'Launch & Open the React Dashboard',
      desc: 'Start the Vite frontend web server.',
      cmd: 'cd frontend\nnpm install\nnpm run dev\n# Open http://localhost:3000'
    },
    {
      step: 7,
      title: 'Verify Live NIDS Status',
      desc: 'Confirm the dashboard header displays 🟢 LIVE DATA and suricata status is Connected.',
      cmd: 'Check top header status pill -> 🟢 LIVE DATA'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="soc-card p-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white font-mono tracking-tight flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            SURICATA CONNECTION & SETUP GUIDE
          </h3>
          <p className="text-xs text-slate-400">Step-by-step instructions to connect real authorized NIDS data</p>
        </div>
      </div>

      {/* Dynamic Backend Configuration Form Card */}
      <div className="soc-card p-5 space-y-4">
        <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-400" />
          Active Backend Monitoring Configuration
        </h4>

        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Suricata EVE JSON Absolute Path</label>
            <input
              type="text"
              value={evePath}
              onChange={(e) => setEvePath(e.target.value)}
              placeholder="e.g. C:/ProgramData/Suricata/log/eve.json"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Monitored Network Interface Name</label>
            <input
              type="text"
              value={netInterface}
              onChange={(e) => setNetInterface(e.target.value)}
              placeholder="e.g. eth0 or Wi-Fi"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between pt-2">
            {saveMsg ? (
              <span className="text-emerald-400 text-xs font-mono flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {saveMsg}
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold transition-colors"
            >
              {isSaving ? 'Updating...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>

      {/* Step by Step Accordion/List */}
      <div className="space-y-4">
        {steps.map((item) => (
          <div key={item.step} className="soc-card p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-emerald-400 flex-shrink-0">
                {item.step}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white font-mono">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => copyCode(item.cmd, item.step)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs flex items-center gap-1 font-mono transition-colors"
              >
                {copiedStep === item.step ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto">
              {item.cmd}
            </pre>
          </div>
        ))}
      </div>

    </div>
  );
};
