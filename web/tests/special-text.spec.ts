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
