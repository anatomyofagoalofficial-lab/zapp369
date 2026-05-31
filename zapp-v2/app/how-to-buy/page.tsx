import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { MathTexture } from "@/components/MathTexture";
import { Reveal } from "@/components/Reveal";
import { CopyButton } from "@/components/CopyButton";
import { LINKS, TOKEN } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How to Buy",
  description:
    "A simple, step-by-step guide to buying ⚡ZAPP on Solana. Get a wallet, fund it with SOL, and swap on Jupiter or Pump.fun. Always verify the contract.",
};

const STEPS = [
  {
    n: "1",
    title: "Get a Solana wallet",
    body: "Install a self-custody Solana wallet such as Phantom or Solflare (browser extension or mobile app). Write down your recovery phrase and keep it offline. Never share it with anyone, not even us.",
  },
  {
    n: "2",
    title: "Add some SOL",
    body: "Buy SOL on any exchange and withdraw it to your new wallet's address, or use the wallet's built-in on-ramp. You'll swap SOL for ⚡ZAPP, and a little extra covers Solana's tiny network fees (fractions of a cent).",
  },
  {
    n: "3",
    title: "Open Jupiter or Pump.fun",
    body: "Head to Jupiter or Pump.fun and connect your wallet there. ⚡ZAPP never asks you to connect a wallet on this site. You only ever connect on the exchange itself.",
  },
  {
    n: "4",
    title: "Paste the ⚡ZAPP contract & swap",
    body: "Paste the official contract address (below) into the token field, enter how much SOL you want to swap, and confirm. That's it. The tokens arrive in seconds.",
  },
  {
    n: "5",
    title: "Verify you hold the real ⚡ZAPP",
    body: "Confirm the token in your wallet matches the contract address exactly. There is only one ⚡ZAPP. If an address doesn't match the one below, it isn't ours.",
  },
];

export default function HowToBuyPage() {
  return (
    <main className="relative min-h-screen bg-present-black px-6 pb-28 pt-36 text-present-white">
      <MathTexture era="present" />

      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-ritual text-present-yellow">
            How to buy
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight sm:text-6xl">
            From zero to ⚡ZAPP in five steps.
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-present-white/70">
            No bank. No permission. No middleman. If you can use a phone, you can
            do this.
          </p>
        </Reveal>

        {/* Contract address */}
        <Reveal className="mt-10">
          <div className="flex flex-col gap-3 rounded-xl border border-present-yellow/30 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-ritual text-present-white/40">
                Official contract
              </p>
              <p className="mt-1 break-all font-mono text-xs text-present-white/80 sm:text-sm">
                {TOKEN.contract}
              </p>
            </div>
            <CopyButton
              value={TOKEN.contract}
              label="Copy address"
              className="shrink-0"
            />
          </div>
        </Reveal>

        {/* Steps */}
        <ol className="mt-12 space-y-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.06}>
              <li className="flex gap-5 rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-present-yellow/40 font-serif text-xl text-present-yellow">
                  {step.n}
                </span>
                <div>
                  <h2 className="font-serif text-2xl text-present-white">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-pretty leading-relaxed text-present-white/65">
                    {step.body}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        {/* Buy buttons */}
        <Reveal className="mt-12">
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href={LINKS.jupiter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-present-yellow px-8 py-3 font-sans text-sm uppercase tracking-wider text-present-black transition-opacity hover:opacity-90"
            >
              Buy on Jupiter <ArrowUpRight size={16} />
            </a>
            <a
              href={LINKS.pumpfun}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-present-yellow/60 px-8 py-3 font-sans text-sm uppercase tracking-wider text-present-yellow transition-colors hover:bg-present-yellow hover:text-present-black"
            >
              Buy on Pump.fun <ArrowUpRight size={16} />
            </a>
          </div>
        </Reveal>

        {/* Safety note */}
        <Reveal className="mt-10">
          <div className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
            <ShieldAlert
              size={22}
              className="mt-0.5 shrink-0 text-present-yellow"
              aria-hidden="true"
            />
            <p className="text-pretty text-sm leading-relaxed text-present-white/60">
              Stay safe: ⚡ZAPP will never DM you first, never run a giveaway
              asking you to send tokens, and never ask for your recovery phrase.
              Only ever trust the contract address on this page.{" "}
              <Link
                href="/whitepaper#honest-words"
                className="text-present-white/80 underline underline-offset-2 hover:text-present-white"
              >
                Read the honest words →
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
