/**
 * ⚡ZAPP — single source of truth.
 * Every fact, link, and slogan lives here. Import from "@/lib/constants"
 * everywhere so the whole site stays consistent. Do NOT invent or change
 * values — these are verified on-chain facts.
 */

export const SITE = {
  name: "⚡ZAPP",
  symbol: "ZAPP",
  url: "https://zapp369.energy",
  email: "team@zapp369.energy",
} as const;

export const TOKEN = {
  name: "⚡ZAPP",
  symbol: "ZAPP",
  chain: "Solana",
  contract: "Ab16ce5SDbibTbXevxHLpqUnUvu9tNkkpaJcSDvCpump",
  launch: "May 1, 2026", // Workers Day
  totalSupply: 1_000_000_000,
  totalSupplyLabel: "1,000,000,000",
  tax: "0%",
  mintAuthority: "Revoked",
  freezeAuthority: "Revoked",
  lp: "Permanently burned",
} as const;

/** Fallback values used when live APIs are unavailable (verified May 31, 2026). */
export const STATS_FALLBACK = {
  holders: 270,
  telegramMembers: 2400,
  tvl: 13800,
  tvlLabel: "$13K",
  marketCap: null as number | null,
  volume24h: null as number | null,
} as const;

export const LINKS = {
  pumpfun: "https://pump.fun/coin/Ab16ce5SDbibTbXevxHLpqUnUvu9tNkkpaJcSDvCpump",
  jupiter: "https://jup.ag/tokens/Ab16ce5SDbibTbXevxHLpqUnUvu9tNkkpaJcSDvCpump",
  solscan: "https://solscan.io/token/Ab16ce5SDbibTbXevxHLpqUnUvu9tNkkpaJcSDvCpump",
  dexscreener:
    "https://dexscreener.com/solana/Ab16ce5SDbibTbXevxHLpqUnUvu9tNkkpaJcSDvCpump",
  telegram: "https://t.me/ZAPP369",
  twitter: "https://x.com/ZAPPonSOL",
  email: "mailto:team@zapp369.energy",
} as const;

/** Live chart — the ⚡ZAPP/SOL pair on the Pump.fun AMM (PumpSwap), via DexScreener's embeddable widget. */
export const CHART = {
  pairAddress: "GnnKAkwk2pxb4eKCsHRo2xSpJPDe6b1PzXbk2H6pqpGx",
  embedUrl:
    "https://dexscreener.com/solana/GnnKAkwk2pxb4eKCsHRo2xSpJPDe6b1PzXbk2H6pqpGx?embed=1&theme=dark&trades=0&info=0",
} as const;

/** Slogans — use verbatim, never paraphrase. */
export const SLOGANS = {
  revolution: "Tesla's unfinished revolution",
  freeEnergy: "Free Energy = Free Money ∞",
  frequency: "The frequency they tried to silence",
  numerology: "3 · 6 · 9 ∞",
  marketCap:
    "When the market cap touched $3,690 — Tesla's sacred number — it was not a coincidence. The universe was listening.",
  burnedLp: "Burned LP = no rug pull possible. Ever.",
  noMeters:
    "There are no meters on ⚡ZAPP. JP Morgan's question has no answer here.",
  answer: "The answer Tesla never got to give.",
  signal:
    "⚡ZAPP is that signal. Built on Solana. Owned by no one. Available to everyone.",
} as const;

/** Tesla quotes — verbatim. */
export const TESLA_QUOTES = {
  magnificence:
    "If you knew the magnificence of 3, 6 and 9, you would have a key to the universe.",
  nonPhysical:
    "The day science begins to study non-physical phenomena, it will make more progress in one decade than in all the previous centuries of its existence.",
} as const;

/** The three eras — used by the home-page doorways and navigation. */
export const ERAS = [
  {
    key: "past",
    number: "3",
    title: "PAST",
    subtitle: "The Spark",
    name: "The Tower",
    href: "/past",
    accent: "#E8B547",
  },
  {
    key: "present",
    number: "6",
    title: "PRESENT",
    subtitle: "The Bloom",
    name: "The Current",
    href: "/present",
    accent: "#FFD700",
  },
  {
    key: "future",
    number: "9",
    title: "FUTURE",
    subtitle: "The Network",
    name: "The Network",
    href: "/future",
    accent: "#9D4EDD",
  },
] as const;

export const NAV = [
  { label: "Past", href: "/past" },
  { label: "Present", href: "/present" },
  { label: "Future", href: "/future" },
  { label: "How to Buy", href: "/how-to-buy" },
  { label: "Whitepaper", href: "/whitepaper" },
] as const;

/** The four verified-on-chain trust receipts (home + present pages). */
export const VERIFIED = [
  { label: "Mint authority revoked", href: LINKS.solscan },
  { label: "Freeze authority revoked", href: LINKS.solscan },
  { label: "LP permanently burned", href: LINKS.solscan },
  { label: "0% transaction tax", href: LINKS.pumpfun },
] as const;
