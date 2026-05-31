"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * A live-instrument readout. The number COUNTS UP when it scrolls into view
 * (the digits race up like an instrument powering on), the card lifts and its
 * gold edge glows on hover. Reduced-motion → shows the final value instantly.
 */
export function LiveStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : "");

  // Split the formatted value into prefix + number + suffix so we can animate
  // only the numeric core (keeps $, +, K/M and decimals intact).
  useEffect(() => {
    if (reduce || !inView) {
      if (reduce) setDisplay(value);
      return;
    }
    const m = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
    if (!m) {
      setDisplay(value);
      return;
    }
    const [, prefix, numStr, suffix] = m;
    const target = parseFloat(numStr.replace(/,/g, ""));
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    const grouped = numStr.includes(",");
    const dur = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const cur = target * eased;
      let s = decimals ? cur.toFixed(decimals) : Math.round(cur).toString();
      if (grouped) {
        const parts = s.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        s = parts.join(".");
      }
      setDisplay(`${prefix}${s}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return (
    <motion.div
      ref={ref}
      className="group rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-present-yellow/50 hover:shadow-[0_0_40px_-12px_rgba(255,215,0,0.5)]"
      initial={reduce ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="font-mono text-xs uppercase tracking-ritual text-present-white/40">
        {label}
      </p>
      <p className="mt-3 font-serif text-3xl tabular-nums text-present-white transition-colors group-hover:text-present-yellow">
        {display || value}
      </p>
      {sub ? (
        <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-wider text-present-white/40">
          {sub}
        </p>
      ) : null}
    </motion.div>
  );
}
