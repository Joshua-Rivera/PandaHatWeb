import { useEffect, useRef } from "react";

const SYMBOLS = "_!X$0-+*#";
type Entry = { element: HTMLElement; draw: (step: number) => void; reveal: () => void };
const entries = new Map<Element, Entry>();
const active = new Set<Entry>();
let observer: IntersectionObserver | undefined;
let frame = 0;
function update() {
  frame = 0;
  // Batch measurements before changing any text.
  const steps = [...active].map(entry => {
    const rect = entry.element.getBoundingClientRect();
    return { entry, step: Math.round(Math.max(0, Math.min(1, (innerHeight * .95 - rect.top) / (rect.height + innerHeight * .3))) * 60) };
  });
  steps.forEach(({ entry, step }) => entry.draw(step));
}
function schedule() { if (active.size && !frame) frame = requestAnimationFrame(update); }
function selectionChanged() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;
  for (const entry of entries.values()) {
    if (selection.containsNode(entry.element, true)) entry.reveal();
  }
}
function register(entry: Entry) {
  if (!observer) {
    observer = new IntersectionObserver(changes => {
      for (const change of changes) {
        const item = entries.get(change.target);
        if (!item) continue;
        if (change.isIntersecting) active.add(item);
        else { active.delete(item); item.draw(60); }
      }
      schedule();
    }, { rootMargin: "200px 0px" });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("selectionchange", selectionChanged);
  }
  entries.set(entry.element, entry);
  observer.observe(entry.element);
  return () => {
    observer?.unobserve(entry.element);
    active.delete(entry); entries.delete(entry.element);
    if (!entries.size) {
      observer?.disconnect(); observer = undefined; cancelAnimationFrame(frame); frame = 0;
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
      document.removeEventListener("selectionchange", selectionChanged);
    }
  };
}

/** Only nearby mobile scroll text updates; React never rerenders animation frames. */
export function MobileScrollText({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reveal = useRef(() => {});
  useEffect(() => {
    const element = ref.current!;
    const words = Array.from(element.querySelectorAll<HTMLElement>(".special-text-decoded"));
    const matches = Array.from(children.matchAll(/\S+/g));
    let previous = 60;
    let reading = false;
    const draw = (step: number) => {
      if (reading) step = 60;
      if (step === previous) return;
      previous = step;
      const revealed = Math.floor(step / 60 * children.length);
      words.forEach((word, wordIndex) => {
        const match = matches[wordIndex];
        word.textContent = Array.from(match[0], (char, index) => {
          const position = match.index + index;
          return step === 60 || position < revealed ? char : SYMBOLS[(position * 7 + step * 3) % SYMBOLS.length];
        }).join("");
      });
    };
    reveal.current = () => { reading = true; draw(60); };
    return register({ element, draw, reveal: () => reveal.current() });
  }, [children]);
  return <span ref={ref} className="special-text mobile-scroll-text" onPointerDown={() => reveal.current()}>
    <span className="special-text-accessible">{children}</span>
    <span aria-hidden="true">{Array.from(children.matchAll(/\S+|\s+/g)).map(match => /\s/.test(match[0]) ? match[0] :
      <span className="special-text-word" key={match.index}><span className="special-text-measure">{match[0]}</span><span className="special-text-decoded">{match[0]}</span></span>
    )}</span>
  </span>;
}
