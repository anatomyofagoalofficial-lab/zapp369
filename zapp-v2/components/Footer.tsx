import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { CopyButton } from "./CopyButton";
import { RiskDisclaimer } from "./RiskDisclaimer";
import { LINKS, SITE, SLOGANS, TOKEN } from "@/lib/constants";

const linkCls =
  "inline-flex items-center gap-1 text-sm text-present-white/55 transition-colors hover:text-present-white";
const headingCls =
  "font-mono text-xs uppercase tracking-ritual text-present-white/35";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <BrandMark
              as="p"
              boltClassName="text-present-yellow"
              className="text-2xl text-present-white"
            />
            <p className="mt-3 max-w-xs text-sm text-present-white/45">
              {SLOGANS.signal}
            </p>
          </div>

          {/* Signal */}
          <nav aria-label="Community">
            <h2 className={headingCls}>Signal</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a className={linkCls} href={LINKS.telegram} target="_blank" rel="noopener noreferrer">
                  Telegram <ArrowUpRight size={13} />
                </a>
              </li>
              <li>
                <a className={linkCls} href={LINKS.twitter} target="_blank" rel="noopener noreferrer">
                  Twitter / X <ArrowUpRight size={13} />
                </a>
              </li>
            </ul>
          </nav>

          {/* Markets */}
          <nav aria-label="Markets">
            <h2 className={headingCls}>Markets</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a className={linkCls} href={LINKS.pumpfun} target="_blank" rel="noopener noreferrer">
                  Pump.fun <ArrowUpRight size={13} />
                </a>
              </li>
              <li>
                <a className={linkCls} href={LINKS.jupiter} target="_blank" rel="noopener noreferrer">
                  Jupiter <ArrowUpRight size={13} />
                </a>
              </li>
              <li>
                <a className={linkCls} href={LINKS.dexscreener} target="_blank" rel="noopener noreferrer">
                  DEXScreener <ArrowUpRight size={13} />
                </a>
              </li>
              <li>
                <a className={linkCls} href={LINKS.solscan} target="_blank" rel="noopener noreferrer">
                  Solscan <ArrowUpRight size={13} />
                </a>
              </li>
            </ul>
          </nav>

          {/* Explore */}
          <nav aria-label="Site">
            <h2 className={headingCls}>Explore</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <Link className={linkCls} href="/whitepaper">
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link className={linkCls} href="/how-to-buy">
                  How to Buy
                </Link>
              </li>
              <li>
                <a className={linkCls} href={LINKS.email}>
                  <Mail size={13} /> {SITE.email}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Contract address */}
        <div className="mt-12 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className={headingCls}>Contract</p>
            <p className="mt-1 break-all font-mono text-xs text-present-white/70 sm:text-sm">
              {TOKEN.contract}
            </p>
          </div>
          <CopyButton value={TOKEN.contract} label="Copy address" className="shrink-0" />
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <RiskDisclaimer className="max-w-xl" />
          <p className="shrink-0 font-mono text-xs uppercase tracking-ritual text-present-white/35">
            3 · 6 · 9 ∞
          </p>
        </div>
      </div>
    </footer>
  );
}
