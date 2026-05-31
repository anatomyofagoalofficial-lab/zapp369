"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Scroll-reveal wrapper — fades + lifts its children into view once.
 * Honors prefers-reduced-motion (renders instantly, no transform).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
