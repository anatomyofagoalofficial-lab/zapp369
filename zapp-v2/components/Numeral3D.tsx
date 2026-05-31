"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

type Era = "past" | "present" | "future";

/**
 * A 3·6·9 numeral rendered as a REAL dimensional object — no WebGL.
 *
 * Depth is faked the way title sequences do it: ~18 stacked copies of the glyph,
 * each nudged back along x/y, build a solid extruded side wall; a bright front
 * face sits on top. The whole block lives in a perspective scene and tilts
 * toward the cursor (spring-damped), so it genuinely turns in space and the
 * "side" of the number reveals itself as you move. Floats gently at rest.
 *
 * Decorative only (aria-hidden). Honors reduced-motion (renders static, flat-on).
 */
const ERA: Record<
  Era,
  { face: string; faceGlow: string; side: string; depth: number }
> = {
  past: {
    face: "#E8B547",
    faceGlow: "rgba(232,181,71,0.5)",
    side: "#5a3410",
    depth: 18,
  },
  present: {
    face: "#3B82F6",
    faceGlow: "rgba(34,211,238,0.45)",
    side: "#0b2a52",
    depth: 18,
  },
  future: {
    face: "#9D4EDD",
    faceGlow: "rgba(157,78,221,0.5)",
    side: "#2a1147",
    depth: 22,
  },
};

export function Numeral3D({
  era,
  value,
  className,
  style,
}: {
  era: Era;
  value: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const cfg = ERA[era];

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [16, -16]), {
    stiffness: 120,
    damping: 18,
  });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-20, 20]), {
    stiffness: 120,
    damping: 18,
  });

  // Scroll-driven motion: the numeral drifts and slowly turns as the page
  // scrolls — real motion tied to scroll position, not a static layer.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scrollY = useSpring(useTransform(scrollYProgress, [0, 1], [90, -90]), {
    stiffness: 80,
    damping: 30,
  });
  const scrollSpin = useSpring(useTransform(scrollYProgress, [0, 1], [-12, 12]), {
    stiffness: 80,
    damping: 30,
  });

  function onMove(e: React.PointerEvent) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }

  // Build the extruded side wall: stacked copies marching back into depth.
  const layers = reduce ? [] : Array.from({ length: cfg.depth }, (_, i) => i + 1);

  if (reduce) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{ ...style, color: cfg.face, opacity: 0.14, fontWeight: 700, lineHeight: 1 }}
      >
        {value}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
      style={{ ...style, perspective: 900 }}
    >
      <motion.div
        style={{
          rotateX: rotX,
          rotateY: rotY,
          rotateZ: scrollSpin,
          y: scrollY,
          transformStyle: "preserve-3d",
          position: "relative",
          lineHeight: 1,
          fontWeight: 700,
        }}
      >
        {/* Extruded side wall */}
        {layers.map((i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              color: cfg.side,
              transform: `translate(${i * -1.4}px, ${i * 1.4}px)`,
              zIndex: -i,
            }}
          >
            {value}
          </span>
        ))}
        {/* Bright front face */}
        <span
          style={{
            position: "relative",
            color: cfg.face,
            textShadow: `0 0 40px ${cfg.faceGlow}, 0 0 90px ${cfg.faceGlow}`,
          }}
        >
          {value}
        </span>
      </motion.div>
    </div>
  );
}
