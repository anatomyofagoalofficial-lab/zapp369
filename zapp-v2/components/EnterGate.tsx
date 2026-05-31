"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { WardenclyffeTower } from "./WardenclyffeTower";
import { ElectricArcs } from "./ElectricArcs";
import { BrandMark } from "./BrandMark";

/**
 * The threshold. On first arrival the visitor sees the Wardenclyffe tower far
 * away across a dark, electric plain — then taps to be pulled INTO the site,
 * rushing toward the tower until it fills the screen and the world opens.
 *
 * Shows once per browser session (sessionStorage), so navigating around later
 * doesn't re-gate. Reduced-motion → a simple, instant "Enter" button.
 */
export function EnterGate() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem("zapp-entered")) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function enter() {
    try {
      sessionStorage.setItem("zapp-entered", "1");
    } catch {}
    if (reduce) {
      setShow(false);
      return;
    }
    setEntering(true);
    window.setTimeout(() => setShow(false), 1500);
  }

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#050301]"
          onClick={enter}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="button"
          aria-label="Enter the ⚡ZAPP experience"
        >
          {/* electric plain */}
          <ElectricArcs tone="gold" className="absolute inset-0 h-full w-full opacity-50" />
          {/* horizon glow under the tower */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-[30%] h-[40vh] bg-[radial-gradient(ellipse_50%_100%_at_50%_100%,rgba(255,180,60,0.25),transparent_70%)]"
          />

          {/* the whole scene rushes toward the tower on enter */}
          <motion.div
            className="relative flex flex-col items-center"
            animate={
              entering
                ? { scale: 9, opacity: 0, filter: "blur(6px)" }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 1.5, ease: [0.6, 0, 0.3, 1] }}
          >
            {/* the tower, small and far away */}
            <motion.div
              className="relative w-32 origin-bottom opacity-80 sm:w-40"
              animate={reduce ? undefined : { y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <WardenclyffeTower className="h-full w-full drop-shadow-[0_0_30px_rgba(255,180,60,0.4)]" />
            </motion.div>

            <BrandMark
              as="div"
              boltClassName="text-present-yellow animate-glow-pulse"
              className="text-glow-gold mt-6 text-4xl font-semibold tracking-tight text-present-white sm:text-5xl"
            />
            <p className="mt-3 font-serif text-base italic text-[#f4e8d0]/70">
              The tower waits across a century.
            </p>
          </motion.div>

          {/* tap prompt */}
          {!entering ? (
            <motion.p
              className="absolute bottom-16 font-mono text-xs uppercase tracking-[0.5em] text-present-yellow"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              ⚡ Tap to enter
            </motion.p>
          ) : null}

          {/* white flash at the moment of entry */}
          {entering && !reduce ? (
            <motion.div
              className="pointer-events-none absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.8, 0] }}
              transition={{ duration: 1.5, times: [0, 0.6, 0.82, 1] }}
            />
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
