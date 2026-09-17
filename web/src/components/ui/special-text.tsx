import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";

const SYMBOLS = "_!X$0-+*#";

/** A scroll-driven decode with stable word widths and readable assistive text. */
export function SpecialText({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "end 0.65"],
  });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", value => {
    setStep(Math.round(Math.max(0, Math.min(1, value)) * 60));
  });
  const progress = reduced ? 1 : step / 60;
  const revealed = Math.floor(progress * children.length);
  const visible = Array.from(children, (char, index) =>
    /\s/.test(char) || index < revealed || progress === 1
      ? char
      : SYMBOLS[(index * 7 + step * 3) % SYMBOLS.length]
  ).join("");
  return (
    <span ref={ref} className="special-text">
      <span className="special-text-accessible">{children}</span>
      <span aria-hidden="true">
        {Array.from(children.matchAll(/\S+|\s+/g)).map(match => {
          const word = match[0];
          const index = match.index;
          const decoded = visible.slice(index, index + word.length);
          return /\s/.test(word) ? word : (
            <span className="special-text-word" key={index}>
              <span className="special-text-measure">{word}</span>
              <span className="special-text-decoded">{decoded}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
