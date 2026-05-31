import { ArrowUpRight, Check } from "lucide-react";
import { VERIFIED } from "@/lib/constants";
import { Reveal } from "./Reveal";

/** The four verified-on-chain trust receipts, each linking to its proof. */
export function VerifiedPanel() {
  return (
    <section className="relative border-t border-white/5 px-6 py-24 sm:py-28">
      <Reveal className="mx-auto mb-12 max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-ritual text-present-white/40">
          Verified on-chain
        </p>
        <h2 className="mt-4 font-serif text-4xl text-present-white sm:text-5xl">
          No meters. No locks. No exits.
        </h2>
        <p className="mt-4 text-pretty text-present-white/55">
          Every claim below is provable on the Solana blockchain.
        </p>
      </Reveal>

      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VERIFIED.map((v, i) => {
          const source = v.href.includes("solscan") ? "Solscan" : "Pump.fun";
          return (
            <Reveal key={v.label} delay={i * 0.08}>
              <a
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col justify-between gap-6 rounded-xl border border-past-gold/30 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-past-gold/70 hover:bg-white/[0.04]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-past-gold/40 text-past-gold">
                  <Check size={18} />
                </span>
                <div>
                  <p className="font-serif text-lg text-present-white">{v.label}</p>
                  <p className="mt-3 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-present-white/45 transition-colors group-hover:text-past-gold">
                    View on {source}
                    <ArrowUpRight size={13} />
                  </p>
                </div>
              </a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
