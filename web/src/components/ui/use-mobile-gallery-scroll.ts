import { useEffect, useState, type RefObject } from "react";

export function useMobileGalleryScroll(section: RefObject<HTMLElement | null>, rail: RefObject<HTMLDivElement | null>, mobile: boolean, pinned: boolean, travel: number, overflow: number) {
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const element = rail.current;
    const container = section.current;
    if (!mobile || !element || !container) return;
    let visible = false;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (pinned) {
        const left = Math.max(0, Math.min(travel, -container.getBoundingClientRect().top - overflow));
        if (Math.abs(element.scrollLeft - left) > .5) element.scrollLeft = left;
      }
      const start = element.scrollLeft <= 2;
      const end = element.scrollLeft >= travel - 2;
      setEdges(previous => previous.start === start && previous.end === end ? previous : { start, end });
    };
    const schedule = () => { if (visible && !frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        window.addEventListener("scroll", schedule, { passive: true });
        element.addEventListener("scroll", schedule, { passive: true });
        schedule();
      } else {
        window.removeEventListener("scroll", schedule); element.removeEventListener("scroll", schedule);
        cancelAnimationFrame(frame); frame = 0;
      }
    }, { rootMargin: "200px 0px" });
    observer.observe(container);
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule); element.removeEventListener("scroll", schedule);
    };
  }, [section, rail, mobile, pinned, travel, overflow]);
  return edges;
}
