# Convert CSV (roll,name,filename) to mapping.json
# Usage:
#   python3 csv_to_mapping.py input.csv output.json

import csv, json, sys

def convert(csv_path, out_path):
    mapping = {}
    with open(csv_path, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            roll = row['roll'].strip().upper()
            mapping[roll] = {
                "name": row['name'].strip(),
                "filename": row['filename'].strip()
            }

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)

    print("Generated", out_path, "with", len(mapping), "entries")

if __name__ == "__main__":
    convert(sys.argv[1], sys.argv[2])
