"use client";

/**
 * A scrolling ticker band — the signal, always transmitting. Pure CSS marquee
 * (duplicated track for a seamless loop), reduced-motion safe (it just sits
 * still). Gives the page a living, broadcast feel instead of static text.
 */
const ITEMS = [
  "FREE ENERGY",
  "3 · 6 · 9",
  "NO BANKS",
  "FREE MONEY",
  "ON SOLANA",
  "OWNED BY NO ONE",
  "THE FREQUENCY RETURNS",
];

export function Marquee() {
  const track = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="relative z-10 overflow-hidden border-y border-present-yellow/20 bg-black/40 py-3 backdrop-blur-sm">
      <div className="flex w-max animate-marquee gap-0 whitespace-nowrap will-change-transform">
        {track.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6 font-mono text-xs uppercase tracking-[0.35em] text-present-yellow/90 sm:text-sm">
              {t}
            </span>
            <span aria-hidden className="text-present-yellow/40">
              ⚡
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
