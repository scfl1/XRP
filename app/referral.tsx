import { useMemo, type ReactNode } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { notify } from "@/lib/_core/native-alert";
import { trpc } from "@/lib/trpc";

// ألوان هذه الصفحة (داكنة: أزرق ملكي على كحلي) — مستقلة عن باقي المشروع
const CWAAX = {
  green: "#4F80FF",
  greenSoft: "rgba(79,128,255,0.16)",
  ink: "#FFFFFF",
  muted: "#9AA6C0",
  line: "rgba(255,255,255,0.10)",
  white: "#FFFFFF",
  bg: "#070B14",
  card: "#0F1626",
  card2: "#18223D",
} as const;

function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[{ backgroundColor: CWAAX.card, borderWidth: 1, borderColor: CWAAX.line, borderRadius: 22, padding: 16 }, style]}>{children}</View>;
}

function IconButton({ icon, onPress, label }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; onPress?: () => void; label?: string }) {
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        { width: 42, height: 42, borderRadius: 21, backgroundColor: CWAAX.card, borderWidth: 1, borderColor: "rgba(79,128,255,0.4)", alignItems: "center", justifyContent: "center" },
        pressed && { opacity: 0.6 },
      ]}
    >
      <MaterialIcons name={icon} size={21} color={CWAAX.ink} />
    </Pressable>
  );
}

const TIERS = [
  {
    level: 1,
    rate: "10%",
    base: "#2B2111",
    accent: "#F0B93E",
    glow: "rgba(240,185,62,0.22)",
    icon: "workspace-premium" as const,
    label: "المستوى الأول",
    desc: "من دعوتهم مباشرة",
  },
  {
    level: 2,
    rate: "5%",
    base: "#0E1F3F",
    accent: "#5B8CFF",
    glow: "rgba(79,128,255,0.25)",
    icon: "groups" as const,
    label: "المستوى الثاني",
    desc: "من دعاهم أصدقاؤك",
  },
  {
    level: 3,
    rate: "2.5%",
    base: "#201A3B",
    accent: "#9B8CFF",
    glow: "rgba(155,140,255,0.22)",
    icon: "hub" as const,
    label: "المستوى الثالث",
    desc: "الدائرة الثالثة",
  },
];

export default function ReferralScreen() {
  const router = useRouter();
  const stats = trpc.wallet.referralStats.useQuery();

  const referralCode = stats.data?.referralCode ?? "—";
  const referralLink = useMemo(
    () => (typeof window !== "undefined" ? `${window.location.origin}/register?ref=${referralCode}` : referralCode),
    [referralCode],
  );

  const copyCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(referralCode);
      notify("تم النسخ", "تم نسخ كود الإحالة إلى الحافظة.");
    } else {
      notify("كود الإحالة", referralCode);
    }
  };

  const shareLink = async () => {
    const text = `انضم إلى CwaAX عبر كود الإحالة الخاص بي واحصل على مكافآت: ${referralCode}\n${referralLink}`;
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "CwaAX", text, url: referralLink });
        return;
      } catch {
        // fall through to copy
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      notify("تم النسخ", "تم نسخ رابط الإحالة، شاركه مع أصدقائك.");
    }
  };

  return (
    <ScreenContainer className="px-0" edges={["top", "left", "right"]}>
    <View style={{ flex: 1, backgroundColor: CWAAX.bg, paddingHorizontal: 20 }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <IconButton icon="arrow-forward" label="رجوع" onPress={() => router.back()} />
          <Text style={styles.title}>الإحالة والمكافآت</Text>
          <View style={{ width: 42 }} />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.gift}>
            <MaterialIcons name="card-giftcard" size={30} color={CWAAX.white} />
          </View>
          <Text style={styles.heroTitle}>اربح مع شبكتك بالكامل</Text>
          <Text style={styles.heroSub}>عمولة تلقائية على كل إيداع يقوم به من دعوتهم — على 3 مستويات</Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{stats.isLoading ? "…" : stats.data?.totalReferred ?? 0}</Text>
              <Text style={styles.heroStatLabel}>إجمالي شبكتك</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{stats.isLoading ? "…" : (stats.data?.totalEarned ?? 0).toFixed(2)}</Text>
              <Text style={styles.heroStatLabel}>USDT مكتسبة</Text>
            </View>
          </View>
        </View>

        {/* Referral code */}
        <Text style={styles.label}>كود الإحالة الخاص بك</Text>
        <View style={styles.code}>
          <Text style={styles.codeText}>{stats.isLoading ? "…" : referralCode}</Text>
          <Pressable onPress={copyCode} hitSlop={8}>
            <MaterialIcons name="content-copy" size={19} color={CWAAX.green} />
          </Pressable>
        </View>
        <Pressable onPress={shareLink} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <MaterialIcons name="share" size={18} color={CWAAX.white} />
          <Text style={styles.buttonText}>مشاركة رابط الدعوة</Text>
        </Pressable>

        {/* Tiers */}
        <Text style={styles.section}>نظام العمولة — 3 مستويات</Text>
        <View style={styles.tiers}>
          {TIERS.map((tier, i) => {
            const count = stats.data?.levelCounts?.[i] ?? 0;
            const earned = stats.data?.levelEarnings?.[i] ?? 0;
            return (
              <View key={tier.level} style={[styles.tierCard, { backgroundColor: tier.base }]}>
                <View style={[styles.tierGlow, { backgroundColor: tier.glow }]} />

                <View style={styles.tierRankBadge}>
                  <Text style={styles.tierRankText}>{tier.level}</Text>
                </View>

                <View style={[styles.tierIcon, { backgroundColor: tier.accent }]}>
                  <MaterialIcons name={tier.icon} size={19} color={tier.base} />
                </View>

                <Text style={[styles.tierRate, { color: tier.accent }]}>{tier.rate}</Text>
                <Text style={styles.tierLabel}>{tier.label}</Text>
                <Text style={styles.tierDesc}>{tier.desc}</Text>

                <View style={styles.tierFooter}>
                  <Text style={styles.tierCount}>{count} شخص</Text>
                  <Text style={[styles.tierEarned, { color: tier.accent }]}>+{earned.toFixed(2)} USDT</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Card style={styles.infoCard}>
          <MaterialIcons name="info-outline" size={16} color={CWAAX.muted} />
          <Text style={styles.infoText}>تُضاف عمولتك تلقائيًا لرصيدك بمجرد موافقة الإدارة على إيداع أي شخص في شبكتك — لا حاجة لأي إجراء إضافي منك.</Text>
        </Card>

        {/* History */}
        <Text style={styles.section}>سجل المكافآت</Text>
        <Card>
          {stats.isLoading ? (
            <View style={styles.emptyWrap}>
              <ActivityIndicator color={CWAAX.green} />
            </View>
          ) : !stats.data?.history?.length ? (
            <View style={styles.emptyWrap}>
              <MaterialIcons name="inbox" size={26} color={CWAAX.line} />
              <Text style={styles.emptyText}>لا توجد مكافآت بعد. شارك رابطك لتبدأ الربح.</Text>
            </View>
          ) : (
            stats.data.history.map((row: any, idx: number) => (
              <View key={row.id} style={[styles.rewardRow, idx > 0 && styles.rewardRowBorder]}>
                <View style={[styles.rewardIcon, { backgroundColor: TIERS[row.level - 1]?.base ?? CWAAX.card2 }]}>
                  <Text style={[styles.rewardLevel, { color: TIERS[row.level - 1]?.accent ?? CWAAX.green }]}>L{row.level}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rewardName}>عمولة من {row.sourceName || row.sourceUsername || "مستخدم"}</Text>
                  <Text style={styles.rewardMeta}>{new Date(row.createdAt).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.rewardAmount}>+ {Number(row.commission).toFixed(2)} {row.currency}</Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 12, paddingBottom: 30 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { color: CWAAX.ink, fontSize: 19, fontWeight: "900" },

  hero: { alignItems: "center", backgroundColor: "#16205A", borderWidth: 1, borderColor: "rgba(110,150,255,0.4)", borderRadius: 24, paddingVertical: 28, paddingHorizontal: 20, overflow: "hidden" },
  heroGlow: { position: "absolute", top: -60, right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(79,128,255,0.35)" },
  gift: { width: 58, height: 58, borderRadius: 20, backgroundColor: CWAAX.green, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  heroTitle: { color: CWAAX.white, fontSize: 19, fontWeight: "900", textAlign: "center" },
  heroSub: { color: "#B7C3E0", fontSize: 12, marginTop: 8, textAlign: "center", lineHeight: 18, paddingHorizontal: 10 },
  heroStats: { flexDirection: "row", alignItems: "center", marginTop: 22, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 16, paddingVertical: 14, width: "100%", justifyContent: "space-around" },
  heroStat: { alignItems: "center" },
  heroStatValue: { color: CWAAX.white, fontSize: 22, fontWeight: "900" },
  heroStatLabel: { color: "#B7C3E0", fontSize: 10, marginTop: 5 },
  heroDivider: { width: 1, height: 34, backgroundColor: "rgba(255,255,255,0.15)" },

  label: { color: CWAAX.ink, fontSize: 12, fontWeight: "800", textAlign: "right", marginTop: 24, marginBottom: 8 },
  code: { height: 52, borderWidth: 1.5, borderColor: "rgba(79,128,255,0.6)", borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, backgroundColor: CWAAX.greenSoft },
  codeText: { color: CWAAX.ink, fontSize: 15, fontWeight: "900", letterSpacing: 1 },
  button: { height: 50, borderRadius: 14, backgroundColor: CWAAX.green, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", marginTop: 11 },
  buttonText: { color: CWAAX.white, fontSize: 13, fontWeight: "900" },

  section: { color: CWAAX.muted, fontSize: 12, fontWeight: "800", textAlign: "right", marginTop: 26, marginBottom: 10 },
  tiers: { flexDirection: "row", gap: 10 },
  tierCard: {
    flex: 1,
    borderRadius: 20,
    padding: 13,
    paddingTop: 15,
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  tierGlow: { position: "absolute", top: -34, left: -28, width: 110, height: 110, borderRadius: 55 },
  tierRankBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  tierRankText: { color: "rgba(255,255,255,0.85)", fontSize: 10, fontWeight: "900" },
  tierIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", marginBottom: 9 },
  tierRate: { fontSize: 21, fontWeight: "900" },
  tierLabel: { color: CWAAX.white, fontSize: 11, fontWeight: "800", marginTop: 5, textAlign: "center" },
  tierDesc: { color: "rgba(255,255,255,0.55)", fontSize: 9, marginTop: 3, textAlign: "center" },
  tierFooter: { marginTop: 11, alignItems: "center", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.12)", paddingTop: 9, width: "100%" },
  tierCount: { color: "rgba(255,255,255,0.6)", fontSize: 9 },
  tierEarned: { fontSize: 11, fontWeight: "900", marginTop: 3 },

  infoCard: { flexDirection: "row-reverse", alignItems: "flex-start", gap: 8, marginTop: 16, backgroundColor: CWAAX.card2 },
  infoText: { flex: 1, color: CWAAX.muted, fontSize: 10.5, lineHeight: 16, textAlign: "right" },

  emptyWrap: { alignItems: "center", justifyContent: "center", paddingVertical: 28, gap: 8 },
  emptyText: { color: CWAAX.muted, fontSize: 11, textAlign: "center" },

  rewardRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 },
  rewardRowBorder: { borderTopWidth: 1, borderTopColor: CWAAX.line },
  rewardIcon: { width: 35, height: 35, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  rewardLevel: { fontSize: 12, fontWeight: "900" },
  rewardName: { color: CWAAX.ink, fontSize: 12, fontWeight: "800", textAlign: "right" },
  rewardMeta: { color: CWAAX.muted, fontSize: 10, marginTop: 4, textAlign: "right" },
  rewardAmount: { color: CWAAX.green, fontSize: 11, fontWeight: "900" },

  pressed: { opacity: 0.62 },
});
