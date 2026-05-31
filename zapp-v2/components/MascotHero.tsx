"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Era = "home" | "past" | "present" | "future";

/**
 * The mascot rendered as a monument standing in a single shaft of light:
 * a layered chiaroscuro halo behind him, an elliptical "spotlight" pool he
 * stands in, and a soft mirror reflection fading into the floor. Same
 * mascot.png everywhere; only the light colour changes per era. Gentle float,
 * reduced-motion safe.
 */
const ERA: Record<
  Era,
  { halo: string; rim: string; pool: string; floorFrom: string }
> = {
  home: {
    halo: "rgba(255,215,0,0.20)",
    rim: "rgba(255,215,0,0.45)",
    pool: "rgba(255,215,0,0.16)",
    floorFrom: "rgba(255,215,0,0.10)",
  },
  past: {
    halo: "rgba(232,181,71,0.30)",
    rim: "rgba(232,181,71,0.55)",
    pool: "rgba(122,46,46,0.16)",
    floorFrom: "rgba(232,181,71,0.14)",
  },
  present: {
    halo: "rgba(59,130,246,0.26)",
    rim: "rgba(34,211,238,0.5)",
    pool: "rgba(59,130,246,0.16)",
    floorFrom: "rgba(16,185,129,0.10)",
  },
  future: {
    halo: "rgba(157,78,221,0.32)",
    rim: "rgba(34,211,238,0.5)",
    pool: "rgba(157,78,221,0.20)",
    floorFrom: "rgba(157,78,221,0.16)",
  },
};

export function MascotHero({
  era = "home",
  priority = false,
  className,
}: {
  era?: Era;
  priority?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const c = ERA[era];

  return (
    <div
      className={cn(
        "pointer-events-none relative mx-auto flex w-full max-w-md flex-col items-center",
        className,
      )}
    >
      {/* Shaft of light pouring from above (chiaroscuro) */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-[120%] w-[60%] -translate-x-1/2"
        style={{
          background: `linear-gradient(to bottom, ${c.halo} 0%, transparent 75%)`,
          filter: "blur(28px)",
        }}
      />
      {/* Round halo behind the figure */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[12%] h-[72%] w-[72%] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${c.rim} 0%, transparent 68%)`,
          opacity: 0.7,
        }}
      />

      {/* The mascot, gently floating */}
      <motion.div
        className="relative z-10 w-[82%]"
        animate={reduce ? undefined : { y: [0, -12, 0] }}
        transition={
          reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ aspectRatio: "10 / 13" }}
      >
        <Image
          src="/mascot.png"
          alt="The ⚡ZAPP mascot, a mustached inventor in a tweed suit"
          fill
          priority={priority}
          sizes="(max-width: 768px) 72vw, 380px"
          className="object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
        />
      </motion.div>

      {/* Mirror reflection fading into the floor (premium grounding) */}
      <motion.div
        aria-hidden="true"
        className="relative z-0 -mt-1 h-[34%] w-[82%] overflow-hidden opacity-25"
        animate={reduce ? undefined : { y: [0, -12, 0] }}
        transition={
          reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
        style={{
          aspectRatio: "10 / 13",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 70%)",
          maskImage: "linear-gradient(to bottom, black, transparent 70%)",
          transform: "scaleY(-1)",
        }}
      >
        <Image
          src="/mascot.png"
          alt=""
          fill
          sizes="(max-width: 768px) 72vw, 380px"
          className="object-contain object-top"
        />
      </motion.div>

      {/* Elliptical spotlight pool he stands in */}
      <div
        aria-hidden="true"
        className="relative z-0 -mt-6 h-10 w-[70%] rounded-[100%] blur-xl"
        style={{ background: c.pool }}
      />
      <div
        aria-hidden="true"
        className="relative z-0 -mt-7 h-4 w-[48%] rounded-[100%] blur-md"
        style={{ background: c.floorFrom }}
      />
    </div>
  );
}
