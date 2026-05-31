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

// Deterministic hyperspace streaks radiating from the centre (SSR-safe).
const STREAKS = Array.from({ length: 64 }, (_, i) => ({
  deg: (360 / 64) * i,
  len: 30 + ((i * 37) % 50), // pseudo-random length, deterministic
  delay: ((i * 13) % 20) / 100,
  thick: i % 4 === 0 ? 3 : 1.5,
}));

/**
 * A time-jump warp: the screen fills with light-streaks rushing through a tunnel
 * toward (or away from) the viewer, the destination era's colour floods in, and
 * the era's name punches through the middle — so moving between pages reads as
 * travelling through time, not clicking a link. ⚡ZAPP palette, original artwork.
 */
function PortalOverlay({ href }: { href: string }) {
  const c = eraOf(href);
  // Forward in time → streaks rush OUTWARD (we fly forward). Back in time →
  // streaks rush INWARD (we're pulled back). Default forward.
  const forward = c.order >= 1;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {/* colour flood from the centre */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at center, ${c.core}, transparent 60%)` }}
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: [0, 0.7, 0], scale: [0.2, 1.4, 2] }}
        transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
      />

      {/* hyperspace streak tunnel */}
      <div className="absolute inset-0 flex items-center justify-center">
        {STREAKS.map((s, i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 origin-left"
            style={{
              height: s.thick,
              borderRadius: 9999,
              background: `linear-gradient(to right, transparent, ${c.streak})`,
              rotate: `${s.deg}deg`,
              boxShadow: `0 0 6px ${c.streak}`,
            }}
            initial={{
              width: forward ? "2vmin" : "70vmin",
              opacity: 0,
              x: forward ? "4vmin" : "8vmin",
            }}
            animate={{
              width: forward ? ["2vmin", "85vmin"] : ["70vmin", "3vmin"],
              opacity: [0, 1, 0],
              x: forward ? ["4vmin", "10vmin"] : ["8vmin", "2vmin"],
            }}
            transition={{ duration: 1, ease: "easeIn", delay: s.delay }}
          />
        ))}
      </div>

      {/* the era name punches through the warp */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, scale: forward ? 0.4 : 1.6, filter: "blur(12px)" }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: forward ? [0.4, 1, 1.05, 1.3] : [1.6, 1, 0.95, 0.7],
          filter: ["blur(12px)", "blur(0px)", "blur(0px)", "blur(10px)"],
        }}
        transition={{ duration: 1.25, ease: [0.6, 0, 0.3, 1], times: [0, 0.35, 0.7, 1] }}
      >
        <p
          className="font-serif text-5xl font-semibold sm:text-7xl"
          style={{ color: "#fff", textShadow: `0 0 30px ${c.core}, 0 0 70px ${c.core}` }}
        >
          {c.label}
        </p>
        <p
          className="mt-3 font-mono text-xs uppercase tracking-[0.5em]"
          style={{ color: c.streak }}
        >
          ⚡ 3 · 6 · 9 ∞
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
