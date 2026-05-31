"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The real photograph of Nikola Tesla beside his machinery (a public-domain
 * 1899 Colorado Springs image — the historical Tesla, allowed), used full-bleed
 * as the Past hero. Graded to sepia→black so it sits in the era, with the
 * machinery's electric arcs made to FLASH once in a while (a white surge every
 * several seconds) so it feels alive — lightning going out now and then.
 *
 * Drop the image at: /public/tesla-lab.jpg  (or change `src` below).
 * If the file is missing it hides itself gracefully (the shader shows instead).
 */
export function TeslaPhotoHero({ src = "/tesla-lab.jpg" }: { src?: string }) {
  const reduce = useReducedMotion();
  const [ok, setOk] = useState(true);
  if (!ok) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* the real photograph */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        onError={() => setOk(false)}
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{ filter: "sepia(0.5) contrast(1.12) brightness(0.82) saturate(0.9)" }}
      />
      {/* sepia→black grade so it lives in the Past era */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f04]/55 via-[#0a0604]/35 to-[#050301]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0604]/85 via-[#0a0604]/25 to-transparent" />

      {/* the machinery's arcs FLASH every few seconds (lightning going out) */}
      {!reduce ? (
        <motion.div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse 45% 40% at 62% 32%, rgba(255,245,210,0.9), rgba(255,210,120,0.25) 40%, transparent 70%)",
          }}
          animate={{ opacity: [0, 0, 0.85, 0.1, 0.6, 0] }}
          transition={{
            duration: 7,
            times: [0, 0.62, 0.66, 0.7, 0.74, 0.8],
            repeat: Infinity,
            repeatDelay: 2.5,
            ease: "easeOut",
          }}
        />
      ) : null}
    </div>
  );
}
