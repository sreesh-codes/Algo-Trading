import os
import time
from concurrent.futures import ProcessPoolExecutor
from PIL import Image, ImageFilter, ImageEnhance

SRC_DIR = 'ezgif-60d8c0ef286a1806-jpg'
DST_DIR = 'public/sequence'

def enhance_frame(fn):
    if not fn.endswith('.jpg'):
        return
    src_path = os.path.join(SRC_DIR, fn)
    dst_path = os.path.join(DST_DIR, fn)
    
    with Image.open(src_path) as img:
        # High quality unsharp mask for crystal clear architectural edges and neon lines
        enh = img.filter(ImageFilter.UnsharpMask(radius=1.3, percent=140, threshold=2))
        # Refined contrast to eliminate flat washed-out haze
        enh = ImageEnhance.Contrast(enh).enhance(1.06)
        # Rich color vibrance for Dubai golden lights and skyline
        enh = ImageEnhance.Color(enh).enhance(1.06)
        # Sharpness boost
        enh = ImageEnhance.Sharpness(enh).enhance(1.15)
        # Save at high quality with progressive encoding and optimization
        enh.save(dst_path, 'JPEG', quality=93, optimize=True)

if __name__ == '__main__':
    t0 = time.time()
    files = [f for f in sorted(os.listdir(SRC_DIR)) if f.endswith('.jpg')]
    print(f"Enhancing {len(files)} frames for crystal-clear visual quality...")
    with ProcessPoolExecutor() as executor:
        list(executor.map(enhance_frame, files))
    print(f"Successfully enhanced all {len(files)} frames in {time.time() - t0:.2f}s!")
