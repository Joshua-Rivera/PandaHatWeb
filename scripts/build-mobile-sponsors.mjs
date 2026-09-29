// Generate mobile-only responsive sources; keep original desktop logos untouched.
import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const root = new URL('../web/public/images/sponsors/', import.meta.url);
await mkdir(new URL('mobile/', root), { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const name of ['iap', 'uprm', 'cps-iot', 'mit-lincoln']) {
    const bytes = await readFile(new URL(`${name}-transparent.webp`, root));
    for (const width of [240, 480, 960]) {
      const data = await page.evaluate(async ({data, width}) => {
        const image = new Image(); image.src = 'data:image/webp;base64,' + data; await image.decode();
        const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = Math.round(image.height * width / image.width);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/webp', .9).split(',')[1];
      }, {data:bytes.toString('base64'), width});
      const output = Buffer.from(data, 'base64');
      await writeFile(new URL(`mobile/${name}-${width}.webp`, root), output);
      console.log(`${name}-${width}: ${output.length} bytes`);
    }
  }
} finally { await browser.close(); }
