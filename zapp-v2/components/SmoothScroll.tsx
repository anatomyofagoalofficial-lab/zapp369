"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

/**
 * Solana-style buttery smooth scrolling, via Lenis (the same scroll engine
 * behind many award-winning sites). It eases the wheel/touch input so the page
 * glides with weight instead of snapping — this single thing carries most of
 * the "premium / cinematic" scroll feel, and everything scroll-driven we built
 * (parallax, the 3D numerals, the scroll-teleport) rides on top of it.
 *
 * Disabled for visitors who prefer reduced motion (native scroll instead).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09, // lower = smoother/heavier glide
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
