"""Test the full upload flow to reproduce and diagnose errors."""
import httpx
import json
import os

BASE = "http://127.0.0.1:8000/api"

# 1. Try login as admin
print("=" * 60)
print("STEP 1: Login")
print("=" * 60)
try:
    resp = httpx.post(f"{BASE}/auth/login", data={"username": "habeebc84@gmail.com", "password": "password"}, timeout=10)
    print(f"Login status: {resp.status_code}")
    print(f"Login body: {resp.text[:500]}")
except Exception as e:
    print(f"Login error: {e}")
    resp = None

token = None
if resp and resp.status_code == 200:
    data = resp.json()
    token = data.get("access_token")
    print(f"Got token: {token[:20]}...")

# 2. Try guest login if admin login failed
if not token:
    print("\nTrying guest login...")
    try:
        resp = httpx.post(f"{BASE}/auth/guest", timeout=10)
        print(f"Guest status: {resp.status_code}")
        print(f"Guest body: {resp.text[:500]}")
        if resp.status_code == 200:
            data = resp.json()
            token = data.get("access_token")
    except Exception as e:
        print(f"Guest error: {e}")

# 3. Try uploading without token
print("\n" + "=" * 60)
print("STEP 2: Upload WITHOUT token (expect 401)")
print("=" * 60)
test_csv = os.path.join(os.path.dirname(__file__), "test_upload.csv")
with open(test_csv, "w") as f:
    f.write("date,region,rainfall,avg_temp,humidity\n")
    f.write("2024-01-01,Mumbai,5.2,28.3,75\n")
    f.write("2024-01-02,Pune,3.1,27.1,68\n")
    f.write("2024-01-03,Delhi,0.0,22.5,45\n")

try:
    with open(test_csv, "rb") as f:
        resp = httpx.post(f"{BASE}/datasets/upload", files={"file": ("test_upload.csv", f, "text/csv")}, timeout=10)
    print(f"Upload (no auth) status: {resp.status_code}")
    print(f"Upload (no auth) body: {resp.text[:500]}")
except Exception as e:
    print(f"Upload (no auth) error: {e}")

# 4. Try uploading WITH token
if token:
    print("\n" + "=" * 60)
    print("STEP 3: Upload WITH token")
    print("=" * 60)
    headers = {"Authorization": f"Bearer {token}"}
    try:
        with open(test_csv, "rb") as f:
            resp = httpx.post(f"{BASE}/datasets/upload", files={"file": ("test_upload.csv", f, "text/csv")}, headers=headers, timeout=30)
        print(f"Upload (auth) status: {resp.status_code}")
        print(f"Upload (auth) body: {resp.text[:800]}")
    except Exception as e:
        print(f"Upload (auth) error: {e}")
else:
    print("\n** NO TOKEN AVAILABLE - Cannot test authenticated upload **")
    print("** This is the root cause: the user must be logged in to upload. **")

# 5. Try demo dataset endpoint
print("\n" + "=" * 60)
print("STEP 4: Demo dataset load")
print("=" * 60)
if token:
    headers = {"Authorization": f"Bearer {token}"}
    try:
        resp = httpx.post(f"{BASE}/datasets/demo", headers=headers, timeout=10)
        print(f"Demo status: {resp.status_code}")
        print(f"Demo body: {resp.text[:500]}")
    except Exception as e:
        print(f"Demo error: {e}")
else:
    try:
        resp = httpx.post(f"{BASE}/datasets/demo", timeout=10)
        print(f"Demo (no auth) status: {resp.status_code}")
        print(f"Demo (no auth) body: {resp.text[:500]}")
    except Exception as e:
        print(f"Demo error: {e}")

# Cleanup
if os.path.exists(test_csv):
    os.remove(test_csv)
