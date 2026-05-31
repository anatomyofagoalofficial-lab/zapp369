"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Branching electric arcs that crackle across the screen — "electricity
 * everywhere", in ⚡ZAPP gold/white. Pure animated SVG, deterministic (SSR-safe),
 * sits behind content, never blocks clicks. Reduced-motion → renders a couple of
 * static faint arcs.
 *
 * `tone` tints the bolts: "gold" (default, retro Tesla) or "cyan" (future).
 */
const ARCS = [
  { x: 12, delay: 0.0, gap: 5 },
  { x: 28, delay: 1.3, gap: 7 },
  { x: 47, delay: 2.6, gap: 6 },
  { x: 66, delay: 0.8, gap: 8 },
  { x: 84, delay: 3.4, gap: 5 },
].map((a, i) => {
  // jagged main bolt + a couple of forks
  let d = `M${a.x} -4`;
  let cx = a.x;
  let cy = -4;
  const forks: string[] = [];
  for (let s = 0; s < 9; s++) {
    cy += 8 + ((i * 7 + s * 13) % 6);
    cx += (((i * 5 + s * 11) % 14) - 7);
    d += ` L${cx} ${cy}`;
    if (s === 3 || s === 6) {
      const fx = cx + (((i + s) % 2 ? 1 : -1) * (6 + (s % 3)));
      forks.push(`M${cx} ${cy} L${fx} ${cy + 7} L${fx - 3} ${cy + 13}`);
    }
  }
  return { d, forks, delay: a.delay, gap: a.gap };
});

export function ElectricArcs({
  tone = "gold",
  className,
}: {
  tone?: "gold" | "cyan";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const color = tone === "cyan" ? "#22D3EE" : "#FFE08a";
  const glow = tone === "cyan" ? "#22D3EE" : "#FFD700";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      {ARCS.map((a, i) => (
        <g key={i} style={{ filter: `drop-shadow(0 0 1.2px ${glow})` }}>
          <motion.path
            d={a.d}
            fill="none"
            stroke={color}
            strokeWidth={0.35}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              reduce
                ? { pathLength: 1, opacity: 0.18 }
                : { pathLength: [0, 1, 1], opacity: [0, 0.9, 0] }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.6, delay: a.delay, repeat: Infinity, repeatDelay: a.gap, ease: "easeOut" }
            }
          />
          {!reduce
            ? a.forks.map((f, j) => (
                <motion.path
                  key={j}
                  d={f}
                  fill="none"
                  stroke={color}
                  strokeWidth={0.2}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1], opacity: [0, 0.7, 0] }}
                  transition={{ duration: 0.5, delay: a.delay + 0.1, repeat: Infinity, repeatDelay: a.gap, ease: "easeOut" }}
                />
              ))
            : null}
        </g>
      ))}
    </svg>
  );
}
