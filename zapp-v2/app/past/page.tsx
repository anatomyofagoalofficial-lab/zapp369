import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Numeral3D } from "@/components/Numeral3D";
import { ScrollTeleport } from "@/components/ScrollTeleport";
import { ShaderCanvas } from "@/components/ShaderCanvas";
import { TeslaPhotoHero } from "@/components/TeslaPhotoHero";
import { SLOGANS, TESLA_QUOTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Past · The Tower",
  description:
    "1893 to 1917. Tesla's tower at Wardenclyffe, free energy for every human being, wirelessly, for free. The frequency they tried to silence.",
};

export default function PastPage() {
  return (
    <main className="era-past relative min-h-screen bg-[#0a0604] text-[#f4e8d0]">
      {/* The cinematic WebGL world IS the page: backlit monument, golden-hour
          god-rays, drifting desert haze, the 3·6·9 sacred geometry. Fixed, full
          screen, fully visible (no opaque background covering it). */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <ShaderCanvas shader="past" className="h-full w-full" />
        {/* retro Brâncuși grade: sepia-brown → black, white-hot highlights */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f04]/70 via-[#0a0604]/45 to-[#050301]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0604]/85 via-[#0a0604]/35 to-transparent" />
      </div>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center overflow-hidden px-6 py-32">
        <Numeral3D
          era="past"
          value="3"
          className="ghost-number font-serif opacity-40"
          style={{ fontSize: "clamp(14rem, 34vw, 30rem)", bottom: "-3rem", right: "-1rem" }}
        />
        <div className="relative max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-ritual text-past-gold">
            3 · Past · The Tower
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-ritual text-[#f4e8d0]/50">
            Wardenclyffe · 1893–1917
          </p>

          <h1 className="mt-8 text-balance font-serif text-5xl font-semibold leading-[1.05] text-glow-gold sm:text-7xl">
            A tower built to give the world its energy, for free.
          </h1>

          <blockquote className="mt-10 max-w-reading border-l-2 border-past-gold pl-6 font-serif text-2xl italic leading-relaxed text-[#f4e8d0]/90">
            &ldquo;{TESLA_QUOTES.magnificence}&rdquo;
            <cite className="mt-3 block font-sans text-sm not-italic tracking-ritual text-[#f4e8d0]/50">
              Nikola Tesla
            </cite>
          </blockquote>

          <p className="mt-10 font-mono text-xs uppercase tracking-ritual text-[#f4e8d0]/40">
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
          <p className="mt-4 font-sans text-sm uppercase tracking-ritual text-[#f4e8d0]/50">
            J.P. Morgan
          </p>
          <p className="mx-auto mt-8 max-w-reading text-pretty font-serif text-xl leading-relaxed text-[#f4e8d0]/75">
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
      <section className="relative z-10 border-y border-past-gold/15 bg-black/40 px-6 py-28 backdrop-blur-sm">
        <Reveal className="mx-auto max-w-reading">
          <p className="font-mono text-xs uppercase tracking-ritual text-past-gold">
            From the Whitepaper · I. The Signal
          </p>
          <blockquote className="mt-6 font-serif text-2xl leading-relaxed text-[#f4e8d0] sm:text-3xl">
            &ldquo;{TESLA_QUOTES.nonPhysical}&rdquo;
            <cite className="mt-4 block font-sans text-sm not-italic tracking-ritual text-[#f4e8d0]/50">
              Nikola Tesla
            </cite>
          </blockquote>
          <p className="mt-8 text-pretty font-serif text-xl leading-relaxed text-[#f4e8d0]/80">
            {SLOGANS.signal} {SLOGANS.answer}
          </p>
        </Reveal>
      </section>

      {/* ── Onward ── */}
      <section className="relative z-10 px-6 py-28">
        <div className="mx-auto flex max-w-reading flex-col items-start gap-4">
          <p className="font-mono text-xs uppercase tracking-ritual text-[#f4e8d0]/50">
            The signal did not die.
          </p>
          <Link
            href="/present"
            className="group inline-flex items-center gap-2 font-serif text-3xl text-past-gold transition-colors hover:text-[#f4e8d0]"
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
        <p className="font-mono text-xs uppercase tracking-ritual text-past-gold">
          {kicker}
        </p>
        <div className="mt-6 space-y-6 text-pretty font-serif text-xl leading-relaxed text-[#f4e8d0]/85 sm:text-2xl">
          {children}
        </div>
      </Reveal>
    </section>
  );
}
