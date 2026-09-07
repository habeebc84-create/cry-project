import React from 'react';
import { FeatureAnalysisSection } from '../components/FeatureAnalysisSection';
import { DataPipelineSection } from '../components/DataPipelineSection';

export const FeatureAnalysisPage: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <FeatureAnalysisSection />
      <DataPipelineSection />
    </div>
  );
};
