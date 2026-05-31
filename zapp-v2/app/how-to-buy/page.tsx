import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CopyButton } from "@/components/CopyButton";
import { ShaderCanvas } from "@/components/ShaderCanvas";
import { LINKS, TOKEN } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How to Buy",
  description:
    "Get ⚡ZAPP on Solana in four steps. Wallet, SOL, swap, verify. No bank, no permission, no middleman.",
};

const STEPS = [
  { n: "01", title: "Wallet", body: "Install Phantom or Solflare. Keep your recovery phrase offline. Never share it." },
  { n: "02", title: "SOL", body: "Fund the wallet with a little SOL. Fees on Solana are fractions of a cent." },
  { n: "03", title: "Swap", body: "Open Jupiter or Pump.fun, connect there, paste the contract, swap. Tokens arrive in seconds." },
  { n: "04", title: "Verify", body: "Check the token in your wallet matches the contract exactly. There is only one ⚡ZAPP." },
];

export default function HowToBuyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04090a] text-present-white">
      {/* Cinematic field, fully visible behind a wash. */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <ShaderCanvas shader="cosmos" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04090a]/80 via-[#04090a]/65 to-[#04090a]/90" />
      </div>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center px-6 pt-32">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-ritual text-present-green">
            Acquire the signal
          </p>
          <h1 className="mt-4 text-balance font-serif text-6xl font-semibold leading-[1] text-glow-gold sm:text-8xl">
            Get ⚡ZAPP.
          </h1>
          <p className="mt-6 max-w-md text-pretty text-lg text-present-white/70">
            Four steps. No bank, no permission, no middleman.
          </p>
        </Reveal>

        {/* Contract pill */}
        <Reveal delay={0.1} className="mt-10">
          <div className="flex max-w-2xl flex-col gap-3 rounded-xl border border-present-yellow/25 bg-black/40 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-[0.65rem] uppercase tracking-ritual text-present-white/40">
                Official contract — the only one
              </p>
              <p className="mt-1 break-all font-mono text-xs text-present-white/85">
                {TOKEN.contract}
              </p>
            </div>
            <CopyButton value={TOKEN.contract} label="Copy" className="shrink-0" />
          </div>
        </Reveal>
      </section>

      {/* ── Steps as a vertical numbered spine (unique architecture) ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24">
        <div className="relative">
          {/* the conductor line */}
          <div
            aria-hidden="true"
            className="absolute left-[2.15rem] top-4 bottom-4 w-px bg-gradient-to-b from-present-yellow/60 via-present-green/40 to-transparent sm:left-[3.15rem]"
          />
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08}>
                <div className="group flex items-start gap-6 sm:gap-8">
                  <span className="relative z-10 flex h-[4.3rem] w-[4.3rem] shrink-0 items-center justify-center rounded-full border border-present-yellow/40 bg-[#04090a] font-serif text-2xl text-present-yellow transition-all duration-300 group-hover:scale-110 group-hover:border-present-yellow group-hover:shadow-[0_0_40px_-8px_rgba(255,215,0,0.6)] sm:h-[6.3rem] sm:w-[6.3rem] sm:text-4xl">
                    {step.n}
                  </span>
                  <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 group-hover:border-present-yellow/30 sm:p-8">
                    <h2 className="font-serif text-3xl text-present-white sm:text-4xl">
                      {step.title}
                    </h2>
                    <p className="mt-2 text-pretty leading-relaxed text-present-white/65">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Buy buttons */}
        <Reveal className="mt-16 flex flex-col gap-4 sm:flex-row">
          <a
            href={LINKS.jupiter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-present-yellow px-8 py-4 font-sans text-sm uppercase tracking-wider text-present-black transition-all hover:scale-[1.02] hover:opacity-90"
          >
            Buy on Jupiter <ArrowUpRight size={16} />
          </a>
          <a
            href={LINKS.pumpfun}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-present-yellow/60 px-8 py-4 font-sans text-sm uppercase tracking-wider text-present-yellow transition-colors hover:bg-present-yellow hover:text-present-black"
          >
            Buy on Pump.fun <ArrowUpRight size={16} />
          </a>
        </Reveal>

        <Reveal className="mt-8">
          <p className="text-pretty text-sm leading-relaxed text-present-white/45">
            ⚡ZAPP never DMs first, never runs giveaways, never asks for your
            recovery phrase, and never asks you to connect a wallet on this site.
            Trust only the contract above.{" "}
            <Link
              href="/whitepaper#honest-words"
              className="text-present-white/70 underline underline-offset-2 hover:text-present-white"
            >
              The honest words →
            </Link>
          </p>
        </Reveal>
      </section>
    </main>
  );
}
