import { test, expect } from "@playwright/test";
for (const { width, height } of [{ width: 375, height: 900 }, { width: 1440, height: 900 }, { width: 1440, height: 600 }]) {
  test(`members roles and vertical-to-horizontal scrolling at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/#members");
    // Font loading can change the gallery height after its first layout.
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("#members");
    const rail = page.getByRole("region", { name: "Member profiles" });
    await expect(section).toHaveClass(/is-pinned/);
    await expect(section.locator(".team-profile")).toHaveCount(23);
    const roles = await section.locator(".profile-role").allTextContents();
    expect(roles.filter(role => role === "PM")).toHaveLength(1);
    expect(roles.filter(role => role === "Co-PM")).toHaveLength(1);
    expect(roles.filter(role => role === "TL · Team Leader")).toHaveLength(5);
    expect(roles.filter(role => role === "Learning path member")).toHaveLength(16);
    await expect(section.locator(".members-progress")).toHaveCount(0);
    await expect(rail).toHaveCSS("scrollbar-width", "none");
    const stage = section.locator(".members-stage");
    const overflow = await stage.evaluate(el => Math.max(0, (el as HTMLElement).offsetHeight - window.innerHeight));
    await page.mouse.wheel(0, 600 + overflow);
    await expect.poll(() => rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(450);
    await expect.poll(() => stage.evaluate(el => {
      const currentOverflow = Math.max(0, (el as HTMLElement).offsetHeight - innerHeight);
      return Math.abs(el.getBoundingClientRect().y + currentOverflow);
    })).toBeLessThan(0.5);
    await page.mouse.wheel(0, -300);
    await expect.poll(() => rail.evaluate(el => el.scrollLeft)).toBeLessThan(400);
    const remaining = await rail.evaluate(el => el.scrollWidth - el.clientWidth - el.scrollLeft);
    await page.mouse.wheel(0, remaining + 500);
    await expect.poll(() => rail.evaluate(el => el.scrollWidth - el.clientWidth - el.scrollLeft)).toBeLessThan(2);
    await expect(page.locator(".team-group-card")).toBeInViewport();
    await page.locator("#research-posters .section-heading").scrollIntoViewIfNeeded();
    await expect(page.locator("#research-posters .section-heading")).toBeInViewport();
  });
}
