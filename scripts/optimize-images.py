"""Generate missing responsive WebP images without discarding existing assets.

Requires Pillow. Existing outputs are preserved unless --overwrite is supplied;
manifest records without available originals are always preserved.
"""
from argparse import ArgumentParser
from pathlib import Path
import json
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
RETIRED_SPONSORS = {
    'academic-partners', 'mit-lincoln-laboratory',
    'mit-lincoln-laboratory-clean',
}


def build_images(source_root, output_root, manifest_path, overwrite=False):
    source_root, output_root, manifest_path = map(Path, (source_root, output_root, manifest_path))
    sources = []
    for source in sorted(source_root.rglob('*')):
        if source.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
            continue
        relative = source.relative_to(source_root)
        if relative.parts[0] in {'collage', 'recovered-legacy'}:
            continue
        if relative.parts[0] == 'sponsors' and source.stem in RETIRED_SPONSORS:
            continue
        sources.append(source)
    if not sources:
        raise ValueError('No supported originals found; existing images and manifest were left unchanged.')
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}

    def describe(output):
        with Image.open(output) as image:
            return {'src': '/images/' + output.relative_to(output_root).as_posix(),
                    'width': image.width, 'height': image.height}

    def convert(source, output, width=None, lossless=False, quality=82):
        if output.exists() and not overwrite:
            return describe(output)
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert('RGBA' if 'A' in original.getbands() else 'RGB')
            if width and image.width > width:
                image = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
            output.parent.mkdir(parents=True, exist_ok=True)
            image.save(output, 'WEBP', quality=quality, method=6, lossless=lossless)
        return describe(output)

    def smaller(source, base, output, target, **options):
        return convert(source, output, target, **options) if base['width'] > target else base

    def record(base, variants):
        # A srcSet must not list identical widths, including narrow originals.
        unique = {variant['width']: variant for variant in variants}
        manifest[base['src']] = {
            'width': base['width'], 'height': base['height'],
            'variants': [unique[width] for width in sorted(unique)],
        }

    for source in sources:
        relative = source.relative_to(source_root)
        output = output_root / relative.with_suffix('.webp')
        category = relative.parts[0]
        if category == 'conference':
            with Image.open(source) as original:
                image = ImageOps.exif_transpose(original)
                full_width = round(image.width * min(1, 1600 / max(image.size)))
                thumb_width = round(image.width * min(1, 640 / max(image.size)))
            full = convert(source, output, full_width)
            thumb = convert(source, output.with_name(output.stem + '-thumb.webp'), thumb_width)
            small = smaller(source, thumb, output.with_name(output.stem + '-small.webp'), 320)
            record(thumb, [small, thumb])
            if source.stem.endswith('-03'):
                medium = smaller(source, full, output.with_name(output.stem + '-960.webp'), 960)
                record(full, [small, thumb, medium, full])
        elif category == 'posters':
            convert(source, output, quality=85)
            large = convert(source, output.with_name(output.stem + '-preview.webp'), 960, quality=85)
            small = smaller(source, large, output.with_name(output.stem + '-480.webp'), 480, quality=85)
            record(large, [small, large])
        elif category == 'sponsors':
            base = convert(source, output, 1000 if 'mit-' in source.name else 1120, lossless=True)
            # Transparent desktop logos use the separate mobile sponsor generator.
            if source.stem.endswith('-transparent'):
                record(base, [base])
            else:
                small = smaller(source, base, output.with_name(output.stem + '-480.webp'), 480, lossless=True)
                record(base, [small, base])
        elif category in {'members', 'professors'}:
            base = convert(source, output, 720 if category == 'members' else 300)
            small = smaller(source, base, output.with_name(output.stem + '-small.webp'), 320 if category == 'members' else 180)
            record(base, [small, base])
        else:
            convert(source, output, 200, lossless=True)

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    temporary = manifest_path.with_suffix(manifest_path.suffix + '.tmp')
    temporary.write_text(json.dumps(manifest, indent=2) + '\n')
    temporary.replace(manifest_path)
    return len(sources)


def main():
    parser = ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=ROOT / 'assets/image-originals')
    parser.add_argument('--output', type=Path, default=ROOT / 'web/public/images')
    parser.add_argument('--manifest', type=Path, default=ROOT / 'web/src/image-variants.json')
    parser.add_argument('--overwrite', action='store_true', help='Explicitly regenerate existing WebP outputs.')
    args = parser.parse_args()
    try:
        count = build_images(args.source, args.output, args.manifest, args.overwrite)
    except ValueError as error:
        parser.exit(1, f'{error}\n')
    print(f'Processed {count} originals; preserved manifest records for unavailable originals.')


if __name__ == '__main__':
    main()
