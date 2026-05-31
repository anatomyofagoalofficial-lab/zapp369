"use client";

import { motion, useReducedMotion } from "framer-motion";

const BOLTS = [
  "M0 24 L80 24 L110 6 L140 42 L170 2 L200 44 L230 12 L260 32 L290 6 L320 38 L350 18 L380 24 L460 24",
  "M460 24 L540 24 L560 4 L590 44 L620 8 L650 40 L680 16 L710 30 L740 2 L770 44 L800 20 L840 24 L920 24",
  "M920 24 L980 24 L1010 8 L1040 42 L1070 4 L1100 40 L1130 14 L1160 34 L1200 24",
];

export function LightningDivider({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={`relative h-10 overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <filter id="lf-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {BOLTS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="rgba(255,215,0,0.55)"
            strokeWidth={reduce ? "0.8" : "1"}
            strokeLinecap="round"
            filter="url(#lf-glow)"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
          />
        ))}

        {/* Faint white core — the "hot channel" */}
        {BOLTS.map((d, i) => (
          <motion.path
            key={`w-${i}`}
            d={d}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.5"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: i * 0.12 + 0.05, ease: "easeOut" }}
          />
        ))}
      </svg>
    </div>
  );
}
