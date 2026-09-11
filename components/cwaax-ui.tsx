import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Path, Polygon } from "react-native-svg";
import { CWAAX } from "@/constants/cwaax";
import { NetworkIcon } from "@/app/network-select";

export type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

export function CwaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.logoWrap}>
      <View style={styles.logoBadge}>
        <Text style={styles.logoLetter}>C</Text>
      </View>
      {!compact && (
        <Text style={styles.logoText}>
          Cwa<Text style={styles.logoAccent}>AX</Text>
        </Text>
      )}
    </View>
  );
}

export function IconButton({
  icon,
  onPress,
  label,
  tone = "light",
}: {
  icon: IconName;
  onPress?: () => void;
  label?: string;
  tone?: "light" | "green";
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        tone === "green" && styles.iconButtonGreen,
        pressed && styles.pressed,
      ]}
    >
      <MaterialIcons
        name={icon}
        size={21}
        color={tone === "green" ? CWAAX.white : CWAAX.ink}
      />
    </Pressable>
  );
}

export function Card({
  children,
  style,
  onPress,
}: {
  children: ReactNode;
  style?: object;
  onPress?: () => void;
}) {
  const content = <View style={[styles.card, style]}>{children}</View>;
  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.cardPressed]}
    >
      {content}
    </Pressable>
  );
}

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>{title}</Text>
      {action &&
        (onAction ? (
          <Pressable
            onPress={onAction}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <Text style={styles.sectionAction}>{action}</Text>
          </Pressable>
        ) : (
          <Text style={styles.sectionAction}>{action}</Text>
        ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  CoinMark — يستخدم نفس NetworkIcon حتى تظهر الأيقونات موحّدة        */
/*  mark: يمكن أن يكون كود الشبكة (TRC20, ERC20, SOL, ...) أو حرف      */
/*  color: يُستخدم فقط عند الرسم الاحتياطي بالحرف                      */
/* ------------------------------------------------------------------ */

const KNOWN_NETWORK_CODES = new Set([
  "TRC20",
  "TRON",
  "ERC20",
  "ETH",
  "ETHEREUM",
  "OPTIMISM",
  "OP",
  "ARETH",
  "ARBITRUM",
  "ARB",
  "AVAX",
  "AVALANCHE",
  "OPBNB",
  "BEP20",
  "BNB",
  "SOL",
  "SOLANA",
  "TON",
  "POLYGON",
  "MATIC",
  "CELO",
]);

export function CoinMark({
  mark,
  color,
  size = 42,
}: {
  mark: string;
  color: string;
  size?: number;
}) {
  const upper = (mark || "").toUpperCase();

  if (KNOWN_NETWORK_CODES.has(upper)) {
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2 }}>
        <NetworkIcon code={upper} size={size} />
      </View>
    );
  }

  /* Fallback: حرف داخل دائرة ملوّنة (للعملات غير المعروفة) */
  return (
    <View
      style={[
        styles.coin,
        { backgroundColor: color, width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.coinText, { fontSize: size * 0.4 }]}>
        {(mark || "?").slice(0, 1).toUpperCase()}
      </Text>
    </View>
  );
}

/* أيقونة عملة SVG عامة (اختيارية للاستخدام المباشر) */
export function CoinGlyph({
  glyph,
  size = 24,
}: {
  glyph: "btc" | "eth" | "usdt" | "sol" | "bnb" | "ton";
  size?: number;
}) {
  const vb = "0 0 24 24";
  switch (glyph) {
    case "btc":
      return (
        <Svg width={size} height={size} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#F7931A" />
          <Path
            d="M16.5 10.6c.2-1.4-.9-2.2-2.4-2.7l.5-2-1.2-.3-.5 2c-.3-.1-.7-.2-1-.2l.5-2-1.2-.3-.5 2c-.3-.1-.6-.1-.8-.2v0l-1.7-.4-.3 1.3s.9.2.9.2c.5.1.6.4.6.7l-.6 2.3c0 0 .1 0 .1.1-.1 0-.1 0-.1 0l-.8 3.3c-.1.2-.2.4-.6.3 0 0-.9-.2-.9-.2l-.6 1.4 1.6.4c.3.1.6.2.9.2l-.5 2 1.2.3.5-2c.3.1.7.2 1 .2l-.5 2 1.2.3.5-2c2.1.4 3.6.2 4.3-1.6.5-1.5 0-2.3-1.1-2.9.8-.2 1.4-.7 1.5-1.7zm-2.7 3.8c-.4 1.5-3 .7-3.9.5l.7-2.7c.8.2 3.5.6 3.2 2.2zm.4-3.8c-.3 1.3-2.5.7-3.2.5l.6-2.5c.7.2 3 .5 2.6 2z"
            fill="#FFFFFF"
          />
        </Svg>
      );
    case "eth":
      return (
        <Svg width={size} height={size} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#627EEA" />
          <G fill="#FFFFFF">
            <Path d="M12 4v6l5 2.2z" opacity="0.7" />
            <Path d="M12 4L7 12.2 12 10z" opacity="0.9" />
            <Path d="M12 16.5V20l5-7z" opacity="0.7" />
            <Path d="M12 20v-3.5L7 13z" opacity="0.9" />
            <Path d="M12 15.4l5-2.9-5-2.3z" opacity="0.6" />
          </G>
        </Svg>
      );
    case "usdt":
      return (
        <Svg width={size} height={size} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#26A17B" />
          <Path
            d="M13.4 10.4V8.9h3.2V6.5H7.4v2.4h3.2v1.5c-2.7.1-4.7.7-4.7 1.4s2 1.3 4.7 1.4v4.4h2.8v-4.4c2.7-.1 4.7-.7 4.7-1.4s-2-1.3-4.7-1.4zm0 2.4c-.1 0-.5 0-1 .1-.8 0-1.3-.1-1.3-.1-2-.2-3.4-.6-3.4-1s1.5-.8 3.4-1v1.5c.4 0 .8.1 1.3.1.5 0 .9 0 1-.1v-1.5c1.9.2 3.3.6 3.3 1s-1.4.8-3.3 1z"
            fill="#FFFFFF"
          />
        </Svg>
      );
    case "sol":
      return (
        <Svg width={size} height={size} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#000000" />
          <G>
            <Path
              d="M6.5 8.5h8.6l2.2-2.2H8.7L6.5 8.5z"
              fill="#00FFA3"
            />
            <Path
              d="M6.5 13.3h8.6l2.2-2.2H8.7L6.5 13.3z"
              fill="#00FFA3"
            />
            <Path
              d="M6.5 18.1h8.6l2.2-2.2H8.7L6.5 18.1z"
              fill="#00FFA3"
            />
          </G>
        </Svg>
      );
    case "bnb":
      return (
        <Svg width={size} height={size} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#F3BA2F" />
          <G fill="#FFFFFF">
            <Path d="M12 4.5l2.6 2.6L12 9.7 9.4 7.1z" />
            <Path d="M7 9.5l2.6 2.6L7 14.7 4.4 12.1z" />
            <Path d="M17 9.5l2.6 2.6L17 14.7l-2.6-2.6z" />
            <Path d="M12 14.3l2.6 2.6L12 19.5l-2.6-2.6z" />
            <Path d="M12 10.3l1.7 1.7L12 13.7l-1.7-1.7z" />
          </G>
        </Svg>
      );
    case "ton":
      return (
        <Svg width={size} height={size} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#0098EA" />
          <Path
            d="M8.3 7h7.4c.6 0 1 .6.7 1.1l-3.4 6.6c-.4.7-1.4.7-1.8 0L7.6 8.1C7.3 7.6 7.7 7 8.3 7z"
            fill="#FFFFFF"
            opacity="0.4"
          />
          <Path
            d="M8.3 7h7.4c.6 0 1 .6.7 1.1l-3.4 6.6c-.4.7-1.4.7-1.8 0L7.6 8.1C7.3 7.6 7.7 7 8.3 7z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.1"
          />
          <Path d="M12 7v9.5" stroke="#FFFFFF" strokeWidth="1" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#94A3B8" />
          <Polygon points="12,6 18,12 12,18 6,12" fill="#FFFFFF" opacity="0.85" />
        </Svg>
      );
  }
}

export function TrendLine({ color = CWAAX.green }: { color?: string }) {
  return (
    <View style={styles.trendLine}>
      {[18, 11, 15, 7, 12, 4, 8, 2, 6].map((height, index) => (
        <View
          key={index}
          style={[
            styles.trendBar,
            { height, backgroundColor: color, opacity: 0.35 + index * 0.07 },
          ]}
        />
      ))}
    </View>
  );
}

export function StatusPill({
  children,
  tone = "success",
}: {
  children: ReactNode;
  tone?: "success" | "warning" | "danger";
}) {
  const toneStyle =
    tone === "warning"
      ? styles.warningPill
      : tone === "danger"
      ? styles.dangerPill
      : styles.successPill;
  const textStyle =
    tone === "warning"
      ? styles.warningText
      : tone === "danger"
      ? styles.dangerText
      : styles.successText;
  return (
    <View style={[styles.pill, toneStyle]}>
      <Text style={[styles.pillText, textStyle]}>{children}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  logoWrap: { flexDirection: "row", alignItems: "center", gap: 9 },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: CWAAX.green,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-8deg" }],
  },
  logoLetter: {
    color: CWAAX.white,
    fontSize: 23,
    fontWeight: "900",
    transform: [{ rotate: "8deg" }],
  },
  logoText: {
    color: CWAAX.ink,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  logoAccent: { color: CWAAX.green },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: CWAAX.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: CWAAX.line,
  },
  iconButtonGreen: {
    backgroundColor: CWAAX.green,
    borderColor: CWAAX.green,
  },
  pressed: { opacity: 0.62, transform: [{ scale: 0.96 }] },
  cardPressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  card: {
    backgroundColor: CWAAX.white,
    borderWidth: 1,
    borderColor: CWAAX.line,
    borderRadius: 22,
    padding: 16,
    shadowColor: "#15231c",
    shadowOpacity: 0.035,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitleText: { fontSize: 17, fontWeight: "800", color: CWAAX.ink },
  sectionAction: { fontSize: 13, color: CWAAX.green, fontWeight: "700" },
  coin: { alignItems: "center", justifyContent: "center" },
  coinText: { color: CWAAX.white, fontWeight: "900" },
  trendLine: {
    height: 24,
    width: 56,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  trendBar: { width: 4, borderRadius: 5 },
  pill: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  successPill: { backgroundColor: CWAAX.greenSoft },
  warningPill: { backgroundColor: "#FFF6DF" },
  dangerPill: { backgroundColor: "#FDECEB" },
  pillText: { fontSize: 11, fontWeight: "700" },
  successText: { color: CWAAX.green },
  warningText: { color: CWAAX.gold },
  dangerText: { color: CWAAX.red },
});
