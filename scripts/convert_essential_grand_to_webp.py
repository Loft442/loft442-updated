from PIL import Image
import os

# Convert essential.png and grand.png to webp in the same directory
base_path = r"c:\Users\fahib\Desktop\Stuff\Repo clone\loft442-updated\public\images"

images_to_convert = [
    ("essential.png", "essential.webp"),
    ("grand.png", "grand.webp")
]

for input_filename, output_filename in images_to_convert:
    input_path = os.path.join(base_path, input_filename)
    output_path = os.path.join(base_path, output_filename)
    
    if os.path.exists(input_path):
        with Image.open(input_path) as img:
            img.save(output_path, 'WEBP')
        print(f"Converted {input_path} to {output_path}")
    else:
        print(f"Input file not found: {input_path}")
