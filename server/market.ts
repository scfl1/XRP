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

const COINCAP_IDS: Record<string, string> = {
  BTC: "bitcoin", ETH: "ethereum", BNB: "binance-coin", XRP: "xrp", SOL: "solana",
  DOGE: "dogecoin", ADA: "cardano", TRX: "tron", TON: "the-open-network", AVAX: "avalanche",
  DOT: "polkadot", LINK: "chainlink", MATIC: "polygon", LTC: "litecoin", SHIB: "shiba-inu",
  BCH: "bitcoin-cash", NEAR: "near-protocol", UNI: "uniswap", ICP: "internet-computer", ETC: "ethereum-classic",
};

function icon(sym: string): string {
  return `https://assets.coincap.io/assets/icons/${sym.toLowerCase()}@2x.png`;
}

/*
 * Multiple independent upstream sources are tried in order, each with
 * its own short timeout, so a single blocked/geo-restricted provider
 * can't take the whole feature down. In practice, several well-known
 * exchange/aggregator APIs (Binance, CoinCap) block or throttle
 * requests coming from Cloudflare's own IP ranges (Workers included)
 * — confirmed here with Binance returning 403 and CoinCap returning
 * 530. CryptoCompare is tried first because it's commonly reported to
 * work reliably from Cloudflare Workers specifically for this reason.
 */

async function fromCryptoCompare(): Promise<MarketCoin[]> {
  const res = await fetch(
    `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${TOP_SYMBOLS.join(",")}&tsyms=USD`,
    { headers: { accept: "application/json" }, signal: AbortSignal.timeout(4000) },
  );

  if (!res.ok) throw new Error(`CryptoCompare responded ${res.status}`);

  const json = (await res.json()) as { RAW?: Record<string, any> };
  if (!json.RAW) throw new Error("CryptoCompare returned no RAW data");

  return TOP_SYMBOLS
    .map((sym) => {
      const row = json.RAW?.[sym]?.USD;
      if (!row) return null;
      return {
        id: sym.toLowerCase(),
        symbol: sym,
        name: COIN_NAMES[sym] || sym,
        image: icon(sym),
        price: Number(row.PRICE) || 0,
        change24h: Number(row.CHANGEPCT24HOUR) || 0,
      };
    })
    .filter((c): c is MarketCoin => c !== null && c.price > 0);
}

async function fromBinance(): Promise<MarketCoin[]> {
  const symbolsParam = encodeURIComponent(JSON.stringify(TOP_SYMBOLS.map((s) => `${s}USDT`)));

  const res = await fetch(
    `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbolsParam}`,
    { headers: { accept: "application/json" }, signal: AbortSignal.timeout(4000) },
  );

  if (!res.ok) throw new Error(`Binance responded ${res.status}`);

  const rows = (await res.json()) as any[];
  const bySymbol = new Map(rows.map((r) => [r.symbol, r]));

  return TOP_SYMBOLS
    .map((sym) => {
      const row = bySymbol.get(`${sym}USDT`);
      if (!row) return null;
      return {
        id: sym.toLowerCase(),
        symbol: sym,
        name: COIN_NAMES[sym] || sym,
        image: icon(sym),
        price: Number(row.lastPrice) || 0,
        change24h: Number(row.priceChangePercent) || 0,
      };
    })
    .filter((c): c is MarketCoin => c !== null && c.price > 0);
}

async function fromCoinCap(): Promise<MarketCoin[]> {
  const ids = TOP_SYMBOLS.map((s) => COINCAP_IDS[s]).join(",");

  const res = await fetch(
    `https://api.coincap.io/v2/assets?ids=${ids}`,
    { headers: { accept: "application/json" }, signal: AbortSignal.timeout(4000) },
  );

  if (!res.ok) throw new Error(`CoinCap responded ${res.status}`);

  const json = (await res.json()) as { data: any[] };
  const byId = new Map(json.data.map((r) => [r.id, r]));

  return TOP_SYMBOLS
    .map((sym) => {
      const row = byId.get(COINCAP_IDS[sym]);
      if (!row) return null;
      return {
        id: sym.toLowerCase(),
        symbol: sym,
        name: COIN_NAMES[sym] || sym,
        image: icon(sym),
        price: Number(row.priceUsd) || 0,
        change24h: Number(row.changePercent24Hr) || 0,
      };
    })
    .filter((c): c is MarketCoin => c !== null && c.price > 0);
}

export async function getTopMarkets(): Promise<MarketCoin[]> {
  if (_cache && Date.now() - _cache.ts < TTL_MS) {
    return _cache.data;
  }

  const failures: string[] = [];

  for (const source of [fromCryptoCompare, fromBinance, fromCoinCap]) {
    try {
      const data = await source();
      if (data.length > 0) {
        _cache = { data, ts: Date.now() };
        return data;
      }
      failures.push(`${source.name}: empty result`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[Market] ${source.name} failed:`, error);
      failures.push(`${source.name}: ${message}`);
    }
  }

  if (_cache) return _cache.data;

  // TEMPORARY diagnostic: surface exactly why every provider failed
  // instead of silently returning an empty list. Remove once confirmed.
  throw new Error(`[تشخيص مؤقت] فشل كل مصادر الأسعار: ${failures.join(" | ")}`);
}
