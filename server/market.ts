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
 * Top ~20 coins by market cap, paired against USDT. Binance's public
 * ticker endpoint is used instead of CoinGecko: CoinGecko is known to
 * throttle/hang requests coming from Cloudflare's own IP ranges
 * (Workers included), which let a single slow fetch stall a Worker
 * isolate and destabilize the shared DB connection for unrelated
 * requests. Binance is far more reliable from within Workers and
 * needs no API key for this endpoint.
 */
const TOP_SYMBOLS = [
  "BTC", "ETH", "BNB", "XRP", "SOL", "DOGE", "ADA", "TRX", "TON", "AVAX",
  "DOT", "LINK", "MATIC", "LTC", "SHIB", "BCH", "NEAR", "UNI", "ICP", "ETC",
];

const COIN_NAMES: Record<string, string> = {
  BTC: "Bitcoin", ETH: "Ethereum", BNB: "BNB", XRP: "XRP", SOL: "Solana",
  DOGE: "Dogecoin", ADA: "Cardano", TRX: "TRON", TON: "Toncoin", AVAX: "Avalanche",
  DOT: "Polkadot", LINK: "Chainlink", MATIC: "Polygon", LTC: "Litecoin", SHIB: "Shiba Inu",
  BCH: "Bitcoin Cash", NEAR: "NEAR Protocol", UNI: "Uniswap", ICP: "Internet Computer", ETC: "Ethereum Classic",
};

export async function getTopMarkets(): Promise<MarketCoin[]> {
  if (_cache && Date.now() - _cache.ts < TTL_MS) {
    return _cache.data;
  }

  try {
    const symbolsParam = encodeURIComponent(
      JSON.stringify(TOP_SYMBOLS.map((s) => `${s}USDT`)),
    );

    const res = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbolsParam}`,
      {
        headers: { accept: "application/json" },
        // Never let a slow/blocked upstream hang this request — a
        // stuck fetch can stall the whole Worker isolate.
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!res.ok) {
      throw new Error(`Binance responded ${res.status}`);
    }

    const rows = (await res.json()) as any[];
    const bySymbol = new Map(rows.map((r) => [r.symbol, r]));

    const data: MarketCoin[] = TOP_SYMBOLS
      .map((sym) => {
        const row = bySymbol.get(`${sym}USDT`);
        if (!row) return null;

        return {
          id: sym.toLowerCase(),
          symbol: sym,
          name: COIN_NAMES[sym] || sym,
          image: `https://assets.coincap.io/assets/icons/${sym.toLowerCase()}@2x.png`,
          price: Number(row.lastPrice) || 0,
          change24h: Number(row.priceChangePercent) || 0,
        };
      })
      .filter((c): c is MarketCoin => c !== null && c.price > 0);

    _cache = { data, ts: Date.now() };
    return data;
  } catch (error) {
    console.error("[Market] Failed to fetch live prices:", error);
    return _cache?.data ?? [];
  }
}
