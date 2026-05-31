"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * A Solana-style scroll-pinned scene. The section is tall; its inner stage
 * sticks to the viewport while you scroll through it, and the children animate
 * across stages driven by scroll progress (0 → 1). This is the "scroll tells a
 * story" technique — done with framer-motion (already in the stack), no new
 * library, themed in ⚡ZAPP. Reduced-motion → renders as a normal static block.
 */
export function ScrollScene({
  children,
  heightVh = 250,
  className,
}: {
  children: (progress: import("framer-motion").MotionValue<number>) => React.ReactNode;
  /** Total scroll length of the scene, in viewport heights. */
  heightVh?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  if (reduce) {
    // Static fallback: render children at "mid" progress, no pinning.
    const flat = { get: () => 0.5 } as unknown as import("framer-motion").MotionValue<number>;
    return (
      <section className={className}>
        <div className="flex min-h-screen flex-col items-center justify-center">
          {children(flat)}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className={className} style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {children(scrollYProgress)}
      </div>
    </section>
  );
}

/** Helper hooks for children to read the scene's scroll progress. */
export { useTransform, motion };
