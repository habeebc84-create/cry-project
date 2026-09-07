import React, { useState } from 'react';
import { ModeProvider } from './context/ModeContext';
import { Header } from './components/Header';
import { OverviewPage } from './pages/OverviewPage';
import { DashboardPage } from './pages/DashboardPage';
import { TrafficMonitorPage } from './pages/TrafficMonitorPage';
import { ThreatDetectionPage } from './pages/ThreatDetectionPage';
import { MLModelsPage } from './pages/MLModelsPage';
import { ModelComparisonPage } from './pages/ModelComparisonPage';
import { FeatureAnalysisPage } from './pages/FeatureAnalysisPage';
import { AlertsPage } from './pages/AlertsPage';
import { HistoryPage } from './pages/HistoryPage';
import { HealthPage } from './pages/HealthPage';
import { SetupPage } from './pages/SetupPage';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewPage
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            onNavigateToModels={() => setActiveTab('models')}
          />
        );
      case 'dashboard':
        return <DashboardPage />;
      case 'traffic':
      case 'network':
        return <TrafficMonitorPage />;
      case 'threat-detection':
        return <ThreatDetectionPage />;
      case 'models':
        return <MLModelsPage />;
      case 'comparison':
        return <ModelComparisonPage />;
      case 'features':
        return <FeatureAnalysisPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'history':
        return <HistoryPage />;
      case 'health':
        return <HealthPage />;
      case 'setup':
        return <SetupPage />;
      default:
        return <OverviewPage onNavigateToDashboard={() => setActiveTab('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary font-sans flex flex-col antialiased selection:bg-cyan-500 selection:text-black">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>

      <footer className="border-t border-borderMuted bg-surface py-5 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="font-bold text-slate-200">
              SENTINEL IDS — Intelligent Network Intrusion Detection Machine Learning Frontier
            </span>
          </div>
          <span className="text-slate-500 text-[11px]">
            Academic & Defense Research Platform • Free & Open Source
          </span>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <ModeProvider>
      <AppContent />
    </ModeProvider>
  );
}

export default App;
