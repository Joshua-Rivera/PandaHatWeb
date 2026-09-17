import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [375, 768, 1024, 1440]) {
  test(`single page layout and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("#research-posters")).toBeAttached();
    for (const id of ["description", "problem-statement", "objective", "members", "research-posters", "professors", "sponsors"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
      await expect(page.getByRole("navigation", { name: "Main navigation", includeHidden: true }).locator(`a[href="#${id}"]`)).toHaveCount(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const section of ["#description", "#research-posters", "#members"]) {
      await page.locator(section).scrollIntoViewIfNeeded();
      expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}

test("section links, horizontal controls, keyboard, and legacy bookmarks", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "Explore the research" }).click();
  await expect(page).toHaveURL(/\/#research-posters$/);
  await expect(page.locator("#research-posters .section-heading")).toBeInViewport();
  const research = page.locator("#research-posters .horizontal-rail");
  await page.getByRole("button", { name: "Next research posters" }).click();
  expect(await research.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  await research.focus();
  await page.keyboard.press("ArrowLeft");
  await expect.poll(() => research.evaluate(el => el.scrollLeft)).toBeLessThan(2);
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Members" }).click();
  await expect(page).toHaveURL(/\/#members$/);
  await page.getByRole("button", { name: "Next member profiles" }).click();
  expect(await page.getByRole("region", { name: "Member profiles" }).evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  await page.goto("/research#topic-02");
  await expect(page).toHaveURL(/\/#topic-02$/);
  await expect(page.locator("#topic-02")).toBeInViewport();
  await page.goto("/team");
  await expect(page).toHaveURL(/\/#members$/);
  await expect(page.locator("#members .section-heading")).toBeInViewport();
});

test("mobile navigation and skip link", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.click();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Members" }).click();
  await expect(page).toHaveURL(/\/#members$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});
