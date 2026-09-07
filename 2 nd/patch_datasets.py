import os

target = r"C:\Users\habee\backend\app\api\datasets.py"

new_parse_code = '''import openpyxl

def parse_dataset_metadata(filepath: str, filename: str, is_demo: bool = False):
    filename_lower = filename.lower()
    if filename_lower.endswith('.xlsx') or filename_lower.endswith('.xls'):
        file_type = "XLSX"
        try:
            wb = openpyxl.load_workbook(filepath, read_only=True, data_only=True)
            sheet = wb.active
            records_count = max(0, (sheet.max_row or 1) - 1)
            rows_iter = sheet.iter_rows(values_only=True)
            try:
                header_row = next(rows_iter)
            except StopIteration:
                raise ValueError("Uploaded Excel file is empty.")

            columns = [str(c).strip().lower().replace(" ", "_") for c in header_row if c is not None]

            sample_rows = []
            for i, r in enumerate(rows_iter):
                sample_rows.append(r)
                if i >= 1000:
                    break
            df_sample = pd.DataFrame(sample_rows, columns=columns[:len(sample_rows[0])] if sample_rows else columns)
        except Exception as e:
            # Fallback if openpyxl read_only fails
            df_sample = pd.read_excel(filepath, nrows=1000)
            records_count = len(df_sample)
            df_sample.columns = [str(c).strip().lower().replace(" ", "_") for c in df_sample.columns]
            columns = list(df_sample.columns)
    else:
        file_type = "CSV"
        df_sample = pd.read_csv(filepath, nrows=1000)
        with open(filepath, 'rb') as f:
            records_count = max(0, sum(1 for _ in f) - 1)
        df_sample.columns = [str(c).strip().lower().replace(" ", "_") for c in df_sample.columns]
        columns = list(df_sample.columns)

    if df_sample.empty and not columns:
        raise ValueError("Uploaded file has no recognizable data columns.")

    date_col = next((c for c in columns if 'date' in c or 'time' in c), None)
    date_start, date_end = None, None
    if date_col and not df_sample.empty:
        try:
            dates = pd.to_datetime(df_sample[date_col], errors='coerce').dropna().sort_values()
            if not dates.empty:
                date_start = dates.iloc[0].strftime("%Y-%m-%d")
                date_end = dates.iloc[-1].strftime("%Y-%m-%d")
        except Exception:
            pass

    regions = []
    for col in ['district', 'state', 'region', 'city', 'station_name']:
        if col in df_sample.columns:
            vals = [str(r).strip() for r in df_sample[col].dropna().unique() if str(r).strip()]
            regions.extend(vals)

    regions = list(dict.fromkeys(regions))[:30]
    if not regions:
        regions = ["Mumbai", "Pune", "Bengaluru Urban", "Chennai", "New Delhi"]

    return {
        "file_type": file_type,
        "records_count": records_count,
        "columns": columns,
        "date_range_start": date_start,
        "date_range_end": date_end,
        "regions": regions
    }
'''

with open(target, "r", encoding="utf-8") as f:
    text = f.read()

# Replace parse_dataset_metadata definition
start_marker = "def parse_dataset_metadata("
end_marker = "    return {\n        \"file_type\": file_type,\n        \"records_count\": records_count,\n        \"columns\": columns,\n        \"date_range_start\": date_start,\n        \"date_range_end\": date_end,\n        \"regions\": regions\n    }"

idx_start = text.find(start_marker)
idx_end = text.find(end_marker) + len(end_marker)

if idx_start != -1 and idx_end != -1:
    new_text = text[:idx_start] + new_parse_code + text[idx_end:]
    with open(target, "w", encoding="utf-8") as f:
        f.write(new_text)
    print("SUCCESSFULLY patched parse_dataset_metadata in datasets.py!")
else:
    print(f"Markers not found. Start: {idx_start}, End: {idx_end}")
