import psutil
import socket
import time
import subprocess
import os
import re
from typing import List, Dict, Any, Optional

def format_speed_bps(bytes_per_sec: float) -> str:
    if bytes_per_sec < 1024:
        return f"{bytes_per_sec:.1f} B/s"
    elif bytes_per_sec < 1024 * 1024:
        return f"{bytes_per_sec / 1024:.1f} KB/s"
    else:
        return f"{bytes_per_sec / (1024 * 1024):.2f} MB/s"

class NetworkDetector:
    def __init__(self):
        self.interface_io_state: Dict[str, Dict[str, Any]] = {}
        self.current_interface: str = None
        self.cached_wifi_ssid = None
        self.last_ssid_check = 0

    def get_active_interface_name(self) -> str:
        try:
            from app.config import config_instance
            configured = config_instance.network_interface
            if configured and configured not in ("Default", "Ethernet / Wi-Fi"):
                return configured
        except Exception:
            pass

        try:
            stats = psutil.net_if_stats()
            io_counters = psutil.net_io_counters(pernic=True)
            addrs = psutil.net_if_addrs()

            candidates = []
            for name, stat in stats.items():
                if not stat.isup:
                    continue
                name_lower = name.lower()
                if 'loopback' in name_lower or name_lower == 'lo':
                    continue
                
                # Check for active IPv4 address
                has_routable_ip = False
                if name in addrs:
                    for addr in addrs[name]:
                        if addr.family == socket.AF_INET and not addr.address.startswith("127.") and not addr.address.startswith("169.254."):
                            has_routable_ip = True
                            break
                
                # Cumulative traffic on interface
                bytes_total = 0
                if name in io_counters:
                    bytes_total = io_counters[name].bytes_recv + io_counters[name].bytes_sent

                # Filter out virtual adapters with 0 traffic; prioritize real network adapters
                score = (1_000_000_000 if has_routable_ip else 0) + bytes_total
                candidates.append((score, bytes_total, name))

            if candidates:
                # Pick the interface with active IP and greatest traffic volume
                candidates.sort(key=lambda x: x[0], reverse=True)
                return candidates[0][2]

            return list(stats.keys())[0] if stats else "Wi-Fi"
        except Exception:
            return "Wi-Fi"

    def get_network_details(self, interface_name: str) -> Dict[str, Any]:
        ip_address = "127.0.0.1"
        link_speed = "Unknown"
        network_name = interface_name

        try:
            # Get IP Address
            addrs = psutil.net_if_addrs().get(interface_name, [])
            for addr in addrs:
                if addr.family == socket.AF_INET and not addr.address.startswith("127."):
                    ip_address = addr.address
                    break

            # Get Link Speed
            stats = psutil.net_if_stats().get(interface_name)
            if stats and stats.speed > 0:
                if stats.speed >= 1000:
                    link_speed = f"{stats.speed / 1000:.1f} Gbps"
                else:
                    link_speed = f"{stats.speed} Mbps"

            # Check Wi-Fi SSID if on Windows
            now = time.time()
            if os.name == 'nt' and (now - self.last_ssid_check > 10):
                self.last_ssid_check = now
                try:
                    cmd_out = subprocess.check_output(
                        "netsh wlan show interfaces",
                        shell=True,
                        stderr=subprocess.STDOUT,
                        text=True,
                        encoding='utf-8',
                        errors='ignore'
                    )
                    match = re.search(r'^\s*SSID\s*:\s*(.+)$', cmd_out, re.MULTILINE)
                    if match:
                        ssid = match.group(1).strip()
                        if ssid and ssid.lower() != "bssid":
                            self.cached_wifi_ssid = ssid
                except Exception:
                    pass

            if self.cached_wifi_ssid:
                network_name = f"{self.cached_wifi_ssid} ({interface_name})"
            else:
                hostname = socket.gethostname()
                network_name = f"{hostname} / {interface_name}"

        except Exception:
            pass

        return {
            "ip_address": ip_address,
            "link_speed": link_speed,
            "network_name": network_name
        }

    def _get_interface_io(self, interface_name: str):
        try:
            pernic = psutil.net_io_counters(pernic=True)
            if pernic and interface_name in pernic:
                return pernic[interface_name]
        except Exception:
            pass
        return psutil.net_io_counters()

    def reset_interface(self, interface_name: Optional[str] = None):
        if interface_name:
            self.interface_io_state.pop(interface_name, None)
        else:
            self.interface_io_state.clear()
        self.current_interface = None

    def get_traffic_sample(self) -> Dict[str, Any]:
        """
        Samples actual network interface stats (delta bytes, delta packets, speeds in B/s).
        Instantly measures initial real traffic rate for new devices/interfaces without dropping to zero.
        """
        interface_name = self.get_active_interface_name()
        now = time.time()

        # Check if interface changed, or brand new device/interface, or stale baseline (>5s ago)
        is_new_device = (
            self.current_interface != interface_name or
            interface_name not in self.interface_io_state or
            (now - self.interface_io_state[interface_name]["time"]) > 5.0
        )

        if is_new_device:
            # Immediate 80ms micro-sample to return REAL traffic data on the 1st second
            start_io = self._get_interface_io(interface_name)
            time.sleep(0.08)
            current_io = self._get_interface_io(interface_name)
            now = time.time()
            time_delta = 0.08
        else:
            prev_state = self.interface_io_state[interface_name]
            start_io = prev_state["io"]
            current_io = self._get_interface_io(interface_name)
            time_delta = max(now - prev_state["time"], 0.001)

            # If counters rolled over or device reconnected
            if current_io.bytes_sent < start_io.bytes_sent or current_io.bytes_recv < start_io.bytes_recv:
                start_io = current_io
                time.sleep(0.08)
                current_io = self._get_interface_io(interface_name)
                now = time.time()
                time_delta = 0.08

        # Record latest baseline for this interface
        self.interface_io_state[interface_name] = {
            "time": now,
            "io": current_io
        }
        self.current_interface = interface_name

        bytes_sent = max(current_io.bytes_sent - start_io.bytes_sent, 0)
        bytes_recv = max(current_io.bytes_recv - start_io.bytes_recv, 0)
        packets_sent = max(current_io.packets_sent - start_io.packets_sent, 0)
        packets_recv = max(current_io.packets_recv - start_io.packets_recv, 0)

        upload_speed_bps = max(bytes_sent / time_delta, 0.0)
        download_speed_bps = max(bytes_recv / time_delta, 0.0)
        total_speed_bps = upload_speed_bps + download_speed_bps

        total_bytes = bytes_sent + bytes_recv
        total_packets = packets_sent + packets_recv

        active_conns = 0
        try:
            conns = psutil.net_connections(kind="inet")
            active_conns = len([c for c in conns if getattr(c, "status", "") in ("ESTABLISHED", "LISTEN", "SYN_SENT")])
        except Exception:
            pass

        details = self.get_network_details(interface_name)

        return {
            "timestamp": time.strftime("%H:%M:%S"),
            "packets": max(total_packets, 0),
            "bytes": max(total_bytes, 0),
            "bytes_sent": max(bytes_sent, 0),
            "bytes_recv": max(bytes_recv, 0),
            "upload_speed_bps": round(upload_speed_bps, 2),
            "download_speed_bps": round(download_speed_bps, 2),
            "total_speed_bps": round(total_speed_bps, 2),
            "upload_speed_formatted": format_speed_bps(upload_speed_bps),
            "download_speed_formatted": format_speed_bps(download_speed_bps),
            "total_speed_formatted": format_speed_bps(total_speed_bps),
            "interface_name": interface_name,
            "network_name": details["network_name"],
            "ip_address": details["ip_address"],
            "link_speed": details["link_speed"],
            "connections": active_conns
        }

    def get_active_connections(self, limit: int = 50) -> List[Dict[str, Any]]:
        results = []
        try:
            connections = psutil.net_connections(kind="inet")
            for conn in connections[:limit]:
                if not conn.laddr:
                    continue
                
                src_ip = getattr(conn.laddr, 'ip', conn.laddr[0]) if conn.laddr else '0.0.0.0'
                src_port = getattr(conn.laddr, 'port', conn.laddr[1]) if (conn.laddr and len(conn.laddr) > 1) else 0
                dest_ip = getattr(conn.raddr, 'ip', conn.raddr[0]) if conn.raddr else '0.0.0.0'
                dest_port = getattr(conn.raddr, 'port', conn.raddr[1]) if (conn.raddr and len(conn.raddr) > 1) else 0
                
                proto = "TCP" if conn.type == socket.SOCK_STREAM else ("UDP" if conn.type == socket.SOCK_DGRAM else "RAW")
                
                results.append({
                    "source_ip": src_ip,
                    "source_port": src_port,
                    "destination_ip": dest_ip,
                    "destination_port": dest_port,
                    "protocol": proto,
                    "status": getattr(conn, "status", "ACTIVE"),
                    "packets": 1,
                    "bytes": 64
                })
        except Exception:
            pass

        return results

network_detector_instance = NetworkDetector()

