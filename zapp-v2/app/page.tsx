import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { MathTexture } from "@/components/MathTexture";
import { EraDoorway } from "@/components/EraDoorway";
import { VerifiedPanel } from "@/components/VerifiedPanel";
import { Reveal } from "@/components/Reveal";
import { MascotHero } from "@/components/MascotHero";
import { IntroScene } from "@/components/IntroScene";
import { ShaderCanvas } from "@/components/ShaderCanvas";
import { Marquee } from "@/components/Marquee";
import { ElectricArcs } from "@/components/ElectricArcs";
import { EnterGate } from "@/components/EnterGate";
import { ERAS, SLOGANS } from "@/lib/constants";

/**
 * Home — the foyer. Deliberately small. Sets the frame, then invites the
 * visitor to enter one of the three eras. Less is more.
 */
export default function Home() {
  return (
    <main className="relative">
        {/* The threshold: tower far away → tap to rush inside */}
        <EnterGate />

        {/* Cinematic cosmos field behind the whole home page (warm nebula +
            receding grid), fully visible behind a legibility wash. */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <ShaderCanvas shader="cosmos" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-present-black/70 via-present-black/55 to-present-black/85" />
          {/* electricity everywhere */}
          <ElectricArcs tone="gold" className="absolute inset-0 h-full w-full opacity-50" />
        </div>

        {/* ── Scroll-pinned cinematic opener (Solana technique, ⚡ZAPP-themed) ── */}
        <div className="relative z-10">
        <IntroScene />

        {/* ── Masthead (the settled hero) ── */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-28 text-center">
          {/* Light pouring from above onto the mascot */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_50%_38%,rgba(255,215,0,0.16),transparent_65%)]"
          />

          <div className="relative flex flex-col items-center">
            {/* The mascot, standing in a shaft of light */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-[120%] w-[60%] -translate-x-1/2 bg-[radial-gradient(ellipse_50%_60%_at_50%_30%,rgba(255,215,0,0.22),transparent_70%)] blur-2xl"
              />
              <MascotHero era="home" priority className="relative w-[clamp(9rem,22vw,15rem)]" />
            </div>

            {/* Monumental wordmark, overlapping up under the mascot */}
            <BrandMark
              as="h1"
              boltClassName="text-present-yellow animate-glow-pulse"
              className="text-glow-gold -mt-4 text-[clamp(4.5rem,17vw,12rem)] font-semibold leading-[0.85] tracking-tight text-present-white"
            />

            <p className="mt-6 font-serif text-2xl italic text-present-white/85 sm:text-3xl">
              Free Energy = Free Money <span className="text-present-yellow">∞</span>
            </p>

            <div className="mt-5 flex items-center justify-center gap-4 text-present-white/45">
              <span className="h-px w-10 bg-present-yellow/30" />
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em]">
                Tesla&rsquo;s Unfinished Revolution
              </span>
              <span className="h-px w-10 bg-present-yellow/30" />
            </div>

            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
              <a
                href="#doorways"
                className="rounded-full bg-present-yellow px-9 py-3.5 font-sans text-sm uppercase tracking-wider text-present-black shadow-[0_0_50px_-12px_rgba(255,215,0,0.8)] transition-all duration-300 hover:scale-[1.03]"
              >
                Enter the signal
              </a>
              <Link
                href="/whitepaper"
                className="rounded-full border border-present-white/25 px-8 py-3.5 font-sans text-sm uppercase tracking-wider text-present-white/70 transition-colors duration-300 hover:border-present-white hover:text-present-white"
              >
                Read the whitepaper
              </Link>
            </div>
          </div>

          <a
            href="#doorways"
            aria-label="Scroll to the three eras"
            className="absolute bottom-6 text-present-white/40 transition-colors hover:text-present-white/80"
          >
            <ChevronDown size={24} className="animate-bounce" />
          </a>
        </section>

        {/* ── The signal ticker — always transmitting ── */}
        <Marquee />

        {/* ── The three doorways ── */}
        <section id="doorways" className="tech-grid relative scroll-mt-20 px-6 py-24 sm:py-32">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-ritual text-present-white/40">
              Three eras · One signal
            </p>
            <h2 className="mt-4 font-serif text-4xl text-present-white sm:text-5xl">
              Enter the revolution
            </h2>
            <p className="mt-4 text-pretty text-present-white/55">
              Past, Present, and Future. Three immersive worlds, one frequency.
            </p>
          </Reveal>

          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
            {ERAS.map((era, i) => (
              <Reveal key={era.key} delay={i * 0.12}>
                <EraDoorway era={era} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Verified on-chain ── */}
        <VerifiedPanel />
        </div>
      </main>
  );
}
