"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { BrandMark } from "./BrandMark";
import { SLOGANS } from "@/lib/constants";

/**
 * The home foyer's scroll-pinned opening, ⚡ZAPP-themed. As you scroll through
 * the scene the brand mark rushes forward and fades, the Tesla line resolves,
 * and the spark slogan ignites — a single continuous beat driven by scroll
 * (the Solana technique), in our palette. Pass it the scene's progress value.
 */
export function IntroScene({ progress }: { progress: MotionValue<number> }) {
  // Stage 1 (0–0.4): the giant mark fills the screen, then recedes.
  const markScale = useTransform(progress, [0, 0.4, 0.7], [1.15, 1, 0.86]);
  const markOpacity = useTransform(progress, [0, 0.55, 0.8], [1, 1, 0]);
  const markBlur = useTransform(progress, [0.5, 0.8], [0, 8]);
  const markFilter = useTransform(markBlur, (b) => `blur(${b}px)`);

  // Stage 2 (0.3–0.7): the line resolves in.
  const lineOpacity = useTransform(progress, [0.28, 0.5, 0.72, 0.85], [0, 1, 1, 0]);
  const lineY = useTransform(progress, [0.28, 0.5], [30, 0]);

  // Stage 3 (0.7–1): the spark slogan ignites and holds.
  const sparkOpacity = useTransform(progress, [0.7, 0.9], [0, 1]);
  const sparkScale = useTransform(progress, [0.7, 1], [0.9, 1]);
  const haloOpacity = useTransform(progress, [0.7, 1], [0, 0.5]);

  return (
    <div className="relative flex flex-col items-center text-center">
      {/* gold halo igniting behind the final slogan */}
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
  );
}
