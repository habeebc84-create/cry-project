import asyncio
import json
import os
import logging
from typing import Callable, Optional
from app.categorizer import normalize_suricata_event
from app.database import save_alert

logger = logging.getLogger("sentinel.eve_parser")

class EveParser:
    def __init__(self, eve_path: str, on_alert_callback: Optional[Callable] = None):
        self.eve_path = eve_path
        self.on_alert_callback = on_alert_callback
        self.is_running = False
        self.file_position = 0
        self.last_event_time = None
        self.total_parsed_alerts = 0
        self._task = None

    def update_path(self, new_path: str):
        self.eve_path = new_path
        self.file_position = 0

    def start(self):
        if not self.is_running:
            self.is_running = True
            self._task = asyncio.create_task(self._tail_file())

    def stop(self):
        self.is_running = False
        if self._task:
            self._task.cancel()

    async def _tail_file(self):
        logger.info(f"Starting EVE JSON watcher on: {self.eve_path}")
        while self.is_running:
            try:
                current_path = self.eve_path
                if not os.path.exists(current_path):
                    await asyncio.sleep(2)
                    continue

                with open(current_path, "r", encoding="utf-8", errors="ignore") as f:
                    # Seek to previous position
                    f.seek(self.file_position)
                    
                    while self.is_running and self.eve_path == current_path:
                        line = f.readline()
                        if not line:
                            self.file_position = f.tell()
                            await asyncio.sleep(0.5)
                            # Check if file was truncated/rotated
                            if os.path.exists(current_path) and os.path.getsize(current_path) < self.file_position:
                                self.file_position = 0
                                f.seek(0)
                            continue

                        line_str = line.strip()
                        if not line_str:
                            continue

                        try:
                            data = json.loads(line_str)
                            if data.get("event_type") == "alert":
                                normalized = normalize_suricata_event(data)
                                alert_id = save_alert(normalized)
                                normalized["id"] = alert_id
                                self.total_parsed_alerts += 1
                                self.last_event_time = normalized["timestamp"]

                                if self.on_alert_callback:
                                    await self.on_alert_callback(normalized)
                        except json.JSONDecodeError:
                            continue
                        except Exception as e:
                            logger.error(f"Error parsing eve.json line: {e}")

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"EVE file reader error: {e}")
                await asyncio.sleep(2)

