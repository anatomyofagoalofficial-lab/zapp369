"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CHART, LINKS } from "@/lib/constants";

/**
 * "The chart" — the live DexScreener chart for the ⚡ZAPP/SOL pair on the
 * Pump.fun AMM (PumpSwap), framed in ⚡ZAPP styling. If the embed is slow or
 * blocked, a clean fallback with direct links appears after a few seconds, so
 * it never dead-ends on an endless spinner.
 */
export function LiveChart() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="relative z-10 border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-white/40">
            Live market
          </p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">The chart</h2>
          <p className="mt-4 text-pretty text-present-white/55">
            Real-time price, straight from the Pump.fun AMM on Solana.
          </p>
        </div>

        {/* Gold-edged frame so the third-party chart sits inside ⚡ZAPP styling */}
        <div className="relative rounded-2xl border border-present-yellow/20 bg-present-black/40 p-1.5 shadow-[0_0_60px_-25px_rgba(255,215,0,0.5)]">
          <div className="relative h-[480px] w-full overflow-hidden rounded-xl sm:h-[620px]">
            {/* Fallback shown until the iframe reports it loaded */}
            {!loaded ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-present-black/60 text-center">
                <span className="font-mono text-xs uppercase tracking-ritual text-present-white/50">
                  Loading live chart…
                </span>
                <a
                  href={LINKS.dexscreener}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-present-blue/60 px-5 py-2 font-sans text-xs uppercase tracking-wider text-present-blue transition-colors hover:bg-present-blue hover:text-present-white"
                >
                  Open chart on DEXScreener <ArrowUpRight size={14} />
                </a>
              </div>
            ) : null}
            <iframe
              title="⚡ZAPP live price chart on Pump.fun AMM"
              src={CHART.embedUrl}
              onLoad={() => setLoaded(true)}
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
              allow="clipboard-write"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href={LINKS.pumpfun}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-present-yellow px-6 py-2.5 font-sans text-xs uppercase tracking-wider text-present-black transition-opacity hover:opacity-90"
          >
            Trade on Pump.fun <ArrowUpRight size={14} />
          </a>
          <a
            href={LINKS.dexscreener}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-present-blue/60 px-6 py-2.5 font-sans text-xs uppercase tracking-wider text-present-blue transition-colors hover:bg-present-blue hover:text-present-white"
          >
            Full chart on DEXScreener <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
