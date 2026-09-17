// Scroll composition adapted from the Hyperiux Vault stack-spread reference.
import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import "./stack-spread.css";

type Card = {
  image: number;
  w: number;
  h: number;
  x: number;
  y: number;
  angle: number;
  end: [number, number];
};
// Coordinates share one design space, so the lettering lines up across every card.
// Swap the local placeholder files to change the photographs without changing masks.
const CARDS: Card[] = [
  { image: 1, w: 220, h: 155, x: 440, y: 270, angle: -18, end: [330, 110] },
  { image: 8, w: 220, h: 210, x: 765, y: 255, angle: 20, end: [1000, 130] },
  { image: 3, w: 225, h: 210, x: 345, y: 365, angle: -5, end: [130, 375] },
  { image: 4, w: 300, h: 210, x: 580, y: 280, angle: -2, end: [680, 125] },
  { image: 5, w: 240, h: 200, x: 825, y: 365, angle: 6, end: [1060, 390] },
  { image: 6, w: 275, h: 175, x: 470, y: 445, angle: 6, end: [280, 620] },
  { image: 7, w: 250, h: 165, x: 685, y: 435, angle: 3, end: [640, 635] },
  { image: 2, w: 200, h: 140, x: 865, y: 475, angle: -7, end: [990, 625] },
];
const MOBILE_END = [[170, 100], [430, 100], [160, 270], [430, 270], [160, 630], [430, 630], [170, 805], [430, 805]];
const originalTransform = (c: Card) => `translate(${c.x} ${c.y}) rotate(${c.angle})`;

function PhotoCard({ card, index, progress, small, id }: {
  card: Card; index: number; progress: MotionValue<number>; small: boolean; id: string;
}) {
  const { w, h } = card;
  const transform = useTransform(progress, (p) => {
    const startScale = small ? 0.62 : 1;
    const startX = small ? 300 + (card.x - 600) * startScale : card.x;
    const startY = small ? 450 + (card.y - 370) * startScale : card.y;
    const [endX, endY] = small ? MOBILE_END[index] : card.end;
    const endScale = small ? Math.min(225 / w, 145 / h) : 1;
    // A small alternating twist settles into a relaxed tilt. At p=0 the
    // original transform is exact, keeping the PandaHat stencil aligned.
    const direction = index % 2 === 0 ? -1 : 1;
    const tilt = direction * (small ? 2 : 3);
    const twist = Math.sin(p * Math.PI) * direction * (small ? 4 : 7);
    const angle = card.angle * (1 - p) + tilt * p + twist;
    return `translate(${startX + (endX - startX) * p}px, ${startY + (endY - startY) * p}px) rotate(${angle}deg) scale(${startScale + (endScale - startScale) * p})`;
  });
  const clip = `${id}-clip-${index}`;
  const mask = `${id}-mask-${index}`;
  return (
    <motion.g style={{ transform, originX: 0, originY: 0, transformBox: "view-box" }} data-collage-card={index}>
      <defs>
        <clipPath id={clip}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx="9" /></clipPath>
        {/* Keep only lettering actually visible on this card in the original stack.
            Higher cards occlude it; hidden fragments must not reappear after spreading.
            Inset occluders slightly so antialiased clip edges do not leave dark
            hairline seams through the shared lettering. */}
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="740">
          <rect width="1200" height="740" fill="white" />
          {CARDS.slice(index + 1).map((front) => (
            <rect key={front.image} transform={originalTransform(front)} x={-front.w / 2 + 0.6} y={-front.h / 2 + 0.6} width={front.w - 1.2} height={front.h - 1.2} rx="8.4" fill="black" />
          ))}
        </mask>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <image href={`/images/collage/placeholder-${card.image}.jpg`} x={-w / 2} y={-h / 2} width={w} height={h} preserveAspectRatio="xMidYMid slice" />
        {/* Invert the initial card transform: all text starts aligned in world space,
            then remains permanently attached to its own moving photograph. */}
        <g transform={`rotate(${-card.angle}) translate(${-card.x} ${-card.y})`}>
          <text x="600" y="422" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="142" fontWeight="900" letterSpacing="-7" fill="var(--collage-bg)" stroke="#141414" strokeWidth="1.5" strokeLinejoin="round" paintOrder="stroke fill" mask={`url(#${mask})`}>PandaHat</text>
        </g>
      </g>
    </motion.g>
  );
}

export default function StackSpread() {
  const ref = useRef<HTMLElement>(null);
  const id = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const [small, setSmall] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setSmall(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useTransform(scrollYProgress, [0, 0.08, 0.85, 1], [0, 0, 1, 1]);
  const cardProgress = useTransform(progress, (p) => reduced ? 1 : p);
  const copyOpacity = useTransform(progress, (p) => reduced ? 1 : Math.min(1, Math.max(0, (p - 0.6) / 0.3)));
  const hintOpacity = useTransform(progress, [0, 0.12], [1, 0]);
  return (
    <section ref={ref} className={`stack-spread${reduced ? " is-reduced" : ""}`} aria-label="PandaHat introduction">
      <div className="stack-spread-stage">
        <h1 className="collage-accessible-title">PandaHat Adversarial</h1>
        <motion.div className="stack-spread-copy" style={{ opacity: copyOpacity }} aria-hidden="true">
          <span>Adversarial</span>
        </motion.div>
        <svg className="stack-spread-art" viewBox={small ? "0 0 600 900" : "0 0 1200 740"} aria-hidden="true">
          {CARDS.map((card, index) => <PhotoCard key={card.image} card={card} index={index} progress={cardProgress} small={small} id={id} />)}
        </svg>
        {!reduced && <motion.div className="stack-spread-hint" style={{ opacity: hintOpacity }} aria-hidden="true">SCROLL TO EXPLORE<span>↓</span></motion.div>}
      </div>
    </section>
  );
}
