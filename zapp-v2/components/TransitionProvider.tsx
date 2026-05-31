"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type NavFn = (href: string) => void;
const TransitionCtx = createContext<NavFn>(() => {});
export const useTransitionNav = () => useContext(TransitionCtx);

/**
 * Per-destination colours for the portal. Always ⚡ZAPP's own palette — gold is
 * the constant spark ring, the core takes the destination era's accent.
 */
function eraOf(href: string): { core: string; spark: string; rim: string } {
  if (href.startsWith("/past"))
    return { core: "#E8B547", spark: "#FFD700", rim: "#7A2E2E" };
  if (href.startsWith("/present"))
    return { core: "#3B82F6", spark: "#FFD700", rim: "#22D3EE" };
  if (href.startsWith("/future"))
    return { core: "#9D4EDD", spark: "#FFD700", rim: "#22D3EE" };
  return { core: "#FFD700", spark: "#FFD700", rim: "#FFD700" };
}

// Deterministic spark positions around the ring (no Math.random → SSR-safe).
const SPARKS = Array.from({ length: 48 }, (_, i) => (360 / 48) * i);

/**
 * A Dr-Strange-inspired portal — a spinning circle drawn in flying sparks and
 * embers — rendered entirely in ⚡ZAPP gold + the destination era's accent.
 * Inspired by the *idea* of a fiery threshold; original artwork, our colours.
 */
function PortalOverlay({ href }: { href: string }) {
  const c = eraOf(href);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {/* The spinning spark-ring (the portal's burning edge) */}
      <motion.div
        className="absolute"
        style={{ width: "70vmin", height: "70vmin" }}
        initial={{ scale: 0.2, opacity: 0, rotate: 0 }}
        animate={{ scale: [0.2, 1, 1.15], opacity: [0, 1, 0], rotate: [0, 200] }}
        transition={{ duration: 1.15, ease: [0.6, 0, 0.3, 1] }}
      >
        {SPARKS.map((deg, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: i % 3 === 0 ? 6 : 3,
              height: i % 3 === 0 ? 6 : 3,
              borderRadius: "50%",
              background: i % 4 === 0 ? c.rim : c.spark,
              boxShadow: `0 0 8px ${c.spark}`,
              transform: `rotate(${deg}deg) translateY(-35vmin)`,
            }}
          />
        ))}
        {/* inner glowing rim of the opening */}
        <div
          className="absolute inset-[6%] rounded-full"
          style={{
            border: `2px solid ${c.spark}`,
            boxShadow: `0 0 40px ${c.spark}, inset 0 0 40px ${c.spark}`,
            opacity: 0.5,
          }}
        />
      </motion.div>

      {/* Mandala shimmer — concentric sigil rings flaring out */}
      {[0, 0.08, 0.16].map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ border: `1px solid ${c.spark}`, opacity: 0.4 }}
          initial={{ width: "10vmin", height: "10vmin", opacity: 0 }}
          animate={{ width: "120vmin", height: "120vmin", opacity: [0, 0.5, 0] }}
          transition={{ duration: 1, ease: "easeOut", delay: d }}
        />
      ))}

      {/* The opening itself — destination era's colour pouring through */}
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${c.core}, transparent 70%)` }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{
          width: ["0vmax", "8vmax", "150vmax"],
          height: ["0vmax", "8vmax", "150vmax"],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 1.15, ease: [0.7, 0, 0.3, 1] }}
      />
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
      window.setTimeout(() => router.push(href), 600);
      window.setTimeout(() => setTarget(null), 1300);
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
