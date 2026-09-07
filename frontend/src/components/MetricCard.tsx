import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accentColor?: 'default' | 'critical' | 'high' | 'live' | 'demo';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'default'
}) => {
  const getAccentDetails = () => {
    switch (accentColor) {
      case 'critical':
        return {
          borderTop: 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600',
          hoverClass: 'soc-card-red hover:-translate-y-1',
          iconBg: 'bg-red-950/80 border-red-800/80 text-red-400 shadow-glow-red',
          valColor: 'text-red-400 text-glow-red',
          bgHighlight: 'from-red-950/20 to-transparent'
        };
      case 'high':
        return {
          borderTop: 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600',
          hoverClass: 'soc-card-amber hover:-translate-y-1',
          iconBg: 'bg-amber-950/80 border-amber-800/80 text-amber-400',
          valColor: 'text-amber-400 text-glow-amber',
          bgHighlight: 'from-amber-950/20 to-transparent'
        };
      case 'live':
        return {
          borderTop: 'bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-600',
          hoverClass: 'soc-card-emerald hover:-translate-y-1',
          iconBg: 'bg-emerald-950/80 border-emerald-800/80 text-emerald-400 shadow-glow-emerald',
          valColor: 'text-emerald-400 text-glow-emerald',
          bgHighlight: 'from-emerald-950/20 to-transparent'
        };
      case 'demo':
        return {
          borderTop: 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600',
          hoverClass: 'soc-card-purple hover:-translate-y-1',
          iconBg: 'bg-purple-950/80 border-purple-800/80 text-purple-300 shadow-glow-purple',
          valColor: 'text-purple-300 text-glow-purple',
          bgHighlight: 'from-purple-950/20 to-transparent'
        };
      default:
        return {
          borderTop: 'bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-700',
          hoverClass: 'soc-card hover:-translate-y-1',
          iconBg: 'bg-zinc-900/90 border-zinc-750 text-zinc-200',
          valColor: 'text-white',
          bgHighlight: 'from-zinc-900/30 to-transparent'
        };
    }
  };

  const style = getAccentDetails();

  return (
    <div className={`soc-card relative overflow-hidden p-4 group transition-all duration-300 ${style.hoverClass}`}>
      
      {/* Top Gradient Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${style.borderTop}`}></div>

      {/* Subtle Background Radial Accent */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${style.bgHighlight} blur-xl pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity`}></div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-400 font-mono">{title}</span>
        <div className={`p-2 rounded-lg border shadow-sm transition-transform duration-300 group-hover:scale-110 ${style.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3">
        <span className={`text-2xl font-bold font-mono tracking-tight ${style.valColor}`}>
          {value}
        </span>
      </div>

      {subtitle && (
        <p className="mt-1 text-[11px] text-zinc-400 font-mono truncate">{subtitle}</p>
      )}
    </div>
  );
};

