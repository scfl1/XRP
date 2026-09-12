export type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
};

let _cache: { data: MarketCoin[]; ts: number } | null = null;
const TTL_MS = 60_000;

/*
 * Real, live top-20 cryptocurrency prices from CoinGecko's public API
 * (no API key required for this endpoint). Cached in-memory for 60s
 * per Worker isolate to stay well within CoinGecko's free-tier rate
 * limits even under load. If the fetch fails (rate limit, network
 * blip), we serve the last good cache instead of breaking the page.
 */
export async function getTopMarkets(): Promise<MarketCoin[]> {
  if (_cache && Date.now() - _cache.ts < TTL_MS) {
    return _cache.data;
  }

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h",
      { headers: { accept: "application/json" } },
    );

    if (!res.ok) {
      throw new Error(`CoinGecko responded ${res.status}`);
    }

    const rows = (await res.json()) as any[];

    const data: MarketCoin[] = rows.map((c) => ({
      id: c.id,
      symbol: String(c.symbol || "").toUpperCase(),
      name: c.name,
      image: c.image,
      price: Number(c.current_price) || 0,
      change24h: Number(c.price_change_percentage_24h) || 0,
    }));

    _cache = { data, ts: Date.now() };
    return data;
  } catch (error) {
    console.error("[Market] Failed to fetch live prices:", error);
    return _cache?.data ?? [];
  }
}
