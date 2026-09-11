import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
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

/* ================================================================== */
/*  CoinMark — يستخدم NetworkIcon لأكواد الشبكات المعروفة              */
/* ================================================================== */

const KNOWN_NETWORK_CODES = new Set([
  "TRC20", "TRON",
  "ERC20", "ETH", "ETHEREUM",
  "OPTIMISM", "OP",
  "ARETH", "ARBITRUM", "ARB",
  "AVAX", "AVALANCHE",
  "OPBNB", "BEP20", "BNB",
  "SOL", "SOLANA",
  "TON",
  "POLYGON", "MATIC",
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
      <View style={{ width: size, height: size, borderRadius: size / 2, overflow: "hidden" }}>
        <NetworkIcon code={upper} size={size} />
      </View>
    );
  }

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

/* ================================================================== */
/*  CoinGlyph — أيقونات عملات رسمية SVG                                */
/* ================================================================== */

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
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="#FFFFFF"
              d="M23.189 14.02c-1.592 6.38-8.061 10.265-14.442 8.673C2.365 21.101-1.52 14.632.072 8.252C1.663 1.872 8.132-2.013 14.513-.421c6.381 1.592 10.266 8.06 8.676 14.441zM16.62 10.912c.231-1.543-.943-2.372-2.549-2.925l.521-2.09-1.273-.317-.507 2.035c-.335-.084-.678-.163-1.021-.241l.51-2.048-1.272-.317-.521 2.09c-.276-.063-.548-.125-.812-.19l.002-.006-1.755-.438-.339 1.36s.944.216.924.23c.516.128.609.47.593.74l-.594 2.385c.036.009.082.022.133.042l-.135-.034-.833 3.342c-.063.157-.223.392-.583.303.013.018-.925-.23-.925-.23l-.632 1.457 1.656.413c.308.077.61.158.907.234l-.526 2.114 1.271.317.521-2.091c.348.094.685.181 1.015.263l-.52 2.08 1.272.317.526-2.11c2.169.41 3.799.245 4.486-1.717.553-1.58-.027-2.492-1.17-3.086.832-.192 1.459-.74 1.626-1.869zm-2.9 4.091c-.394 1.58-3.055.727-3.918.512l.697-2.798c.863.216 3.632.643 3.221 2.286zm.394-4.121c-.36 1.438-2.574.708-3.292.529l.632-2.538c.718.179 3.035.514 2.66 2.009z"
            />
          </G>
        </Svg>
      );

    case "eth":
      return (
        <Svg width={size} height={size} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#627EEA" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path fill="#FFFFFF" fillOpacity="0.602" d="M11.998 3v6.652l5.623 2.512z" />
            <Path fill="#FFFFFF" d="M11.998 3 6.375 12.164l5.623-2.512z" />
            <Path fill="#FFFFFF" fillOpacity="0.602" d="M11.998 16.476v4.52l5.627-7.784z" />
            <Path fill="#FFFFFF" d="M11.998 20.996v-4.52L6.375 13.212z" />
            <Path fill="#FFFFFF" fillOpacity="0.2" d="m11.998 15.429 5.623-3.265-5.623-2.51z" />
            <Path fill="#FFFFFF" fillOpacity="0.602" d="m6.375 12.164 5.623 3.265v-5.775z" />
          </G>
        </Svg>
      );

    case "usdt":
      return (
        <Svg width={size} height={size} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#26A17B" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="#FFFFFF"
              d="M12.978 10.475v-1.68h3.785V6.16H7.238v2.635h3.785v1.68c-3.077.14-5.39.75-5.39 1.48 0 .73 2.313 1.34 5.39 1.48v5.408h3.955v-5.41c3.07-.14 5.376-.75 5.376-1.478 0-.728-2.305-1.336-5.376-1.48zm0 2.517v-.002c-.069.005-.42.026-1.075.026-.522 0-.887-.015-1.017-.024l-.001.001c-3.31-.148-5.787-.72-5.787-1.41 0-.69 2.477-1.262 5.787-1.41v2.244c.132.009.505.03 1.03.03.633 0 1.0-.026 1.063-.03v-2.243c3.304.148 5.771.722 5.771 1.409 0 .687-2.467 1.26-5.771 1.409z"
            />
          </G>
        </Svg>
      );

    case "sol":
      return (
        <Svg width={size} height={size} viewBox={vb}>
          <Defs>
            <LinearGradient id="solGlyph" x1="0" y1="1" x2="1" y2="0">
              <Stop offset="0" stopColor="#00FFA3" />
              <Stop offset="1" stopColor="#DC1FFF" />
            </LinearGradient>
          </Defs>
          <Circle cx="12" cy="12" r="12" fill="#000000" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="url(#solGlyph)"
              d="M17.75 6.65a.43.43 0 0 1 .3-.13h7.34c.22 0 .34.26.18.42l-1.42 1.42a.43.43 0 0 1-.3.13h-7.34a.3.3 0 0 1-.18-.42z"
              transform="translate(-3.3 -1)"
            />
            <Path
              fill="url(#solGlyph)"
              d="M17.75 6.65a.43.43 0 0 1 .3-.13h7.34c.22 0 .34.26.18.42l-1.42 1.42a.43.43 0 0 1-.3.13h-7.34a.3.3 0 0 1-.18-.42z"
              transform="translate(-5.6 3.6) scale(0.92)"
            />
            <Path
              fill="url(#solGlyph)"
              d="M17.75 6.65a.43.43 0 0 1 .3-.13h7.34c.22 0 .34.26.18.42l-1.42 1.42a.43.43 0 0 1-.3.13h-7.34a.3.3 0 0 1-.18-.42z"
              transform="translate(-5.6 8.2) scale(1.08)"
            />
          </G>
        </Svg>
      );

    case "bnb":
      return (
        <Svg width={size} height={size} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#F3BA2F" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="#FFFFFF"
              d="M7.3 9.6 9.6 7.3 12 9.6l-2.4 2.4zM4.6 12.3 6.9 10l2.4 2.3-2.4 2.4zM9.6 14.6l2.4-2.3 2.4 2.3-2.4 2.4zM14.7 9.6 17.1 7.3l2.3 2.3-2.3 2.4zM11.7 12.3l2.4-2.3 2.3 2.3-2.3 2.4zM9.6 12.3l2.4-2.3 2.4 2.3-2.4 2.4z"
            />
          </G>
        </Svg>
      );

    case "ton":
      return (
        <Svg width={size} height={size} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#0098EA" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="#FFFFFF"
              d="M16.375 4.5H7.625a.75.75 0 0 0-.643 1.135l4.375 7.5a.75.75 0 0 0 1.286 0l4.375-7.5A.75.75 0 0 0 16.375 4.5zM11.25 8.5h1.5v6.55l-1.5-2.57z"
            />
          </G>
        </Svg>
      );

    default:
      return (
        <Svg width={size} height={size} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#94A3B8" />
          <Path fill="#FFFFFF" d="M12 5 19 12 12 19 5 12z" opacity="0.9" />
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
