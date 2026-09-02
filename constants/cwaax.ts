export const CWAAX = {
  green: "#0B8754",
  greenDark: "#076A42",
  greenSoft: "#E8F7EF",
  ink: "#101A16",
  muted: "#77837D",
  line: "#E7ECE9",
  surface: "#F7F9F8",
  white: "#FFFFFF",
  red: "#D95C55",
  gold: "#D19A32",
  purple: "#7567D9",
} as const;

export const COINS = [
  { symbol: "TRX", name: "TRON", amount: "3,420.80", value: "$1,078.38", change: "+2.84%", color: "#E94F64", mark: "T" },
  { symbol: "USDT", name: "Tether USD", amount: "820.00", value: "$820.00", change: "+0.01%", color: "#26A17B", mark: "₮" },
  { symbol: "XRP", name: "XRP", amount: "486.20", value: "$227.08", change: "+4.12%", color: "#232B32", mark: "X" },
  { symbol: "DOGE", name: "Dogecoin", amount: "1,240.00", value: "$196.53", change: "-1.28%", color: "#C89B3C", mark: "Ð" },
  { symbol: "XLM", name: "Stellar", amount: "645.00", value: "$72.24", change: "+0.94%", color: "#2E3540", mark: "✦" },
];

export const MARKETS = [
  { symbol: "BTC/USDT", price: "$67,240.10", change: "+2.31%", color: "#D98931" },
  { symbol: "ETH/USDT", price: "$3,487.62", change: "+1.18%", color: "#6675D1" },
  { symbol: "XRP/USDT", price: "$0.4671", change: "+4.12%", color: "#232B32" },
];

export const TRANSACTIONS = [
  { id: "#CX-92031", title: "استقبال USDT", time: "اليوم، 10:42 ص", amount: "+ 250.00 USDT", status: "مكتملة", positive: true },
  { id: "#CX-92016", title: "تبديل XRP إلى USDT", time: "أمس، 08:18 م", amount: "- 120.00 XRP", status: "مكتملة", positive: false },
  { id: "#CX-91988", title: "شراء BTC", time: "28 أغسطس، 02:05 م", amount: "- 100.00 USDT", status: "مكتملة", positive: false },
];

export const quickActions = [
  { label: "دفع", icon: "qr-code-scanner" as const, route: "/deposit" },
  { label: "استقبال", icon: "call-received" as const, route: "/deposit" },
  { label: "شراء / بيع", icon: "swap-vertical-circle" as const, route: "/trade" },
  { label: "تبديل", icon: "compare-arrows" as const, route: "/trade" },
  { label: "أكثر", icon: "more-horiz" as const, route: "/menu" },
];
