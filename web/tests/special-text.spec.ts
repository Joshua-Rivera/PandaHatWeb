import { test, expect } from "@playwright/test";

test("section text decodes with scrolling, reverses, and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const paragraph = page.locator("#description .body-copy").first();
  const text = await paragraph.locator(".special-text-accessible").textContent();
  const words = paragraph.locator(".special-text-decoded");
  const scrollToProgress = async (progress: number) => {
    await paragraph.evaluate((el, value) => {
      const rect = el.getBoundingClientRect();
      const top = window.scrollY + rect.top - innerHeight * .95;
      window.scrollTo({ top: top + value * (rect.height + innerHeight * .3), behavior: "instant" });
    }, progress);
  };
  await scrollToProgress(.4);
  await expect.poll(async () => (await words.allTextContents()).join(" ")).not.toBe(text);
  const height = await paragraph.evaluate(el => el.getBoundingClientRect().height);
  await scrollToProgress(1.1);
  await expect.poll(async () => (await words.allTextContents()).join(" ")).toBe(text);
  expect(await paragraph.evaluate(el => el.getBoundingClientRect().height)).toBe(height);
  await scrollToProgress(.3);
  await expect.poll(async () => (await words.allTextContents()).join(" ")).not.toBe(text);
  for (const id of ["description", "problem-statement", "objective", "members", "research-posters", "professors", "sponsors"]) {
    await expect(page.locator(`#${id} .special-text`).first()).toBeAttached();
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect.poll(async () => (await words.allTextContents()).join(" ")).toBe(text);
});

test("hover decodes text and dragging selects only the original words", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  const paragraph = page.locator("#description .body-copy").first();
  const words = paragraph.locator(".special-text-decoded");
  const original = await paragraph.locator(".special-text-accessible").textContent();
  await paragraph.evaluate(el => window.scrollTo({ top: scrollY + el.getBoundingClientRect().top - 200, behavior: "instant" }));
  await expect.poll(async () => (await words.allTextContents()).join(" ")).toBe(original);
  await paragraph.locator(".special-text-word").first().hover();
  await expect.poll(async () => (await words.allTextContents()).join(" ")).not.toBe(original);
  await expect.poll(async () => (await words.allTextContents()).join(" ")).toBe(original);
  await page.mouse.move(0, 0);
  await paragraph.evaluate(el => window.scrollTo({ top: scrollY + el.getBoundingClientRect().top - 200, behavior: "instant" }));
  const first = await paragraph.locator(".special-text-measure").first().boundingBox();
  const last = await paragraph.locator(".special-text-measure").last().boundingBox();
  if (!first || !last) throw new Error("Text is not visible");
  await page.mouse.move(first.x + 1, first.y + first.height / 2);
  await page.mouse.down();
  await expect.poll(async () => (await words.allTextContents()).join(" ")).toBe(original);
  await page.mouse.move(last.x + last.width, last.y + last.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe(original);
  await page.mouse.move(0, 0);
  await paragraph.locator(".special-text-word").first().hover();
  await expect.poll(async () => (await words.allTextContents()).join(" ")).toBe(original);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => window.getSelection()?.removeAllRanges());
  await page.mouse.move(0, 0);
  await paragraph.locator(".special-text-word").first().hover();
  await expect.poll(async () => (await words.allTextContents()).join(" ")).toBe(original);
});

test("hover decoding covers navigation, labels, captions, cards, and profiles", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  for (const selector of [
    '.navigation a[href="#objective"]',
    '#objective .eyebrow',
    '#objective .research-questions-title',
    '.onboarding-grid h3',
    '.featured-poster figcaption h3',
    '.advisor-card h3',
    '.footer .back-top',
  ]) {
    const target = page.locator(selector).first().locator('.special-text').first();
    await target.scrollIntoViewIfNeeded();
    const original = await target.locator('.special-text-accessible').textContent();
    const decoded = target.locator('.special-text-decoded');
    await page.mouse.move(0, 0);
    await target.locator(".special-text-word").first().hover();
    await expect.poll(async () => (await decoded.allTextContents()).join(' ')).not.toBe(original);
    await expect.poll(async () => (await decoded.allTextContents()).join(' ')).toBe(original);
  }
  await page.goto('/#member/joshua-rivera');
  const name = page.locator('#member-endpoint-title .special-text');
  await name.locator(".special-text-word").first().hover();
  await expect.poll(async () => (await name.locator('.special-text-decoded').allTextContents()).join(' ')).not.toBe('Joshua Rivera');
  await page.getByRole('button', { name: 'Close member profile' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
