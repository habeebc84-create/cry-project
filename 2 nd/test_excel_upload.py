import httpx
import os
import time

BASE = "http://127.0.0.1:8000/api"

print("=" * 60)
print("TESTING FULL EXCEL UPLOAD VIA API")
print("=" * 60)

# 1. Login as guest
resp = httpx.post(f"{BASE}/auth/guest", timeout=10)
token = resp.json().get("access_token")
headers = {"Authorization": f"Bearer {token}"}
print(f"Logged in, token acquired.")

# 2. Upload india_weather_rainfall_data.xlsx
excel_path = r"H:\india_weather_rainfall_data.xlsx"
filename = "india_weather_rainfall_data.xlsx"

t0 = time.time()
print(f"Uploading {excel_path} ({os.path.getsize(excel_path) / 1024 / 1024:.1f} MB)...")

with open(excel_path, "rb") as f:
    upload_resp = httpx.post(
        f"{BASE}/datasets/upload",
        files={"file": (filename, f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        headers=headers,
        timeout=60
    )

elapsed = time.time() - t0
print(f"Upload Completed in {elapsed:.2f} seconds!")
print(f"Status Code: {upload_resp.status_code}")
print(f"Response: {upload_resp.text}")
