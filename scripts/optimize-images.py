"""Build responsive WebP assets and their dimensions. Requires Pillow."""
from pathlib import Path
import json
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/image-originals'
OUTPUT = ROOT / 'web/public/images'
manifest = {}

def convert(source, output, width=None, lossless=False, quality=82):
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGBA' if 'A' in original.getbands() else 'RGB')
        if width and image.width > width:
            image = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
        output.parent.mkdir(parents=True, exist_ok=True)
        image.save(output, 'WEBP', quality=quality, method=6, lossless=lossless)
        return {'src': '/images/' + str(output.relative_to(OUTPUT)), 'width': image.width, 'height': image.height}

for source in sorted(SOURCE.rglob('*')):
    if source.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
        continue
    relative = source.relative_to(SOURCE)
    if relative.parts[0] == 'collage' or source.name == 'mit-lincoln-laboratory.png':
        continue
    output = OUTPUT / relative.with_suffix('.webp')
    category = relative.parts[0]
    if category == 'conference':
        with Image.open(source) as im:
            im = ImageOps.exif_transpose(im)
            full_width = round(im.width * min(1, 1600 / max(im.size)))
            thumb_width = round(im.width * min(1, 640 / max(im.size)))
        full = convert(source, output, full_width)
        thumb = convert(source, output.with_name(output.stem + '-thumb.webp'), thumb_width)
        small = convert(source, output.with_name(output.stem + '-small.webp'), min(320, thumb_width))
        manifest[thumb['src']] = {**{k: thumb[k] for k in ['width','height']}, 'variants': [small, thumb]}
        if source.stem.endswith('-03'):
            medium = convert(source, output.with_name(output.stem + '-960.webp'), 960)
            manifest[full['src']] = {'width': full['width'], 'height': full['height'], 'variants': [small, thumb, medium, full]}
    elif category == 'posters':
        convert(source, output, quality=85)
        preview = output.with_name(output.stem + '-preview.webp')
        large = convert(source, preview, 960, quality=85)
        small = convert(source, output.with_name(output.stem + '-480.webp'), 480, quality=85)
        manifest[large['src']] = {'width': large['width'], 'height': large['height'], 'variants': [small, large]}
    elif category == 'sponsors':
        width = 1000 if 'mit-' in source.name else 1120
        base = convert(source, output, width, lossless=True)
        small = convert(source, output.with_name(output.stem + '-480.webp'), 480, lossless=True)
        manifest[base['src']] = {'width': base['width'], 'height': base['height'], 'variants': [small, base]}
    elif category in {'members', 'professors'}:
        width = 720 if category == 'members' else 300
        base = convert(source, output, width)
        small = convert(source, output.with_name(output.stem + '-small.webp'), 320 if category == 'members' else 180)
        manifest[base['src']] = {'width': base['width'], 'height': base['height'], 'variants': [small, base]}
    else:
        convert(source, output, 200, lossless=True)

# Retired unused sponsor asset from the prior generator.
(OUTPUT / 'sponsors/mit-lincoln-laboratory.webp').unlink(missing_ok=True)
(ROOT / 'web/src/image-variants.json').write_text(json.dumps(manifest, indent=2) + '\n')
