import os
from pydantic import BaseModel

class SystemConfig(BaseModel):
    eve_json_path: str = os.getenv("SURICATA_EVE_PATH", "C:/ProgramData/Suricata/log/eve.json")
    network_interface: str = os.getenv("NETWORK_INTERFACE", "Default")
    monitoring_enabled: bool = True
    mode: str = "live"  # 'live' or 'demo'
    zeek_log_dir: str = os.getenv("ZEEK_LOG_DIR", "")
    db_path: str = "sentinel_ids.db"

config_instance = SystemConfig()
