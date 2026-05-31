"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The Wardenclyffe tower as a piece of art, not a blueprint:
 * Brâncuší essential forms (a great smooth dome/egg crowning the structure,
 * stacked tapering rings like the Endless Column) fused with Gaudí organic
 * curves (catenary legs that swell and narrow, branching tendrils, a trencadís
 * shimmer of light). Gold energy gathers and pulses at the crown.
 *
 * Pure SVG, no assets. Subtle living motion (energy breathes, arcs flicker).
 * Reduced-motion safe (renders still).
 */
export function WardenclyffeTower({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 300 560"
      className={className}
      fill="none"
      aria-label="The Wardenclyffe tower"
      role="img"
    >
      <defs>
        <linearGradient id="wt-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4E8D0" />
          <stop offset="45%" stopColor="#E8B547" />
          <stop offset="100%" stopColor="#7A2E2E" />
        </linearGradient>
        <linearGradient id="wt-dome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF3D0" />
          <stop offset="55%" stopColor="#E8B547" />
          <stop offset="100%" stopColor="#9a6a1e" />
        </linearGradient>
        <radialGradient id="wt-crown" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF7DA" />
          <stop offset="40%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>
        <filter id="wt-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* ── Crown energy: the gathered free energy, breathing ── */}
      <motion.circle
        cx="150"
        cy="78"
        r="46"
        fill="url(#wt-crown)"
        animate={reduce ? undefined : { opacity: [0.55, 1, 0.55], r: [44, 50, 44] }}
        transition={reduce ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Branching tendrils of transmission (Gaudí biomimicry) */}
      {[
        "M150 78 C120 60 96 54 70 40",
        "M150 78 C180 60 204 54 230 40",
        "M150 78 C140 50 134 36 128 16",
        "M150 78 C160 50 166 36 172 16",
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="#FFD700"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
          animate={reduce ? undefined : { opacity: [0.25, 0.8, 0.25] }}
          transition={
            reduce ? undefined : { duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }
          }
        />
      ))}
      {[
        [70, 40],
        [230, 40],
        [128, 16],
        [172, 16],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#FFD700" />
      ))}

      {/* ── Brâncuší dome / egg crowning the tower ── */}
      <ellipse cx="150" cy="92" rx="58" ry="40" fill="url(#wt-dome)" />
      <ellipse cx="150" cy="86" rx="40" ry="22" fill="#FFF3D0" opacity="0.5" filter="url(#wt-soft)" />
      <path d="M92 96 Q150 132 208 96" stroke="#7A2E2E" strokeWidth="1" opacity="0.4" />

      {/* ── Brâncuší Endless Column: stacked rhombus (diamond) modules ──
          Directly after the dome, the body reads as repeating diamonds that
          taper as they rise, exactly like the sculpture. */}
      {Array.from({ length: 7 }, (_, i) => {
        const y = 178 + i * 46; // module centre, marching down
        const w = 30 + i * 6; // widens toward the base
        return (
          <path
            key={i}
            d={`M150 ${y - 26} L${150 + w} ${y} L150 ${y + 26} L${150 - w} ${y} Z`}
            fill="url(#wt-metal)"
            stroke="#7A2E2E"
            strokeOpacity="0.25"
            strokeWidth="0.75"
            opacity={0.97 - i * 0.03}
          />
        );
      })}
      {/* soft highlight running down the diamond ridge */}
      <path d="M150 152 L150 500" stroke="#FFF3D0" strokeWidth="1.2" opacity="0.4" />

      {/* ── Gaudí catenary legs sweeping out to the base, framing the column ── */}
      <path
        d="M118 200 C72 300 66 410 90 520 L118 520 C104 410 110 320 150 250 C190 320 196 410 182 520 L210 520 C234 410 228 300 182 200"
        fill="none"
        stroke="url(#wt-metal)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* lattice cross-bracing, curved not straight */}
      {[210, 270, 330, 390, 450].map((y, i) => {
        const spread = 30 + i * 9;
        return (
          <path
            key={y}
            d={`M${150 - spread} ${y} Q150 ${y + 14} ${150 + spread} ${y}`}
            stroke="url(#wt-metal)"
            strokeWidth="1.4"
            opacity="0.6"
          />
        );
      })}
      {/* trencadís shimmer — fragments of light on the structure */}
      {[
        [134, 230],
        [166, 250],
        [128, 300],
        [172, 320],
        [138, 380],
        [162, 410],
      ].map(([x, y], i) => (
        <motion.rect
          key={i}
          x={x}
          y={y}
          width="5"
          height="5"
          rx="1"
          fill="#FFF3D0"
          animate={reduce ? undefined : { opacity: [0.15, 0.7, 0.15] }}
          transition={
            reduce ? undefined : { duration: 2.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }
          }
        />
      ))}

      {/* ── Grounding base: a smooth Brâncuší plinth into the earth ── */}
      <path d="M70 520 L230 520 L246 548 L54 548 Z" fill="url(#wt-metal)" />
      <ellipse cx="150" cy="548" rx="96" ry="10" fill="#7A2E2E" opacity="0.35" />
      {/* the root spark, never labeled */}
      <circle cx="150" cy="540" r="4" fill="#7A2E2E" />
    </svg>
  );
}
