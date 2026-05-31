"use client";

import { useEffect, useMemo, useState } from "react";
import { TOKEN } from "@/lib/constants";

/** Format a USD amount, scaling decimals for tiny per-token prices. */
function usd(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n === 0) return "$0";
  if (n < 0.01)
    return `$${n.toLocaleString("en-US", { maximumSignificantDigits: 3 })}`;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 1000 ? 2 : 0,
  });
}

/**
 * Holdings value calculator. Enter how much ⚡ZAPP you hold and see its value at
 * the live price, plus a clearly-hypothetical "what-if market cap" explorer.
 * The what-if is simple math, never a prediction, target, or promise.
 * Live price is derived from the live market cap ÷ total supply (1B).
 */
export function Calculator() {
  const [amount, setAmount] = useState<number>(1_000_000);
  const [price, setPrice] = useState<number | null>(null);
  const [liveMcap, setLiveMcap] = useState<number | null>(null);
  const [whatIfMcap, setWhatIfMcap] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const mcap = Number(d?.marketCap);
        if (Number.isFinite(mcap) && mcap > 0) {
          setLiveMcap(mcap);
          setPrice(mcap / TOKEN.totalSupply);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const liveValue = useMemo(
    () => (price != null ? amount * price : null),
    [amount, price],
  );

  const whatIfValue = useMemo(() => {
    const m = Number(whatIfMcap.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(m) || m <= 0) return null;
    return amount * (m / TOKEN.totalSupply);
  }, [amount, whatIfMcap]);

  return (
    <section className="relative border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-white/40">
            The instrument
          </p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
            Your ⚡ZAPP, measured
          </h2>
          <p className="mt-4 text-pretty text-present-white/55">
            Enter how much you hold. See its value at the live price.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          {/* Amount input */}
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-ritual text-present-white/40">
              Your ⚡ZAPP holdings
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={amount ? amount.toLocaleString("en-US") : ""}
              onChange={(e) => {
                const n = Number(e.target.value.replace(/[^0-9]/g, ""));
                setAmount(Number.isFinite(n) ? n : 0);
              }}
              className="mt-2 w-full rounded-xl border border-white/10 bg-present-black/50 px-4 py-3 font-mono text-2xl text-present-white outline-none transition-colors focus:border-present-yellow/60"
              placeholder="1,000,000"
              aria-label="Amount of ⚡ZAPP you hold"
            />
          </label>

          {/* Quick presets */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[100_000, 1_000_000, 10_000_000, 100_000_000].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setAmount(n)}
                className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-present-white/60 transition-colors hover:border-present-yellow/50 hover:text-present-yellow"
              >
                {n.toLocaleString("en-US")}
              </button>
            ))}
          </div>

          {/* Live value */}
          <div className="mt-8 flex flex-col gap-1 border-t border-white/10 pt-6">
            <span className="font-mono text-xs uppercase tracking-ritual text-present-white/40">
              Value at live price
            </span>
            <span className="font-mono text-4xl text-present-yellow transition-all duration-500 sm:text-5xl">
              {liveValue != null ? usd(liveValue) : "…"}
            </span>
            <span className="mt-1 font-mono text-xs text-present-white/35">
              {price != null
                ? `live price ${usd(price)} · live market cap ${usd(liveMcap ?? 0)}`
                : "fetching live price…"}
            </span>
          </div>

          {/* Hypothetical explorer */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <label className="block">
              <span className="font-mono text-xs uppercase tracking-ritual text-present-blue">
                Hypothetical · explore a market cap
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={whatIfMcap}
                onChange={(e) => setWhatIfMcap(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-present-black/50 px-4 py-3 font-mono text-lg text-present-white outline-none transition-colors focus:border-present-blue/60"
                placeholder="e.g. 1,000,000"
                aria-label="Hypothetical market cap to explore"
              />
            </label>
            {whatIfValue != null ? (
              <p className="mt-4 font-mono text-2xl text-present-white">
                {usd(whatIfValue)}
                <span className="ml-2 text-sm text-present-white/40">
                  at that market cap
                </span>
              </p>
            ) : null}
            <p className="mt-4 text-xs leading-relaxed text-present-white/35">
              This is simple math (your tokens × the price at that market cap),
              not a prediction, target, or promise. ⚡ZAPP makes no claims about
              future value. It can go to zero. Nothing here is financial advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
