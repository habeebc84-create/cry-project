import os

target = r"C:\Users\habee\backend\app\api\datasets.py"

with open(target, "r", encoding="utf-8") as f:
    text = f.read()

old_check = 'if not (file.filename.endswith(".csv") or file.filename.endswith(".xlsx") or file.filename.endswith(".xls")):'

new_check = '''filename_lower = (file.filename or "").lower()
    if not (filename_lower.endswith(".csv") or filename_lower.endswith(".xlsx") or filename_lower.endswith(".xls")):'''

if old_check in text:
    text = text.replace(old_check, new_check)
    with open(target, "w", encoding="utf-8") as f:
        f.write(text)
    print("SUCCESS: datasets.py upload filename extension check is now case-insensitive.")
else:
    print("Pattern not found in datasets.py")
