from PIL import Image
import os

# Path to the image
input_path = r"c:\Users\fahib\Desktop\Stuff\Repo clone\loft442-updated\public\images\military-ex.webp"
output_path = r"c:\Users\fahib\Desktop\Stuff\Repo clone\loft442-updated\public\images\military-ex.webp"

# Desired size
new_size = (640, 427)

if os.path.exists(input_path):
    with Image.open(input_path) as img:
        img_resized = img.resize(new_size, Image.LANCZOS)
        img_resized.save(output_path, 'WEBP')
    print(f"Resized {input_path} to {new_size}")
else:
    print(f"Input file not found: {input_path}")
