import { useEffect, type RefObject } from "react";

/** Circular arc inspired by the supplied gallery, with accessible HTML labels. */
export function useCircularGallery(rail: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    let frame = 0;
    const draw = () => {
      frame = 0;
      const center = element.clientWidth / 2;
      const radius = Math.max(650, element.clientWidth * 1.05);
      const cards = Array.from(element.children) as HTMLElement[];
      // Read layout before writing transforms to avoid layout thrashing.
      const positions = cards.map(card => card.offsetLeft - element.scrollLeft + card.offsetWidth / 2 - center);
      cards.forEach((card, index) => {
        const profile = card.querySelector<HTMLElement>(".team-profile");
        if (!profile) return;
        const x = Math.max(-radius * 0.65, Math.min(radius * 0.65, positions[index]));
        const y = Math.min(105, radius - Math.sqrt(radius * radius - x * x));
        const angle = Math.asin(x / radius) * 180 / Math.PI;
        profile.style.transform = enabled ? `translateY(${y}px) rotate(${angle}deg)` : "none";
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    element.addEventListener("scroll", schedule, { passive: true });
    draw();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener("scroll", schedule);
      element.querySelectorAll<HTMLElement>(".team-profile").forEach(card => { card.style.transform = ""; });
    };
  }, [rail, enabled]);
}
