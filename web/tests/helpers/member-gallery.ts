import { expect, type Page } from "@playwright/test";

export async function alignMemberGallery(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  const section = page.locator("#members");
  await expect(section).toHaveClass(/is-pinned/);
  // Initial hash navigation can precede the gallery's ResizeObserver layout.
  // Re-align after that layout and verify the starting point before wheel input.
  await expect.poll(async () => section.evaluate(element => {
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - padding, behavior: "instant" });
    return Math.abs(element.getBoundingClientRect().top - padding);
  })).toBeLessThan(1);
  await expect.poll(() => section.evaluate(element => {
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    return Math.abs(element.getBoundingClientRect().top - padding);
  })).toBeLessThan(1);
}

export async function centerMemberCard(page: Page, name: string) {
  const link = page.getByRole("link", { name: `Open profile for ${name}`, exact: true });
  // The pinned gallery maps document scrolling to horizontal travel. Native
  // scrollIntoView fights that mapping and can leave a rotated neighbor on top.
  await link.evaluate(element => {
    const section = element.closest<HTMLElement>("#members")!;
    const rail = element.closest<HTMLElement>(".members-track")!;
    const card = element.closest(".team-profile")!.parentElement!;
    const stage = section.querySelector<HTMLElement>(".members-stage")!;
    const target = Math.max(0, Math.min(rail.scrollWidth - rail.clientWidth,
      card.offsetLeft + card.offsetWidth / 2 - rail.clientWidth / 2));
    const overflow = Math.max(0, stage.offsetHeight - innerHeight);
    window.scrollTo({ top: scrollY + section.getBoundingClientRect().top + overflow + target, behavior: "instant" });
  });
  await expect.poll(() => link.evaluate(element => {
    const rail = element.closest(".members-track")!;
    const card = element.getBoundingClientRect();
    const bounds = rail.getBoundingClientRect();
    return Math.abs((card.left + card.right) / 2 - (bounds.left + bounds.right) / 2);
  })).toBeLessThan(2);
  await expect(link).toBeInViewport();
  // Keep actionability checks: an overlapping card must still fail this test.
  await link.click({ trial: true });
  return link;
}
