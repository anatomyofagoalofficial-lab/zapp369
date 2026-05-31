"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type NavFn = (href: string) => void;
const TransitionCtx = createContext<NavFn>(() => {});
export const useTransitionNav = () => useContext(TransitionCtx);

/**
 * Per-destination identity for the time-jump. ⚡ZAPP gold is the constant; the
 * core + label take the destination era. `order` lets us tell forward (into the
 * future) from backward (into the past) so the warp direction reads as time.
 */
type EraDef = { core: string; streak: string; label: string; order: number };
function eraOf(href: string): EraDef {
  if (href.startsWith("/past"))
    return { core: "#E8B547", streak: "#FFE08a", label: "THE PAST", order: 0 };
  if (href.startsWith("/present"))
    return { core: "#22D3EE", streak: "#9be9ff", label: "THE PRESENT", order: 1 };
  if (href.startsWith("/future"))
    return { core: "#9D4EDD", streak: "#d8a8ff", label: "THE FUTURE", order: 2 };
  if (href.startsWith("/how-to-buy"))
    return { core: "#10B981", streak: "#7af0c0", label: "ACQUIRE", order: 1 };
  return { core: "#FFD700", streak: "#FFE08a", label: "⚡ZAPP", order: 1 };
}

/**
 * A precise, mechanical interface transition — blockchain/Solana grammar, not
 * fireworks. Two metallic panels seal the screen shut like a vault door, a fine
 * data-grid + scan line lock on, the destination's label reads out, then the
 * panels retract to reveal the new page. Clean, engineered, premium. Reduced
 * motion handled upstream (instant nav).
 */
function PortalOverlay({ href }: { href: string }) {
  const c = eraOf(href);
  const panelBg =
    "linear-gradient(180deg,#0b0d12 0%,#05060a 50%,#0b0d12 100%)";
  // close ~0-40%, hold 40-60%, retract 60-100% of the 1.4s lifetime
  const seq = { duration: 1.4, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], times: [0, 0.4, 0.6, 1] };

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* top panel */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{ background: panelBg, borderBottom: `1px solid ${c.core}` }}
        initial={{ y: "-100%" }}
        animate={{ y: ["-100%", "0%", "0%", "-100%"] }}
        transition={seq}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: `linear-gradient(to top, ${c.core}22, transparent)` }}
        />
      </motion.div>

      {/* bottom panel */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: panelBg, borderTop: `1px solid ${c.core}` }}
        initial={{ y: "100%" }}
        animate={{ y: ["100%", "0%", "0%", "100%"] }}
        transition={seq}
      >
        <div
          className="absolute inset-x-0 top-0 h-24"
          style={{ background: `linear-gradient(to bottom, ${c.core}22, transparent)` }}
        />
      </motion.div>

      {/* the locked-in interface readout (only while sealed) */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 1.4, times: [0, 0.38, 0.45, 0.58, 0.66] }}
      >
        {/* fine data grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(${c.core}22 1px,transparent 1px),linear-gradient(90deg,${c.core}22 1px,transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent 75%)",
          }}
        />
        {/* seam scan line */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
          style={{ background: c.core, boxShadow: `0 0 18px ${c.core}` }}
        />
        <p className="relative font-mono text-[0.6rem] uppercase tracking-[0.55em] text-white/40">
          Solana · on-chain
        </p>
        <p
          className="relative mt-3 font-serif text-5xl font-semibold sm:text-7xl"
          style={{ color: "#fff", textShadow: `0 0 24px ${c.core}` }}
        >
          {c.label}
        </p>
        <p
          className="relative mt-3 font-mono text-[0.6rem] uppercase tracking-[0.5em]"
          style={{ color: c.core }}
        >
          3 · 6 · 9 ∞
        </p>
      </motion.div>
    </motion.div>
  );
}

/**
 * Wraps the app and turns internal navigation into a passage through space and
 * time: a full-screen ⚡ZAPP portal opens, the destination loads beneath it,
 * then the veil lifts. Reduced-motion → instant navigation.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [target, setTarget] = useState<string | null>(null);

  const go = useCallback<NavFn>(
    (href) => {
      if (reduce) {
        router.push(href);
        return;
      }
      setTarget(href);
      window.setTimeout(() => router.push(href), 700);
      window.setTimeout(() => setTarget(null), 1500);
    },
    [router, reduce],
  );

  return (
    <TransitionCtx.Provider value={go}>
      {children}
      <AnimatePresence>
        {target ? <PortalOverlay key="portal" href={target} /> : null}
      </AnimatePresence>
    </TransitionCtx.Provider>
  );
}
