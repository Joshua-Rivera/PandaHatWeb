// Deterministically bake the existing SVG artwork into mobile-only WebP layers.
// Run from the repository root: cd web && npm run images:collage
import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const cards = JSON.parse(await readFile(new URL('../src/components/ui/collage-cards.json', import.meta.url)));
const output = new URL('../public/images/collage-mobile/', import.meta.url);
// Tighten the mobile wordmark, especially the gaps around the a/H transition.
const mobileLetterSpacing = -11;
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const [index, c] of cards.entries()) {
    const image = await readFile(new URL(`../public/images/conference/spring-iap-2026-${String(c.image).padStart(2, '0')}-thumb.webp`, import.meta.url));
    const occluders = cards.slice(index + 1).map(f => `<rect transform="translate(${f.x} ${f.y}) rotate(${f.angle})" x="${-f.w/2+.6}" y="${-f.h/2+.6}" width="${f.w-1.2}" height="${f.h-1.2}" rx="8.4" fill="black"/>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${c.w*2}" height="${c.h*2}" viewBox="${-c.w/2} ${-c.h/2} ${c.w} ${c.h}"><defs><clipPath id="clip"><rect x="${-c.w/2}" y="${-c.h/2}" width="${c.w}" height="${c.h}" rx="9"/></clipPath><mask id="mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="740"><rect width="1200" height="740" fill="white"/>${occluders}</mask></defs><g clip-path="url(#clip)"><image href="data:image/webp;base64,${image.toString('base64')}" x="${-c.w/2}" y="${-c.h/2}" width="${c.w}" height="${c.h}" preserveAspectRatio="xMidYMid slice"/><g transform="rotate(${-c.angle}) translate(${-c.x} ${-c.y})"><text x="600" y="422" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="142" font-weight="900" letter-spacing="${mobileLetterSpacing}" fill="#ececeb" stroke="#141414" stroke-width="1.5" stroke-linejoin="round" paint-order="stroke fill" mask="url(#mask)">PandaHat</text></g></g></svg>`;
    const encoded = await page.evaluate(async svg => {
      const image = new Image(); image.src = 'data:image/svg+xml;base64,' + btoa(svg); await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
      canvas.getContext('2d').drawImage(image, 0, 0);
      return canvas.toDataURL('image/webp', .84).split(',')[1];
    }, svg);
    const bytes = Buffer.from(encoded, 'base64');
    await writeFile(new URL(`card-${index + 1}.webp`, output), bytes);
    console.log(`card-${index + 1}.webp: ${bytes.length} bytes`);
  }
} finally { await browser.close(); }
