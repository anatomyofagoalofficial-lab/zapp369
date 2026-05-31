"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTransitionNav } from "./TransitionProvider";

const LABEL: Record<string, string> = {
  "/past": "the Past",
  "/present": "the Present",
  "/future": "the Future",
};

/**
 * Scroll-to-teleport. When the visitor reaches the bottom of an era page and
 * keeps scrolling / swiping (overscroll), a "pull to travel" indicator fills.
 * When it completes, the space-time wormhole fires and carries them to the next
 * era — a continuous 3·6·9 journey (Past → Present → Future → Past).
 *
 * Threshold-based so it never fires accidentally; resets if they stop. Honors
 * reduced-motion (no auto-teleport; the footer links still navigate).
 */
const THRESHOLD = 600; // accumulated overscroll px needed to trigger

export function ScrollTeleport({ to }: { to: string }) {
  const go = useTransitionNav();
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const acc = useRef(0);
  const fired = useRef(false);
  const decayTimer = useRef<number | null>(null);

  useEffect(() => {
    if (reduce) return;

    function atBottom() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      return window.scrollY >= scrollable - 4;
    }

    function bump(delta: number) {
      if (fired.current) return;
      if (delta <= 0 || !atBottom()) {
        // ease the meter back down when not actively pulling
        return;
      }
      acc.current = Math.min(THRESHOLD, acc.current + delta);
      setProgress(acc.current / THRESHOLD);

      if (decayTimer.current) window.clearTimeout(decayTimer.current);
      decayTimer.current = window.setTimeout(() => {
        acc.current = 0;
        setProgress(0);
      }, 400);

      if (acc.current >= THRESHOLD) {
        fired.current = true;
        setProgress(1);
        go(to);
      }
    }

    function onWheel(e: WheelEvent) {
      bump(e.deltaY);
    }

    let lastTouch = 0;
    function onTouchStart(e: TouchEvent) {
      lastTouch = e.touches[0]?.clientY ?? 0;
    }
    function onTouchMove(e: TouchEvent) {
      const y = e.touches[0]?.clientY ?? 0;
      bump(lastTouch - y); // swipe up = positive
      lastTouch = y;
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      if (decayTimer.current) window.clearTimeout(decayTimer.current);
    };
  }, [go, to, reduce]);

  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[58] flex flex-col items-center pb-6"
      style={{ opacity: progress > 0.02 ? 1 : 0, transition: "opacity 300ms" }}
    >
      <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-ritual text-white/70">
        Keep scrolling to travel to {LABEL[to] ?? "the next era"}
      </p>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-white/15">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-present-yellow via-future-cyan to-future-crown"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
