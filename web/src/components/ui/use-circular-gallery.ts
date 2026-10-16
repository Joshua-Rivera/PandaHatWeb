import { useEffect, type RefObject } from "react";

/** Circular arc inspired by the supplied gallery, with accessible HTML labels. */
export function useCircularGallery(rail: RefObject<HTMLDivElement | null>, enabled: boolean, mobile = false) {
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    let frame = 0;
    let visible = !mobile;
    let geometry: { card: HTMLElement; profile: HTMLElement | null; center: number; width: number }[] = [];
    const measure = () => {
      geometry = Array.from(element.children, child => {
        const card = child as HTMLElement;
        return { card, profile: card.querySelector<HTMLElement>(".team-profile"), center: card.offsetLeft + card.offsetWidth / 2, width: card.offsetWidth };
      });
    };
    measure();
    const draw = () => {
      frame = 0;
      const center = element.clientWidth / 2;
      const radius = Math.max(650, element.clientWidth * 1.05);
      const scrollLeft = element.scrollLeft;
      const items = mobile ? geometry : Array.from(element.children, child => {
        const card = child as HTMLElement;
        return { card, profile: card.querySelector<HTMLElement>(".team-profile"), center: card.offsetLeft + card.offsetWidth / 2, width: card.offsetWidth };
      });
      items.forEach(({ card, profile, center: cardCenter, width }) => {
        const position = cardCenter - scrollLeft - center;
        if (mobile && Math.abs(position) > center + width * 1.5) return;
        // Warm up the next card before it slides onscreen.
        if (mobile) card.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach(image => { image.loading = "eager"; });
        if (!profile) return;
        const x = Math.max(-radius * 0.65, Math.min(radius * 0.65, position));
        const y = Math.min(105, radius - Math.sqrt(radius * radius - x * x));
        const angle = Math.asin(x / radius) * 180 / Math.PI;
        profile.style.transform = enabled ? `translateY(${y}px) rotate(${angle}deg)` : "none";
      });
    };
    const schedule = () => { if (visible && !frame) frame = requestAnimationFrame(draw); };
    const observer = new ResizeObserver(() => { measure(); schedule(); });
    observer.observe(element);
    element.addEventListener("scroll", schedule, { passive: true });
    const visibility = mobile ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { measure(); schedule(); }
      else { cancelAnimationFrame(frame); frame = 0; }
    }, { rootMargin: "200px 0px" }) : undefined;
    visibility?.observe(element);
    if (!mobile) draw();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility?.disconnect();
      element.removeEventListener("scroll", schedule);
      element.querySelectorAll<HTMLElement>(".team-profile").forEach(card => { card.style.transform = ""; });
    };
  }, [rail, enabled, mobile]);
}
