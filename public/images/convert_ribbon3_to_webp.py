from PIL import Image
import os

# Convert ribbon3.png to ribbon3.webp in the same directory
input_path = r"c:\Users\fahib\Desktop\Stuff\Repo clone\loft442-updated\public\images\ribbon3.png"
output_path = r"c:\Users\fahib\Desktop\Stuff\Repo clone\loft442-updated\public\images\ribbon3.webp"

if os.path.exists(input_path):
    with Image.open(input_path) as img:
        img.save(output_path, 'WEBP')
    print(f"Converted {input_path} to {output_path}")
else:
    print(f"Input file not found: {input_path}")
