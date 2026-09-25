import { test, expect } from "@playwright/test";

for (const width of [375, 1440]) {
  test(`responsive assets and full-size poster at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const requests: string[] = [];
    page.on("request", request => requests.push(request.url()));
    await page.goto("/");
    const fullPoster = "/images/posters/pandahat-fall-2026.webp";
    const poster = page.locator(".featured-poster img");
    await poster.scrollIntoViewIfNeeded();
    await expect.poll(() => poster.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect.poll(() => poster.evaluate(el => (el as HTMLImageElement).currentSrc)).toContain(width < 768 ? "-480.webp" : "-preview.webp");
    expect(requests.some(url => url.endsWith(fullPoster))).toBe(false);
    const popupPromise = page.waitForEvent("popup");
    await page.locator(".featured-poster > a").click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    await expect(popup).toHaveURL(new RegExp(`${fullPoster}$`));
    await expect.poll(() => popup.locator("img").evaluate(el => (el as HTMLImageElement).naturalWidth)).toBe(2400);
    await popup.close();

    for (const img of await page.locator(".conference-grid img, .team-group-image, .sponsor-logo-card img, .advisor-card img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
    for (const portrait of await page.locator(".advisor-card img").all()) {
      const box = await portrait.boundingBox();
      expect(box!.width).toBe(box!.height);
    }
    const group = page.locator(".team-group-image");
    expect(await group.evaluate(el => (el as HTMLImageElement).currentSrc)).toContain(width < 768 ? "-thumb.webp" : "-03.webp");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
