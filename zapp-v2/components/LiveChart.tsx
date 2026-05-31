import { ArrowUpRight } from "lucide-react";
import { CHART, LINKS } from "@/lib/constants";

/**
 * Live price chart — embeds the ⚡ZAPP/SOL pair on the Pump.fun AMM (PumpSwap)
 * via DexScreener's iframe widget. Real-time, no API key, no extra libraries.
 */
export function LiveChart() {
  return (
    <section className="relative border-t border-white/5 px-6 py-24">
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

        <div className="relative h-[460px] w-full overflow-hidden rounded-2xl border border-white/10 bg-present-black/40 sm:h-[600px]">
          <iframe
            title="⚡ZAPP live price chart"
            src={CHART.embedUrl}
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
            loading="lazy"
            allow="clipboard-write"
          />
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
