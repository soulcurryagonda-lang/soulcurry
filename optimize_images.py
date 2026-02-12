import os
from PIL import Image
import re

ASSETS_DIR = r"c:\Users\Lenovo\OneDrive\Desktop\soulcurry\assets"
HTML_FILE = r"c:\Users\Lenovo\OneDrive\Desktop\soulcurry\index.html"

# Define resizing rules (filename pattern -> max_width)
RESIZE_RULES = {
    "logo": 300,
    "dining-thali": 800,
    "cocktail-prawns": 800,
    "chicken-roast": 800,
    "mackeral-fry": 800,
    "menu": 800,
    "masala-fish": 800,
    "ambience-night": 1200,
    "exterior-night": 1200,
    "pool-player": 1200,
    "ambience-wide": 1920,
    "pool-table-wide": 1920
}

def optimize_image(filename):
    filepath = os.path.join(ASSETS_DIR, filename)
    name, ext = os.path.splitext(filename)
    
    if ext.lower() not in ['.png', '.jpg', '.jpeg']:
        return None

    try:
        img = Image.open(filepath)
        
        # Determine max width
        max_width = 1920 # Default
        for key, width in RESIZE_RULES.items():
            if key in name:
                max_width = width
                break
        
        # Resize if needed
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            print(f"Resized {filename} to {max_width}x{new_height}")

        # Check for transparency
        has_transparency = False
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            has_transparency = True
        
        new_filename = filename
        if has_transparency:
            # Save as WebP to preserve transparency but compress better than PNG
            new_filename = f"{name}.webp"
            new_filepath = os.path.join(ASSETS_DIR, new_filename)
            img.save(new_filepath, 'WEBP', quality=85)
            print(f"Optimized {filename} -> {new_filename} (WebP)")
        else:
            # specific handling for logo to keep it jpeg if it was jpeg, but optimize
            if "logo" in name:
                 new_filename = f"{name}.jpg" # Ensure jpg extension
                 new_filepath = os.path.join(ASSETS_DIR, new_filename)
                 # convert to RGB if needed
                 if img.mode != 'RGB':
                     img = img.convert('RGB')
                 img.save(new_filepath, 'JPEG', quality=85, optimize=True)
                 print(f"Optimized {filename} -> {new_filename} (JPEG)")
            else:
                # Convert non-transparent images to WebP for better compression
                new_filename = f"{name}.webp"
                new_filepath = os.path.join(ASSETS_DIR, new_filename)
                img.save(new_filepath, 'WEBP', quality=85)
                print(f"Optimized {filename} -> {new_filename} (WebP)")
        
        return new_filename

    except Exception as e:
        print(f"Failed to optimize {filename}: {e}")
        return None

def update_html(replacements):
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old_name, new_name in replacements.items():
        if old_name != new_name:
            # Replace strictly within src attributes or similar contexts to avoid false positives
            # But simple string replacement for assets/filename should be safe enough here
            content = content.replace(f"assets/{old_name}", f"assets/{new_name}")
            print(f"Updated HTML: {old_name} -> {new_name}")
            
    with open(HTML_FILE, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    files = os.listdir(ASSETS_DIR)
    replacements = {}
    
    for filename in files:
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            new_name = optimize_image(filename)
            if new_name:
                replacements[filename] = new_name
                
    update_html(replacements)
    print("Optimization complete.")

if __name__ == "__main__":
    main()
