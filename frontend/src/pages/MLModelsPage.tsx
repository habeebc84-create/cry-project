import React from 'react';
import { MLModelsSection } from '../components/MLModelsSection';
import { ModelComparisonSection } from '../components/ModelComparisonSection';
import { Cpu, Zap } from 'lucide-react';

export const MLModelsPage: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <MLModelsSection />
      <ModelComparisonSection />
    </div>
  );
};
