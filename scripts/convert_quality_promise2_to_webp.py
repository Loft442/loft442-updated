from PIL import Image
import os

# Path to the image
input_path = r"c:\Users\fahib\Desktop\Stuff\Repo clone\loft442-updated\public\images\quality-promise2.png"
output_path = r"c:\Users\fahib\Desktop\Stuff\Repo clone\loft442-updated\public\images\quality-promise2.webp"

# Desired size
new_size = (640, 478)

if os.path.exists(input_path):
    with Image.open(input_path) as img:
        img = img.convert('RGBA')
        img_resized = img.resize(new_size, Image.LANCZOS)
        img_resized.save(output_path, 'WEBP')
    print(f"Converted and resized {input_path} to {output_path} with size {new_size}")
else:
    print(f"Input file not found: {input_path}")
