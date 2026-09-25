import { test, expect } from "@playwright/test";

for (const width of [375, 1440]) {
  test(`collage aligns lettering, spreads, and reverses at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const cards = page.locator("[data-collage-card]");
    await expect(cards).toHaveCount(8);
    // Every clipped word must map to the same screen coordinates in the stack.
    const origins = await cards.locator("text").evaluateAll((nodes) => nodes.map((node) => {
      const matrix = (node as SVGTextElement).getScreenCTM()!;
      return { x: matrix.e, y: matrix.f, a: matrix.a, b: matrix.b };
    }));
    for (const origin of origins) {
      expect(origin.x).toBeCloseTo(origins[0].x, 2);
      expect(origin.y).toBeCloseTo(origins[0].y, 2);
      expect(origin.a).toBeCloseTo(origins[0].a, 2);
      expect(origin.b).toBeCloseTo(0, 2);
    }
    const initial = await cards.first().getAttribute("style");
    const copy = page.locator(".stack-spread-copy");
    await expect(copy).toHaveCSS("opacity", "0");
    await page.mouse.wheel(0, width < 768 ? 1050 : 1450);
    await expect(copy).toHaveCSS("opacity", "1");
    expect(await cards.first().getAttribute("style")).not.toBe(initial);
    const stage = await page.locator(".stack-spread-stage").boundingBox();
    for (const card of await cards.all()) {
      const box = await card.locator("image").boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(-1);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      expect(box!.y).toBeGreaterThanOrEqual(stage!.y - 1);
      expect(box!.y + box!.height).toBeLessThanOrEqual(stage!.y + stage!.height + 1);
    }
    await page.mouse.wheel(0, -3000);
    await expect(copy).toHaveCSS("opacity", "0");
    await expect(cards.first()).toHaveAttribute("style", initial!);
  });
}
