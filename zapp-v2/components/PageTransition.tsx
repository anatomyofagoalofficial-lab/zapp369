"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Dimensional-portal page transition. On every navigation (re-mounted via
 * app/template.tsx) the incoming page arrives THROUGH a portal:
 *
 *  1. an iris of light blooms from the centre and sweeps outward
 *  2. concentric rings ripple out like a wormhole mouth
 *  3. the page itself rushes forward from deep z-space (scale 1.08 → 1, slight
 *     3D tilt settling to flat) and fades in
 *  4. a gold light-streak crosses the screen — the threshold of time
 *
 * The portal colour is tuned per era (sepia past / blue present / violet
 * future / gold elsewhere). Honors prefers-reduced-motion (instant render).
 */
const PORTAL: Record<string, { core: string; ring: string }> = {
  "/past": { core: "rgba(232,181,71,0.55)", ring: "rgba(122,46,46,0.5)" },
  "/present": { core: "rgba(59,130,246,0.55)", ring: "rgba(16,185,129,0.45)" },
  "/future": { core: "rgba(157,78,221,0.6)", ring: "rgba(34,211,238,0.5)" },
};
const DEFAULT_PORTAL = { core: "rgba(255,215,0,0.5)", ring: "rgba(255,215,0,0.35)" };

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  if (reduce) return <>{children}</>;

  const portal = PORTAL[pathname] ?? DEFAULT_PORTAL;

  return (
    <motion.div
      style={{ perspective: 1400 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── The portal overlay — plays once, then unmounts visually ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.1, ease: "easeInOut", times: [0, 1] }}
      >
        {/* iris of light blooming from centre */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{
            background: `radial-gradient(circle, ${portal.core} 0%, transparent 60%)`,
          }}
          initial={{ scale: 0.1, opacity: 0.9 }}
          animate={{ scale: 3.2, opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* concentric wormhole rings */}
        {[0, 0.12, 0.24].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-[20vmax] w-[20vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ border: `2px solid ${portal.ring}` }}
            initial={{ scale: 0.05, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay }}
          />
        ))}
        {/* gold threshold streak crossing the screen */}
        <motion.div
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent blur-md"
          initial={{ x: "-140%", opacity: 0 }}
          animate={{ x: "340%", opacity: [0, 0.7, 0] }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ── The page rushing forward out of z-space ── */}
      <motion.div
        style={{ transformOrigin: "center center" }}
        initial={{ opacity: 0, scale: 1.08, rotateX: 6, y: 24 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
