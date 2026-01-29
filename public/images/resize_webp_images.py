from PIL import Image
import os

# Directory containing the images
folder = r"c:\Users\fahib\Desktop\Stuff\Repo clone\Images updated V"

# Target width
target_width = 720

# Only resize feature_0000.webp to feature_0004.webp and feuture_0000_weding.webp
files_to_resize = [f"feature_{i:04d}.webp" for i in range(5)]
files_to_resize.append("feuture_0000_weding.webp")
for filename in files_to_resize:
    filepath = os.path.join(folder, filename)
    if os.path.exists(filepath):
        with Image.open(filepath) as img:
            w_percent = (target_width / float(img.size[0]))
            h_size = int((float(img.size[1]) * float(w_percent)))
            img_resized = img.resize((target_width, h_size), Image.LANCZOS)
            img_resized.save(filepath, 'WEBP')
print("feature_0000.webp to feature_0004.webp and feuture_0000_weding.webp resized to 720px width, maintaining aspect ratio.")
