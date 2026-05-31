"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The Future "boot": lines of on-chain code type themselves across the screen
 * like a terminal compiling, then — all at once — the code dissolves and a
 * super-futuristic holographic interface ignites (rotating rings, data nodes,
 * HUD brackets), as if booting tech from the year 3960. ⚡ZAPP gold + white on
 * black. Reduced-motion → skips straight to the interface.
 */
const CODE = [
  "> initializing ⚡ZAPP.protocol --net solana --freq 3·6·9",
  "  loading consensus.kernel ............... OK",
  "  fn transmit(value) -> light_speed { route(borderless) }",
  "  fn settle(tx) -> finality(0.4s) :: fee(0.00025)",
  "  deploy energy_grid<5D> @ horizon ....... OK",
  "  mint_authority = REVOKED  freeze = REVOKED  lp = BURNED",
  "  fn free_money(human) { return energy.flow(∞) }",
  "  compiling future.reality ............... 100%",
  "> SIGNAL LOCKED. THE NETWORK IS LIVE.",
];

export function FutureBoot({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<string[]>(reduce ? CODE : []);
  const [booted, setBooted] = useState(reduce);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      if (es[0].isIntersecting && !started.current) {
        started.current = true;
        runBoot();
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runBoot() {
    let i = 0;
    const tick = () => {
      i += 1;
      setLines(CODE.slice(0, i));
      if (i < CODE.length) {
        window.setTimeout(tick, 240);
      } else {
        window.setTimeout(() => setBooted(true), 500);
      }
    };
    window.setTimeout(tick, 200);
  }

  return (
    <div ref={ref} className={className}>
      <div className="relative mx-auto aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-2xl border border-present-yellow/25 bg-black/70 shadow-[0_0_80px_-20px_rgba(255,215,0,0.4)] backdrop-blur-sm">
        {/* HUD corner brackets */}
        {[
          "left-3 top-3 border-l-2 border-t-2",
          "right-3 top-3 border-r-2 border-t-2",
          "left-3 bottom-3 border-l-2 border-b-2",
          "right-3 bottom-3 border-r-2 border-b-2",
        ].map((c, i) => (
          <span key={i} className={`absolute h-6 w-6 border-present-yellow/70 ${c}`} aria-hidden="true" />
        ))}

        {/* CODE PHASE */}
        {!booted ? (
          <div className="absolute inset-0 overflow-hidden p-6 font-mono text-[0.7rem] leading-relaxed text-present-yellow/90 sm:text-sm">
            {lines.map((l, i) => (
              <div key={i} className={l.startsWith(">") ? "text-white" : ""}>
                {l}
                {i === lines.length - 1 ? (
                  <span className="ml-0.5 inline-block h-3.5 w-2 animate-pulse bg-present-yellow align-middle" />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {/* INTERFACE PHASE — the future ignites */}
        {booted ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.6, 0, 0.3, 1] }}
          >
            {/* scan grid floor */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,215,0,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,0.12) 1px,transparent 1px)",
                backgroundSize: "32px 32px",
                maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent 80%)",
                WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent 80%)",
              }}
            />
            {/* concentric rotating rings (the holographic core) */}
            <svg viewBox="0 0 200 200" className="h-[80%] w-[80%]">
              {[88, 70, 52, 34].map((r, i) => (
                <motion.g
                  key={i}
                  style={{ transformOrigin: "100px 100px" }}
                  animate={reduce ? undefined : { rotate: i % 2 ? -360 : 360 }}
                  transition={reduce ? undefined : { duration: 18 - i * 3, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="100" cy="100" r={r} fill="none" stroke="#FFD700" strokeOpacity={0.5 - i * 0.07} strokeWidth="0.8" strokeDasharray={i % 2 ? "2 6" : "10 4"} />
                  <circle cx={100 + r} cy="100" r="2.2" fill="#FFD700" />
                </motion.g>
              ))}
              {/* white-hot core */}
              <circle cx="100" cy="100" r="8" fill="#fff" />
              <circle cx="100" cy="100" r="16" fill="none" stroke="#FFD700" strokeWidth="1" />
            </svg>

            {/* readout label */}
            <div className="pointer-events-none absolute bottom-5 left-0 right-0 text-center">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.5em] text-white/70">
                ⚡ZAPP NETWORK · ONLINE
              </p>
              <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-present-yellow/70">
                5D ENERGY GRID · 3·6·9 ∞
              </p>
            </div>
          </motion.div>
        ) : null}

        {/* sweeping scan line over everything */}
        {!reduce ? (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-16"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(255,215,0,0.10), transparent)" }}
            animate={{ y: ["-4rem", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        ) : null}
      </div>
    </div>
  );
}
