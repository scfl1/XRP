import { Image, View } from "react-native";

export type NetworkIconProps = {
  code: string;
  size?: number;
};

/*
 * خرائط الأكواد إلى slugs الخاصة بـ Simple Icons
 * المصدر: https://simpleicons.org — رخصة CC0 (مفتوحة، مجانية)
 */
const SLUG_MAP: Record<string, { slug: string; color: string }> = {
  // ============ شبكات ============
  TRC20:     { slug: "tron",       color: "EF0027" },
  TRON:      { slug: "tron",       color: "EF0027" },
  ERC20:     { slug: "ethereum",   color: "627EEA" },
  ETH:       { slug: "ethereum",   color: "627EEA" },
  ETHEREUM:  { slug: "ethereum",   color: "627EEA" },
  OPTIMISM:  { slug: "optimism",   color: "FF0420" },
  OP:        { slug: "optimism",   color: "FF0420" },
  ARETH:     { slug: "arbitrum",   color: "12AAFF" },
  ARBITRUM:  { slug: "arbitrum",   color: "12AAFF" },
  ARB:       { slug: "arbitrum",   color: "12AAFF" },
  AVAX:      { slug: "avalanche",  color: "E84142" },
  AVALANCHE: { slug: "avalanche",  color: "E84142" },
  OPBNB:     { slug: "bnb",        color: "F3BA2F" },
  BEP20:     { slug: "bnb",        color: "F3BA2F" },
  BNB:       { slug: "bnb",        color: "F3BA2F" },
  SOL:       { slug: "solana",     color: "9945FF" },
  SOLANA:    { slug: "solana",     color: "9945FF" },
  TON:       { slug: "ton",        color: "0098EA" },
  POLYGON:   { slug: "polygon",    color: "8247E5" },
  MATIC:     { slug: "polygon",    color: "8247E5" },
  CELO:      { slug: "celo",       color: "FCFF52" },
  // ============ عملات ============
  USDT:      { slug: "tether",     color: "26A17B" },
  BTC:       { slug: "bitcoin",    color: "F7931A" },
  BITCOIN:   { slug: "bitcoin",    color: "F7931A" },
  XRP:       { slug: "xrp",        color: "23292F" },
  RIPPLE:    { slug: "xrp",        color: "23292F" },
};

export function NetworkIcon({ code, size = 40 }: NetworkIconProps) {
  const upper = (code || "").toUpperCase();
  const entry = SLUG_MAP[upper];

  // كود غير معروف → دائرة رمادية
  if (!entry) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#94A3B8",
        }}
      />
    );
  }

  // رابط PNG الرسمي من Simple Icons CDN
  const url = `https://cdn.simpleicons.org/${entry.slug}/FFFFFF`;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        backgroundColor: `#${entry.color}`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={{ uri: url }}
        style={{
          width: size * 0.6,
          height: size * 0.6,
        }}
        resizeMode="contain"
      />
    </View>
  );
}

export default NetworkIcon;
