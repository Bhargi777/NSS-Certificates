from PIL import Image, ImageDraw, ImageFont
import pandas as pd
import os

TEMPLATE_PATH = 'certificate.png'
CSV_PATH = 'students.csv'
FONT_PATH = "/Library/Fonts/Arial.ttf"   # CHANGE to your system's .ttf path
FONT_SIZE = 42

TEXT_Y = 350  # Y-position of the name line (tweak to match your template)
OUTPUT_DIR = 'certificates'

# Create output folder
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Load data
df = pd.read_csv(CSV_PATH)
font = ImageFont.truetype(FONT_PATH, FONT_SIZE)

for _, row in df.iterrows():
    rollno = str(row['roll_no']).strip()
    name = str(row['name']).strip()

    # Open certificate image
    img = Image.open(TEMPLATE_PATH).convert('RGB')
    draw = ImageDraw.Draw(img)
    
    # Calculate center
    W, _ = img.size
    bbox = draw.textbbox((0, 0), name, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]

    TEXT_X = (W - w) / 2  # Center horizontally
    TEXT_Y = 420
    # Draw the name centered
    draw.text((TEXT_X, TEXT_Y), name, font=font, fill=(0,0,0))
    
    # Save as PDF using roll number
    pdf_path = os.path.join(OUTPUT_DIR, f"{rollno}.pdf")
    img.save(pdf_path, 'PDF')
    print(f"Generated: {pdf_path}")

print("\nDone! All certificates are saved in the 'certificates' folder.")
