import { test, expect } from "@playwright/test";
for (const width of [375, 1440]) {
  test(`members roles and vertical-to-horizontal scrolling at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/#members");
    const section = page.locator("#members");
    const rail = page.getByRole("region", { name: "Member profiles" });
    await expect(section).toHaveClass(/is-pinned/);
    await expect(section.locator(".team-profile")).toHaveCount(23);
    const roles = await section.locator(".profile-role").allTextContents();
    expect(roles.filter(role => role === "PM")).toHaveLength(1);
    expect(roles.filter(role => role === "Co-PM")).toHaveLength(1);
    expect(roles.filter(role => role === "TL · Team Leader")).toHaveLength(5);
    expect(roles.filter(role => role === "Regular member")).toHaveLength(16);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(450);
    expect((await section.locator(".members-stage").boundingBox())!.y).toBeCloseTo(0, 0);
    await page.mouse.wheel(0, -300);
    await expect.poll(() => rail.evaluate(el => el.scrollLeft)).toBeLessThan(400);
    const remaining = await rail.evaluate(el => el.scrollWidth - el.clientWidth - el.scrollLeft);
    await page.mouse.wheel(0, remaining + 500);
    await expect.poll(() => rail.evaluate(el => el.scrollWidth - el.clientWidth - el.scrollLeft)).toBeLessThan(2);
    await expect(page.locator("#research-posters .section-heading")).toBeInViewport();
  });
}
