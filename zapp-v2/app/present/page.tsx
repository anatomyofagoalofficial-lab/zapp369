import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { LiveStat } from "@/components/LiveStat";
import { LiveChart } from "@/components/LiveChart";
import { Calculator } from "@/components/Calculator";
import { VerifiedPanel } from "@/components/VerifiedPanel";
import { ScrollTeleport } from "@/components/ScrollTeleport";
import { DigitalRain } from "@/components/DigitalRain";
import {
  IllustratedScene, SceneCopy, SceneKicker, SceneTitle, SceneBody,
} from "@/components/IllustratedScene";
import { LightningDivider } from "@/components/LightningDivider";
import { getStats } from "@/lib/stats";
import { formatNumber, formatUsd } from "@/lib/utils";
import { SLOGANS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Present · The Current",
  description: "⚡ZAPP is live on Solana. 0% tax. LP burned. The answer Tesla never got to give.",
};
export const revalidate = 300;

export default async function PresentPage() {
  const stats = await getStats();
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

      {/* WHY NOT JUST ANOTHER MEMECOIN */}
      <IllustratedScene src="/illustrations/not-just-memecoin.jpg"
        alt="Why ⚡ZAPP isn't just another memecoin — mascot with Doge and Pepe coins"
        position="center 35%" veil="light">
        <SceneCopy>
          <SceneKicker>6 · Present · The Difference</SceneKicker>
          <SceneTitle>Not just<br />
            <em className="italic text-present-yellow">another memecoin</em>.
          </SceneTitle>
          <SceneBody>Doge had the meme. Pepe had the cult. ⚡ZAPP has the story —
            a century of suppressed technology, a real on-chain structure, and
            a frequency that was always there.</SceneBody>
        </SceneCopy>
      </IllustratedScene>
      <LightningDivider />

      {/* THE PROBLEM */}
      <IllustratedScene src="/illustrations/chains.jpg"
        alt="World map with chains — the broken banking system"
        position="center 40%" veil="dark">
        <SceneCopy>
          <SceneKicker>Present · The Problem</SceneKicker>
          <SceneTitle>The system isn&rsquo;t broken.<br />
            <em className="italic text-present-yellow">It&rsquo;s working as designed.</em>
          </SceneTitle>
          <SceneBody>1.4 billion people unbanked. $45 to send $200 internationally.
            1–5 days for a wire transfer. Built to extract — from you. Every time.</SceneBody>
        </SceneCopy>
      </IllustratedScene>
      <LightningDivider />

      {/* RUNNING — the answer */}
      <IllustratedScene src="/illustrations/running-lightning.jpg"
        alt="⚡ZAPP mascot running through the city with a lightning energy ball"
        position="center 30%" veil="default">
        <SceneCopy>
          <SceneKicker>Present · The Answer · Solana 2026</SceneKicker>
          <SceneTitle>The signal is<br />
            <em className="italic text-present-yellow">already running</em>.
          </SceneTitle>
          <SceneBody>⚡ZAPP is live on Solana. The frequency is transmitting —
            verifiable, on-chain, owned by no one.
            65,000 transactions per second. Average fee: $0.00025.</SceneBody>
        </SceneCopy>
      </IllustratedScene>
      <LightningDivider />

      {/* SOLANA GLOBE */}
      <IllustratedScene src="/illustrations/solana-globe.jpg"
        alt="⚡ZAPP mascot with Solana globe and world network"
        position="center 35%" veil="default">
        <SceneCopy>
          <SceneKicker>Present · Built on Solana</SceneKicker>
          <SceneTitle>One network.<br />
            <em className="italic text-present-yellow">Every corner of Earth</em>.
          </SceneTitle>
          <SceneBody>No bank. No border. No permission required.
            ⚡ZAPP reaches anyone with a phone, anywhere on this planet — instantly.</SceneBody>
        </SceneCopy>
      </IllustratedScene>

      {/* LIVE STATS */}
      <section className="relative z-10 border-t border-white/5 px-6 py-20">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-ritual text-white/40">
            Instrument panel — live on Solana
          </p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">Read the frequency</h2>
        </Reveal>
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LiveStat label="Holders" value={`${formatNumber(stats.holders)}+`} sub="wallets" />
          <LiveStat label="Market cap" value={formatUsd(stats.marketCap)} sub={stats.live ? "live" : "·"} />
          <LiveStat label="24h volume" value={formatUsd(stats.volume24h)} sub={stats.live ? "live" : "·"} />
          <LiveStat label="Telegram" value={`${formatNumber(stats.telegramMembers)}+`} sub="members" />
        </div>
      </section>

      <LiveChart />
      <Calculator />
      <LightningDivider />

      {/* HALL OF FAME — context */}
      <IllustratedScene src="/illustrations/hall-of-fame.jpg"
        alt="Pump.fun Hall of Fame — the six that made it out: Fartcoin $2.15B, PNUT $1.8B, GOAT $1.3B. ⚡ZAPP: hidden in plain sight. 3·6·9∞"
        position="center 50%" veil="light" minHeight="80vh">
        <SceneCopy>
          <SceneKicker>Present · Context · Pump.fun Graduates</SceneKicker>
          <SceneTitle>The ones who<br />
            <em className="italic text-present-yellow">made it out</em>.
          </SceneTitle>
          <SceneBody>Fartcoin. PNUT. GOAT. They all started like this — small,
            dismissed, then suddenly everywhere. ⚡ZAPP has something none of
            them had: a real story. Hidden in plain sight. 3 · 6 · 9 ∞</SceneBody>
        </SceneCopy>
      </IllustratedScene>
      <LightningDivider />

      {/* 0% TAX */}
      <IllustratedScene src="/illustrations/zero-tax.jpg"
        alt="⚡ZAPP mascot leaning on 0% — zero tax, world network"
        position="center 40%" veil="default">
        <SceneCopy>
          <SceneKicker>Present · Zero Tax · No Hidden Fees</SceneKicker>
          <SceneTitle><em className="italic text-present-yellow">0%</em> tax.<br />
            100% reaches you.
          </SceneTitle>
          <SceneBody>No buy tax. No sell tax. No hidden fees.
            ⚡ZAPP transaction fee on Solana: $0.00025.
            JP Morgan&rsquo;s meter doesn&rsquo;t exist here.</SceneBody>
        </SceneCopy>
      </IllustratedScene>
      <LightningDivider />

      {/* VAULT */}
      <IllustratedScene src="/illustrations/vault-v2.jpg"
        alt="⚡ZAPP mascot protecting the vault — liquidity locked"
        position="center 35%" veil="dark">
        <SceneCopy>
          <SceneKicker>Present · Trust On-Chain · May 2026</SceneKicker>
          <SceneTitle>Nobody touches<br />
            the <em className="italic text-present-yellow">liquidity</em>.
          </SceneTitle>
          <SceneBody>LP permanently burned. Mint revoked. Freeze revoked. 0% tax.
            The vault is sealed — not even the founders can open it.
            Verified on Solscan.</SceneBody>
        </SceneCopy>
      </IllustratedScene>

      <VerifiedPanel />

      {/* 369 CARDS */}
      <IllustratedScene src="/illustrations/369-cards.jpg"
        alt="⚡ZAPP mascot with golden 3·6·9 frequency cards"
        position="center 35%" veil="light">
        <SceneCopy>
          <SceneKicker>Present · The Frequency · 3 · 6 · 9</SceneKicker>
          <SceneTitle>The cards are<br />
            <em className="italic text-present-yellow">always gold</em>.
          </SceneTitle>
          <SceneBody>Liquidity locked. Protected by the curve. Nobody touches it.
            Not even us. The frequency is sealed — 3 · 6 · 9 ∞</SceneBody>
        </SceneCopy>
      </IllustratedScene>

      {/* MOVEMENT */}
      <section className="relative z-10 border-t border-white/5 bg-black/30 px-6 py-28 backdrop-blur-sm">
        <Reveal className="mx-auto max-w-reading">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-yellow">
            From the Whitepaper · VI. The Movement
          </p>
          <blockquote className="mt-6 font-serif text-2xl leading-relaxed sm:text-3xl">
            &ldquo;A frequency means nothing without receivers. ⚡ZAPP built its
            community in real time. In a single day, 1,438 people joined the
            Telegram. Just people who recognised the signal.&rdquo;
          </blockquote>
          <p className="mt-8 font-sans text-lg leading-relaxed text-white/70">
            No paid promotion. No manipulation. Community owned.
            No corporation, no VC, no bank.
          </p>
        </Reveal>
      </section>

      {/* ONWARD */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto flex max-w-reading flex-col items-start gap-4">
          <p className="font-mono text-xs uppercase tracking-ritual text-white/40">
            {SLOGANS.numerology}
          </p>
          <Link href="/future"
            className="group inline-flex items-center gap-2 font-serif text-2xl
                       text-white transition-colors hover:text-present-yellow">
            See where the signal is going
            <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <ScrollTeleport to="/future" />
    </main>
  );
}
