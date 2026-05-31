import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { BrandMark } from "@/components/BrandMark";
import { WorldClock } from "@/components/WorldClock";
import { MascotHero } from "@/components/MascotHero";
import { BurnRitual } from "@/components/BurnRitual";
import { Numeral3D } from "@/components/Numeral3D";
import { Parallax } from "@/components/Parallax";
import { ScrollTeleport } from "@/components/ScrollTeleport";
import { FutureHUD } from "@/components/FutureHUD";
import { DigitalRain } from "@/components/DigitalRain";
import { FutureBoot } from "@/components/FutureBoot";
import { LINKS, SLOGANS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Future · The Network",
  description:
    "What ⚡ZAPP becomes when Tesla's vision is realised. Community-owned. Borderless. Free for everyone. Forever on the blockchain.",
};

/** Branching light — like wireless transmission across a planetary network
 *  (Gaudí biomimicry: river deltas / neurons, never sharp zigzags). */
function BranchingLight() {
  return (
    <svg
      viewBox="0 0 240 360"
      fill="none"
      aria-hidden="true"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
          <stop offset="60%" stopColor="#22D3EE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* trunk */}
      <path d="M120 360 C120 300 120 260 120 220" stroke="url(#beam)" strokeWidth="2" />
      {/* primary branches */}
      <path d="M120 220 C95 190 80 170 60 150" stroke="url(#beam)" strokeWidth="1.4" />
      <path d="M120 220 C145 190 160 170 180 150" stroke="url(#beam)" strokeWidth="1.4" />
      <path d="M120 220 C118 185 116 160 110 120" stroke="url(#beam)" strokeWidth="1.4" />
      {/* secondary branches */}
      <path d="M60 150 C50 135 44 126 34 116" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="0.9" />
      <path d="M60 150 C66 132 70 122 74 108" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="0.9" />
      <path d="M180 150 C190 135 196 126 206 116" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="0.9" />
      <path d="M180 150 C174 132 170 122 166 108" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="0.9" />
      <path d="M110 120 C104 104 100 96 92 84" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="0.9" />
      <path d="M110 120 C116 104 120 96 128 84" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="0.9" />
      {/* node lights */}
      {[
        [34, 116],
        [74, 108],
        [206, 116],
        [166, 108],
        [92, 84],
        [128, 84],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#FFD700" fillOpacity="0.85" />
      ))}
      <circle cx="120" cy="220" r="4" fill="#9D4EDD" />
    </svg>
  );
}

export default function FuturePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Clean black field: monochrome grid + falling on-chain numbers + gold
          shaft. Crisp black + white + ⚡ZAPP gold, unified across the site. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 75% 60% at 50% 35%, black, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 35%, black, transparent 85%)",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.20]">
        <DigitalRain className="h-full w-full" density={1} />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[70vh] bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,rgba(255,215,0,0.12),transparent_70%)]"
      />

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">
        <Numeral3D
          era="future"
          value="9"
          className="ghost-number font-serif opacity-40"
          style={{ fontSize: "clamp(16rem, 40vw, 34rem)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />
        <p className="relative font-mono text-xs uppercase tracking-ritual text-present-yellow">
          9 · Future · The Network
        </p>

        <h1 className="relative mt-6 max-w-3xl text-balance font-serif text-6xl font-semibold leading-[1.05] text-glow-gold sm:text-8xl">
          When the signal belongs to everyone.
        </h1>

        <p className="relative mt-10 max-w-reading text-pretty font-serif text-xl leading-relaxed text-white/80">
          Free money. Free energy. No gatekeepers. The revolution Tesla started,
          carried at the speed of light to anyone with a phone, anywhere on this
          planet.
        </p>

        {/* The boot sequence: code writes itself, then futuristic tech ignites */}
        <div className="relative mt-14 w-full">
          <FutureBoot className="w-full" />
        </div>

        <p className="relative mt-10 font-mono text-xs uppercase tracking-ritual text-white/40">
          ↓ Enter the network
        </p>
      </section>

      {/* ── One world · live time zones (carried over from v1) ── */}
      <section className="relative z-10 scroll-mt-24 px-6 pb-24 pt-12">
        <Reveal className="mx-auto max-w-5xl text-center">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-yellow">
            One frequency · One signal · One world
          </p>
          <h2 className="mt-4 text-balance font-serif text-3xl leading-tight sm:text-4xl">
            No banks. No borders. Zapped to anyone, anywhere on Earth.
          </h2>
          <div className="mt-10">
            <WorldClock />
          </div>
          <p className="mt-10 font-serif text-lg italic text-white/60">
            ⚡ Tesla&rsquo;s frequency reaches every time zone.
          </p>
        </Reveal>
      </section>

      {/* ── The Direction (Whitepaper VII) ── */}
      <section className="relative z-10 bg-black/30 px-6 py-28 backdrop-blur-sm">
        <Reveal className="mx-auto max-w-reading">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-yellow">
            From the Whitepaper · VII. The Roadmap
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Energy for everyone
          </h2>
          <p className="mt-6 text-pretty font-serif text-xl leading-relaxed text-white/75">
            These are directions the community is moving toward. Not deadlines,
            not promises, but the shape of what&rsquo;s next, decided together,
            in the open:
          </p>
          <ul className="mt-8 space-y-4 font-serif text-lg leading-relaxed text-white/70">
            {[
              "Instant ⚡ZAPP payments at live events and community gatherings worldwide",
              "Building toward partnerships with humanitarian organisations and NGOs",
              "Direct, borderless, instant support for individuals and families in need",
              "Reaching grassroots communities across Africa, Asia, and Latin America",
              "Micro-grants and donations powered by ⚡ZAPP, no bank, no middleman",
            ].map((item) => (
              <li key={item} className="flex gap-4">
                <span aria-hidden="true" className="mt-1 text-present-yellow">
                  ◆
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-pretty text-sm leading-relaxed text-white/40">
            Items above are aspirations the community is exploring, not
            commitments. See the whitepaper&rsquo;s honest words for the full
            risk disclosure.
          </p>
        </Reveal>
      </section>

      {/* ── The burn ritual (3 · 6 · 9) ── */}
      <BurnRitual />

      {/* ── Closing poetry ── */}
      <section className="relative z-10 border-y border-white/5 px-6 py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-balance font-serif text-3xl leading-relaxed sm:text-4xl">
            <BrandMark className="text-white" boltClassName="text-present-yellow" />{" "}
            is not just a token. It is the answer Tesla never got to give.
          </p>
          <p className="mt-8 font-serif text-2xl italic leading-relaxed text-white/70">
            Decentralised. Borderless. Free for everyone. Forever on the
            blockchain.
          </p>
          <p className="mt-10 font-mono text-sm uppercase tracking-ritual text-present-yellow">
            {SLOGANS.numerology}
          </p>
          <p className="mt-2 font-mono text-sm uppercase tracking-ritual text-present-yellow">
            {SLOGANS.freeEnergy}
          </p>
        </Reveal>
      </section>

      {/* ── Final invitation ── */}
      <section className="relative z-10 px-6 py-28">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl">Join the frequency</h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href={LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-future-gold px-8 py-3 font-sans text-sm uppercase tracking-wider text-future-black transition-opacity hover:opacity-90"
            >
              Open Telegram <ArrowUpRight size={16} />
            </a>
            <Link
              href="/how-to-buy"
              className="inline-flex items-center gap-2 rounded-full border border-future-cyan/60 px-8 py-3 font-sans text-sm uppercase tracking-wider text-present-yellow transition-colors hover:bg-future-cyan hover:text-future-black"
            >
              How to buy <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>

      <ScrollTeleport to="/past" />
    </main>
  );
}
