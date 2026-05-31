import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { MathTexture } from "@/components/MathTexture";
import { EraDoorway } from "@/components/EraDoorway";
import { VerifiedPanel } from "@/components/VerifiedPanel";
import { Reveal } from "@/components/Reveal";
import { MascotHero } from "@/components/MascotHero";
import { ScrollScene } from "@/components/ScrollScene";
import { IntroScene } from "@/components/IntroScene";
import { ERAS, SLOGANS, TESLA_QUOTES } from "@/lib/constants";

/**
 * Home — the foyer. Deliberately small. Sets the frame, then invites the
 * visitor to enter one of the three eras. Less is more.
 */
export default function Home() {
  return (
    <main>
        {/* ── Scroll-pinned cinematic opener (Solana technique, ⚡ZAPP-themed) ── */}
        <ScrollScene heightVh={260} className="relative">
          {(progress) => <IntroScene progress={progress} />}
        </ScrollScene>

        {/* ── Masthead (the settled hero) ── */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
          {/* Light pouring from above */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(255,215,0,0.12),transparent_60%)]"
          />
          <MathTexture era="home" className="opacity-[0.05]" />

          <div className="relative flex max-w-3xl flex-col items-center gap-8">
            <BrandMark
              as="h1"
              boltClassName="text-present-yellow animate-glow-pulse"
              className="text-glow-gold text-[clamp(4rem,15vw,10rem)] font-semibold leading-none tracking-tight text-present-white"
            />

            <div className="flex w-full items-center justify-center gap-4 text-present-white/50">
              <span className="h-px w-12 bg-present-white/20" />
              <span className="font-mono text-xs uppercase tracking-ritual">
                Tesla&rsquo;s Unfinished Revolution
              </span>
              <span className="h-px w-12 bg-present-white/20" />
            </div>

            <blockquote className="max-w-reading text-pretty font-serif text-2xl italic leading-relaxed text-present-white/85 sm:text-3xl">
              &ldquo;{TESLA_QUOTES.magnificence}&rdquo;
              <cite className="mt-4 block font-sans text-sm not-italic tracking-ritual text-present-white/45">
                Nikola Tesla
              </cite>
            </blockquote>

            <p className="font-mono text-sm uppercase tracking-ritual text-present-yellow">
              {SLOGANS.freeEnergy}
            </p>

            <MascotHero era="home" priority className="mt-4 max-w-[14rem]" />

            <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
              <a
                href="#doorways"
                className="rounded-full border border-present-yellow/70 px-8 py-3 font-sans text-sm uppercase tracking-wider text-present-yellow transition-colors duration-300 hover:bg-present-yellow hover:text-present-black"
              >
                Enter the signal
              </a>
              <Link
                href="/whitepaper"
                className="px-4 py-3 font-sans text-sm uppercase tracking-wider text-present-white/60 underline-offset-4 transition-colors duration-300 hover:text-present-white hover:underline"
              >
                Read the whitepaper
              </Link>
            </div>
          </div>

          <a
            href="#doorways"
            aria-label="Scroll to the three eras"
            className="absolute bottom-8 text-present-white/40 transition-colors hover:text-present-white/80"
          >
            <ChevronDown size={24} className="animate-bounce" />
          </a>
        </section>

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
    </main>
  );
}
