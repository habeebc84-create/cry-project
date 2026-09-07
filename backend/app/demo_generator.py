import random
import time

DEMO_ATTACK_TEMPLATES = [
    {
        "severity": 1,
        "attack_type": "Web Attack Indicators",
        "signature": "ET WEB_SERVER SQL Injection Attempt in URI (UNION SELECT)",
        "protocol": "HTTP",
        "destination_port": 80,
        "category": "web-attack"
    },
    {
        "severity": 2,
        "attack_type": "Network Scanning",
        "signature": "ET SCAN Nmap SYN Scan Detected",
        "protocol": "TCP",
        "destination_port": 443,
        "category": "attempted-recon"
    },
    {
        "severity": 2,
        "attack_type": "Brute Force Indicators",
        "signature": "ET POLICY SSH Brute Force Authentication Attempts",
        "protocol": "SSH",
        "destination_port": 22,
        "category": "attempted-admin"
    },
    {
        "severity": 1,
        "attack_type": "Malware Indicators",
        "signature": "ET MALWARE Cobalt Strike Beacon DNS Lookup",
        "protocol": "DNS",
        "destination_port": 53,
        "category": "trojan-activity"
    },
    {
        "severity": 3,
        "attack_type": "Suspicious DNS",
        "signature": "ET DNS High Volume NXDOMAIN Query - Potential DGA",
        "protocol": "DNS",
        "destination_port": 53,
        "category": "bad-unknown"
    },
    {
        "severity": 2,
        "attack_type": "DoS/DDoS Indicators",
        "signature": "ET DROP High Volume TCP SYN Flood Attempt",
        "protocol": "TCP",
        "destination_port": 80,
        "category": "denial-of-service"
    },
    {
        "severity": 4,
        "attack_type": "Protocol Anomalies",
        "signature": "SURICATA Stream TCP Invalid ACK Number",
        "protocol": "TCP",
        "destination_port": 8080,
        "category": "protocol-command-decode"
    }
]

DEMO_SRC_IPS = ["192.168.1.105", "10.0.0.42", "172.16.0.88", "45.154.255.12", "185.220.101.5", "198.51.100.24"]
DEMO_DEST_IPS = ["192.168.1.1", "192.168.1.100", "10.0.0.1", "172.16.0.1"]

def generate_demo_alert() -> dict:
    tmpl = random.choice(DEMO_ATTACK_TEMPLATES)
    src_ip = random.choice(DEMO_SRC_IPS)
    dest_ip = random.choice(DEMO_DEST_IPS)
    src_port = random.randint(1024, 65535)
    
    return {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S.000000+0000"),
        "severity": tmpl["severity"],
        "source_ip": src_ip,
        "source_port": src_port,
        "destination_ip": dest_ip,
        "destination_port": tmpl["destination_port"],
        "protocol": tmpl["protocol"],
        "attack_type": tmpl["attack_type"],
        "signature": tmpl["signature"],
        "detection_engine": "Suricata Demo Simulator",
        "raw_event": {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S.000000+0000"),
            "event_type": "alert",
            "src_ip": src_ip,
            "src_port": src_port,
            "dest_ip": dest_ip,
            "dest_port": tmpl["destination_port"],
            "proto": tmpl["protocol"],
            "alert": {
                "action": "allowed",
                "gid": 1,
                "signature_id": random.randint(2000000, 2099999),
                "rev": 1,
                "signature": tmpl["signature"],
                "category": tmpl["category"],
                "severity": tmpl["severity"]
            }
        }
    }

def generate_demo_traffic() -> dict:
    bytes_recv = random.randint(200000, 1200000)
    bytes_sent = random.randint(50000, 300000)
    total_bytes = bytes_recv + bytes_sent
    down_bps = float(bytes_recv)
    up_bps = float(bytes_sent)
    total_bps = down_bps + up_bps
    
    return {
        "timestamp": time.strftime("%H:%M:%S"),
        "packets": random.randint(350, 1200),
        "bytes": total_bytes,
        "bytes_sent": bytes_sent,
        "bytes_recv": bytes_recv,
        "upload_speed_bps": round(up_bps, 2),
        "download_speed_bps": round(down_bps, 2),
        "total_speed_bps": round(total_bps, 2),
        "upload_speed_formatted": f"{up_bps / 1024:.1f} KB/s",
        "download_speed_formatted": f"{down_bps / (1024 * 1024):.2f} MB/s",
        "total_speed_formatted": f"{total_bps / (1024 * 1024):.2f} MB/s",
        "interface_name": "Wi-Fi (Demo)",
        "network_name": "Sentinel-Secure-5G (Demo)",
        "ip_address": "192.168.1.105",
        "link_speed": "1.2 Gbps",
        "connections": random.randint(15, 60)
    }

