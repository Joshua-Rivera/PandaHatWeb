import { useEffect, useRef } from "react";
import { useMobileReducedMotion } from "./use-mobile";
import cards from "./collage-cards.json";

const destinations = [[170, 100], [430, 100], [160, 270], [430, 270], [160, 630], [430, 630], [170, 805], [430, 805]];
const clamp = (value: number) => Math.max(0, Math.min(1, value));
function transform(index: number, progress: number) {
  const card = cards[index];
  const x = 300 + (card.x - 600) * .62;
  const y = 450 + (card.y - 370) * .62;
  const [endX, endY] = destinations[index];
  const scale = .62 + (Math.min(225 / card.w, 145 / card.h) - .62) * progress;
  const direction = index % 2 === 0 ? -1 : 1;
  const angle = card.angle * (1 - progress) + direction * 2 * progress + Math.sin(progress * Math.PI) * direction * 4;
  return `translate(${(x + (endX - x) * progress - card.w / 2) / card.w * 100}%, ${(y + (endY - y) * progress - card.h / 2) / card.h * 100}%) rotate(${angle}deg) scale(${scale})`;
}
// Sample the original curved path; native interpolation runs without JS scroll work.
const animationCSS = cards.map((_, index) => `@keyframes mobile-card-${index} {
  0%, 8% { transform: ${transform(index, 0)}; }
  ${Array.from({ length: 24 }, (_, step) => {
    const progress = (step + 1) / 24;
    return `${8 + 77 * progress}% { transform: ${transform(index, progress)}; }`;
  }).join("\n")}
  100% { transform: ${transform(index, 1)}; }
}`).join("\n");

export function MobileCollage() {
  const section = useRef<HTMLElement>(null);
  const reduced = useMobileReducedMotion();
  const native = CSS.supports("animation-timeline: view()") && CSS.supports("animation-range: contain 0% contain 100%");
  useEffect(() => {
    const element = section.current;
    if (!element || reduced || native) return;
    const images = Array.from(element.querySelectorAll<HTMLElement>("[data-collage-card]"));
    const copy = element.querySelector<HTMLElement>(".stack-spread-copy")!;
    const hint = element.querySelector<HTMLElement>(".stack-spread-hint")!;
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const stageHeight = element.querySelector(".stack-spread-stage")!.clientHeight;
      const raw = clamp(-rect.top / Math.max(1, rect.height - stageHeight));
      const progress = clamp((raw - .08) / .77);
      images.forEach((image, index) => { image.style.transform = transform(index, progress); });
      copy.style.opacity = String(clamp((progress - .6) / .3));
      hint.style.opacity = String(1 - clamp(progress / .12));
    };
    const schedule = () => { if (visible && !frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      // Set an exact end pose when leaving the viewport, including fast jumps.
      if (!frame) frame = requestAnimationFrame(update);
    });
    observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
    };
  }, [native, reduced]);
  return <section ref={section} className={`stack-spread mobile-collage${reduced ? " is-reduced" : ""}`} data-native-scroll={native && !reduced} aria-label="PandaHat introduction">
    <style>{animationCSS}</style>
    <div className="stack-spread-stage">
      <h1 className="collage-accessible-title">PandaHat Adversarial</h1>
      <div className="stack-spread-copy" aria-hidden="true" style={{ opacity: reduced ? 1 : 0 }}><span>Adversarial</span></div>
      <div className="mobile-collage-art" aria-hidden="true">
        {cards.map((card, index) => <img key={card.image} data-collage-card={index}
          src={`/images/collage-mobile/card-${index + 1}.webp`} alt="" width={card.w * 2} height={card.h * 2}
          decoding="async" fetchPriority={index === cards.length - 1 ? "high" : "auto"}
          style={{ width: `${card.w / 6}%`, height: `${card.h / 9}%`, transform: transform(index, reduced ? 1 : 0), animationName: `mobile-card-${index}` }} />)}
      </div>
      {!reduced && <div className="stack-spread-hint" aria-hidden="true">SCROLL TO EXPLORE<span className="stack-spread-arrow">↓</span></div>}
    </div>
  </section>;
}
