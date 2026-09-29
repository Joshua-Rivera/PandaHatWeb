import { test, expect } from "@playwright/test";

for (const fallback of [false, true]) {
  test(`mobile collage preserves its poses with ${fallback ? "JS fallback" : "native timeline"}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    if (fallback) await page.addInitScript(() => {
      const supports = CSS.supports.bind(CSS);
      CSS.supports = ((...args: string[]) => args.some(arg => arg.includes("animation-timeline")) ? false : supports(...args as [string, string])) as typeof CSS.supports;
    });
    await page.goto("/");
    const hero = page.locator('.mobile-collage');
    await expect(hero).toHaveAttribute('data-native-scroll', String(!fallback));
    await expect(hero.locator('svg, mask')).toHaveCount(0);
    const first = hero.locator('[data-collage-card]').first();
    await expect.poll(() => first.evaluate(el => {
      const matrix = new DOMMatrix(getComputedStyle(el).transform);
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    })).toBeCloseTo(-18, 2);
    const initial = await first.evaluate(el => getComputedStyle(el).transform);
    await hero.evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().height - el.querySelector('.stack-spread-stage')!.clientHeight, behavior: 'instant' }));
    await expect(hero.locator('.stack-spread-copy')).toHaveCSS('opacity', '1');
    await expect.poll(() => first.evaluate(el => {
      const matrix = new DOMMatrix(getComputedStyle(el).transform);
      return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
    })).toBeCloseTo(-2, 2);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(first).toHaveCSS('transform', initial);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(hero.locator('.stack-spread-copy')).toHaveCSS('opacity', '1');
    await expect(hero.locator('.stack-spread-hint')).toHaveCount(0);
  });
}

test('mobile uses light text, early hero requests, local fonts, and small sponsor sources', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.navigation .special-text-word')).toHaveCount(0);
  expect(await page.locator('*').count()).toBeLessThan(4000);
  const resources = await page.evaluate(() => performance.getEntriesByType('resource').map(e => ({ name: e.name, start: e.startTime, type: e.initiatorType })));
  expect(resources.filter(e => e.name.includes('/collage-mobile/'))).toHaveLength(8);
  expect(resources.filter(e => e.name.includes('/collage-mobile/')).every(e => e.type === 'link')).toBe(true);
  await expect(page.locator('body')).toHaveCSS('font-family', /DM Sans Mobile/);
  await page.locator('#sponsors').evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
  for (const img of await page.locator('#sponsors img').all()) {
    await expect.poll(() => img.evaluate(el => (el as HTMLImageElement).currentSrc)).toContain('/sponsors/mobile/');
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.stack-spread svg')).toHaveCount(1);
  await expect(page.locator('.mobile-collage')).toHaveCount(0);
  await expect(page.locator('.navigation .special-text-word').first()).toBeAttached();
  for (const img of await page.locator('#sponsors img').all()) {
    await expect.poll(() => img.evaluate(el => (el as HTMLImageElement).currentSrc)).not.toContain('/mobile/');
  }
});

test('mobile scroll decoding reverses and selection reveals original text', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const text = page.locator('#description .body-copy .mobile-scroll-text').first();
  const original = await text.locator('.special-text-accessible').textContent();
  const decoded = () => text.locator('.special-text-decoded').allTextContents().then(words => words.join(' '));
  const progress = (value: number) => text.evaluate((el, value) => {
    const rect = el.getBoundingClientRect();
    window.scrollTo({ top: scrollY + rect.top - innerHeight * .95 + value * (rect.height + innerHeight * .3), behavior: 'instant' });
  }, value);
  await progress(.3);
  await expect.poll(decoded).not.toBe(original);
  await progress(1.1);
  await expect.poll(decoded).toBe(original);
  await progress(.3);
  await expect.poll(decoded).not.toBe(original);
  await text.evaluate(el => {
    const range = document.createRange();
    range.selectNodeContents(el.querySelector('[aria-hidden]')!);
    const selection = getSelection()!; selection.removeAllRanges(); selection.addRange(range);
  });
  await expect.poll(decoded).toBe(original);
  await expect.poll(() => page.evaluate(() => getSelection()?.toString())).toBe(original);
  await progress(.1);
  await expect.poll(decoded).toBe(original);
});
