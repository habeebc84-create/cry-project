import React, { useState } from 'react';
import { ThreatAlertCenter } from '../components/ThreatAlertCenter';
import { LiveAlertFeed } from '../components/LiveAlertFeed';
import { AlertDetailsModal } from '../components/AlertDetailsModal';
import { AlertItem } from '../types';
import { useMode } from '../context/ModeContext';
import { ShieldAlert, Trash2 } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { liveAlerts, clearLiveAlerts } = useMode();
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Primary Threat Alert Center with Severity Triage */}
      <ThreatAlertCenter onSelectAlert={(a) => setSelectedAlert(a)} />

      {/* Real-time Streaming Alert Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              RAW WEBSOCKET TELEMETRY BUFFER
            </h3>
            <p className="text-xs text-slate-400">Incoming unbuffered packet events directly from Suricata EVE stream</p>
          </div>

          <button
            onClick={clearLiveAlerts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Stream View
          </button>
        </div>

        <LiveAlertFeed alerts={liveAlerts} onSelectAlert={(a) => setSelectedAlert(a)} />
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <AlertDetailsModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onUpdate={() => {}}
        />
      )}
    </div>
  );
};
