"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The Wardenclyffe tower as a majestic monument — refined SVG line-art in the
 * ⚡ZAPP palette (white linework, gold energy). An octagonal tapered lattice with
 * X-bracing rises to a great toroid crown; a white-hot orb breathes at the apex,
 * gold arcs flick off it, and energy motes rise through the structure. Premium,
 * architectural, alive. Reduced-motion → renders still. No assets, no WebGL.
 */
export function MajesticTower({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const W = 360;
  const H = 620;
  const cx = W / 2;

  // lattice nodes: 9 levels, tapering from wide base to narrow top
  const levels = 9;
  const baseY = 540;
  const topY = 150;
  const baseHalf = 95;
  const topHalf = 26;
  const node = (lvl: number, side: -1 | 1) => {
    const t = lvl / levels;
    const y = baseY + (topY - baseY) * t;
    const half = baseHalf + (topHalf - baseHalf) * t;
    return { x: cx + side * half, y };
  };

  const legL: string[] = [];
  const legR: string[] = [];
  const braces: string[] = [];
  const rings: { x1: number; x2: number; y: number }[] = [];
  for (let i = 0; i <= levels; i++) {
    const l = node(i, -1);
    const r = node(i, 1);
    legL.push(`${i === 0 ? "M" : "L"}${l.x} ${l.y}`);
    legR.push(`${i === 0 ? "M" : "L"}${r.x} ${r.y}`);
    rings.push({ x1: l.x, x2: r.x, y: l.y });
    if (i < levels) {
      const l2 = node(i + 1, -1);
      const r2 = node(i + 1, 1);
      braces.push(`M${l.x} ${l.y} L${r2.x} ${r2.y}`);
      braces.push(`M${r.x} ${r.y} L${l2.x} ${l2.y}`);
    }
  }

  const apex = { x: cx, y: topY };
  const orb = { x: cx, y: topY - 46 };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} fill="none" role="img" aria-label="The Wardenclyffe tower">
      <defs>
        <linearGradient id="mt-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="mt-orb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#FFE9A8" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mt-ground" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>
        <filter id="mt-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* grounding light pool */}
      <ellipse cx={cx} cy={baseY + 30} rx={140} ry={20} fill="url(#mt-ground)" />

      {/* lattice braces (faint) */}
      {braces.map((d, i) => (
        <path key={i} d={d} stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1" />
      ))}
      {/* horizontal rings */}
      {rings.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y} x2={r.x2} y2={r.y} stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.1" />
      ))}
      {/* the two legs (bright) */}
      <path d={legL.join(" ")} stroke="url(#mt-steel)" strokeWidth="2.4" strokeLinejoin="round" />
      <path d={legR.join(" ")} stroke="url(#mt-steel)" strokeWidth="2.4" strokeLinejoin="round" />
      {/* central mast */}
      <line x1={cx} y1={baseY} x2={cx} y2={topY} stroke="#FFD700" strokeOpacity="0.5" strokeWidth="1.4" />

      {/* the great toroid crown */}
      <ellipse cx={cx} cy={topY} rx={52} ry={15} stroke="#FFD700" strokeWidth="2.6" />
      <ellipse cx={cx} cy={topY - 5} rx={38} ry={10} stroke="#FFD700" strokeOpacity="0.5" strokeWidth="1.4" />
      {/* spires reaching to the orb */}
      {[-1, -0.5, 0, 0.5, 1].map((k, i) => (
        <line key={i} x1={cx + k * 50} y1={topY} x2={orb.x} y2={orb.y + 8} stroke="#FFD700" strokeOpacity="0.55" strokeWidth="1.1" />
      ))}

      {/* breathing energy orb */}
      <motion.circle
        cx={orb.x}
        cy={orb.y}
        r={40}
        fill="url(#mt-orb)"
        filter="url(#mt-glow)"
        animate={reduce ? undefined : { r: [34, 44, 34], opacity: [0.7, 1, 0.7] }}
        transition={reduce ? undefined : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx={orb.x} cy={orb.y} r={6} fill="#ffffff" />

      {/* gold arcs flicking off the orb */}
      {[
        `M${orb.x} ${orb.y} L${orb.x - 30} ${orb.y - 26} L${orb.x - 22} ${orb.y - 44}`,
        `M${orb.x} ${orb.y} L${orb.x + 34} ${orb.y - 20} L${orb.x + 26} ${orb.y - 40}`,
        `M${orb.x} ${orb.y} L${orb.x + 18} ${orb.y - 40} L${orb.x + 30} ${orb.y - 54}`,
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="#FFD700"
          strokeWidth="1.4"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 3px #FFD700)" }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={reduce ? { pathLength: 1, opacity: 0.4 } : { pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
          transition={reduce ? undefined : { duration: 0.6, repeat: Infinity, repeatDelay: 1.5 + i * 0.7, ease: "easeOut" }}
        />
      ))}

      {/* energy motes rising through the lattice */}
      {!reduce
        ? [0, 1, 2, 3, 4].map((i) => (
            <motion.circle
              key={i}
              cx={cx + (i - 2) * 22}
              r={1.8}
              fill="#FFD700"
              initial={{ cy: baseY, opacity: 0 }}
              animate={{ cy: [baseY, topY], opacity: [0, 1, 0] }}
              transition={{ duration: 3.5 + i, repeat: Infinity, delay: i * 0.8, ease: "easeIn" }}
            />
          ))
        : null}
    </svg>
  );
}
