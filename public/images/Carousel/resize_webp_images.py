from PIL import Image
import os

# Directory containing the images
folder = os.path.dirname(os.path.abspath(__file__))

# Scale factor for both width and height
scale_factor = 0.5

# Process all .webp files in the folder
for filename in os.listdir(folder):
    if filename.lower().endswith('.webp'):
        filepath = os.path.join(folder, filename)
        with Image.open(filepath) as img:
            new_width = max(1, int(img.size[0] * scale_factor))
            new_height = max(1, int(img.size[1] * scale_factor))
            img_resized = img.resize((new_width, new_height), Image.LANCZOS)
            img_resized.save(filepath, 'WEBP')
print("All .webp images resized to 50% of original dimensions, maintaining aspect ratio.")
