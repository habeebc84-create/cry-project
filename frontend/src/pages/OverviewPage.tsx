import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ProblemStatementSection } from '../components/ProblemStatementSection';
import { SystemOverviewSection } from '../components/SystemOverviewSection';
import { ObjectivesSection } from '../components/ObjectivesSection';
import { DataPipelineSection } from '../components/DataPipelineSection';
import { SystemArchitectureSection } from '../components/SystemArchitectureSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { ApplicationsSection } from '../components/ApplicationsSection';
import { TechStackSection } from '../components/TechStackSection';

interface OverviewPageProps {
  onNavigateToDashboard?: () => void;
  onNavigateToModels?: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateToDashboard,
  onNavigateToModels
}) => {
  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* 1. Hero Section */}
      <HeroSection
        onExploreClick={() => {
          const el = document.getElementById('problem-statement-anchor');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onDashboardClick={onNavigateToDashboard}
      />

      {/* Anchor for Smooth Scroll */}
      <div id="problem-statement-anchor" />

      {/* 2. Problem Statement */}
      <ProblemStatementSection />

      {/* 3. System Overview & Comparison */}
      <SystemOverviewSection />

      {/* 4. Core Objectives */}
      <ObjectivesSection />

      {/* 5. Data Preprocessing Pipeline */}
      <DataPipelineSection />

      {/* 6. System Architecture */}
      <SystemArchitectureSection />

      {/* 7. How It Works (5 Steps) */}
      <HowItWorksSection />

      {/* 8. Industry & Defense Applications */}
      <ApplicationsSection />

      {/* 9. Technology Stack */}
      <TechStackSection />
    </div>
  );
};
