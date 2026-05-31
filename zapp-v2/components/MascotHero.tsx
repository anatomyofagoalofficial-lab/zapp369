"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Era = "home" | "past" | "present" | "future";

/**
 * The mascot, rendered as a monument — the consistent thread through every era.
 * Brâncuší pedestal beneath him, single-source Michelangelo chiaroscuro glow
 * behind him in each era's accent colour, gentle float (reduced-motion safe).
 * Same mascot.png everywhere; only the lighting + plinth change per era.
 */
const ERA_STYLE: Record<
  Era,
  { glow: string; plinthFrom: string; plinthVia: string; ground: string }
> = {
  home: {
    glow: "rgba(255,215,0,0.22)",
    plinthFrom: "rgba(255,215,0,0.35)",
    plinthVia: "rgba(255,215,0,0.08)",
    ground: "rgba(255,215,0,0.10)",
  },
  past: {
    glow: "rgba(232,181,71,0.40)",
    plinthFrom: "rgba(122,46,46,0.45)",
    plinthVia: "rgba(232,181,71,0.12)",
    ground: "rgba(122,46,46,0.18)",
  },
  present: {
    glow: "rgba(59,130,246,0.30)",
    plinthFrom: "rgba(59,130,246,0.40)",
    plinthVia: "rgba(16,185,129,0.10)",
    ground: "rgba(59,130,246,0.12)",
  },
  future: {
    glow: "rgba(157,78,221,0.38)",
    plinthFrom: "rgba(157,78,221,0.45)",
    plinthVia: "rgba(34,211,238,0.10)",
    ground: "rgba(157,78,221,0.16)",
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
  const s = ERA_STYLE[era];

  return (
    <div
      className={cn(
        "pointer-events-none relative mx-auto flex w-full max-w-md flex-col items-center",
        className,
      )}
    >
      {/* Chiaroscuro glow — light pouring from a single unseen source */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[8%] h-[78%] w-[78%] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${s.glow} 0%, transparent 70%)`,
        }}
      />

      {/* The mascot, gently floating */}
      <motion.div
        className="relative z-10 w-[68%]"
        animate={reduce ? undefined : { y: [0, -14, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ aspectRatio: "10 / 13" }}
      >
        <Image
          src="/mascot.png"
          alt="The ⚡ZAPP mascot, a mustached inventor in a tweed suit"
          fill
          priority={priority}
          sizes="(max-width: 768px) 60vw, 320px"
          className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
        />
      </motion.div>

      {/* Brâncuší pedestal — the plinth that frames him as monument */}
      <div className="relative z-0 -mt-2 flex w-full flex-col items-center">
        {/* cast-light pool on the ground */}
        <div
          aria-hidden="true"
          className="h-6 w-[55%] rounded-[100%] blur-md"
          style={{ background: s.ground }}
        />
        {/* stacked plinth (Endless Column logic) */}
        <div
          aria-hidden="true"
          className="mt-1 h-3 w-[46%] rounded-sm"
          style={{
            background: `linear-gradient(180deg, ${s.plinthFrom}, ${s.plinthVia})`,
          }}
        />
        <div
          aria-hidden="true"
          className="mt-1 h-3 w-[54%] rounded-sm"
          style={{
            background: `linear-gradient(180deg, ${s.plinthFrom}, ${s.plinthVia})`,
            opacity: 0.7,
          }}
        />
      </div>
    </div>
  );
}
