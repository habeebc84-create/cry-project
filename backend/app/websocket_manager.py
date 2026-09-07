import asyncio
import json
import logging
from typing import Set
from fastapi import WebSocket

logger = logging.getLogger("sentinel.ws")

class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"WebSocket client connected. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        logger.info(f"WebSocket client disconnected. Remaining: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        if not self.active_connections:
            return
        
        data = json.dumps(message)
        to_remove = set()
        
        for connection in list(self.active_connections):
            try:
                await connection.send_text(data)
            except Exception as e:
                logger.warning(f"Error sending to WebSocket client: {e}")
                to_remove.add(connection)
                
        for conn in to_remove:
            self.disconnect(conn)

ws_manager = ConnectionManager()
