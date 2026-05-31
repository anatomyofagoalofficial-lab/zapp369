import { ArrowUpRight } from "lucide-react";
import { CHART, LINKS } from "@/lib/constants";
import { getOhlcv } from "@/lib/chart";
import { BrandChart } from "./BrandChart";

function formatPrice(n: number | undefined): string {
  if (!n || !Number.isFinite(n)) return "—";
  return n >= 1 ? `$${n.toFixed(4)}` : `$${n.toPrecision(3)}`;
}

/**
 * "The chart" — a bespoke, on-brand ⚡ZAPP candlestick chart (SVG, no widget),
 * fed by live GeckoTerminal data for the Pump.fun AMM (PumpSwap) pair. If the
 * data source is unavailable, falls back to the live DexScreener embed so the
 * section is never empty.
 */
export async function LiveChart() {
  const candles = await getOhlcv();
  const last = candles[candles.length - 1];
  const first = candles[0];
  const changePct =
    last && first && first.c ? ((last.c - first.c) / first.c) * 100 : 0;
  const up = changePct >= 0;

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

        {candles.length > 1 ? (
          <div className="rounded-2xl border border-white/10 bg-present-black/40 p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-ritual text-present-white/50">
                ZAPP / SOL · PumpSwap
              </span>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-2xl text-present-white">
                  {formatPrice(last?.c)}
                </span>
                <span
                  className={`font-mono text-sm ${up ? "text-present-green" : "text-present-blue"}`}
                >
                  {up ? "▲" : "▼"} {Math.abs(changePct).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="w-full" style={{ aspectRatio: "1000 / 420" }}>
              <BrandChart candles={candles} />
            </div>

            <p className="mt-3 text-right font-mono text-[0.65rem] uppercase tracking-wider text-present-white/30">
              ~15 days · 4h candles · data via GeckoTerminal
            </p>
          </div>
        ) : (
          /* Fallback: live DexScreener embed if our data source is unreachable */
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
        )}

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
