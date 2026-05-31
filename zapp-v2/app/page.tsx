import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { EraDoorway } from "@/components/EraDoorway";
import { VerifiedPanel } from "@/components/VerifiedPanel";
import { Reveal } from "@/components/Reveal";
import { MascotHero } from "@/components/MascotHero";
import { Marquee } from "@/components/Marquee";
import { DigitalRain } from "@/components/DigitalRain";
import { ERAS, SLOGANS, TESLA_QUOTES } from "@/lib/constants";

/**
 * Home — the foyer. Clean, premium, Solana-grammar: one strong hero on deep
 * black with a single shaft of light, generous space, large type, minimal
 * motion. The cosmos shader sits far behind, dimmed, so the page reads as a lit
 * room rather than a busy effect reel. Less is more.
 */
export default function Home() {
  return (
    <main className="relative bg-black">
      {/* Clean black-and-white field: a faint monochrome grid + soft vignette. */}
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

      {/* Falling on-chain numbers (3·6·9 + hex) — small, crisp, in the back */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.22]">
        <DigitalRain className="h-full w-full" density={1} />
      </div>

      <div className="relative z-10">
        {/* ── Hero ── */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
          {/* single shaft of light from above */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(ellipse_42%_60%_at_50%_0%,rgba(255,215,0,0.18),transparent_70%)]"
          />

          <div className="relative flex flex-col items-center">
            <MascotHero
              era="home"
              priority
              className="relative w-[clamp(8rem,20vw,13rem)] drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            />

            <BrandMark
              as="h1"
              boltClassName="text-present-yellow"
              className="text-glow-gold -mt-2 text-[clamp(4.5rem,18vw,13rem)] font-semibold leading-[0.82] tracking-tight text-present-white"
            />

            <p className="mt-7 font-serif text-2xl italic text-present-white/80 sm:text-3xl">
              Free Energy = Free Money <span className="text-present-yellow">∞</span>
            </p>

            <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.35em] text-present-white/40">
              Tesla&rsquo;s Unfinished Revolution · On Solana
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/how-to-buy"
                className="rounded-full bg-present-yellow px-9 py-3.5 font-sans text-sm uppercase tracking-wider text-present-black shadow-[0_0_50px_-12px_rgba(255,215,0,0.8)] transition-transform duration-300 hover:scale-[1.03]"
              >
                Buy ⚡ZAPP
              </Link>
              <a
                href="#doorways"
                className="rounded-full border border-present-white/20 px-8 py-3.5 font-sans text-sm uppercase tracking-wider text-present-white/70 transition-colors duration-300 hover:border-present-white hover:text-present-white"
              >
                Enter the eras
              </a>
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

        {/* ── The signal ticker ── */}
        <Marquee />

        {/* ── A single calm Tesla line (breathing room, Solana-style) ── */}
        <section className="relative px-6 py-28 sm:py-36">
          <Reveal className="mx-auto max-w-3xl text-center">
            <blockquote className="text-balance font-serif text-3xl italic leading-relaxed text-present-white/90 sm:text-4xl">
              &ldquo;{TESLA_QUOTES.magnificence}&rdquo;
            </blockquote>
            <cite className="mt-6 block font-mono text-xs uppercase tracking-[0.35em] not-italic text-present-yellow">
              Nikola Tesla
            </cite>
          </Reveal>
        </section>

        {/* ── The three doorways ── */}
        <section id="doorways" className="relative scroll-mt-20 px-6 py-20 sm:py-28">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-ritual text-present-white/40">
              Three eras · One signal
            </p>
            <h2 className="mt-4 font-serif text-4xl text-present-white sm:text-5xl">
              Past. Present. Future.
            </h2>
            <p className="mt-4 text-pretty text-present-white/55">
              {SLOGANS.numerology}
            </p>
          </Reveal>

          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
            {ERAS.map((era, i) => (
              <Reveal key={era.key} delay={i * 0.1}>
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
