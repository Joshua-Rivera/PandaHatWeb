import { useEffect, useRef, useState, type RefObject } from "react";
import { useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";

import { useMobile, useMobileReducedMotion } from "./use-mobile";
import { MobileScrollText } from "./mobile-text";

const SYMBOLS = "_!X$0-+*#";

/** Scroll and hover decoding over a stable, selectable copy of the original text. */
export function SpecialText({ children, hoverOnly = false }: { children: string; hoverOnly?: boolean }) {
  const mobile = useMobile();
  const reduced = useMobileReducedMotion();
  if (mobile) return hoverOnly || reduced
    ? <span className="special-text mobile-plain-text">{children}</span>
    : <MobileScrollText>{children}</MobileScrollText>;
  return hoverOnly ? <DecodeText>{children}</DecodeText> : <ScrollText>{children}</ScrollText>;
}

function ScrollText({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "end 0.65"],
  });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", value => {
    setStep(Math.round(Math.max(0, Math.min(1, value)) * 60));
  });
  return <DecodeText targetRef={ref} step={step}>{children}</DecodeText>;
}

function DecodeText({ children, targetRef, step = 60 }: {
  children: string;
  targetRef?: RefObject<HTMLSpanElement | null>;
  step?: number;
}) {
  const localRef = useRef<HTMLSpanElement>(null);
  const ref = targetRef ?? localRef;
  const reduced = useReducedMotion();
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const [reading, setReading] = useState(false);
  const animation = useRef(0);
  const reveal = () => {
    cancelAnimationFrame(animation.current);
    setHoverStep(null);
    setReading(true);
  };
  useEffect(() => {
    const onSelection = () => {
      const selection = window.getSelection();
      if (ref.current && selection && !selection.isCollapsed && selection.containsNode(ref.current, true)) {
        cancelAnimationFrame(animation.current);
        setHoverStep(null);
        setReading(true);
      }
    };
    document.addEventListener("selectionchange", onSelection);
    return () => {
      cancelAnimationFrame(animation.current);
      document.removeEventListener("selectionchange", onSelection);
    };
  }, [ref]);
  const decodeStep = hoverStep ?? step;
  const progress = reduced || reading ? 1 : decodeStep / 60;
  const revealed = Math.floor(progress * children.length);
  const visible = Array.from(children, (char, index) =>
    /\s/.test(char) || index < revealed || progress === 1
      ? char
      : SYMBOLS[(index * 7 + decodeStep * 3) % SYMBOLS.length]
  ).join("");
  return (
    <span
      ref={ref}
      className="special-text"
      onPointerDown={reveal}
      onPointerEnter={event => {
        if (event.pointerType !== "mouse" || reduced) return;
        if (event.buttons || !window.getSelection()?.isCollapsed) {
          reveal();
          return;
        }
        cancelAnimationFrame(animation.current);
        setReading(false);
        setHoverStep(0);
        const start = performance.now();
        const tick = (now: number) => {
          const next = Math.min(60, Math.floor((now - start) / 12));
          setHoverStep(next);
          if (next < 60) animation.current = requestAnimationFrame(tick);
        };
        animation.current = requestAnimationFrame(tick);
      }}
      onPointerLeave={() => {
        cancelAnimationFrame(animation.current);
        setHoverStep(null);
      }}
    >
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
