export interface AlertItem {
  id: number;
  timestamp: string;
  severity: number; // 1: Critical, 2: High, 3: Medium, 4: Low
  source_ip: string;
  source_port: number;
  destination_ip: string;
  destination_port: number;
  protocol: string;
  attack_type: string;
  signature: string;
  detection_engine: string;
  raw_event?: any;
  is_investigated?: number;
  notes?: string;
  created_at?: string;
}

export interface TrafficPoint {
  timestamp: string;
  packets: number;
  bytes: number;
  connections: number;
  bytes_sent?: number;
  bytes_recv?: number;
  upload_speed_bps?: number;
  download_speed_bps?: number;
  total_speed_bps?: number;
  upload_speed_formatted?: string;
  download_speed_formatted?: string;
  total_speed_formatted?: string;
  network_name?: string;
  interface_name?: string;
  ip_address?: string;
  link_speed?: string;
  suricata_connected?: boolean;
}

export interface SystemStatus {
  status: string;
  mode: 'live' | 'demo';
  suricata: {
    connected: boolean;
    path: string;
    parsed_alerts_count: number;
    last_event_time: string | null;
  };
  fastapi: string;
  websocket: string;
  database: string;
  network: {
    interface: string;
    monitoring: boolean;
  };
}

export interface NetworkConnection {
  source_ip: string;
  source_port: number;
  destination_ip: string;
  destination_port: number;
  protocol: string;
  status: string;
  packets: number;
  bytes: number;
}
