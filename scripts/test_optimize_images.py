"""Regression checks for safe, incremental image generation (requires Pillow)."""
from pathlib import Path
import json
import tempfile
import unittest
from PIL import Image
import importlib.util

_spec = importlib.util.spec_from_file_location('optimize_images', Path(__file__).with_name('optimize-images.py'))
_optimizer = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_optimizer)
build_images = _optimizer.build_images


class ImageGenerationTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.source = self.root / 'originals'
        self.output = self.root / 'images'
        self.manifest = self.root / 'image-variants.json'
        self.source.mkdir()

    def original(self, relative, size=(264, 540), color='blue'):
        file = self.source / relative
        file.parent.mkdir(parents=True, exist_ok=True)
        Image.new('RGB', size, color).save(file)
        return file

    def build(self, **options):
        return build_images(self.source, self.output, self.manifest, **options)

    def test_missing_originals_leave_manifest_and_images_untouched(self):
        self.manifest.write_text('{"existing": true}\n')
        (self.source / 'presentation.pptx').write_bytes(b'original presentation')
        with self.assertRaisesRegex(ValueError, 'left unchanged'):
            self.build()
        self.assertEqual(self.manifest.read_text(), '{"existing": true}\n')
        self.assertFalse(self.output.exists())

    def test_narrow_portrait_has_one_variant_and_preserves_unrelated_records(self):
        self.original('members/narrow.png')
        existing = {'/images/other.webp': {'width': 10, 'height': 20, 'variants': []}}
        self.manifest.write_text(json.dumps(existing))
        self.build()
        manifest = json.loads(self.manifest.read_text())
        entry = manifest['/images/members/narrow.webp']
        self.assertEqual(entry['variants'], [{'src': '/images/members/narrow.webp', 'width': 264, 'height': 540}])
        self.assertEqual(manifest['/images/other.webp'], existing['/images/other.webp'])
        self.assertFalse((self.output / 'members/narrow-small.webp').exists())

    def test_existing_outputs_are_unchanged_unless_overwrite_is_explicit(self):
        source = self.original('members/portrait.png', (1024, 768))
        self.build()
        base = self.output / 'members/portrait.webp'
        before = base.read_bytes()
        self.original('members/portrait.png', (1024, 768), 'red')
        self.build()
        self.assertEqual(base.read_bytes(), before)
        self.build(overwrite=True)
        self.assertNotEqual(base.read_bytes(), before)

    def test_wide_portrait_produces_correct_responsive_dimensions(self):
        self.original('members/portrait.png', (1024, 768))
        self.build()
        entry = json.loads(self.manifest.read_text())['/images/members/portrait.webp']
        self.assertEqual([(v['width'], v['height']) for v in entry['variants']], [(320, 240), (720, 540)])
        for variant in entry['variants']:
            with Image.open(self.output / variant['src'].removeprefix('/images/')) as image:
                self.assertEqual(image.format, 'WEBP')
                self.assertEqual(image.size, (variant['width'], variant['height']))

    def test_retired_sponsors_do_not_reappear(self):
        for name in ['academic-partners', 'mit-lincoln-laboratory-clean', 'mit-lincoln-laboratory']:
            self.original(f'sponsors/{name}.png')
        with self.assertRaises(ValueError):
            self.build()
        self.assertFalse(self.output.exists())

    def test_conference_group_retains_full_and_intermediate_variants(self):
        self.original('conference/spring-iap-2026-03.png', (1600, 1200))
        self.build()
        manifest = json.loads(self.manifest.read_text())
        self.assertEqual([v['width'] for v in manifest['/images/conference/spring-iap-2026-03.webp']['variants']], [320, 640, 960, 1600])
        self.assertEqual([v['width'] for v in manifest['/images/conference/spring-iap-2026-03-thumb.webp']['variants']], [320, 640])


if __name__ == '__main__':
    unittest.main()
