import React, { useState, useEffect } from 'react';
import { NetworkActivityTable } from '../components/NetworkActivityTable';
import { ThreeDNetworkGraph } from '../components/ThreeDNetworkGraph';
import { useMode } from '../context/ModeContext';
import { NetworkConnection } from '../types';

export const NetworkPage: React.FC = () => {
  const { mode, trafficHistory, liveAlerts } = useMode();
  const [connections, setConnections] = useState<NetworkConnection[]>([]);

  useEffect(() => {
    const fetchConns = async () => {
      try {
        const res = await fetch('/api/network');
        if (res.ok) {
          const data = await res.json();
          setConnections(data.connections || []);
        }
      } catch (e) {
        console.error('Error fetching network connections:', e);
      }
    };
    fetchConns();
    const interval = setInterval(fetchConns, 4000);
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="space-y-6">
      {/* 3D Cyber Network Topology Visualizer */}
      <ThreeDNetworkGraph
        trafficData={trafficHistory}
        alerts={liveAlerts}
        connections={connections}
        height="480px"
      />

      {/* Network Activity Connection Table */}
      <NetworkActivityTable />
    </div>
  );
};

