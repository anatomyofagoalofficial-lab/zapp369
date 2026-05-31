"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Full-bleed illustrated story panel.
 * Each scene has a full-screen illustration, a gradient veil so text is
 * readable, and animated copy that rises in on scroll. The illustration
 * gets a gentle Ken Burns scale on entry (cinematic, not distracting).
 * Fully reduced-motion safe.
 */
export function IllustratedScene({
  src,
  alt,
  position = "center",
  veil = "default",
  children,
  className = "",
  minHeight = "100vh",
}: {
  src: string;
  alt: string;
  position?: string;
  /** Gradient preset for the overlay */
  veil?: "default" | "dark" | "light" | "top" | "sides";
  children?: ReactNode;
  className?: string;
  minHeight?: string;
}) {
  const reduce = useReducedMotion();

  const veils: Record<string, string> = {
    default:
      "linear-gradient(0deg, rgba(7,7,13,.82) 0%, rgba(7,7,13,.25) 50%, rgba(7,7,13,.35) 100%)",
    dark: "linear-gradient(0deg, rgba(7,7,13,.88) 0%, rgba(7,7,13,.42) 60%)",
    light: "linear-gradient(0deg, rgba(7,7,13,.6) 0%, rgba(7,7,13,.08) 55%)",
    top: "linear-gradient(180deg, rgba(7,7,13,.7) 0%, rgba(7,7,13,.1) 55%)",
    sides:
      "linear-gradient(0deg, rgba(7,7,13,.75) 0%, rgba(7,7,13,.35) 40%, rgba(7,7,13,.75) 100%)",
  };

  return (
    <section
      className={`relative flex items-end justify-start overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      {/* Illustration */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={reduce ? {} : { scale: 1 }}
        whileInView={reduce ? {} : { scale: 1.04 }}
        viewport={{ once: true }}
        transition={{ duration: 14, ease: "easeOut" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          style={{ objectPosition: position }}
          quality={90}
          sizes="100vw"
        />
      </motion.div>

      {/* Veil */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: veils[veil] ?? veils.default }}
      />

      {/* Content */}
      {children && (
        <div className="relative z-20 w-full max-w-6xl mx-auto px-8 pb-16 pt-28 lg:pb-24">
          {children}
        </div>
      )}
    </section>
  );
}

/**
 * Animated copy block inside a scene.
 * Each child animates in with a staggered delay.
 */
export function SceneCopy({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="flex flex-col items-start gap-4 max-w-2xl"
      initial={reduce ? {} : { opacity: 0, y: 32 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

export function SceneKicker({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.4em] text-present-yellow">
      {children}
    </p>
  );
}

export function SceneTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-serif font-semibold text-glow-gold text-balance leading-[0.98]"
        style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)", letterSpacing: "-0.015em" }}>
      {children}
    </h2>
  );
}

export function SceneBody({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-[1.05rem] leading-[1.72] text-white/75 max-w-[44ch]">
      {children}
    </p>
  );
}
