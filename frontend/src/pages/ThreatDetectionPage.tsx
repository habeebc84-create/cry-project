import React from 'react';
import { TrafficClassifierWorkbench } from '../components/TrafficClassifierWorkbench';
import { ThreatAlertCenter } from '../components/ThreatAlertCenter';
import { ShieldAlert, Zap } from 'lucide-react';

export const ThreatDetectionPage: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Interactive Classification Workbench */}
      <TrafficClassifierWorkbench />

      {/* Threat Alert Center */}
      <ThreatAlertCenter />
    </div>
  );
};
