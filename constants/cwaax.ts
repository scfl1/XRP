export const TRADE_DAILY_RATE = 0.035;

export const CWAAX = {
  green: "#20E58A",
  greenDark: "#0A9F61",
  greenSoft: "#123C31",
  ink: "#F4FFFA",
  muted: "#8EA9A0",
  line: "#1D4B40",
  border: "#1D4B40",
  surface: "#102B29",
  white: "#FFFFFF",
  red: "#FF6B73",
  gold: "#F5C33B",
  purple: "#A77BFF",
  blue: "#347CFF",
  background: "#061C1B",
} as const;

const PLAN_COIN_CYCLE = [
  "USDT", "ETH", "BNB", "XRP", "SOL", "ADA", "TRX", "TON",
  "AVAX", "DOT", "LINK", "MATIC", "LTC", "BCH", "NEAR", "UNI",
];

const TRADE_AMOUNTS = [
  50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700,
  800, 900, 1000, 1200, 1400, 1500, 2000, 2500, 3000, 3500, 4000, 5000,
  7000, 8000, 9000, 10000, 15000, 20000, 25000, 30000, 40000, 50000,
];

export const TRADE_PLANS = TRADE_AMOUNTS.map((amount, index) => ({
  amount,
  color: ["#20E58A", "#347CFF", "#A77BFF", "#F5C33B"][index % 4],
  // The last (highest) plan is always Bitcoin; every other plan cycles
  // through a curated list of real, distinct coins for visual variety.
  coin: index === TRADE_AMOUNTS.length - 1 ? "BTC" : PLAN_COIN_CYCLE[index % PLAN_COIN_CYCLE.length],
}));

export const COINS = [
  { symbol: "TRX", name: "TRON", amount: "0", value: "$0.00", change: "—", color: "#E94F64", mark: "TRON" },
  { symbol: "USDT", name: "Tether USD", amount: "0", value: "$0.00", change: "—", color: "#26A17B", mark: "USDT" },
  { symbol: "DOGE", name: "Dogecoin", amount: "0", value: "$0.00", change: "—", color: "#C89B3C", mark: "DOGE" },
  { symbol: "XLM", name: "Stellar", amount: "0", value: "$0.00", change: "—", color: "#2E3540", mark: "XLM" },
];

export const MARKETS = [
  { symbol: "BTC/USDT", price: "السوق", change: "متاح", color: "#D98931", mark: "BTC" },
  { symbol: "ETH/USDT", price: "السوق", change: "متاح", color: "#6675D1", mark: "ETH" },
  { symbol: "USDT", price: "رصيدك", change: "مباشر", color: "#26A17B", mark: "USDT" },
];

export const TRANSACTIONS = [
  { id: "#CX-92031", title: "استقبال USDT", time: "اليوم، 10:42 ص", amount: "+ 250.00 USDT", status: "مكتملة", positive: true },
  { id: "#CX-92016", title: "بدء عقد USDT", time: "أمس، 08:18 م", amount: "- 120.00 USDT", status: "مكتملة", positive: false },
  { id: "#CX-91988", title: "شراء BTC", time: "28 أغسطس، 02:05 م", amount: "- 100.00 USDT", status: "مكتملة", positive: false },
];

export const quickActions = [
  { label: "دفع", icon: "north-east" as const, route: "/send", tone: CWAAX.ink, filled: true },
  { label: "استقبال", icon: "south-west" as const, route: "/receive", tone: CWAAX.green, filled: false },
  { label: "شراء / بيع", icon: "swap-vert" as const, route: "/trade", tone: CWAAX.gold, filled: true },
  { label: "تبديل", icon: "autorenew" as const, route: "/trade", tone: CWAAX.purple, filled: false },
  { label: "أكثر", icon: "apps" as const, route: "/menu", tone: CWAAX.muted, filled: false },
];
