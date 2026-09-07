import React, { useState } from 'react';
import { 
  Shield, Activity, Database, Network, HeartPulse, BookOpen, 
  ArrowDown, ArrowUp, Wifi, HardDrive, BrainCircuit, BarChart3, 
  Layers, ShieldAlert, Sparkles, Menu, X, Compass
} from 'lucide-react';
import { useMode } from '../context/ModeContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { mode, setMode, suricataConnected, trafficHistory, liveAlerts } = useMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const latestPoint = trafficHistory.length > 0 ? trafficHistory[trafficHistory.length - 1] : null;
  const networkName = latestPoint?.network_name || 'Ethernet/Wi-Fi';
  const ipAddress = latestPoint?.ip_address || '127.0.0.1';
  const downloadSpeed = latestPoint?.download_speed_formatted || '2.4 MB/s';
  const uploadSpeed = latestPoint?.upload_speed_formatted || '0.8 MB/s';
  const unreadAlertsCount = liveAlerts.length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'traffic', label: 'Traffic Monitor', icon: Network },
    { id: 'threat-detection', label: 'Threat Detection', icon: ShieldAlert, badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined },
    { id: 'models', label: 'ML Models', icon: BrainCircuit },
    { id: 'comparison', label: 'Model Comparison', icon: BarChart3 },
    { id: 'features', label: 'Feature Analysis', icon: Layers },
    { id: 'alerts', label: 'Alerts', icon: Shield, badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined },
    { id: 'history', label: 'History', icon: Database },
    { id: 'health', label: 'System Health', icon: HeartPulse },
    { id: 'setup', label: 'Setup Guide', icon: BookOpen },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="border-b border-borderMuted bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 shadow-soc">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tier: Brand Logo & System Controls */}
        <div className="flex items-center justify-between h-16 border-b border-slate-800/80">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => handleTabClick('overview')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-glow-cyan flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white font-display">SENTINEL</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/80 font-mono font-bold tracking-wider">
                  ML FRONTIER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono leading-none mt-0.5">
                Intelligent Network Intrusion Detection
              </p>
            </div>
          </div>

          {/* Right Controls: System Status & Live/Demo Mode Switcher */}
          <div className="flex items-center gap-3">
            
            {/* System Online Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-emerald-950/60 border border-emerald-800 text-emerald-300 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold tracking-wide">SYSTEM ONLINE</span>
            </div>

            {/* Mode Switcher Pill */}
            <div className="flex items-center bg-slate-900 border border-slate-700 p-1 rounded-xl shadow-inner">
              <button
                onClick={() => setMode('live')}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                  mode === 'live'
                    ? 'bg-emerald-600 text-slate-950 font-black shadow-glow-emerald'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                LIVE
              </button>
              <button
                onClick={() => setMode('demo')}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                  mode === 'demo'
                    ? 'bg-purple-600 text-white font-black shadow-glow-purple'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                DEMO
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white lg:hidden transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Second Tier: Navigation Tabs Bar */}
        <nav className="hidden lg:flex items-center justify-between py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all select-none relative ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/60 shadow-glow-cyan font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Third Tier: Live Telemetry Ticker */}
        <div className="bg-slate-950/80 border-t border-slate-800/80 py-1.5 px-2 -mx-4 sm:-mx-6 lg:-mx-8 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
          <div className="flex items-center gap-4 pl-4">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-500">INTERFACE:</span>
              <span className="font-bold text-white tracking-tight">{networkName}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <HardDrive className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">HOST IP:</span>
              <span className="text-slate-200 font-semibold">{ipAddress}</span>
            </div>
          </div>

          <div className="flex items-center gap-5 pr-4">
            <div className="flex items-center gap-1">
              <ArrowDown className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
              <span className="text-slate-500">DOWN:</span>
              <span className="text-emerald-400 font-bold">{downloadSpeed}</span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUp className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
              <span className="text-slate-500">UP:</span>
              <span className="text-blue-400 font-bold">{uploadSpeed}</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-purple-400">
              <span className="text-slate-500">STATUS:</span>
              <span className="font-bold">{mode === 'demo' ? 'SIMULATED DEMO' : (suricataConnected ? 'SURICATA NIDS' : 'HOST PCAP')}</span>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono text-xs animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-bold'
                      : 'text-slate-300 hover:bg-slate-900 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-auto px-1.5 py-0.2 rounded-full text-[9px] bg-rose-500 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
};
