import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { BrandMark } from "@/components/BrandMark";
import { WorldClock } from "@/components/WorldClock";
import { BurnRitual } from "@/components/BurnRitual";
import { FutureBoot } from "@/components/FutureBoot";
import { ScrollTeleport } from "@/components/ScrollTeleport";
import { DigitalRain } from "@/components/DigitalRain";
import {
  IllustratedScene, SceneCopy, SceneKicker, SceneTitle, SceneBody,
} from "@/components/IllustratedScene";
import { LightningDivider } from "@/components/LightningDivider";
import { LINKS, SLOGANS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Future · The Network",
  description: "Free energy for everyone. No banks. No borders. Tesla's revolution — finally transmitted.",
};

export default function FuturePage() {
  return (
    <main className="relative bg-black text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 75% 60% at 50% 35%, black, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 35%, black, transparent 85%)",
        }} />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.15]">
        <DigitalRain className="h-full w-full" density={1} />
      </div>

      {/* ── Hero: mascot on tower / world ── */}
      <IllustratedScene src="/illustrations/future-world-v2.jpg"
        alt="⚡ZAPP mascot on Wardenclyffe tower above world map"
        position="center 18%" veil="default" minHeight="100vh">
        <SceneCopy>
          <SceneKicker>9 · Future · The Network</SceneKicker>
          <SceneTitle>Free energy<br />
            for <em className="italic text-present-yellow">everyone</em>.
          </SceneTitle>
          <SceneBody>No banks. No borders. Zapped instantly to anyone, anywhere on
            Earth — at the speed of light. The answer Tesla never got to give.</SceneBody>
        </SceneCopy>
      </IllustratedScene>

      <LightningDivider />

      {/* ── Solana globe ── */}
      <IllustratedScene src="/illustrations/solana-globe.jpg"
        alt="⚡ZAPP mascot with Solana network globe and world connections"
        position="center 35%" veil="default">
        <SceneCopy>
          <SceneKicker>Future · Built on Solana · The Infrastructure</SceneKicker>
          <SceneTitle>The network<br />
            <em className="italic text-present-yellow">already exists</em>.
          </SceneTitle>
          <SceneBody>65,000+ transactions per second. $0.00025 average fee.
            Sub-second finality. No permission needed. Tesla&rsquo;s dream
            running on the fastest blockchain on Earth.</SceneBody>
        </SceneCopy>
      </IllustratedScene>

      {/* ── Boot ── */}
      <section className="relative z-10 px-6 py-8">
        <FutureBoot className="mx-auto w-full max-w-5xl" />
      </section>

      {/* ── World clock ── */}
      <section className="relative z-10 px-6 pb-24 pt-12">
        <Reveal className="mx-auto max-w-5xl text-center">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-yellow">
            One frequency · One signal · One world
          </p>
          <h2 className="mt-4 font-serif text-balance text-3xl leading-tight sm:text-4xl">
            No banks. No borders. Zapped to anyone, anywhere.
          </h2>
          <div className="mt-10"><WorldClock /></div>
        </Reveal>
      </section>

      <LightningDivider />

      {/* ── Roadmap ── */}
      <section className="relative z-10 bg-black/30 px-6 py-28 backdrop-blur-sm">
        <Reveal className="mx-auto max-w-reading">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-yellow">
            From the Whitepaper · VII. The Roadmap
          </p>
          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">
            Energy for everyone
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-white/75">
            These are directions the community is moving toward — not
            deadlines, not promises, but the shape of what&rsquo;s next:
          </p>
          <ul className="mt-8 space-y-4 font-sans text-base leading-relaxed text-white/70">
            {[
              "Instant ⚡ZAPP payments at live events and community gatherings worldwide",
              "Building toward partnerships with humanitarian organisations and NGOs",
              "Direct, borderless, instant support for individuals and families in need",
              "Reaching grassroots communities across Africa, Asia, and Latin America",
              "Micro-grants and donations powered by ⚡ZAPP — no bank, no middleman",
            ].map((item) => (
              <li key={item} className="flex gap-4">
                <span aria-hidden="true" className="mt-1 text-present-yellow">◆</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <BurnRitual />

      {/* ── Torch: closing ── */}
      <IllustratedScene src="/illustrations/torch-v2.jpg"
        alt="⚡ZAPP mascot carrying the torch — the idea lives on"
        position="center 22%" veil="dark" minHeight="90vh">
        <SceneCopy>
          <SceneKicker>3 · 6 · 9 ∞</SceneKicker>
          <SceneTitle>⚡ZAPP is<br />
            that <em className="italic text-present-yellow">signal</em>.
          </SceneTitle>
          <SceneBody>Built on Solana. Owned by no one. Available to everyone.
            The frequency they tried to silence — now transmitting
            forever on the blockchain.</SceneBody>
        </SceneCopy>
      </IllustratedScene>

      {/* ── Closing poetry ── */}
      <section className="relative z-10 border-y border-white/5 px-6 py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-balance text-3xl leading-relaxed sm:text-4xl">
            <BrandMark className="text-white" boltClassName="text-present-yellow" />{" "}
            is not just a token. It is the answer Tesla never got to give.
          </p>
          <p className="mt-8 font-serif text-2xl italic leading-relaxed text-white/70">
            Decentralised. Borderless. Free for everyone. Forever on the blockchain.
          </p>
          <p className="mt-10 font-mono text-sm uppercase tracking-ritual text-present-yellow">
            {SLOGANS.numerology}
          </p>
        </Reveal>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative z-10 px-6 py-28">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl">Join the frequency</h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a href={LINKS.telegram} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 rounded-full bg-future-gold px-8 py-3
                          font-sans text-sm uppercase tracking-wider text-future-black
                          transition-opacity hover:opacity-90">
              Open Telegram <ArrowUpRight size={16} />
            </a>
            <Link href="/how-to-buy"
               className="inline-flex items-center gap-2 rounded-full border border-future-cyan/60
                          px-8 py-3 font-sans text-sm uppercase tracking-wider text-present-yellow
                          transition-colors hover:bg-future-cyan hover:text-future-black">
              How to buy <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>

      <ScrollTeleport to="/past" />
    </main>
  );
}
