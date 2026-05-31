import { CHART } from "./constants";

export type Candle = { t: number; o: number; h: number; l: number; c: number };

/**
 * Fetches OHLCV candles for the ⚡ZAPP/SOL pair (PumpSwap) from GeckoTerminal's
 * free public API, server-side, cached 5 min. Returns chronological order
 * (oldest → newest). On any failure returns [] so the UI can fall back.
 */
export async function getOhlcv(): Promise<Candle[]> {
  try {
    const url = `https://api.geckoterminal.com/api/v2/networks/solana/pools/${CHART.pairAddress}/ohlcv/hour?aggregate=4&limit=90&currency=usd`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];

    const data = (await res.json()) as {
      data?: { attributes?: { ohlcv_list?: number[][] } };
    };
    const list = data.data?.attributes?.ohlcv_list ?? [];

    return list
      .map((r) => ({
        t: Number(r[0]),
        o: Number(r[1]),
        h: Number(r[2]),
        l: Number(r[3]),
        c: Number(r[4]),
      }))
      .filter((k) => Number.isFinite(k.c) && Number.isFinite(k.o))
      .reverse(); // GeckoTerminal returns newest-first
  } catch {
    return [];
  }
}
