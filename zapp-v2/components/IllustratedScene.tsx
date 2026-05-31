"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import type { ReactNode } from "react";

/* ── Fallback gradient themes per scene ── */
const THEMES: Record<string, { a: string; b: string; c: string }> = {
  pyramid:     { a: "#3D2B1F", b: "#1A0F08", c: "#C9A878" },
  babylon:     { a: "#2B3318", b: "#0F150A", c: "#A8B870" },
  chains:      { a: "#0F1729", b: "#060D1A", c: "#3B82F6" },
  tesla:       { a: "#1A1208", b: "#090600", c: "#FFD700" },
  torch:       { a: "#1A0800", b: "#0A0400", c: "#FF7A00" },
  tribute:     { a: "#1A1005", b: "#0A0800", c: "#FFD700" },
  silent:      { a: "#0C0C14", b: "#06060C", c: "#6B7280" },
  "then-now":  { a: "#0F1729", b: "#1A0A2E", c: "#FFD700" },
  "why-zapp":  { a: "#1A1208", b: "#0A0A0A", c: "#FFD700" },
  running:     { a: "#0B1220", b: "#020A14", c: "#22D3EE" },
  future:      { a: "#1A0A2E", b: "#02020A", c: "#9D4EDD" },
  speed:       { a: "#0A0F1A", b: "#02050A", c: "#FFD700" },
};

function themeFor(src: string) {
  for (const [key, val] of Object.entries(THEMES)) {
    if (src.includes(key)) return val;
  }
  return { a: "#0A0A0A", b: "#02020A", c: "#FFD700" };
}

/* ── Animated gradient fallback (shows when image 404s or as base layer) ── */
function SceneFallback({ src }: { src: string }) {
  const t = themeFor(src);
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 35%, ${t.c}22, transparent 70%), linear-gradient(180deg, ${t.a}, ${t.b})`,
      }}
    >
      {/* Pulsing glow orb */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 40% 40% at 50% 40%, ${t.c}1A, transparent 65%)`,
        }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(${t.c}90 1px, transparent 1px), linear-gradient(90deg, ${t.c}90 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      {/* 3·6·9 watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="select-none font-mono font-bold leading-none"
          style={{
            fontSize: "clamp(4rem, 15vw, 12rem)",
            color: t.c,
            opacity: 0.04,
          }}
        >
          3·6·9
        </span>
      </div>
    </div>
  );
}

/* ── Main component ── */
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
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const veils: Record<string, string> = {
    default:
      "linear-gradient(0deg, rgba(7,7,13,.88) 0%, rgba(7,7,13,.25) 45%, rgba(7,7,13,.4) 100%)",
    dark: "linear-gradient(0deg, rgba(7,7,13,.92) 0%, rgba(7,7,13,.5) 60%)",
    light: "linear-gradient(0deg, rgba(7,7,13,.65) 0%, rgba(7,7,13,.08) 55%)",
    top: "linear-gradient(180deg, rgba(7,7,13,.75) 0%, rgba(7,7,13,.12) 55%)",
    sides:
      "linear-gradient(0deg, rgba(7,7,13,.8) 0%, rgba(7,7,13,.35) 40%, rgba(7,7,13,.8) 100%)",
  };

  const t = themeFor(src);

  return (
    <section
      ref={sectionRef}
      className={`relative flex items-end justify-start overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      {/* Always-present gradient base */}
      <SceneFallback src={src} />

      {/* Real illustration — Ken Burns + parallax */}
      {!imgError && (
        <motion.div
          className="absolute inset-0 z-[1]"
          initial={reduce ? {} : { scale: 1.0 }}
          whileInView={reduce ? {} : { scale: 1.06 }}
          viewport={{ once: true }}
          transition={{ duration: 16, ease: "easeOut" }}
          style={reduce ? {} : { y: imageY }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            style={{ objectPosition: position }}
            quality={90}
            sizes="100vw"
            onError={() => setImgError(true)}
          />
        </motion.div>
      )}

      {/* Veil */}
      <div
        className="absolute inset-0 z-[2]"
        style={{ background: veils[veil] ?? veils.default }}
      />

      {/* Bottom color bleed — warm glow that bleeds into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[3] h-40 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, ${t.c}0A, rgba(7,7,13,0.97))`,
        }}
      />

      {/* Content */}
      {children && (
        <div className="relative z-[4] w-full max-w-6xl mx-auto px-8 pb-16 pt-28 lg:pb-24">
          {children}
        </div>
      )}
    </section>
  );
}

/* ── Copy sub-components ── */

export function SceneCopy({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="flex flex-col items-start gap-4 max-w-2xl"
      initial={reduce ? {} : { opacity: 0, y: 40 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
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
