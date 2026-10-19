import { useRouter, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Svg, { Circle, Path } from "react-native-svg";
import { ScreenContainer } from "@/components/screen-container";
import { formatAmount } from "@/constants/currencies";
import type { CurrencyCode } from "@/lib/_core/preferences";
import * as Preferences from "@/lib/_core/preferences";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import { useLiveMarkets } from "@/hooks/use-live-markets";

// بديل بسيط بدون مكتبات: لون مسطّح بدل التدرج
function LinearGradient({ colors, style, children }: { colors: readonly string[]; style?: any; children?: React.ReactNode; start?: any; end?: any }) {
  return <View style={[style, { backgroundColor: colors[0] }]}>{children}</View>;
}

// شعار USDT (Tether) الحقيقي
function UsdtLogo({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Circle cx="16" cy="16" r="16" fill="#26A17B" />
      <Path
        fill="#FFFFFF"
        fillRule="evenodd"
        d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117"
      />
    </Svg>
  );
}

// ألوان التصميم الداكن (مطابقة للصورة)
const C = {
  bg: "#04100D",
  card: "#0B1A17",
  cardBorder: "rgba(255,255,255,0.08)",
  text: "#FFFFFF",
  muted: "#9FB3AD",
  green: "#19D27C",
  greenDark: "#0B7A4B",
  blue: "#2F5BFF",
  blueDark: "#1A2E8A",
  gold: "#F5B82E",
  goldDark: "#5A4310",
  purple: "#7B4DFF",
  red: "#FF4D4D",
};

type QuickAction = { label: string; icon: keyof typeof MaterialIcons.glyphMap; colors: [string, string]; route: string };

// من اليمين إلى اليسار: المعاملات، استثمار، شراء/بيع، تبديل، أكثر
const QUICK_ACTIONS: QuickAction[] = [
  { label: "المعاملات", icon: "receipt-long", colors: ["#3D63FF", "#1A2E8A"], route: "/transactions" },
  { label: "استثمار", icon: "bar-chart", colors: ["#1FD982", "#0B6B43"], route: "/trade" },
  { label: "شراء / بيع", icon: "swap-horiz", colors: ["#F7C844", "#9A6B0B"], route: "/trade" },
  { label: "تبديل", icon: "sync", colors: ["#8A5CFF", "#43209B"], route: "/trade" },
  { label: "أكثر", icon: "apps", colors: ["#1F3A35", "#0E211D"], route: "/menu" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const { user } = useAuth();
  const balances = trpc.wallet.balances.useQuery(undefined, { enabled: !!user });
  const markets = useLiveMarkets();
  const usdt = Number(balances.data?.find((b: any) => b.currency === "USDT")?.amount ?? 0);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  useFocusEffect(useCallback(() => { Preferences.getCurrency().then(setCurrency); }, []));
  const total = formatAmount(usdt, currency);
  const [notice, setNotice] = useState("");
  const showNotice = (message: string) => { setNotice(message); setTimeout(() => setNotice(""), 2200); };
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await Promise.all([balances.refetch(), markets.refetch()]);
      showNotice("تم تحديث البيانات");
    } catch {
      showNotice("تعذر التحديث، حاول مرة أخرى");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScreenContainer className="px-0" edges={["top", "left", "right"]}>
      <View style={styles.root}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* الهيدر: الشعار + الترحيب */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Text style={styles.logoText}>
                Cwa<Text style={{ color: C.green }}>AX</Text>
              </Text>
              <LinearGradient colors={["#22E58E", "#0E9E5C"]} style={styles.logoBadge}>
                <Text style={styles.logoBadgeText}>C</Text>
              </LinearGradient>
            </View>

            <Pressable onPress={() => router.push("/menu")} style={styles.profileRow}>
              <View>
                <Text style={styles.welcome}>مرحباً بك</Text>
                <Text style={styles.welcomeSub}>في محفظة CwaAX</Text>
              </View>
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={30} color={C.text} />
                <View style={styles.onlineDot} />
              </View>
            </Pressable>
          </View>

          {/* أزرار دائرية: بحث / إشعارات / تحديث */}
          <View style={styles.actionsRow}>
            <RoundButton icon={refreshing ? "hourglass-empty" : "sync"} onPress={handleRefresh} />
            <RoundButton icon="notifications-none" dot onPress={() => router.push("/notifications")} />
            <RoundButton icon="search" onPress={() => showNotice("ابحث عن أصل أو سوق")} />
          </View>

          {/* بطاقة إجمالي الأصول */}
          <LinearGradient
            colors={["#0F4D36", "#0A2A22", "#08201A"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.assetCard}
          >
            <View style={styles.assetTextCol}>
              <View style={styles.assetTop}>
                <Text style={styles.cardLabel}>إجمالي الأصول</Text>
                <Pressable onPress={() => setHidden(!hidden)} hitSlop={10}>
                  <MaterialIcons name={hidden ? "visibility-off" : "visibility"} size={22} color={C.text} />
                </Pressable>
              </View>
              <Text style={styles.assetValue}>{hidden ? "••••••" : total}</Text>
              <View style={styles.usdtPill}>
                <MaterialIcons name="keyboard-arrow-down" size={18} color={C.text} />
                <Text style={styles.usdtLabel}>رصيد</Text>
                <Text style={styles.usdtText}>USDT</Text>
                <UsdtLogo size={28} />
              </View>
            </View>

            {/* رسمة المحفظة */}
            <View style={styles.walletArt}>
              <View style={styles.walletRing} />
              <View style={styles.walletBody}>
                <View style={styles.walletClasp} />
              </View>
              <View style={styles.bigCoin}><UsdtLogo size={60} /></View>
              <View style={styles.smallCoin}><UsdtLogo size={30} /></View>
            </View>
          </LinearGradient>

          {/* إيداع / سحب */}
          <View style={styles.dwRow}>
            <BigAction
              title="سحب"
              subtitle="سحب الأموال إلى محفظتك"
              icon="north-east"
              colors={["#1B2E9C", "#0D1A57"]}
              iconColors={["#4A7BFF", "#2142D6"]}
              border="rgba(74,123,255,0.6)"
              chevron="#4A7BFF"
              onPress={() => router.push("/send")}
            />
            <BigAction
              title="إيداع"
              subtitle="إضافة رصيد إلى محفظتك"
              icon="file-download"
              colors={["#0F6B45", "#0A3D2B"]}
              iconColors={["#2FE39A", "#12A765"]}
              border="rgba(47,227,154,0.55)"
              chevron={C.green}
              onPress={() => router.push("/receive")}
            />
          </View>

          {/* الإجراءات السريعة */}
          <View style={styles.quickCard}>
            {QUICK_ACTIONS.map((a) => (
              <Pressable
                key={a.label}
                onPress={() => router.push(a.route as never)}
                style={({ pressed }) => [styles.quickItem, pressed && styles.pressed]}
              >
                <LinearGradient colors={a.colors} style={styles.quickIcon}>
                  <MaterialIcons name={a.icon} size={26} color={C.text} />
                </LinearGradient>
                <Text style={styles.quickLabel}>{a.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* بانر إكمال الإعداد */}
          <Pressable onPress={() => router.push("/settings")} style={({ pressed }) => [pressed && styles.pressed]}>
            <LinearGradient
              colors={["#3A2D0C", "#1A1407", "#2A210A"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={styles.promo}
            >
              <View style={styles.promoChevron}>
                <MaterialIcons name="chevron-right" size={26} color={C.gold} />
              </View>
              <View style={styles.promoCopy}>
                <Text style={styles.promoTitle}>أكمل إعداد محفظتك</Text>
                <Text style={styles.promoSubtitle}>فعّل المصادقة الثنائية لتحصل على حماية أعلى</Text>
              </View>
              <View style={styles.promoIcon}>
                <MaterialIcons name="bolt" size={34} color="#3A2A00" />
              </View>
            </LinearGradient>
          </Pressable>

          {/* ابدأ مع CwaAX */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>
              ابدأ مع Cwa<Text style={{ color: C.green }}>AX</Text>
            </Text>
            <Pressable onPress={() => router.push("/menu")} style={styles.sectionAction}>
              <MaterialIcons name="chevron-left" size={18} color={C.green} />
              <Text style={styles.sectionActionText}>عرض الكل</Text>
            </Pressable>
          </View>

          <View style={styles.startRow}>
            <StartCard
              title="استقبل عملة"
              subtitle="احصل على العملات الرقمية"
              icon="file-download"
              colors={["#2FE39A", "#0E9E5C"]}
              onPress={() => router.push("/receive")}
            />
            <StartCard
              title="جرّب التبديل"
              subtitle="تداول سريع وآمن"
              icon="sync"
              colors={["#4A5BFF", "#2A1B9C"]}
              onPress={() => router.push("/trade")}
            />
          </View>

          {/* الأسواق */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>الأسواق</Text>
            <Pressable onPress={() => router.push("/trade")} style={styles.sectionAction}>
              <MaterialIcons name="chevron-left" size={18} color={C.green} />
              <Text style={styles.sectionActionText}>كل الأسواق</Text>
            </Pressable>
          </View>

          <View style={styles.marketCard}>
            {markets.loading ? (
              <Text style={styles.marketLoading}>جاري تحميل الأسعار...</Text>
            ) : markets.error ? (
              <Text style={styles.marketLoading}>{markets.error}</Text>
            ) : !markets.data || markets.data.length === 0 ? (
              <Text style={styles.marketLoading}>تعذر تحميل الأسعار حالياً، حاول لاحقاً.</Text>
            ) : (
              markets.data.map((coin, index) => (
                <Pressable
                  key={coin.id}
                  onPress={() => router.push("/trade")}
                  style={({ pressed }) => [
                    styles.marketRow,
                    index < markets.data!.length - 1 && styles.marketBorder,
                    pressed && styles.pressed,
                  ]}
                >
                  <Image source={{ uri: coin.image }} style={styles.marketIcon} />
                  <View style={styles.marketName}>
                    <Text style={styles.marketSymbol}>{coin.symbol}/USDT</Text>
                    <Text style={styles.marketMeta} numberOfLines={1}>{coin.name}</Text>
                  </View>
                  <View style={styles.marketPrice}>
                    <Text style={styles.priceText}>{formatAmount(coin.price, currency)}</Text>
                    <Text style={coin.change24h >= 0 ? styles.positive : styles.negative}>
                      {coin.change24h >= 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
          <View style={{ height: 24 }} />
        </ScrollView>

        {notice ? (
          <View style={styles.toast}>
            <MaterialIcons name="info-outline" size={18} color={C.text} />
            <Text style={styles.toastText}>{notice}</Text>
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

/* ---------- مكونات صغيرة ---------- */

function RoundButton({ icon, onPress, dot }: { icon: keyof typeof MaterialIcons.glyphMap; onPress: () => void; dot?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.roundBtn, pressed && styles.pressed]}>
      <MaterialIcons name={icon} size={24} color={C.text} />
      {dot ? <View style={styles.redDot} /> : null}
    </Pressable>
  );
}

function BigAction(props: {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  colors: [string, string];
  iconColors: [string, string];
  border: string;
  chevron: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={props.onPress} style={({ pressed }) => [styles.dwWrap, pressed && styles.pressed]}>
      <LinearGradient
        colors={props.colors}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.dwCard, { borderColor: props.border }]}
      >
        <View style={styles.dwTop}>
          <LinearGradient colors={props.iconColors} style={styles.dwIcon}>
            <MaterialIcons name={props.icon} size={30} color={C.text} />
          </LinearGradient>
          <MaterialIcons name="chevron-left" size={30} color={props.chevron} />
        </View>
        <Text style={styles.dwTitle}>{props.title}</Text>
        <Text style={styles.dwSub}>{props.subtitle}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function StartCard(props: {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  colors: [string, string];
  onPress: () => void;
}) {
  return (
    <Pressable onPress={props.onPress} style={({ pressed }) => [styles.startCard, pressed && styles.pressed]}>
      <LinearGradient colors={props.colors} style={styles.startIcon}>
        <MaterialIcons name={props.icon} size={24} color={C.text} />
      </LinearGradient>
      <View style={styles.startCopy}>
        <Text style={styles.startTitle}>{props.title}</Text>
        <Text style={styles.startSub} numberOfLines={1}>{props.subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-left" size={22} color={C.muted} />
    </Pressable>
  );
}

/* ---------- الأنماط ---------- */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 24 },
  pressed: { opacity: 0.7 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoText: { color: C.text, fontSize: 30, fontWeight: "900", letterSpacing: -0.5 },
  logoBadge: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  logoBadgeText: { color: C.text, fontSize: 28, fontWeight: "900" },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: "rgba(47,227,154,0.6)",
    backgroundColor: "#0B2A22", alignItems: "center", justifyContent: "center",
  },
  onlineDot: {
    position: "absolute", bottom: 0, right: 0, width: 13, height: 13, borderRadius: 7,
    backgroundColor: C.green, borderWidth: 2, borderColor: C.bg,
  },
  welcome: { color: C.text, fontSize: 17, fontWeight: "800", textAlign: "right" },
  welcomeSub: { color: C.green, fontSize: 13, fontWeight: "700", textAlign: "right", marginTop: 2 },

  actionsRow: { flexDirection: "row", gap: 12, marginTop: 14, marginBottom: 14 },
  roundBtn: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: "#0B1E1A",
    borderWidth: 1, borderColor: "rgba(47,227,154,0.25)", alignItems: "center", justifyContent: "center",
  },
  redDot: { position: "absolute", top: 8, right: 10, width: 9, height: 9, borderRadius: 5, backgroundColor: C.red },

  assetCard: {
    borderRadius: 26, borderWidth: 1, borderColor: "rgba(47,227,154,0.35)",
    padding: 18, minHeight: 170, flexDirection: "row-reverse", overflow: "hidden", marginBottom: 14,
  },
  assetTextCol: { flex: 1, justifyContent: "space-between", alignItems: "flex-end" },
  assetTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardLabel: { color: C.text, fontSize: 15, fontWeight: "700" },
  assetValue: { color: C.text, fontSize: 40, fontWeight: "900", letterSpacing: -1, textAlign: "left", marginVertical: 6 },
  usdtPill: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "rgba(10,30,26,0.8)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 22, paddingHorizontal: 10, paddingVertical: 6,
  },
  usdtText: { color: C.text, fontWeight: "800", fontSize: 14 },
  usdtLabel: { color: C.muted, fontSize: 12 },

  walletArt: { width: 150, alignItems: "center", justifyContent: "center" },
  walletRing: {
    position: "absolute", width: 150, height: 70, borderRadius: 75, borderWidth: 2,
    borderColor: "rgba(47,227,154,0.55)", transform: [{ rotate: "-18deg" }],
  },
  walletBody: {
    width: 100, height: 78, borderRadius: 14, backgroundColor: "#12352C", borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)", transform: [{ rotate: "12deg" }], justifyContent: "center", alignItems: "flex-end",
  },
  walletClasp: { width: 18, height: 26, borderRadius: 8, backgroundColor: "#1B5A45", marginRight: -6 },
  bigCoin: {
    position: "absolute", width: 66, height: 66, borderRadius: 33, alignItems: "center", justifyContent: "center",
    borderWidth: 3, borderColor: "#7FF3C0", top: 28, overflow: "hidden",
  },
  smallCoin: {
    position: "absolute", width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#7FF3C0", bottom: 14, right: 6, overflow: "hidden",
  },

  dwRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  dwWrap: { flex: 1 },
  dwCard: {
    borderRadius: 24, borderWidth: 1.5, padding: 14, minHeight: 150, justifyContent: "space-between",
  },
  dwTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  dwIcon: { width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center" },
  dwCopy: { flex: 1 },
  dwTitle: { color: C.text, fontSize: 24, fontWeight: "900", textAlign: "right" },
  dwSub: { color: "#D5E4DF", fontSize: 12, lineHeight: 18, textAlign: "right", marginTop: 4 },

  quickCard: {
    flexDirection: "row", justifyContent: "space-between", backgroundColor: C.card,
    borderWidth: 1, borderColor: C.cardBorder, borderRadius: 22, paddingVertical: 16, paddingHorizontal: 8, marginBottom: 14,
  },
  quickItem: { alignItems: "center", width: "19%" },
  quickIcon: { width: 58, height: 58, borderRadius: 29, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  quickLabel: { color: C.text, fontSize: 12, fontWeight: "600", textAlign: "center" },

  promo: {
    flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 20, borderWidth: 1.5,
    borderColor: "rgba(245,184,46,0.6)", padding: 14, marginBottom: 20,
  },
  promoIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: C.gold, alignItems: "center", justifyContent: "center" },
  promoCopy: { flex: 1 },
  promoTitle: { color: C.gold, fontSize: 17, fontWeight: "900", textAlign: "right" },
  promoSubtitle: { color: "#E8DDBE", fontSize: 12, marginTop: 4, textAlign: "right" },
  promoChevron: {
    width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, borderColor: C.gold,
    alignItems: "center", justifyContent: "center",
  },

  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { color: C.text, fontSize: 21, fontWeight: "900" },
  sectionAction: { flexDirection: "row", alignItems: "center" },
  sectionActionText: { color: C.green, fontSize: 14, fontWeight: "700" },

  startRow: { flexDirection: "row", gap: 12, marginBottom: 22 },
  startCard: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.card,
    borderWidth: 1, borderColor: C.cardBorder, borderRadius: 18, padding: 12, minHeight: 76,
  },
  startIcon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  startCopy: { flex: 1 },
  startTitle: { color: C.text, fontSize: 16, fontWeight: "800", textAlign: "right" },
  startSub: { color: C.muted, fontSize: 11, marginTop: 4, textAlign: "right" },

  marketCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.cardBorder, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 3 },
  marketRow: { minHeight: 65, flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },
  marketBorder: { borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.07)" },
  marketIcon: { width: 33, height: 33, borderRadius: 16 },
  marketName: { flex: 1 },
  marketSymbol: { color: C.text, fontWeight: "800", fontSize: 13, textAlign: "right" },
  marketMeta: { color: C.muted, fontSize: 10, marginTop: 2, textAlign: "right" },
  marketPrice: { alignItems: "flex-start" },
  priceText: { color: C.text, fontSize: 13, fontWeight: "800" },
  positive: { color: C.green, fontSize: 11, fontWeight: "700", marginTop: 3 },
  negative: { color: "#FF6B63", fontSize: 11, fontWeight: "700", marginTop: 3 },
  marketLoading: { color: C.muted, fontSize: 12, textAlign: "center", paddingVertical: 24 },

  toast: {
    position: "absolute", left: 22, right: 22, bottom: 14, borderRadius: 14, backgroundColor: "#12352C",
    borderWidth: 1, borderColor: "rgba(47,227,154,0.4)", padding: 13, flexDirection: "row",
    alignItems: "center", justifyContent: "center", gap: 8,
  },
  toastText: { color: C.text, fontSize: 12, fontWeight: "700" },
});
