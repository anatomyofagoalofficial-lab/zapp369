"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { BrandMark } from "./BrandMark";
import { SLOGANS } from "@/lib/constants";

/**
 * The home opener — a cinematic ⚡ZAPP reveal. The wordmark is struck into being
 * by a storm of lightning bolts (white flash → gold bolts crack the dark →
 * ⚡ZAPP ignites with a glowing halo), then the scene is scroll-pinned: as you
 * scroll, the mark recedes + blurs, the Tesla line resolves, and the spark
 * slogan ignites. Self-contained client component. Reduced-motion → static hero.
 */

// Deterministic jagged lightning bolts striking from the top (SSR-safe).
const BOLTS = [18, 38, 50, 62, 82].map((x, i) => {
  let d = `M${x} -5`;
  let cx = x;
  let cy = -5;
  for (let s = 0; s < 6; s++) {
    cy += 9 + ((i * 7 + s * 11) % 5);
    cx += (((i * 5 + s * 9) % 12) - 6);
    d += ` L${cx} ${cy}`;
  }
  return { d, delay: (i % 5) * 0.12 };
});

export function IntroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const markScale = useTransform(scrollYProgress, [0, 0.4, 0.7], [1.1, 1, 0.86]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.55, 0.8], [1, 1, 0]);
  const markBlur = useTransform(scrollYProgress, [0.5, 0.8], [0, 8]);
  const markFilter = useTransform(markBlur, (b) => `blur(${b}px)`);
  const lineOpacity = useTransform(scrollYProgress, [0.28, 0.5, 0.72, 0.85], [0, 1, 1, 0]);
  const lineY = useTransform(scrollYProgress, [0.28, 0.5], [30, 0]);
  const sparkOpacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);
  const sparkScale = useTransform(scrollYProgress, [0.7, 1], [0.9, 1]);
  const haloOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 0.35, 0.55]);

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
        {/* Opening white flash — the strike */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0, 0.4, 0] }}
          transition={{ duration: 1.1, times: [0, 0.06, 0.18, 0.26, 0.5], ease: "easeOut" }}
        />

        {/* Lightning storm cracking the dark behind the wordmark */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 60"
          preserveAspectRatio="xMidYMin slice"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[70vh] w-full"
        >
          {BOLTS.map((b, i) => (
            <motion.path
              key={i}
              d={b.d}
              fill="none"
              stroke="#FFD700"
              strokeWidth={0.4}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 3px #FFD700)" }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
              transition={{
                duration: 0.7,
                delay: b.delay,
                repeat: Infinity,
                repeatDelay: 4 + i,
                ease: "easeOut",
              }}
            />
          ))}
        </svg>

        <div className="relative flex flex-col items-center text-center">
          {/* gold halo behind the mark */}
          <motion.div
            aria-hidden="true"
            style={{ opacity: haloOpacity }}
            className="pointer-events-none absolute inset-0 -z-10 scale-150 bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(255,215,0,0.28),transparent_70%)] blur-2xl"
          />

          {/* ⚡ZAPP punches in from the strike */}
          <motion.div
            style={{ scale: markScale, opacity: markOpacity, filter: markFilter }}
            initial={{ scale: 1.6, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.2, 0.9, 0.2, 1] }}
          >
            <BrandMark
              as="h1"
              boltClassName="text-present-yellow animate-glow-pulse"
              className="text-glow-gold text-[clamp(5rem,18vw,13rem)] font-semibold leading-none tracking-tight text-present-white"
            />
          </motion.div>

          <motion.p
            style={{ opacity: lineOpacity, y: lineY }}
            className="absolute font-serif text-2xl italic text-present-white/90 sm:text-3xl"
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

        {/* scroll hint */}
        <motion.p
          className="absolute bottom-8 z-10 font-mono text-[0.65rem] uppercase tracking-[0.4em] text-present-white/40"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll ↓
        </motion.p>
      </div>
    </section>
  );
}
