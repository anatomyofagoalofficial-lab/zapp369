"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Scroll-driven parallax. As the element passes through the viewport, it moves
 * vertically at a fraction of the scroll speed — so foreground and background
 * layers separate in depth, the way premium sites (Solana, Linear) feel alive
 * instead of just stacking sections. Negative speed → moves up (foreground),
 * positive → lags behind (background). Spring-smoothed. Reduced-motion safe.
 */
export function Parallax({
  children,
  speed = 60,
  className,
}: {
  children: React.ReactNode;
  /** Pixels of total travel across the scroll range. */
  speed?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [speed, -speed]), {
    stiffness: 90,
    damping: 30,
    restDelta: 0.5,
  });

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
