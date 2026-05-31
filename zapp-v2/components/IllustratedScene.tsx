"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { ReactNode } from "react";

const THEMES: Record<string, { bg: string; glow: string; accent: string }> = {
  pyramid:    { bg: "#1A0F06", glow: "#C9A87840", accent: "#C9A878" },
  babylon:    { bg: "#0F150A", glow: "#7A9B4040", accent: "#A8C870" },
  chains:     { bg: "#060D1A", glow: "#3B82F640", accent: "#3B82F6" },
  tesla:      { bg: "#0A0800", glow: "#FFD70040", accent: "#FFD700" },
  "369":      { bg: "#0A0800", glow: "#FFD70050", accent: "#FFD700" },
  speed:      { bg: "#050810", glow: "#FFD70030", accent: "#FFD700" },
  torch:      { bg: "#0A0400", glow: "#FF7A0050", accent: "#FF7A00" },
  tribute:    { bg: "#0A0800", glow: "#FFD70035", accent: "#FFD700" },
  silent:     { bg: "#06060C", glow: "#6B728030", accent: "#9CA3AF" },
  "then-now": { bg: "#080A14", glow: "#FFD70030", accent: "#FFD700" },
  "why-zapp": { bg: "#0A0800", glow: "#FFD70040", accent: "#FFD700" },
  running:    { bg: "#020A14", glow: "#22D3EE40", accent: "#22D3EE" },
  future:     { bg: "#06020E", glow: "#9D4EDD40", accent: "#9D4EDD" },
};

function themeFor(src: string) {
  for (const [key, val] of Object.entries(THEMES)) {
    if (src.includes(key)) return val;
  }
  return { bg: "#07070D", glow: "#FFD70030", accent: "#FFD700" };
}

function AnimatedFallback({ src }: { src: string }) {
  const t = themeFor(src);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: t.bg }}>
      {/* Central glow */}
      <motion.div
        className="absolute"
        style={{
          inset: 0,
          background: `radial-gradient(ellipse 70% 55% at 50% 40%, ${t.glow}, transparent 70%)`,
        }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Secondary shimmer */}
      <motion.div
        className="absolute"
        style={{
          inset: 0,
          background: `radial-gradient(ellipse 40% 30% at 50% 50%, ${t.accent}15, transparent 60%)`,
        }}
        animate={{ opacity: [0, 0.8, 0], x: ["-10%", "10%", "-10%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Fine grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${t.accent}12 1px, transparent 1px), linear-gradient(90deg, ${t.accent}12 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Scanline sweep */}
      <motion.div
        className="absolute inset-x-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, ${t.accent}08, transparent)`,
        }}
        animate={{ y: ["-8rem", "120vh"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      />
      {/* Big 3·6·9 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.span
          className="select-none font-mono font-bold"
          style={{
            fontSize: "clamp(5rem, 18vw, 14rem)",
            color: t.accent,
            opacity: 0.05,
            letterSpacing: "-0.02em",
          }}
          animate={{ opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          3·6·9
        </motion.span>
      </div>
    </div>
  );
}

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
  veil?: "default" | "dark" | "light" | "top" | "sides";
  children?: ReactNode;
  className?: string;
  minHeight?: string;
}) {
  const reduce = useReducedMotion();
  const [imgError, setImgError] = useState(false);

  const veils: Record<string, string> = {
    default: "linear-gradient(0deg, rgba(7,7,13,.90) 0%, rgba(7,7,13,.20) 45%, rgba(7,7,13,.38) 100%)",
    dark:    "linear-gradient(0deg, rgba(7,7,13,.93) 0%, rgba(7,7,13,.52) 60%)",
    light:   "linear-gradient(0deg, rgba(7,7,13,.60) 0%, rgba(7,7,13,.06) 55%)",
    top:     "linear-gradient(180deg, rgba(7,7,13,.78) 0%, rgba(7,7,13,.10) 55%)",
    sides:   "linear-gradient(0deg, rgba(7,7,13,.82) 0%, rgba(7,7,13,.32) 40%, rgba(7,7,13,.82) 100%)",
  };

  return (
    <section
      className={`relative flex items-end justify-start overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      {/* Animated fallback — always present as base */}
      <AnimatedFallback src={src} />

      {/* Real illustration with Ken Burns — no parallax (performance) */}
      {!imgError && (
        <motion.div
          className="absolute inset-0 z-[1]"
          initial={reduce ? {} : { scale: 1.0 }}
          whileInView={reduce ? {} : { scale: 1.05 }}
          viewport={{ once: true }}
          transition={{ duration: 14, ease: "easeOut" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            style={{ objectPosition: position }}
            quality={88}
            sizes="100vw"
            onError={() => setImgError(true)}
          />
        </motion.div>
      )}

      {/* Veil */}
      <div className="absolute inset-0 z-[2]" style={{ background: veils[veil] ?? veils.default }} />

      {/* Content */}
      {children && (
        <div className="relative z-[3] w-full max-w-6xl mx-auto px-8 pb-16 pt-28 lg:pb-24">
          {children}
        </div>
      )}
    </section>
  );
}

export function SceneCopy({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="flex flex-col items-start gap-4 max-w-2xl"
      initial={reduce ? {} : { opacity: 0, y: 36 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
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
    <h2
      className="font-serif font-semibold text-glow-gold text-balance leading-[0.98]"
      style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)", letterSpacing: "-0.015em" }}
    >
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
