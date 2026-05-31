"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Future-era HUD: a holographic interface that frames the mascot monument.
 * Visual grammar studied from Tron's glowing-grid / dark-world contrast and
 * sci-fi FUI (spinning circular rings, data arcs, corner brackets, scan-lines)
 * — rendered in ⚡ZAPP's own palette (cosmic black, violet, cyan, gold).
 * Original artwork; no third-party assets or logos. Reduced-motion safe.
 */
const CYAN = "#22D3EE";
const GOLD = "#FFD700";
const VIOLET = "#9D4EDD";

export function FutureHUD({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const spin = (dur: number, dir = 1) =>
    reduce ? undefined : { rotate: 360 * dir };
  const spinT = (dur: number) =>
    reduce ? undefined : { duration: dur, repeat: Infinity, ease: "linear" as const };

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* Concentric holographic rings, counter-rotating */}
      <svg viewBox="0 0 400 400" className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2">
        <defs>
          <linearGradient id="hud-arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={CYAN} />
            <stop offset="100%" stopColor={GOLD} />
          </linearGradient>
        </defs>

        {/* outer dashed ring */}
        <motion.circle
          cx="200" cy="200" r="186" fill="none" stroke={CYAN} strokeOpacity="0.35"
          strokeWidth="1" strokeDasharray="2 10"
          style={{ originX: "200px", originY: "200px" }}
          animate={spin(40)} transition={spinT(40)}
        />
        {/* mid ring with arc segments */}
        <motion.g
          style={{ originX: "200px", originY: "200px" }}
          animate={spin(26, -1)} transition={spinT(26)}
        >
          <circle cx="200" cy="200" r="150" fill="none" stroke={VIOLET} strokeOpacity="0.4" strokeWidth="1" />
          {[0, 90, 180, 270].map((a) => (
            <path
              key={a}
              d="M200 50 A150 150 0 0 1 306 94"
              fill="none" stroke="url(#hud-arc)" strokeWidth="2.5" strokeLinecap="round"
              transform={`rotate(${a} 200 200)`}
              opacity="0.8"
            />
          ))}
        </motion.g>
        {/* inner tick ring */}
        <motion.g
          style={{ originX: "200px", originY: "200px" }}
          animate={spin(18)} transition={spinT(18)}
        >
          {Array.from({ length: 60 }, (_, i) => i * 6).map((a) => (
            <line
              key={a}
              x1="200" y1="86" x2="200" y2={a % 30 === 0 ? "74" : "82"}
              stroke={CYAN} strokeOpacity="0.5" strokeWidth="1"
              transform={`rotate(${a} 200 200)`}
            />
          ))}
        </motion.g>
        {/* pulsing data nodes on the mid ring */}
        {[30, 150, 270].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          const x = 200 + 150 * Math.cos(rad);
          const y = 200 + 150 * Math.sin(rad);
          return (
            <motion.circle
              key={a} cx={x} cy={y} r="4" fill={GOLD}
              animate={reduce ? undefined : { opacity: [0.3, 1, 0.3], r: [3, 5, 3] }}
              transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, delay: i * 0.5 }}
            />
          );
        })}
      </svg>

      {/* Corner bracket frame (FUI) */}
      {[
        "left-2 top-2 border-l-2 border-t-2",
        "right-2 top-2 border-r-2 border-t-2",
        "left-2 bottom-2 border-l-2 border-b-2",
        "right-2 bottom-2 border-r-2 border-b-2",
      ].map((pos) => (
        <span
          key={pos}
          className={`absolute h-8 w-8 ${pos}`}
          style={{ borderColor: CYAN, opacity: 0.6 }}
        />
      ))}

      {/* Scan-line sweeping down */}
      {!reduce ? (
        <motion.div
          className="absolute inset-x-0 h-px"
          style={{ background: `linear-gradient(to right, transparent, ${CYAN}, transparent)`, opacity: 0.5 }}
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
    </div>
  );
}
