import re

def categorize_alert(signature: str, category: str = "", proto: str = "") -> str:
    sig_lower = (signature or "").lower()
    cat_lower = (category or "").lower()
    proto_lower = (proto or "").lower()
    
    # 1. Network Scanning
    if any(k in sig_lower or k in cat_lower for k in [
        "scan", "nmap", "reconn", "sweep", "portscan", "discovery", "fingerprint", "ping sweep"
    ]):
        return "Network Scanning"

    # 2. Brute Force Indicators
    if any(k in sig_lower or k in cat_lower for k in [
        "brute", "ssh login failed", "ftp login failed", "authentication failure", "failed login", "password guessing", "hydra", "medusa"
    ]):
        return "Brute Force Indicators"

    # 3. DoS/DDoS Indicators
    if any(k in sig_lower or k in cat_lower for k in [
        "dos", "ddos", "flood", "synflood", "slowloris", "amplification", "denial of service"
    ]):
        return "DoS/DDoS Indicators"

    # 4. Malware Indicators
    if any(k in sig_lower or k in cat_lower for k in [
        "malware", "trojan", "ransomware", "c2", "command and control", "botnet", "meterpreter", "cobalt strike", "backdoor", "executable"
    ]):
        return "Malware Indicators"

    # 5. Suspicious DNS
    if proto_lower == "dns" or any(k in sig_lower or k in cat_lower for k in [
        "dns tunnel", "suspicious dns", "dga", "nxdomain flood", "dns leak", "zone transfer"
    ]):
        return "Suspicious DNS"

    # 6. Web Attack Indicators
    if proto_lower in ["http", "https"] or any(k in sig_lower or k in cat_lower for k in [
        "sql", "sqli", "xss", "cross-site", "lfi", "rfi", "path traversal", "shellshock", "web attack", "cmd injection", "log4j", "webshell"
    ]):
        return "Web Attack Indicators"

    # 7. Protocol Anomalies
    if any(k in sig_lower or k in cat_lower for k in [
        "bad checksum", "invalid packet", "anomaly", "malformed", "illegal", "out of order", "protocol violation"
    ]):
        return "Protocol Anomalies"

    # Default category if category string is provided in EVE event
    if category:
        return f"IDS ALERT: {category}"

    return "Other IDS Alerts"


def normalize_suricata_event(raw_event: dict) -> dict:
    """
    Parses Suricata EVE JSON event:
    timestamp, event_type, source_ip, source_port, destination_ip, destination_port,
    protocol, alert signature, alert category, alert severity
    Converts into normalized JSON object:
    {
      timestamp, severity, source_ip, source_port, destination_ip, destination_port,
      protocol, attack_type, signature, detection_engine
    }
    """
    event_type = raw_event.get("event_type", "")
    timestamp = raw_event.get("timestamp", "")
    
    src_ip = raw_event.get("src_ip", "0.0.0.0")
    src_port = raw_event.get("src_port", 0)
    dest_ip = raw_event.get("dest_ip", "0.0.0.0")
    dest_port = raw_event.get("dest_port", 0)
    proto = raw_event.get("proto", "TCP")
    
    alert_info = raw_event.get("alert") or {}
    signature = alert_info.get("signature", "Generic Network Anomaly")
    category = alert_info.get("category", "General Security Event")
    severity = alert_info.get("severity", 3)
    
    attack_type = categorize_alert(signature, category, proto)
    
    return {
        "timestamp": timestamp,
        "severity": severity,
        "source_ip": src_ip,
        "source_port": src_port,
        "destination_ip": dest_ip,
        "destination_port": dest_port,
        "protocol": proto,
        "attack_type": attack_type,
        "signature": signature,
        "detection_engine": "Suricata NIDS",
        "raw_event": raw_event
    }
