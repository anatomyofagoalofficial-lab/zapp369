import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ScrollTeleport } from "@/components/ScrollTeleport";
import { PastHero } from "@/components/PastHero";
import { SLOGANS, TESLA_QUOTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Past · The Tower",
  description:
    "1893 to 1917. Tesla's tower at Wardenclyffe, free energy for every human being, wirelessly, for free. The frequency they tried to silence.",
};

export default function PastPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* ── Hero · the vitrine ── */}
      <PastHero />

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
          <p className="mt-4 font-mono text-xs uppercase tracking-ritual text-white/45">
            J.P. Morgan
          </p>
          {/* body → Inter (font-sans) for clean, modern reading */}
          <p className="mx-auto mt-8 max-w-reading text-pretty font-sans text-lg leading-relaxed text-white/70">
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
          {/* the Tesla line stays a serif pull-quote */}
          <blockquote className="mt-6 font-serif text-2xl italic leading-relaxed text-white sm:text-3xl">
            &ldquo;{TESLA_QUOTES.nonPhysical}&rdquo;
            <cite className="mt-4 block font-mono text-xs not-italic uppercase tracking-ritual text-white/45">
              Nikola Tesla
            </cite>
          </blockquote>
          {/* body → Inter */}
          <p className="mt-8 max-w-reading text-pretty font-sans text-lg leading-relaxed text-white/80">
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

/**
 * A slow, generous reading section in the Past world.
 * Body copy is Inter (font-sans) for clarity; the kicker stays mono.
 * (Headlines and pull-quotes elsewhere remain Cormorant serif.)
 */
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
        <div className="mt-6 space-y-6 text-pretty font-sans text-lg leading-relaxed text-white/85">
          {children}
        </div>
      </Reveal>
    </section>
  );
}
