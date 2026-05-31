"use client";

import { useEffect, useRef } from "react";

/**
 * A crisp, monochrome "data rain" of small numbers falling in the background —
 * 3·6·9 and hex digits, like an on-chain ledger streaming past. White on black
 * with the occasional gold glyph (⚡ZAPP accent). One canvas, DPR-capped, ~30fps,
 * pauses when off-screen / tab hidden, reduced-motion → a few static glyphs.
 * Sits far behind content, never blocks clicks.
 */
const GLYPHS = "369369369ABCDEF0123456789⚡".split("");

export function DigitalRain({
  className,
  density = 1,
}: {
  className?: string;
  density?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const FONT = 16; // logical px per glyph cell
    let cols = 0;
    let drops: number[] = [];
    let speeds: number[] = [];

    function size() {
      const w = cv!.clientWidth || window.innerWidth;
      const h = cv!.clientHeight || window.innerHeight;
      cv!.width = Math.floor(w * dpr);
      cv!.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.floor((w / FONT) * density);
      drops = new Array(cols).fill(0).map(() => Math.random() * (h / FONT));
      speeds = new Array(cols).fill(0).map(() => 0.25 + Math.random() * 0.5);
    }
    size();
    window.addEventListener("resize", size);

    let running = true;
    const io = new IntersectionObserver(
      (es) => {
        running = es[0].isIntersecting;
        if (running && !reduce) raf = requestAnimationFrame(frame);
      },
      { threshold: 0.01 },
    );
    io.observe(cv);

    let hidden = document.hidden;
    const onVis = () => {
      hidden = document.hidden;
      if (!hidden && running && !reduce) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    let raf = 0;
    let last = 0;
    function frame(now: number) {
      if (!running || hidden) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 55) return; // ~18fps — calm, cheap
      last = now;

      const w = cv!.clientWidth || window.innerWidth;
      const h = cv!.clientHeight || window.innerHeight;
      // fade the previous frame slightly for a soft trail (monochrome)
      ctx!.fillStyle = "rgba(0,0,0,0.16)";
      ctx!.fillRect(0, 0, w, h);
      ctx!.font = `${FONT}px ui-monospace, monospace`;
      ctx!.textBaseline = "top";

      for (let i = 0; i < cols; i++) {
        const x = (i / density) * FONT;
        const y = drops[i] * FONT;
        const g = GLYPHS[(Math.floor(y + i) % GLYPHS.length + GLYPHS.length) % GLYPHS.length];
        const gold = (i * 7 + Math.floor(drops[i])) % 23 === 0;
        // brightest at the leading glyph, dim behind
        ctx!.fillStyle = gold ? "rgba(255,215,0,0.85)" : "rgba(255,255,255,0.45)";
        ctx!.fillText(g, x, y);
        // head highlight
        ctx!.fillStyle = gold ? "rgba(255,235,150,0.95)" : "rgba(255,255,255,0.9)";
        ctx!.fillText(g, x, y);

        drops[i] += speeds[i];
        if (y > h && Math.random() > 0.975) drops[i] = -2;
      }
    }

    if (reduce) {
      // static sparse glyphs
      const w = cv.clientWidth, h = cv.clientHeight;
      ctx.font = `${FONT}px ui-monospace, monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      for (let i = 0; i < cols; i++) {
        ctx.fillText(GLYPHS[i % GLYPHS.length], (i / density) * FONT, ((i * 53) % h));
      }
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", size);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
