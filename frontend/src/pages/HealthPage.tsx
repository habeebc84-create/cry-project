import React from 'react';
import { SystemHealthGrid } from '../components/SystemHealthGrid';

export const HealthPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <SystemHealthGrid />
    </div>
  );
};
