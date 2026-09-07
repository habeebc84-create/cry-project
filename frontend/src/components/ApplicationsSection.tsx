import React from 'react';
import { Building2, Server, Cloud, Landmark, GraduationCap, Cpu, Shield, ArrowUpRight } from 'lucide-react';

export const ApplicationsSection: React.FC = () => {
  const applications = [
    {
      title: 'Enterprise Networks',
      icon: Building2,
      desc: 'Monitor internal east-west traffic, workstation VLANs, and identify lateral movement or suspicious employee data exfiltration.',
      accent: 'border-cyan-500/50 text-cyan-400 bg-cyan-950/20'
    },
    {
      title: 'Data Centers',
      icon: Server,
      desc: 'Protect high-density server racks, load balancers, and hypervisor communication lines from high-throughput DoS assaults.',
      accent: 'border-blue-500/50 text-blue-400 bg-blue-950/20'
    },
    {
      title: 'Cloud Security',
      icon: Cloud,
      desc: 'Detect abnormal multi-tenant cloud traffic patterns, unauthorized AWS/GCP API calls, and VPC peering anomalies.',
      accent: 'border-purple-500/50 text-purple-400 bg-purple-950/20'
    },
    {
      title: 'Banking Systems',
      icon: Landmark,
      desc: 'Identify zero-day penetration attempts and stealth credential spraying targeting financial transaction pipelines.',
      accent: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/20'
    },
    {
      title: 'Educational Institutions',
      icon: GraduationCap,
      desc: 'Secure open campus Wi-Fi networks, research supercomputer clusters, and protect confidential academic intellectual property.',
      accent: 'border-amber-500/50 text-amber-400 bg-amber-950/20'
    },
    {
      title: 'IoT Networks',
      icon: Cpu,
      desc: 'Detect unusual botnet beaconing and command-and-control chatter across millions of low-power connected smart devices.',
      accent: 'border-rose-500/50 text-rose-400 bg-rose-950/20'
    },
    {
      title: 'Government Networks',
      icon: Shield,
      desc: 'Support mission-critical defense infrastructure protection, SCADA sensor links, and sovereign network perimeters.',
      accent: 'border-indigo-500/50 text-indigo-400 bg-indigo-950/20'
    }
  ];

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Operational Domains</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Real-World Industry & Defense Applications
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-md font-sans">
          Deployable across heterogeneous architectures spanning bare-metal edge nodes to hyperscale cloud data pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {applications.map((app) => {
          const Icon = app.icon;
          return (
            <div
              key={app.title}
              className="soc-card-interactive p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${app.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-display">
                  {app.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {app.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Domain Ready</span>
                <span className="text-emerald-400 font-semibold">Verified Spec</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
