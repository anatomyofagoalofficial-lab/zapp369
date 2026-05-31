import { STATS_FALLBACK, TOKEN } from "./constants";

export type Stats = {
  holders: number;
  telegramMembers: number;
  marketCap: number | null;
  volume24h: number | null;
  tvl: number | null;
  /** true when market data came from the live source, false when using fallback. */
  live: boolean;
};

/**
 * Fetches live market data from DexScreener's public API, server-side, with a
 * 5-minute cache. On ANY failure it returns the verified static fallback —
 * the page never breaks. Holder + Telegram counts are not available via this
 * API, so they always use the last-verified static values.
 */
export async function getStats(): Promise<Stats> {
  const fallback: Stats = {
    holders: STATS_FALLBACK.holders,
    telegramMembers: STATS_FALLBACK.telegramMembers,
    marketCap: STATS_FALLBACK.marketCap,
    volume24h: STATS_FALLBACK.volume24h,
    tvl: STATS_FALLBACK.tvl,
    live: false,
  };

  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${TOKEN.contract}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return fallback;

    const data = (await res.json()) as {
      pairs?: Array<{
        marketCap?: number;
        fdv?: number;
        volume?: { h24?: number };
        liquidity?: { usd?: number };
      }>;
    };

    const pair = data.pairs?.[0];
    if (!pair) return fallback;

    const marketCap = Number(pair.marketCap ?? pair.fdv);
    const volume24h = Number(pair.volume?.h24);
    const tvl = Number(pair.liquidity?.usd);

    return {
      ...fallback,
      marketCap: Number.isFinite(marketCap) ? marketCap : fallback.marketCap,
      volume24h: Number.isFinite(volume24h) ? volume24h : fallback.volume24h,
      tvl: Number.isFinite(tvl) ? tvl : fallback.tvl,
      live: true,
    };
  } catch {
    return fallback;
  }
}
