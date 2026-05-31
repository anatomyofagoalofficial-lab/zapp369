import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MathTexture } from "@/components/MathTexture";
import { Reveal } from "@/components/Reveal";
import { MascotHero } from "@/components/MascotHero";
import { Numeral3D } from "@/components/Numeral3D";
import { Parallax } from "@/components/Parallax";
import { ScrollTeleport } from "@/components/ScrollTeleport";
import { ShaderCanvas } from "@/components/ShaderCanvas";
import { WardenclyffeTower } from "@/components/WardenclyffeTower";
import { SLOGANS, TESLA_QUOTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Past · The Tower",
  description:
    "1893 to 1917. Tesla's tower at Wardenclyffe, free energy for every human being, wirelessly, for free. The frequency they tried to silence.",
};

/** A hand-drawn, blueprint-style schematic of the tower (original line art). */
function TowerSchematic() {
  return (
    <svg
      viewBox="0 0 200 320"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      className="h-full w-full text-past-ink/70"
    >
      {/* dome */}
      <path d="M60 70 Q100 20 140 70 Z" strokeLinejoin="round" />
      <path d="M60 70 H140" />
      <line x1="100" y1="22" x2="100" y2="6" />
      <circle cx="100" cy="5" r="3" />
      {/* lattice mast */}
      <path d="M70 70 L88 290" />
      <path d="M130 70 L112 290" />
      <path d="M78 130 L122 130 M80 170 L120 170 M82 210 L118 210 M85 250 L115 250" />
      <path d="M70 90 L130 130 M130 90 L70 130 M78 130 L122 170 M122 130 L78 170 M80 170 L120 210 M120 170 L80 210 M82 210 L118 250 M118 210 L82 250" />
      {/* base + ground */}
      <path d="M88 290 H112 L120 300 H80 Z" />
      <line x1="20" y1="300" x2="180" y2="300" strokeDasharray="3 4" />
      {/* annotation ticks */}
      <line x1="150" y1="70" x2="172" y2="70" strokeDasharray="2 3" />
      <line x1="150" y1="300" x2="172" y2="300" strokeDasharray="2 3" />
      <line x1="172" y1="70" x2="172" y2="300" strokeDasharray="2 3" />
    </svg>
  );
}

export default function PastPage() {
  return (
    <main className="relative min-h-screen bg-past-cream text-past-ink">
      {/* Real WebGL world (ported from v1 pastfx): backlit monument, godrays */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-90">
        <ShaderCanvas shader="past" />
      </div>
      <MathTexture era="past" />

      {/* ── Hero ── */}
      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center overflow-hidden px-6 py-32">
        <Numeral3D
          era="past"
          value="3"
          className="ghost-number font-serif opacity-50"
          style={{ fontSize: "clamp(14rem, 34vw, 30rem)", bottom: "-3rem", left: "-1rem" }}
        />
        <div className="relative grid items-center gap-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-ritual text-past-root">
              3 · Past · The Tower
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-ritual text-past-ink/50">
              Wardenclyffe · 1893–1917
            </p>

            <h1 className="mt-8 max-w-reading text-balance font-serif text-5xl font-semibold leading-tight sm:text-6xl">
              A tower built to give the world its energy, for free.
            </h1>

            <blockquote className="mt-10 max-w-reading border-l-2 border-past-gold pl-6 font-serif text-2xl italic leading-relaxed text-past-ink/80">
              &ldquo;{TESLA_QUOTES.magnificence}&rdquo;
              <cite className="mt-3 block font-sans text-sm not-italic tracking-ritual text-past-ink/50">
                Nikola Tesla
              </cite>
            </blockquote>
          </div>

          {/* The tower (SVG) rises behind the mascot. The real WebGL 3D tower
              is parked in TeslaTower3D.tsx pending a green build. */}
          <div className="relative mx-auto w-full max-w-md">
            <Parallax speed={80} className="absolute left-1/2 top-[-5rem] h-[40rem] w-72 -translate-x-1/2">
              <WardenclyffeTower className="h-full w-full" />
            </Parallax>
            <div className="relative">
              <MascotHero era="past" priority />
            </div>
            <p className="mt-2 text-center font-mono text-[0.65rem] uppercase tracking-ritual text-past-ink/40">
              Fig. I · the tower at Wardenclyffe
            </p>
          </div>
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
      <section className="relative px-6 py-24">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="font-serif text-3xl italic leading-relaxed sm:text-4xl">
            &ldquo;Where do we put the meter?&rdquo;
          </p>
          <p className="mt-4 font-sans text-sm uppercase tracking-ritual text-past-ink/50">
            J.P. Morgan
          </p>
          <p className="mx-auto mt-8 max-w-reading text-pretty font-serif text-xl leading-relaxed text-past-ink/75">
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
      <section className="relative border-y border-past-ink/10 bg-[#efe2c6]/50 px-6 py-28">
        <Reveal className="mx-auto max-w-reading">
          <p className="font-mono text-xs uppercase tracking-ritual text-past-root">
            From the Whitepaper · I. The Signal
          </p>
          <blockquote className="mt-6 font-serif text-2xl leading-relaxed sm:text-3xl">
            &ldquo;{TESLA_QUOTES.nonPhysical}&rdquo;
            <cite className="mt-4 block font-sans text-sm not-italic tracking-ritual text-past-ink/50">
              Nikola Tesla
            </cite>
          </blockquote>
          <p className="mt-8 text-pretty font-serif text-xl leading-relaxed text-past-ink/80">
            {SLOGANS.signal} {SLOGANS.answer}
          </p>
        </Reveal>
      </section>

      {/* ── Onward ── */}
      <section className="px-6 py-24">
        <div className="mx-auto flex max-w-reading flex-col items-start gap-4">
          <p className="font-mono text-xs uppercase tracking-ritual text-past-ink/50">
            The signal did not die.
          </p>
          <Link
            href="/present"
            className="group inline-flex items-center gap-2 font-serif text-2xl text-past-ink transition-colors hover:text-past-root"
          >
            Follow it to the present
            <ArrowRight
              size={22}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      <ScrollTeleport to="/present" />
    </main>
  );
}

/** A slow, generous reading section in the Past world. */
function Section({
  kicker,
  children,
}: {
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative px-6 py-20">
      <Reveal className="mx-auto max-w-reading">
        <p className="font-mono text-xs uppercase tracking-ritual text-past-root">
          {kicker}
        </p>
        <div className="mt-6 space-y-6 text-pretty font-serif text-xl leading-relaxed text-past-ink/85 sm:text-2xl">
          {children}
        </div>
      </Reveal>
    </section>
  );
}
