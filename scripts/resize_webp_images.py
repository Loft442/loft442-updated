import sys
import os
from PIL import Image

def resize_image(input_path, output_path, width, height):
    with Image.open(input_path) as img:
        img_resized = img.resize((width, height), Image.LANCZOS)
        img_resized.save(output_path, 'WEBP')

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python resize_webp_images.py <filename> <width> <height>")
        sys.exit(1)
    filename = sys.argv[1]
    width = int(sys.argv[2])
    height = int(sys.argv[3])
    folder = os.path.dirname(os.path.abspath(filename))
    input_path = filename if os.path.isabs(filename) else os.path.join(os.getcwd(), filename)
    output_path = input_path  # Overwrite original
    resize_image(input_path, output_path, width, height)
    print(f"{os.path.basename(filename)} resized to {width}x{height}.")
