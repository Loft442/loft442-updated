from PIL import Image
import os

# Directory containing the images
folder = r"c:\Users\fahib\Desktop\Stuff\Repo clone\Images updated V"

# Target width
target_width = 540

# Process all .webp files in the folder
for filename in os.listdir(folder):
    if filename.lower().endswith('.webp'):
        filepath = os.path.join(folder, filename)
        with Image.open(filepath) as img:
            w_percent = (target_width / float(img.size[0]))
            h_size = int((float(img.size[1]) * float(w_percent)))
            img_resized = img.resize((target_width, h_size), Image.LANCZOS)
            img_resized.save(filepath, 'WEBP')
print("All .webp images resized to 540px width, maintaining aspect ratio.")
