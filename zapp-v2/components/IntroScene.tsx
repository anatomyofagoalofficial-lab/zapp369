"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { BrandMark } from "./BrandMark";
import { SLOGANS } from "@/lib/constants";

/**
 * The home foyer's scroll-pinned opening, ⚡ZAPP-themed. The section is tall;
 * its inner stage sticks to the viewport while you scroll through it, and the
 * children animate across stages driven by scroll progress (the Solana
 * technique), in our palette. Self-contained client component — owns its own
 * scroll wiring so a Server Component can render it as a plain element (no
 * function children, which can't cross the server/client boundary).
 */
export function IntroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Stage 1: the giant mark fills the screen, then recedes + blurs out.
  const markScale = useTransform(scrollYProgress, [0, 0.4, 0.7], [1.15, 1, 0.86]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.55, 0.8], [1, 1, 0]);
  const markBlur = useTransform(scrollYProgress, [0.5, 0.8], [0, 8]);
  const markFilter = useTransform(markBlur, (b) => `blur(${b}px)`);
  // Stage 2: the Tesla line resolves in, then out.
  const lineOpacity = useTransform(scrollYProgress, [0.28, 0.5, 0.72, 0.85], [0, 1, 1, 0]);
  const lineY = useTransform(scrollYProgress, [0.28, 0.5], [30, 0]);
  // Stage 3: the spark slogan ignites and holds.
  const sparkOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const sparkScale = useTransform(scrollYProgress, [0.7, 1], [0.9, 1]);
  const haloOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 0.5]);

  // Reduced motion → a simple static hero, no pinning.
  if (reduce) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <BrandMark
          as="h1"
          boltClassName="text-present-yellow"
          className="text-glow-gold text-[clamp(4rem,16vw,11rem)] font-semibold leading-none tracking-tight text-present-white"
        />
        <p className="font-serif text-2xl italic text-present-white/85">
          Tesla&rsquo;s unfinished revolution.
        </p>
        <p className="font-mono text-sm uppercase tracking-ritual text-present-yellow">
          {SLOGANS.freeEnergy}
        </p>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative" style={{ height: "260vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <div className="relative flex flex-col items-center text-center">
          <motion.div
            aria-hidden="true"
            style={{ opacity: haloOpacity }}
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,215,0,0.18),transparent_70%)]"
          />
          <motion.div style={{ scale: markScale, opacity: markOpacity, filter: markFilter }}>
            <BrandMark
              as="h1"
              boltClassName="text-present-yellow animate-glow-pulse"
              className="text-glow-gold text-[clamp(4rem,16vw,11rem)] font-semibold leading-none tracking-tight text-present-white"
            />
          </motion.div>
          <motion.p
            style={{ opacity: lineOpacity, y: lineY }}
            className="absolute font-serif text-2xl italic text-present-white/85 sm:text-3xl"
          >
            Tesla&rsquo;s unfinished revolution.
          </motion.p>
          <motion.p
            style={{ opacity: sparkOpacity, scale: sparkScale }}
            className="absolute font-mono text-sm uppercase tracking-ritual text-present-yellow sm:text-base"
          >
            {SLOGANS.freeEnergy}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
