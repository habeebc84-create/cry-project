import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.config import config_instance

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_db_path() -> str:
    db_name = getattr(config_instance, "db_path", "sentinel_ids.db") or "sentinel_ids.db"
    if not os.path.isabs(db_name):
        return os.path.join(BASE_DIR, db_name)
    return db_name

def get_connection():
    return sqlite3.connect(get_db_path(), timeout=15.0)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        severity INTEGER NOT NULL,
        source_ip TEXT NOT NULL,
        source_port INTEGER NOT NULL,
        destination_ip TEXT NOT NULL,
        destination_port INTEGER NOT NULL,
        protocol TEXT NOT NULL,
        attack_type TEXT NOT NULL,
        signature TEXT NOT NULL,
        detection_engine TEXT NOT NULL,
        raw_event TEXT,
        is_investigated INTEGER DEFAULT 0,
        notes TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS traffic_snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        packets INTEGER NOT NULL,
        bytes_count INTEGER NOT NULL,
        connections INTEGER NOT NULL,
        alerts_count INTEGER NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()

def save_alert(alert_data: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO alerts (
        timestamp, severity, source_ip, source_port, destination_ip, destination_port,
        protocol, attack_type, signature, detection_engine, raw_event, is_investigated, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        alert_data.get("timestamp", datetime.now().isoformat()),
        alert_data.get("severity", 3),
        alert_data.get("source_ip", "0.0.0.0"),
        alert_data.get("source_port", 0),
        alert_data.get("destination_ip", "0.0.0.0"),
        alert_data.get("destination_port", 0),
        alert_data.get("protocol", "UNKNOWN"),
        alert_data.get("attack_type", "Other IDS Alerts"),
        alert_data.get("signature", "Generic Alert"),
        alert_data.get("detection_engine", "Suricata"),
        json.dumps(alert_data.get("raw_event", {})),
        0,
        ""
    ))
    conn.commit()
    alert_id = cursor.lastrowid
    conn.close()
    return alert_id or 0

def get_alerts(
    query: Optional[str] = None,
    severity: Optional[int] = None,
    attack_type: Optional[str] = None,
    ip: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    mode: Optional[str] = "live"
) -> List[Dict[str, Any]]:
    conn = get_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    sql = "SELECT * FROM alerts WHERE 1=1"
    params: List[Any] = []

    if mode == "live":
        sql += " AND detection_engine != ?"
        params.append("Suricata Demo Simulator")
    elif mode == "demo":
        sql += " AND detection_engine = ?"
        params.append("Suricata Demo Simulator")

    if query:
        sql += " AND (signature LIKE ? OR attack_type LIKE ? OR source_ip LIKE ? OR destination_ip LIKE ?)"
        term = f"%{query}%"
        params.extend([term, term, term, term])

    if isinstance(severity, int) and severity > 0:
        sql += " AND severity = ?"
        params.append(severity)

    if attack_type and attack_type != "All":
        sql += " AND attack_type = ?"
        params.append(attack_type)

    if ip:
        sql += " AND (source_ip LIKE ? OR destination_ip LIKE ?)"
        ip_term = f"%{ip}%"
        params.extend([ip_term, ip_term])

    sql += " ORDER BY id DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor.execute(sql, params)
    rows = cursor.fetchall()
    
    results = []
    for r in rows:
        item = dict(r)
        if item.get("raw_event"):
            try:
                item["raw_event"] = json.loads(item["raw_event"])
            except Exception:
                pass
        results.append(item)
        
    conn.close()
    return results

def get_alert_by_id(alert_id: int) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE id = ?", (alert_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    item = dict(row)
    if item.get("raw_event"):
        try:
            item["raw_event"] = json.loads(item["raw_event"])
        except Exception:
            pass
    return item

def update_alert_investigation(alert_id: int, is_investigated: bool, notes: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE alerts SET is_investigated = ?, notes = ? WHERE id = ?",
        (1 if is_investigated else 0, notes, alert_id)
    )
    conn.commit()
    affected = cursor.rowcount > 0
    conn.close()
    return affected

def get_alert_stats(mode: Optional[str] = "live") -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    
    where_clause = ""
    params: List[Any] = []
    if mode == "live":
        where_clause = " WHERE detection_engine != ?"
        params = ["Suricata Demo Simulator"]
    elif mode == "demo":
        where_clause = " WHERE detection_engine = ?"
        params = ["Suricata Demo Simulator"]

    cursor.execute(f"SELECT COUNT(*) FROM alerts{where_clause}", params)
    total_alerts = cursor.fetchone()[0]

    high_where = f"{where_clause} AND severity = 2" if where_clause else " WHERE severity = 2"
    cursor.execute(f"SELECT COUNT(*) FROM alerts{high_where}", params)
    high_severity = cursor.fetchone()[0]

    crit_where = f"{where_clause} AND severity = 1" if where_clause else " WHERE severity = 1"
    cursor.execute(f"SELECT COUNT(*) FROM alerts{crit_where}", params)
    critical_alerts = cursor.fetchone()[0]

    cat_sql = f"SELECT attack_type, COUNT(*) FROM alerts{where_clause} GROUP BY attack_type"
    cursor.execute(cat_sql, params)
    categories = dict(cursor.fetchall())

    conn.close()

    return {
        "total_alerts": total_alerts,
        "high_severity": high_severity,
        "critical_alerts": critical_alerts,
        "categories": categories
    }


