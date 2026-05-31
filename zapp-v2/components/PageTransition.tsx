"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Wraps each page (via app/template.tsx) and plays an "enter" transition on
 * every navigation: the page scales up from 1.04 → 1.0 and fades in, with a
 * single gold light-streak sweeping the screen — passage through time.
 * Honors prefers-reduced-motion (renders instantly).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      style={{ transformOrigin: "center top" }}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] bg-gradient-to-r from-transparent via-brand-gold/15 to-transparent"
        initial={{ x: "-120%", opacity: 0 }}
        animate={{ x: "120%", opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      {children}
    </motion.div>
  );
}
