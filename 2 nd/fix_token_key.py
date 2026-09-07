import os

TARGET_FILE = r"C:\Users\habee\frontend\src\services\api.ts"

with open(TARGET_FILE, "r", encoding="utf-8") as f:
    text = f.read()

# Fix: read from 'water_intel_token' which is where useAuth.tsx stores it
old = "const token = localStorage.getItem('token');"
new = "const token = localStorage.getItem('water_intel_token') || localStorage.getItem('token');"

if old in text:
    text = text.replace(old, new)
    with open(TARGET_FILE, "w", encoding="utf-8") as f:
        f.write(text)
    print("FIXED: api.ts interceptor now reads 'water_intel_token' from localStorage!")
else:
    print("Pattern not found — may already be fixed.")
