"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/**
 * "Ask Tesla" — a playful, interactive learning panel. Tap a question button and
 * the ⚡ZAPP mascot answers in a speech bubble, with a little bounce. Teaches the
 * lore (Tesla, 3·6·9, why Solana, how it's safe) through interaction instead of
 * walls of text. Warm, friendly, colourful chips — gold/cyan/violet accents on
 * black. Fully client-side, no deps beyond framer-motion (already in stack).
 */
type QA = { q: string; a: string; emoji: string; tint: string };

const QAS: QA[] = [
  {
    q: "Who was Tesla?",
    emoji: "⚡",
    tint: "#FFD700",
    a: "Nikola Tesla — the genius who dreamed of FREE energy for everyone. He built a giant tower to beam power through the air. No wires, no bills. The world wasn't ready. ⚡ZAPP finishes what he started.",
  },
  {
    q: "Why 3 · 6 · 9?",
    emoji: "🔺",
    tint: "#22D3EE",
    a: "Tesla said: “If you knew the magnificence of 3, 6 and 9, you'd have a key to the universe.” 3 = the spark, 6 = the bloom, 9 = the network. Our whole site is built on these three.",
  },
  {
    q: "What IS ⚡ZAPP?",
    emoji: "🪙",
    tint: "#9D4EDD",
    a: "A community memecoin on Solana honouring Tesla. Owned by no one, available to everyone. Money is energy — and energy should move free, at the speed of light. That's the whole idea.",
  },
  {
    q: "Why Solana?",
    emoji: "🚀",
    tint: "#22D3EE",
    a: "Because it's the fastest, cheapest chain alive — 65,000+ transfers a second, fees of $0.00025, settled in under a second. Tesla's frequency, transmitted at light speed. That's Solana.",
  },
  {
    q: "Is it safe?",
    emoji: "🔒",
    tint: "#10B981",
    a: "Verifiable on-chain: mint authority REVOKED, freeze authority REVOKED, liquidity BURNED, 0% tax. No new supply, no freezing, no rug possible. But it's a memecoin — only ever buy what you can afford to lose. 🙏",
  },
  {
    q: "How do I get some?",
    emoji: "🛒",
    tint: "#FFD700",
    a: "Easy: get a Phantom wallet, add a little SOL, paste the ⚡ZAPP contract on Phantom/Jupiter/Pump.fun, and swap. Four steps, two minutes. Hit the How to Buy page and I'll walk you through it!",
  },
];

export function AskTesla() {
  const [active, setActive] = useState(0);
  const qa = QAS[active];

  return (
    <section className="relative z-10 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-ritual text-present-yellow">
            Tap a question
          </p>
          <h2 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
            Ask ⚡ZAPP anything
          </h2>
        </div>

        <div className="grid items-center gap-8 md:grid-cols-[0.9fr_1.1fr]">
          {/* Mascot + speech bubble */}
          <div className="relative flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full rounded-2xl border p-5 text-center"
                style={{
                  borderColor: `${qa.tint}55`,
                  background: `${qa.tint}10`,
                  boxShadow: `0 0 50px -22px ${qa.tint}`,
                }}
              >
                <p className="text-pretty font-serif text-lg leading-relaxed text-white/90">
                  {qa.a}
                </p>
                {/* bubble tail */}
                <span
                  className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r"
                  style={{ borderColor: `${qa.tint}55`, background: "#0b0b10" }}
                />
              </motion.div>
            </AnimatePresence>

            <motion.div
              key={`m-${active}`}
              initial={{ y: 0 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.5 }}
              className="mt-6"
            >
              <Image
                src="/mascot.png"
                alt="⚡ZAPP mascot"
                width={150}
                height={220}
                className="h-auto w-[clamp(7rem,18vw,9.5rem)] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              />
            </motion.div>
          </div>

          {/* Question buttons */}
          <div className="grid gap-3 sm:grid-cols-2">
            {QAS.map((item, i) => {
              const on = i === active;
              return (
                <button
                  key={item.q}
                  onClick={() => setActive(i)}
                  className="group flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    borderColor: on ? item.tint : "rgba(255,255,255,0.12)",
                    background: on ? `${item.tint}1a` : "rgba(255,255,255,0.02)",
                    boxShadow: on ? `0 0 30px -14px ${item.tint}` : "none",
                  }}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                    style={{ background: `${item.tint}22` }}
                  >
                    {item.emoji}
                  </span>
                  <span className="font-sans text-sm font-medium text-white/85 group-hover:text-white">
                    {item.q}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
