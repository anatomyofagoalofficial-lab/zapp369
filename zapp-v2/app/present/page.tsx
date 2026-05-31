import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MathTexture } from "@/components/MathTexture";
import { Reveal } from "@/components/Reveal";
import { LiveStat } from "@/components/LiveStat";
import { LiveChart } from "@/components/LiveChart";
import { Calculator } from "@/components/Calculator";
import { MascotHero } from "@/components/MascotHero";
import { Numeral3D } from "@/components/Numeral3D";
import { Parallax } from "@/components/Parallax";
import { ScrollTeleport } from "@/components/ScrollTeleport";
import { VerifiedPanel } from "@/components/VerifiedPanel";
import { getStats } from "@/lib/stats";
import { formatNumber, formatUsd } from "@/lib/utils";
import { SLOGANS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Present · The Current",
  description:
    "May 2026. The chain is live, the community is plugged in. Verified on-chain: mint revoked, freeze revoked, LP burned, 0% tax.",
};

// Revalidate the live market data every 5 minutes.
export const revalidate = 300;

/** A simple node-network motif (original line art). */
function NetworkMotif() {
  const nodes = [
    { x: 100, y: 60 },
    { x: 40, y: 110 },
    { x: 160, y: 110 },
    { x: 60, y: 175 },
    { x: 140, y: 175 },
    { x: 100, y: 120 },
  ];
  return (
    <svg
      viewBox="0 0 200 230"
      aria-hidden="true"
      className="h-full w-full"
    >
      {nodes.map((n, i) =>
        nodes.slice(i + 1).map((m, j) => (
          <line
            key={`${i}-${j}`}
            x1={n.x}
            y1={n.y}
            x2={m.x}
            y2={m.y}
            stroke="#3B82F6"
            strokeOpacity="0.25"
            strokeWidth="0.75"
          />
        )),
      )}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === 5 ? 7 : 4}
          fill={i === 5 ? "#FFD700" : "#E8B547"}
          fillOpacity={i === 5 ? 1 : 0.7}
        />
      ))}
    </svg>
  );
}

export default async function PresentPage() {
  const stats = await getStats();

  return (
    <main className="relative min-h-screen bg-present-navy text-present-white">
      <MathTexture era="present" />

      {/* ── Hero ── */}
      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center overflow-hidden px-6 py-32">
        <Numeral3D
          era="present"
          value="6"
          className="ghost-number font-serif opacity-50"
          style={{ fontSize: "clamp(14rem, 34vw, 30rem)", bottom: "-3rem", right: "-1rem" }}
        />
        <div className="relative grid items-center gap-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-ritual text-present-blue">
              6 · Present · The Current
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-ritual text-present-white/40">
              Solana · May 2026 · live now
            </p>
            <h1 className="mt-8 max-w-reading text-balance font-serif text-5xl font-semibold leading-tight sm:text-6xl">
              The instrument is on.
            </h1>
            <p className="mt-6 max-w-reading text-pretty text-lg leading-relaxed text-present-white/70">
              ⚡ZAPP is real, it is live, and the community exists. The frequency
              is transmitting. Verifiable, on-chain, owned by no one.
            </p>
          </div>

          {/* The mascot at the centre of the network — the instrument is on. */}
          <div className="relative mx-auto w-full max-w-sm">
            <Parallax speed={70} className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 opacity-60">
              <NetworkMotif />
            </Parallax>
            <Parallax speed={-40} className="relative">
              <MascotHero era="present" priority />
            </Parallax>
          </div>
        </div>
      </section>

      {/* ── Live instrument panel ── */}
      <section className="relative border-t border-white/5 px-6 py-24">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-white/40">
            Instrument panel
          </p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
            Read the frequency
          </h2>
        </Reveal>

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LiveStat
            label="Holders"
            value={`${formatNumber(stats.holders)}+`}
            sub="wallets"
          />
          <LiveStat
            label="Market cap"
            value={formatUsd(stats.marketCap)}
            sub={stats.live ? "live" : "·"}
          />
          <LiveStat
            label="24h volume"
            value={formatUsd(stats.volume24h)}
            sub={stats.live ? "live" : "·"}
          />
          <LiveStat
            label="Telegram"
            value={`${formatNumber(stats.telegramMembers)}+`}
            sub="members"
          />
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center font-mono text-[0.7rem] uppercase tracking-wider text-present-white/30">
          Market data live from Solana, refreshed every few minutes. Holder and
          member counts shown as last verified. Falls back to known values if a
          source is unreachable.
        </p>
      </section>

      {/* ── The chart: live Pump.fun AMM chart ── */}
      <LiveChart />

      {/* ── Holdings value calculator ── */}
      <Calculator />

      {/* ── Verified on-chain ── */}
      <VerifiedPanel />

      {/* ── The Movement (Whitepaper VI) ── */}
      <section className="relative border-t border-white/5 px-6 py-28">
        <Reveal className="mx-auto max-w-reading">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-blue">
            From the Whitepaper · VI. The Movement
          </p>
          <blockquote className="mt-6 font-serif text-2xl leading-relaxed sm:text-3xl">
            &ldquo;A frequency means nothing without receivers. ⚡ZAPP built its
            community in real time. In a single day, 1,438 people joined the
            Telegram. Just people who recognised the signal.&rdquo;
          </blockquote>
          <p className="mt-8 text-pretty text-lg leading-relaxed text-present-white/70">
            No paid promotion. No manipulation. The frequency keeps reaching new
            ears, every day, organically. Community owned. No corporation, no
            VC, no bank.
          </p>
        </Reveal>
      </section>

      {/* ── Onward ── */}
      <section className="px-6 py-24">
        <div className="mx-auto flex max-w-reading flex-col items-start gap-4">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-white/40">
            {SLOGANS.numerology}
          </p>
          <Link
            href="/future"
            className="group inline-flex items-center gap-2 font-serif text-2xl text-present-white transition-colors hover:text-present-yellow"
          >
            See where the signal is going
            <ArrowRight
              size={22}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      <ScrollTeleport to="/future" />
    </main>
  );
}
