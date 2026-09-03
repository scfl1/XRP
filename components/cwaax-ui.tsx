import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CWAAX } from "@/constants/cwaax";

export type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

export function CwaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.logoWrap}>
      <View style={styles.logoBadge}><Text style={styles.logoLetter}>C</Text></View>
      {!compact && <Text style={styles.logoText}>Cwa<Text style={styles.logoAccent}>AX</Text></Text>}
    </View>
  );
}

export function IconButton({ icon, onPress, label, tone = "light" }: { icon: IconName; onPress?: () => void; label?: string; tone?: "light" | "green" }) {
  return (
    <Pressable accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.iconButton, tone === "green" && styles.iconButtonGreen, pressed && styles.pressed]}>
      <MaterialIcons name={icon} size={21} color={tone === "green" ? CWAAX.white : CWAAX.ink} />
    </Pressable>
  );
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: object; onPress?: () => void }) {
  const content = <View style={[styles.card, style]}>{children}</View>;
  if (!onPress) return content;
  return <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.cardPressed]}>{content}</Pressable>;
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>{title}</Text>
      {action && <Pressable onPress={onAction} style={({ pressed }) => [pressed && styles.pressed]}><Text style={styles.sectionAction}>{action}</Text></Pressable>}
    </View>
  );
}

export function CoinMark({ mark, color, size = 42 }: { mark: string; color: string; size?: number }) {
  return <View style={[styles.coin, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]}><Text style={[styles.coinText, { fontSize: size * 0.4 }]}>{mark}</Text></View>;
}

export function TrendLine({ color = CWAAX.green }: { color?: string }) {
  return <View style={styles.trendLine}>{[18, 11, 15, 7, 12, 4, 8, 2, 6].map((height, index) => <View key={index} style={[styles.trendBar, { height, backgroundColor: color, opacity: 0.35 + index * 0.07 }]} />)}</View>;
}

export function StatusPill({ children, tone = "success" }: { children: ReactNode; tone?: "success" | "warning" | "danger" }) {
  const toneStyle = tone === "warning" ? styles.warningPill : tone === "danger" ? styles.dangerPill : styles.successPill;
  const textStyle = tone === "warning" ? styles.warningText : tone === "danger" ? styles.dangerText : styles.successText;
  return <View style={[styles.pill, toneStyle]}><Text style={[styles.pillText, textStyle]}>{children}</Text></View>;
}

export const styles = StyleSheet.create({
  logoWrap: { flexDirection: "row", alignItems: "center", gap: 9 },
  logoBadge: { width: 34, height: 34, borderRadius: 12, backgroundColor: CWAAX.green, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-8deg" }] },
  logoLetter: { color: CWAAX.white, fontSize: 23, fontWeight: "900", transform: [{ rotate: "8deg" }] },
  logoText: { color: CWAAX.ink, fontSize: 21, fontWeight: "800", letterSpacing: -0.8 },
  logoAccent: { color: CWAAX.green },
  iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: CWAAX.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: CWAAX.line },
  iconButtonGreen: { backgroundColor: CWAAX.green, borderColor: CWAAX.green },
  pressed: { opacity: 0.62, transform: [{ scale: 0.96 }] },
  cardPressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  card: { backgroundColor: CWAAX.white, borderWidth: 1, borderColor: CWAAX.line, borderRadius: 22, padding: 16, shadowColor: "#15231c", shadowOpacity: 0.035, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  sectionTitle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitleText: { fontSize: 17, fontWeight: "800", color: CWAAX.ink },
  sectionAction: { fontSize: 13, color: CWAAX.green, fontWeight: "700" },
  coin: { alignItems: "center", justifyContent: "center" },
  coinText: { color: CWAAX.white, fontWeight: "900" },
  trendLine: { height: 24, width: 56, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  trendBar: { width: 4, borderRadius: 5 },
  pill: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, alignSelf: "flex-start" },
  successPill: { backgroundColor: CWAAX.greenSoft },
  warningPill: { backgroundColor: "#FFF6DF" },
  dangerPill: { backgroundColor: "#FDECEB" },
  pillText: { fontSize: 11, fontWeight: "700" },
  successText: { color: CWAAX.green },
  warningText: { color: CWAAX.gold },
  dangerText: { color: CWAAX.red },
});
