export type NetworkOption = {
  code: string;
  name: string;
  chain: string;
  feeUsd: number;
  feeToken: string;
  color: string;
  internal?: boolean;
};

/*
 * Static, approximate gas-fee estimates matching the reference app's
 * screenshots. These are NOT live network fees — for production,
 * replace `feeUsd`/`feeToken` with a live estimate fetched from the
 * Worker (cached for a few minutes) instead of these fixed numbers.
 */
export const NETWORKS: NetworkOption[] = [
  { code: "internal", name: "خارج السلسلة", chain: "إلى حساب CwaAX آخر", feeUsd: 0, feeToken: "مجاني", color: "#22C55E", internal: true },
  { code: "TRC20", name: "TRC20", chain: "Tron", feeUsd: 2.63, feeToken: "2.63188299 USDT", color: "#FF0028" },
  { code: "ERC20", name: "ERC20", chain: "Ethereum", feeUsd: 0.02, feeToken: "0.024535 USDT", color: "#454A75" },
  { code: "OPTIMISM", name: "OPTIMISM", chain: "Optimism", feeUsd: 0.06, feeToken: "0.000024 ETH", color: "#FF0420" },
  { code: "ARETH", name: "ARETH", chain: "Arbitrum", feeUsd: 0.09, feeToken: "0.00003636 ETH", color: "#28A0F0" },
  { code: "AVAX", name: "AVAX", chain: "AVAX-C", feeUsd: 0, feeToken: "0.00045 AVAX", color: "#E84142" },
  { code: "OPBNB", name: "OPBNB", chain: "opBNB", feeUsd: 0, feeToken: "<0.000001 BNB", color: "#F0B90B" },
  { code: "BEP20", name: "BEP20", chain: "Binance Smart Chain", feeUsd: 0.16, feeToken: "0.16364471 USDT", color: "#F3BA2F" },
  { code: "TON", name: "TON", chain: "TON", feeUsd: 0.15, feeToken: "0.148099 USDT", color: "#0098EA" },
  { code: "POLYGON", name: "POLYGON", chain: "Polygon", feeUsd: 0, feeToken: "0.004721 USDT", color: "#8247E5" },
  { code: "SOL", name: "SOL", chain: "Solana", feeUsd: 0.35, feeToken: "0.346582 USDT", color: "#14F195" },
  { code: "CELO", name: "CELO", chain: "CELO", feeUsd: 0, feeToken: "0.004309 USDT", color: "#35D07F" },
];

export function getNetwork(code: string): NetworkOption {
  return NETWORKS.find((n) => n.code === code) || NETWORKS[1];
}
