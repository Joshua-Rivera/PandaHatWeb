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
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Research posters" }).click();
  await expect(page).toHaveURL(/\/#research-posters$/);
  await expect(page.locator("#research-posters .section-heading")).toBeInViewport();
  const poster = page.locator("#research-posters .featured-poster img");
  await expect(poster).toHaveCount(1);
  await poster.scrollIntoViewIfNeeded();
  await expect.poll(() => poster.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Members" }).click();
  await expect(page).toHaveURL(/\/#members$/);
  await page.getByRole("button", { name: "Next member profiles" }).click();
  expect(await page.getByRole("region", { name: "Member profiles" }).evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  await page.goto("/research#topic-02");
  await expect(page).toHaveURL(/\/#research-posters$/);
  await expect(page.locator("#research-posters .section-heading")).toBeInViewport();
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

test("research endpoints and cohort onboarding are discoverable", async ({ page }) => {
  await page.goto("/#research-endpoints");
  await expect(page.locator("#research-endpoints")).toBeAttached();
  await expect(page.locator(".endpoint-card")).toHaveCount(3);
  await expect(page.locator(".endpoint-detail")).toHaveCount(3);
  await expect(page.locator("#research-topic-digital-watermarking")).toBeAttached();
  await expect(page.locator("#research-topic-deepfake-analysis")).toBeAttached();
  await expect(page.locator("#research-topic-media-authenticity")).toBeAttached();
  await expect(page.getByText("07 / FULL-TIME RESEARCHERS")).toBeAttached();
  await expect(page.getByText("16 / LEARNING PATH MEMBERS")).toBeAttached();
  await expect(page.locator("#onboarding article")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Dr. Nayda Santiago" })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Dr. Alcibiades Bustillo" })).toBeAttached();
});

test("member cards open resume-ready profile endpoints", async ({ page }) => {
  await page.goto("/#members");
  await expect(page.locator(".team-profile")).toHaveCount(23);
  await expect(page.getByText("Diego Espinal")).toBeAttached();
  await expect(page.getByText("Kevin Beltran")).toBeAttached();
  const profile = page.getByRole("link", { name: "Open profile for Joshua Rivera" });
  await expect(profile).toHaveAttribute("href", "#member/joshua-rivera");
  await profile.click();
  await expect(page).toHaveURL(/#member\/joshua-rivera$/);
  await expect(page.getByRole("dialog")).toContainText("Joshua Rivera");
  await expect(page.getByText("RESUME / PENDING APPROVAL")).toBeAttached();
    const positionBeforeClose = await page.evaluate(() => scrollY);
    await page.getByRole("button", { name: "Close member profile" }).click();
  await expect(page).toHaveURL(/#members$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect.poll(() => page.evaluate(previous => Math.abs(scrollY - previous), positionBeforeClose)).toBeLessThan(120);
  await page.locator(".profile-card-link").filter({ hasText: "Diego Espinal" }).click();
  await expect(page).toHaveURL(/#member\/diego-espinal$/);
  await expect(page.getByRole("dialog")).toContainText("Diego Espinal");
  await expect(page.getByRole("dialog")).toContainText("PonceSpot parking lot management system");
  await page.getByRole("button", { name: "Close member profile" }).click();
  await page.getByRole("link", { name: "Open profile for Diego Espinal" }).click();
  await expect(page).toHaveURL(/#member\/diego-espinal$/);
  await expect(page.getByRole("dialog")).toContainText("Diego Espinal");
  await expect(page.getByRole("button", { name: "Close member profile" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/#members$/);
});
