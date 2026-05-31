"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Hidden delights, ⚡ZAPP-style:
 *  • Type "369" anywhere → a full-screen Tesla lightning storm erupts.
 *  • A global window event "zapp:storm" also triggers it (so a secret button
 *    elsewhere can fire it: window.dispatchEvent(new Event("zapp:storm"))).
 *
 * Pure CSS/SVG bolts, no assets. Reduced-motion → a brief gentle flash instead.
 */
const BOLTS = Array.from({ length: 9 }, (_, i) => i);

function boltPath(seed: number): string {
  // Deterministic jagged bolt from top to bottom around an x anchor.
  const x = 8 + (seed * 11) % 84;
  let d = `M${x} 0`;
  let cx = x;
  let cy = 0;
  for (let s = 0; s < 7; s++) {
    cy += 14 + ((seed * 7 + s * 13) % 6);
    cx += (((seed * 3 + s * 5) % 10) - 5);
    d += ` L${cx} ${cy}`;
  }
  return d;
}

export function EasterEggs() {
  const reduce = useReducedMotion();
  const [storm, setStorm] = useState(false);

  const fire = useCallback(() => {
    setStorm(true);
    window.setTimeout(() => setStorm(false), reduce ? 600 : 1800);
  }, [reduce]);

  useEffect(() => {
    let buf = "";
    function onKey(e: KeyboardEvent) {
      // ignore typing in inputs
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      buf = (buf + e.key).slice(-3);
      if (buf === "369") {
        buf = "";
        fire();
      }
    }
    function onStorm() {
      fire();
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("zapp:storm", onStorm);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("zapp:storm", onStorm);
    };
  }, [fire]);

  return (
    <AnimatePresence>
      {storm ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[120] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* white flashes */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={reduce ? { opacity: 0.3 } : { opacity: [0, 0.7, 0, 0.5, 0, 0.3, 0] }}
            transition={{ duration: reduce ? 0.5 : 1.6, times: [0, 0.05, 0.15, 0.3, 0.45, 0.6, 1] }}
          />
          {!reduce ? (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              {BOLTS.map((i) => (
                <motion.path
                  key={i}
                  d={boltPath(i)}
                  stroke="#FFD700"
                  strokeWidth="0.5"
                  fill="none"
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 6px #FFD700)" }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, delay: (i % 5) * 0.12, repeat: 2, repeatDelay: 0.2 }}
                />
              ))}
            </svg>
          ) : null}
          {/* the message */}
          <motion.p
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-serif text-4xl italic text-white sm:text-6xl"
            style={{ textShadow: "0 0 40px #FFD700, 0 0 80px #FFD700" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0, 1, 1, 0], scale: 1 }}
            transition={{ duration: reduce ? 0.6 : 1.8, times: [0, 0.2, 0.7, 1] }}
          >
            3 · 6 · 9 ⚡
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
