import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AlertItem, TrafficPoint, SystemStatus } from '../types';

interface ModeContextType {
  mode: 'live' | 'demo';
  setMode: (mode: 'live' | 'demo') => Promise<void>;
  suricataConnected: boolean;
  wsConnected: boolean;
  statusData: SystemStatus | null;
  liveAlerts: AlertItem[];
  trafficHistory: TrafficPoint[];
  clearLiveAlerts: () => void;
  refreshStatus: () => Promise<void>;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<'live' | 'demo'>('live');
  const [suricataConnected, setSuricataConnected] = useState<boolean>(false);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [statusData, setStatusData] = useState<SystemStatus | null>(null);
  const [liveAlerts, setLiveAlerts] = useState<AlertItem[]>([]);
  const [trafficHistory, setTrafficHistory] = useState<TrafficPoint[]>([]);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data: SystemStatus = await res.json();
        setStatusData(data);
        setModeState(data.mode);
        setSuricataConnected(data.suricata.connected);
      }
    } catch (e) {
      console.error('Failed to fetch system status:', e);
      setSuricataConnected(false);
    }
  };

  const fetchTrafficHistory = async () => {
    try {
      const res = await fetch('/api/traffic');
      if (res.ok) {
        const data = await res.json();
        if (data.history) {
          setTrafficHistory(data.history);
        }
      }
    } catch (e) {
      console.error('Failed to fetch traffic history:', e);
    }
  };

  const fetchInitialAlerts = async (currentMode?: string) => {
    try {
      const activeMode = currentMode || mode;
      const res = await fetch(`/api/alerts?limit=25&mode=${activeMode}`);
      if (res.ok) {
        const data = await res.json();
        setLiveAlerts(data.alerts || []);
      }
    } catch (e) {
      console.error('Failed to fetch initial alerts:', e);
    }
  };

  const setMode = async (newMode: 'live' | 'demo') => {
    try {
      const res = await fetch('/api/mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode })
      });
      if (res.ok) {
        setModeState(newMode);
        await fetchStatus();
        await fetchInitialAlerts(newMode);
      }
    } catch (e) {
      console.error('Failed to change mode:', e);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchTrafficHistory();
    fetchInitialAlerts();

    // Setup WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    let socket: WebSocket | null = null;
    let reconnectTimeout: any = null;
    let isUnmounted = false;

    const connectWs = () => {
      if (isUnmounted) return;
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        if (!isUnmounted) setWsConnected(true);
      };

      socket.onmessage = (event) => {
        if (isUnmounted) return;
        try {
          const msg = JSON.parse(event.data);
          
          if (msg.type === 'CONNECTED') {
            setModeState(msg.mode);
            setSuricataConnected(!!msg.suricata_connected);
          } else if (msg.type === 'MODE_CHANGED') {
            setModeState(msg.mode);
          } else if (msg.type === 'NEW_ALERT') {
            if (msg.data) {
              setLiveAlerts((prev) => [msg.data, ...prev.slice(0, 49)]);
            }
          } else if (msg.type === 'TRAFFIC_TICK') {
            if (msg.suricata_connected !== undefined) {
              setSuricataConnected(!!msg.suricata_connected);
            }
            if (msg.data) {
              setTrafficHistory((prev) => [...prev.slice(-29), msg.data]);
            }
          }
        } catch (err) {
          console.error('Error parsing WS message:', err);
        }
      };

      socket.onclose = () => {
        if (!isUnmounted) {
          setWsConnected(false);
          reconnectTimeout = setTimeout(connectWs, 3000);
        }
      };

      socket.onerror = () => {
        if (!isUnmounted) setWsConnected(false);
      };
    };

    connectWs();

    const interval = setInterval(fetchStatus, 5000);

    return () => {
      isUnmounted = true;
      clearInterval(interval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socket) socket.close();
    };
  }, []);

  const clearLiveAlerts = () => {
    setLiveAlerts([]);
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        suricataConnected,
        wsConnected,
        statusData,
        liveAlerts,
        trafficHistory,
        clearLiveAlerts,
        refreshStatus: fetchStatus
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};
