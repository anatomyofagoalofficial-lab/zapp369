"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type NavFn = (href: string) => void;
const TransitionCtx = createContext<NavFn>(() => {});
export const useTransitionNav = () => useContext(TransitionCtx);

/** Era tint for the wormhole, inferred from the destination route. */
function eraOf(href: string): { core: string; ring: string; star: string } {
  if (href.startsWith("/past"))
    return { core: "#E8B547", ring: "rgba(122,46,46,0.7)", star: "#F4E8D0" };
  if (href.startsWith("/present"))
    return { core: "#3B82F6", ring: "rgba(34,211,238,0.7)", star: "#F9FAFB" };
  if (href.startsWith("/future"))
    return { core: "#9D4EDD", ring: "rgba(34,211,238,0.7)", star: "#F9F9FF" };
  return { core: "#FFD700", ring: "rgba(255,215,0,0.6)", star: "#FFFFFF" };
}

// Deterministic star-streak angles (no Math.random → no hydration issues).
const STREAKS = Array.from({ length: 28 }, (_, i) => (360 / 28) * i);

function PortalOverlay({ href }: { href: string }) {
  const c = eraOf(href);
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* hyperspace star streaks rushing outward */}
      {STREAKS.map((deg, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 origin-left"
          style={{
            height: 2,
            background: `linear-gradient(to right, transparent, ${c.star})`,
            rotate: `${deg}deg`,
          }}
          initial={{ width: 0, x: 0, opacity: 0 }}
          animate={{ width: ["0px", "60vmax"], x: ["0vmax", "50vmax"], opacity: [0, 1, 0] }}
          transition={{ duration: 0.9, ease: "easeIn", delay: (i % 7) * 0.02 }}
        />
      ))}

      {/* wormhole rings collapsing inward then bursting */}
      {[0, 0.1, 0.2, 0.3].map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ border: `2px solid ${c.ring}` }}
          initial={{ width: "120vmax", height: "120vmax", opacity: 0 }}
          animate={{ width: 0, height: 0, opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.8, ease: "easeIn", delay: d }}
        />
      ))}

      {/* central singularity flash */}
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${c.core}, transparent 70%)` }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{
          width: ["0vmax", "10vmax", "160vmax"],
          height: ["0vmax", "10vmax", "160vmax"],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 1.1, ease: [0.7, 0, 0.3, 1] }}
      />
    </motion.div>
  );
}

/**
 * Wraps the app and turns internal navigation into a passage through space and
 * time: clicking an era link plays a full-screen hyperspace/wormhole cover,
 * THEN loads the destination underneath, then clears — so you feel like you
 * travelled, not just swapped pages. Reduced-motion → instant navigation.
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
      // cover the screen, then navigate beneath it
      window.setTimeout(() => router.push(href), 600);
      // lift the veil once the new page has rendered
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
