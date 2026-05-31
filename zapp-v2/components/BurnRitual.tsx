"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Flame, X } from "lucide-react";
import { BURN, TOKEN } from "@/lib/constants";

const DAY = 24 * 60 * 60 * 1000;

/** Next occurrence of an N-day cycle after `now`, anchored to launch. */
function nextCycle(anchor: number, cycleDays: number, now: number): number {
  const step = cycleDays * DAY;
  const elapsed = now - anchor;
  const cycles = Math.floor(elapsed / step) + 1;
  return anchor + cycles * step;
}

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

function Countdown({ target, label, accent }: { target: number; label: string; accent: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const p = now != null ? parts(target - now) : null;
  const cell = (v: number, unit: string) => (
    <div className="flex flex-col items-center">
      <span className="font-mono text-3xl tabular-nums text-future-white sm:text-4xl">
        {now != null ? String(v).padStart(2, "0") : "--"}
      </span>
      <span className="font-mono text-[0.6rem] uppercase tracking-ritual text-future-white/40">
        {unit}
      </span>
    </div>
  );

  return (
    <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
      <p className="font-mono text-xs uppercase tracking-ritual" style={{ color: accent }}>
        {label}
      </p>
      <div className="mt-5 flex items-center justify-center gap-4">
        {cell(p?.d ?? 0, "days")}
        {cell(p?.h ?? 0, "hrs")}
        {cell(p?.m ?? 0, "min")}
        {cell(p?.s ?? 0, "sec")}
      </div>
    </div>
  );
}

/**
 * The community burn ritual on the 3 · 6 · 9 cadence. Shows live countdowns to
 * the next 9-day burn and the next 369-day great burn, the philosophy, and a
 * safe "how to burn" guide. The site NEVER connects a wallet — members burn
 * their own tokens from their own wallet. Every burn is verifiable on Solscan.
 */
export function BurnRitual() {
  const [open, setOpen] = useState(false);
  const anchor = Date.parse(BURN.anchorISO);
  const [targets, setTargets] = useState<{ small: number; large: number } | null>(null);

  useEffect(() => {
    const now = Date.now();
    setTargets({
      small: nextCycle(anchor, BURN.smallCycleDays, now),
      large: nextCycle(anchor, BURN.largeCycleDays, now),
    });
  }, [anchor]);

  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-xs uppercase tracking-ritual text-future-gold">
          The burn ritual · 3 · 6 · 9
        </p>
        <h2 className="mt-4 text-balance font-serif text-3xl leading-tight sm:text-4xl">
          Fewer over time. Burned together.
        </h2>
        <p className="mx-auto mt-5 max-w-reading text-pretty font-serif text-lg leading-relaxed text-future-white/65">
          A small burn every 9 days when the community can. A great burn every
          369 days. Supply only ever moves one way: down. Owned by everyone,
          decided together, provable on-chain.
        </p>

        {/* Countdowns */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Countdown
            target={targets?.small ?? anchor}
            label="Next 9-day burn"
            accent="#22D3EE"
          />
          <Countdown
            target={targets?.large ?? anchor}
            label="Next 369-day great burn"
            accent="#9D4EDD"
          />
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-future-gold px-7 py-3 font-sans text-sm uppercase tracking-wider text-future-black transition-opacity hover:opacity-90"
          >
            <Flame size={16} /> Burn ⚡ZAPP
          </button>
          <a
            href={BURN.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-future-cyan/60 px-7 py-3 font-sans text-sm uppercase tracking-wider text-future-cyan transition-colors hover:bg-future-cyan hover:text-future-black"
          >
            Verify burns on Solscan <ArrowUpRight size={14} />
          </a>
        </div>

        <p className="mt-6 font-mono text-xs text-future-white/35">
          Total supply: {TOKEN.totalSupplyLabel}. Mint authority revoked, so no
          new ⚡ZAPP can ever be created. Every burn is permanent.
        </p>
      </div>

      {/* How-to-burn modal (no wallet connect) */}
      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-future-black/80 px-6 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-label="How to burn ⚡ZAPP"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-future-gold/30 bg-future-violet/95 p-8 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-future-white/50 transition-colors hover:text-future-white"
            >
              <X size={20} />
            </button>

            <p className="font-mono text-xs uppercase tracking-ritual text-future-gold">
              Burn your own ⚡ZAPP
            </p>
            <h3 className="mt-2 font-serif text-2xl text-future-white">
              How the ritual works
            </h3>

            <ol className="mt-5 space-y-3 text-sm leading-relaxed text-future-white/75">
              <li>
                <span className="text-future-gold">1.</span> Burning is done from
                your own wallet. This site never connects a wallet and never asks
                you to sign anything.
              </li>
              <li>
                <span className="text-future-gold">2.</span> In a Solana wallet
                such as Phantom or Solflare, open your ⚡ZAPP token, find the
                token menu, and choose the &ldquo;Burn&rdquo; option.
              </li>
              <li>
                <span className="text-future-gold">3.</span> Choose how much to
                burn and confirm. The tokens are destroyed forever and the supply
                drops for everyone.
              </li>
              <li>
                <span className="text-future-gold">4.</span> Share your burn
                transaction in the community so we can celebrate it together.
              </li>
            </ol>

            <p className="mt-6 rounded-xl border border-future-gold/30 bg-future-black/40 p-4 text-xs leading-relaxed text-future-white/60">
              ⚠️ Burning is permanent and irreversible. Only ever burn what you
              choose to. It is a voluntary act of conviction, never required, and
              never financial advice. Always confirm you are burning the real
              ⚡ZAPP token (contract on the buy page).
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
