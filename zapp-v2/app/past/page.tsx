import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ScrollTeleport } from "@/components/ScrollTeleport";
import { DigitalRain } from "@/components/DigitalRain";
import { MajesticTower } from "@/components/MajesticTower";
import { SLOGANS, TESLA_QUOTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Past · The Tower",
  description:
    "1893 to 1917. Tesla's tower at Wardenclyffe, free energy for every human being, wirelessly, for free. The frequency they tried to silence.",
};

export default function PastPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* Clean black field: monochrome grid + falling on-chain numbers + a gold
          shaft of light. Crisp black + white + ⚡ZAPP gold — no muddy sepia. */}
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
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[70vh] bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,rgba(255,215,0,0.14),transparent_70%)]"
      />

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center overflow-hidden px-6 py-32">
        <Numeral3D
          era="past"
          value="3"
          className="ghost-number font-serif opacity-40"
          style={{ fontSize: "clamp(14rem, 34vw, 30rem)", bottom: "-3rem", right: "-1rem" }}
        />
        <div className="relative max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-yellow">
            3 · Past · The Tower
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-ritual text-white/45">
            Wardenclyffe · 1893–1917
          </p>

          <h1 className="mt-8 text-balance font-serif text-5xl font-semibold leading-[1.05] text-glow-gold sm:text-7xl">
            A tower built to give the world its energy, for free.
          </h1>

          <blockquote className="mt-10 max-w-reading border-l-2 border-present-yellow pl-6 font-serif text-2xl italic leading-relaxed text-white/90">
            &ldquo;{TESLA_QUOTES.magnificence}&rdquo;
            <cite className="mt-3 block font-sans text-sm not-italic tracking-ritual text-white/45">
              Nikola Tesla
            </cite>
          </blockquote>

          <p className="mt-10 font-mono text-xs uppercase tracking-ritual text-white/40">
            ↓ Scroll into the past
          </p>
        </div>
      </section>

      {/* ── The Vision ── */}
      <Section kicker="The Vision">
        <p>
          A century ago, Nikola Tesla built a tower designed to transmit free
          energy to every human being on Earth. Wirelessly. Instantaneously. For
          free.
        </p>
        <p>
          No meter. No bill. No gatekeeper. Energy travels at the speed of
          light, and Tesla believed value should travel the same way.
        </p>
      </Section>

      {/* ── The Question ── */}
      <section className="relative z-10 px-6 py-24">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="font-serif text-3xl italic leading-relaxed text-glow-gold sm:text-5xl">
            &ldquo;Where do we put the meter?&rdquo;
          </p>
          <p className="mt-4 font-sans text-sm uppercase tracking-ritual text-white/45">
            J.P. Morgan
          </p>
          <p className="mx-auto mt-8 max-w-reading text-pretty font-serif text-xl leading-relaxed text-white/70">
            There was no answer, because there was no meter. Free energy meant
            free people. The funding was pulled. The tower came down.
          </p>
        </Reveal>
      </section>

      {/* ── The Fall ── */}
      <Section kicker="The Fall">
        <p>
          Wardenclyffe was demolished. The frequency went silent. But they did
          not stop the idea. They only delayed it.
        </p>
        <p>{SLOGANS.noMeters}</p>
      </Section>

      {/* ── The Signal (Whitepaper I) ── */}
      <section className="relative z-10 border-y border-white/10 bg-black/40 px-6 py-28 backdrop-blur-sm">
        <Reveal className="mx-auto max-w-reading">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-yellow">
            From the Whitepaper · I. The Signal
          </p>
          <blockquote className="mt-6 font-serif text-2xl leading-relaxed text-white sm:text-3xl">
            &ldquo;{TESLA_QUOTES.nonPhysical}&rdquo;
            <cite className="mt-4 block font-sans text-sm not-italic tracking-ritual text-white/45">
              Nikola Tesla
            </cite>
          </blockquote>
          <p className="mt-8 text-pretty font-serif text-xl leading-relaxed text-white/80">
            {SLOGANS.signal} {SLOGANS.answer}
          </p>
        </Reveal>
      </section>

      {/* ── Onward ── */}
      <section className="relative z-10 px-6 py-28">
        <div className="mx-auto flex max-w-reading flex-col items-start gap-4">
          <p className="font-mono text-xs uppercase tracking-ritual text-white/45">
            The signal did not die.
          </p>
          <Link
            href="/present"
            className="group inline-flex items-center gap-2 font-serif text-3xl text-present-yellow transition-colors hover:text-white"
          >
            Follow it to the present
            <ArrowRight
              size={26}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      <ScrollTeleport to="/present" />
    </main>
  );
}

/** A slow, generous reading section in the Past world, over the cinematic bg. */
function Section({
  kicker,
  children,
}: {
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative z-10 px-6 py-20">
      <Reveal className="mx-auto max-w-reading">
        <p className="font-mono text-xs uppercase tracking-ritual text-present-yellow">
          {kicker}
        </p>
        <div className="mt-6 space-y-6 text-pretty font-serif text-xl leading-relaxed text-white/85 sm:text-2xl">
          {children}
        </div>
      </Reveal>
    </section>
  );
}
