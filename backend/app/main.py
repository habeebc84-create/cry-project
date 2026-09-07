import asyncio
import os
import json
import logging
from typing import Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.config import config_instance
from app.database import (
    init_db, save_alert, get_alerts, get_alert_by_id,
    update_alert_investigation, get_alert_stats
)
from app.eve_parser import EveParser
from app.network_detector import network_detector_instance
from app.demo_generator import generate_demo_alert, generate_demo_traffic
from app.websocket_manager import ws_manager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sentinel.main")

# Global traffic history buffer
traffic_buffer = []

def check_eve_log_exists() -> str:
    """
    Checks the status of the EVE JSON log file.
    Does NOT auto-create empty dummy log files or fake data.
    """
    target_path = config_instance.eve_json_path
    if os.path.exists(target_path):
        logger.info(f"Verified EVE JSON log file exists at: {target_path}")
    else:
        logger.info(f"EVE JSON log file not found at: {target_path} (Suricata disconnected)")
    return target_path

eve_path = check_eve_log_exists()
eve_parser = EveParser(config_instance.eve_json_path)

async def handle_live_alert(alert: dict):
    # Callback when EVE parser finds a real Suricata alert
    if config_instance.mode == "live":
        await ws_manager.broadcast({
            "type": "NEW_ALERT",
            "mode": "live",
            "data": alert
        })

async def background_telemetry_loop():
    """
    Continuous background loop that streams traffic telemetry and alerts over WebSockets.
    Maintains active LIVE mode telemetry and monitors EVE log stream.
    """
    demo_counter = 0
    while True:
        try:
            await asyncio.sleep(1.0)
            
            if config_instance.mode == "demo":
                # DEMO MODE: Generate simulated telemetry & occasional demo alerts
                demo_traffic = generate_demo_traffic()
                
                # Maintain up to 30 sample points
                traffic_buffer.append(demo_traffic)
                if len(traffic_buffer) > 30:
                    traffic_buffer.pop(0)

                # Broadcast demo traffic tick
                await ws_manager.broadcast({
                    "type": "TRAFFIC_TICK",
                    "mode": "demo",
                    "data": demo_traffic
                })

                # Periodically generate a demo alert every 4-8 seconds
                demo_counter += 1
                if demo_counter >= 5:
                    demo_counter = 0
                    demo_alert = generate_demo_alert()
                    # Save demo alert to SQLite for demo mode history
                    alert_id = save_alert(demo_alert)
                    demo_alert["id"] = alert_id
                    
                    await ws_manager.broadcast({
                        "type": "NEW_ALERT",
                        "mode": "demo",
                        "data": demo_alert
                    })
            else:
                # LIVE MODE: Measure actual host interface stats strictly
                real_traffic = network_detector_instance.get_traffic_sample()
                
                # Verify if real Suricata log exists on disk
                suricata_active = os.path.exists(config_instance.eve_json_path)
                
                real_traffic["suricata_connected"] = suricata_active
                
                traffic_buffer.append(real_traffic)
                if len(traffic_buffer) > 30:
                    traffic_buffer.pop(0)

                await ws_manager.broadcast({
                    "type": "TRAFFIC_TICK",
                    "mode": "live",
                    "data": real_traffic,
                    "suricata_connected": suricata_active
                })

        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Error in telemetry loop: {e}")
            await asyncio.sleep(2.0)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Initializing Sentinel IDS database...")
    init_db()
    check_eve_log_exists()
    
    eve_parser.on_alert_callback = handle_live_alert
    eve_parser.start()
    
    telemetry_task = asyncio.create_task(background_telemetry_loop())
    
    yield
    
    # Shutdown logic
    logger.info("Shutting down Sentinel IDS tasks...")
    eve_parser.stop()
    telemetry_task.cancel()

app = FastAPI(
    title="Sentinel IDS API",
    description="Real-Time Network Intrusion Detection Engine & API",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConfigUpdateRequest(BaseModel):
    eve_json_path: Optional[str] = None
    network_interface: Optional[str] = None
    monitoring_enabled: Optional[bool] = None

class ModeUpdateRequest(BaseModel):
    mode: str  # 'live' or 'demo'

class InvestigateRequest(BaseModel):
    is_investigated: bool
    notes: str = ""

@app.get("/api/status")
def get_system_status():
    suricata_connected = os.path.exists(config_instance.eve_json_path)
    
    return {
        "status": "ok",
        "mode": config_instance.mode,
        "suricata": {
            "connected": suricata_connected,
            "path": config_instance.eve_json_path,
            "parsed_alerts_count": eve_parser.total_parsed_alerts,
            "last_event_time": eve_parser.last_event_time
        },
        "fastapi": "running",
        "websocket": "active",
        "database": "connected",
        "network": {
            "interface": config_instance.network_interface,
            "monitoring": config_instance.monitoring_enabled
        }
    }

@app.get("/api/alerts")
def fetch_alerts(
    query: Optional[str] = None,
    severity: Optional[int] = None,
    attack_type: Optional[str] = None,
    ip: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    mode: Optional[str] = None
):
    sev_val = severity if isinstance(severity, int) else None
    active_mode = mode if mode else config_instance.mode
    alerts = get_alerts(query=query, severity=sev_val, attack_type=attack_type, ip=ip, limit=limit, offset=offset, mode=active_mode)
    return {"alerts": alerts, "count": len(alerts)}

@app.get("/api/alerts/{alert_id}")
def fetch_alert_details(alert_id: int):
    alert = get_alert_by_id(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@app.post("/api/alerts/{alert_id}/investigate")
def mark_investigated(alert_id: int, req: InvestigateRequest):
    success = update_alert_investigation(alert_id, req.is_investigated, req.notes)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"status": "success", "alert_id": alert_id, "is_investigated": req.is_investigated}

@app.get("/api/traffic")
def get_traffic():
    suricata_connected = os.path.exists(config_instance.eve_json_path)
    return {
        "mode": config_instance.mode,
        "suricata_connected": suricata_connected,
        "history": traffic_buffer
    }

@app.get("/api/statistics")
def get_statistics():
    db_stats = get_alert_stats(mode=config_instance.mode)
    
    # Measured live packets / connections
    traffic_sample = network_detector_instance.get_traffic_sample()
    suricata_connected = os.path.exists(config_instance.eve_json_path)
    
    return {
        "mode": config_instance.mode,
        "suricata_connected": suricata_connected,
        "total_alerts": db_stats["total_alerts"],
        "high_severity": db_stats["high_severity"],
        "critical_alerts": db_stats["critical_alerts"],
        "active_connections": traffic_sample["connections"],
        "packets_observed": traffic_sample["packets"],
        "categories": db_stats["categories"]
    }

@app.get("/api/network")
def get_network_activity():
    if config_instance.mode == "demo":
        # Return structured demo network connections
        return {
            "mode": "demo",
            "connections": [
                {"source_ip": "192.168.1.105", "source_port": 54210, "destination_ip": "192.168.1.1", "destination_port": 443, "protocol": "TCP", "status": "ESTABLISHED", "packets": 124, "bytes": 85400},
                {"source_ip": "192.168.1.112", "source_port": 61204, "destination_ip": "1.1.1.1", "destination_port": 53, "protocol": "UDP", "status": "ACTIVE", "packets": 12, "bytes": 940},
                {"source_ip": "45.154.255.12", "source_port": 49200, "destination_ip": "192.168.1.100", "destination_port": 80, "protocol": "TCP", "status": "SYN_SENT", "packets": 45, "bytes": 2880},
                {"source_ip": "192.168.1.105", "source_port": 51100, "destination_ip": "140.82.121.4", "destination_port": 443, "protocol": "TCP", "status": "ESTABLISHED", "packets": 890, "bytes": 1240000},
                {"source_ip": "10.0.0.42", "source_port": 22401, "destination_ip": "192.168.1.1", "destination_port": 22, "protocol": "TCP", "status": "ESTABLISHED", "packets": 320, "bytes": 45000}
            ]
        }
    
    conns = network_detector_instance.get_active_connections(limit=50)
    return {
        "mode": "live",
        "connections": conns
    }

@app.post("/api/config")
def update_config(req: ConfigUpdateRequest):
    if req.eve_json_path is not None:
        config_instance.eve_json_path = req.eve_json_path
        check_eve_log_exists()
        eve_parser.update_path(req.eve_json_path)
    if req.network_interface is not None:
        config_instance.network_interface = req.network_interface
    if req.monitoring_enabled is not None:
        config_instance.monitoring_enabled = req.monitoring_enabled
        
    return {
        "status": "success",
        "eve_json_path": config_instance.eve_json_path,
        "network_interface": config_instance.network_interface,
        "monitoring_enabled": config_instance.monitoring_enabled
    }

@app.post("/api/mode")
def update_mode(req: ModeUpdateRequest):
    if req.mode not in ["live", "demo"]:
        raise HTTPException(status_code=400, detail="Mode must be 'live' or 'demo'")
    config_instance.mode = req.mode
    logger.info(f"Switched system mode to: {req.mode}")
    return {"status": "success", "mode": config_instance.mode}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Send initial welcome & status state
        suricata_active = os.path.exists(config_instance.eve_json_path)
        await websocket.send_json({
            "type": "CONNECTED",
            "mode": config_instance.mode,
            "suricata_connected": suricata_active
        })
        while True:
            # Keep connection alive & handle incoming commands from UI
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                if msg.get("type") == "PING":
                    await websocket.send_json({"type": "PONG"})
                elif msg.get("type") == "SET_MODE":
                    new_mode = msg.get("mode", "live")
                    if new_mode in ["live", "demo"]:
                        config_instance.mode = new_mode
                        await ws_manager.broadcast({
                            "type": "MODE_CHANGED",
                            "mode": config_instance.mode
                        })
            except Exception:
                pass
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        ws_manager.disconnect(websocket)

