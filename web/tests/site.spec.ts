import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [375, 1440]) {
  test(`active navigation follows anchor destinations and scrolling at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page.goto("/#problem-statement");
    const nav = page.getByRole("navigation", { name: "Main navigation", includeHidden: true });
    await expect(nav.locator('a[href="#problem-statement"]')).toHaveAttribute("aria-current", "location");
    for (const id of ["objective", "research-endpoints", "members", "research-posters", "professors", "sponsors", "problem-statement", "description"]) {
      if (width < 1000) await page.getByRole("button", { name: "Open navigation" }).click();
      const link = nav.locator(`a[href="#${id}"]`);
      await link.click();
      await expect(link).toHaveAttribute("aria-current", "location");
      await expect(link).toHaveClass("active");
      await expect.poll(() => page.locator(`#${id}`).evaluate(el => Math.abs(el.getBoundingClientRect().top - (100 + parseFloat(getComputedStyle(el).scrollMarginTop))))).toBeLessThan(2);
      await expect(nav.locator('[aria-current="location"]')).toHaveCount(1);
    }
    await page.evaluate(() => document.getElementById("objective")!.scrollIntoView({ behavior: "instant" }));
    await expect(nav.locator('a[href="#objective"]')).toHaveAttribute("aria-current", "location");
  });
}

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
  await page.getByRole("button", { name: "Skip to last member" }).click();
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
  await expect(page.getByText("15 / LEARNING PATH MEMBERS")).toBeAttached();
  await expect(page.locator("#onboarding article")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Dr. Nayda Santiago" })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Dr. Alcibiades Bustillo" })).toBeAttached();
});

test("member cards open resume-ready profile endpoints", async ({ page }) => {
  await page.goto("/#members");
  await expect(page.locator(".team-profile")).toHaveCount(22);
  await expect(page.getByRole("heading", { name: "Joshua Roman", exact: true })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Kevin Beltran", exact: true })).toBeAttached();
  const profile = page.getByRole("link", { name: "Open profile for Joshua Rivera" });
  await expect(profile).toHaveAttribute("href", "#member/joshua-rivera");
  await profile.click();
  await expect(page).toHaveURL(/#member\/joshua-rivera$/);
  await expect(page.getByRole("dialog")).toContainText("Joshua Rivera");
  await expect(page.locator(".resume-pending")).toBeAttached();
    const positionBeforeClose = await page.evaluate(() => scrollY);
    await page.getByRole("button", { name: "Close member profile" }).click();
  await expect(page).toHaveURL(/#members$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect.poll(() => page.evaluate(previous => Math.abs(scrollY - previous), positionBeforeClose)).toBeLessThan(120);
  await page.locator(".profile-card-link").filter({ hasText: "Joshua Roman" }).click();
  await expect(page).toHaveURL(/#member\/joshua-roman$/);
  await expect(page.getByRole("dialog")).toContainText("Joshua Roman");
  await expect(page.getByRole("dialog")).toContainText("Parking Lot Reservation System");
  await page.getByRole("button", { name: "Close member profile" }).click();
  await page.getByRole("link", { name: "Open profile for Joshua Roman" }).click();
  await expect(page).toHaveURL(/#member\/joshua-roman$/);
  await expect(page.getByRole("dialog")).toContainText("Joshua Roman");
  await expect(page.getByRole("button", { name: "Close member profile" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/#members$/);
});

test("year switcher shows past research and persists in the URL", async ({ page }) => {
  await page.goto("/");
  const switcher = page.getByRole("radiogroup", { name: "Research year" });
  await expect(switcher.getByRole("radio", { name: "2026" })).toHaveAttribute("aria-checked", "true");
  await expect(page.locator("#problem-title")).toContainText("digital watermarks");
  await expect(page.locator(".conference-gallery")).toHaveCount(0);

  await switcher.getByRole("radio", { name: "2025" }).click();
  await expect(page).toHaveURL(/\?year=2025/);
  await expect(page.locator("#problem-title")).toContainText("preserving accuracy and robustness");
  await expect(page.locator("#research-topic-lora-fine-tuning")).toBeAttached();
  await expect(page.locator("#research-topic-digital-watermarking")).toHaveCount(0);
  await expect(page.locator(".conference-gallery")).toHaveCount(1);
  await expect(page.locator(".team-group-image")).toHaveCount(1);

  await page.reload();
  await expect(page.getByRole("radiogroup", { name: "Research year" }).getByRole("radio", { name: "2025" })).toHaveAttribute("aria-checked", "true");
  await expect(page.locator("#problem-title")).toContainText("preserving accuracy and robustness");

  await page.getByRole("radio", { name: "2025" }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("radio", { name: "2026" })).toBeFocused();
  await expect(page).not.toHaveURL(/year=/);
  await expect(page.locator(".conference-gallery")).toHaveCount(0);
});

test("year curtain always plays its full cover and reveal, even on a busy CPU", async ({ page }) => {
  await page.goto("/#description");
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 6 });
  await page.evaluate(() => {
    const events: string[] = [];
    (window as unknown as { curtainEvents: string[] }).curtainEvents = events;
    for (const type of ["animationend", "animationcancel"]) {
      document.addEventListener(type, event => {
        const { animationName } = event as AnimationEvent;
        if (animationName.startsWith("curtain")) events.push(`${type} ${animationName}`);
      }, true);
    }
  });
  await page.getByRole("radio", { name: "2025" }).click();
  await expect(page.locator(".year-curtain")).toHaveCount(0, { timeout: 10_000 });
  const events = await page.evaluate(() => (window as unknown as { curtainEvents: string[] }).curtainEvents);
  expect(events).toEqual(["animationend curtain-cover", "animationend curtain-reveal"]);
  await expect(page.locator("#problem-title")).toContainText("preserving accuracy and robustness");
});
