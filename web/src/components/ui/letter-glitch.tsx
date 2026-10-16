import { useEffect, useRef } from "react";

// A faint field of gray characters that flicker, and scramble under a mouse cursor.
// Inspired by the React Bits "Letter Glitch" background.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-=/<>[]{}";
const CELL = 18;
const RADIUS = 130;
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

type Cell = { glyph: string; base: number; glow: number };

export function LetterGlitch() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const color = getComputedStyle(element).color;
    let cells: Cell[] = [];
    let columns = 0;
    let rows = 0;
    let frame = 0;
    let visible = true;
    let last = 0;
    const pointer = { x: -9999, y: -9999, moved: false };

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const { width, height } = element.getBoundingClientRect();
      element.width = width * ratio;
      element.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.font = `500 13px "SFMono-Regular", Consolas, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      columns = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      // Only a sparse share of cells shows a character at rest.
      cells = Array.from({ length: columns * rows }, () => ({
        glyph: randomGlyph(),
        base: Math.random() < 0.12 ? 0.06 + Math.random() * 0.12 : 0,
        glow: 0,
      }));
      draw();
    };

    const draw = () => {
      context.clearRect(0, 0, element.width, element.height);
      context.fillStyle = color;
      for (let index = 0; index < cells.length; index++) {
        const cell = cells[index];
        const alpha = Math.min(0.75, cell.base + cell.glow);
        if (alpha < 0.01) continue;
        context.globalAlpha = alpha;
        context.fillText(cell.glyph, (index % columns) * CELL + CELL / 2, Math.floor(index / columns) * CELL + CELL / 2);
      }
      context.globalAlpha = 1;
    };

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (time - last < 50) return;
      last = time;
      // Background flicker: a few cells change character each step.
      for (let i = 0; i < cells.length * 0.01; i++) {
        const cell = cells[Math.floor(Math.random() * cells.length)];
        if (cell.base) cell.glyph = randomGlyph();
      }
      // Cells near the cursor scramble and brighten, then fade back.
      if (pointer.moved) {
        pointer.moved = false;
        const reach = Math.ceil(RADIUS / CELL);
        const cx = Math.floor(pointer.x / CELL);
        const cy = Math.floor(pointer.y / CELL);
        for (let y = Math.max(0, cy - reach); y <= Math.min(rows - 1, cy + reach); y++) {
          for (let x = Math.max(0, cx - reach); x <= Math.min(columns - 1, cx + reach); x++) {
            const distance = Math.hypot((x - cx) * CELL, (y - cy) * CELL);
            if (distance > RADIUS || Math.random() > 0.35) continue;
            const cell = cells[y * columns + x];
            cell.glyph = randomGlyph();
            cell.glow = Math.max(cell.glow, 0.55 * (1 - distance / RADIUS));
          }
        }
      }
      for (const cell of cells) if (cell.glow) cell.glow = cell.glow < 0.01 ? 0 : cell.glow * 0.9;
      draw();
    };

    const start = () => { if (!frame && visible && !reduced) frame = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = element.getBoundingClientRect();
      Object.assign(pointer, { x: event.clientX - rect.left, y: event.clientY - rect.top, moved: true });
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    const resizer = new ResizeObserver(resize);
    observer.observe(element);
    resizer.observe(element);
    window.addEventListener("pointermove", move, { passive: true });
    start();
    return () => {
      stop();
      observer.disconnect();
      resizer.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={canvas} className="letter-glitch" aria-hidden="true" />;
}
