import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { confirmAsync } from "@/lib/_core/native-alert";
import { useAuth } from "@/hooks/use-auth";

// ألوان هذه الصفحة (داكنة: أزرق ملكي على كحلي) — مستقلة عن باقي المشروع
const CWAAX = {
  green: "#4F80FF",
  greenSoft: "rgba(79,128,255,0.16)",
  ink: "#FFFFFF",
  muted: "#9AA6C0",
  line: "rgba(255,255,255,0.10)",
  white: "#FFFFFF",
  red: "#FF6B63",
  gold: "#F5B82E",
  purple: "#9B6BFF",
  bg: "#070B14",
  card: "#0F1626",
  card2: "#18223D",
} as const;

function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[localStyles.card, style]}>{children}</View>;
}

function CwaLogo() {
  return (
    <View style={localStyles.logoWrap}>
      <View style={localStyles.logoBadge}><Text style={localStyles.logoLetter}>C</Text></View>
      <Text style={localStyles.logoText}>Cwa<Text style={{ color: CWAAX.green }}>AX</Text></Text>
    </View>
  );
}

function IconButton({ icon, onPress, label }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; onPress?: () => void; label?: string }) {
  return (
    <Pressable accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [localStyles.iconButton, pressed && { opacity: 0.6 }]}>
      <MaterialIcons name={icon} size={21} color={CWAAX.ink} />
    </Pressable>
  );
}

const localStyles = StyleSheet.create({
  card: { backgroundColor: CWAAX.card, borderWidth: 1, borderColor: CWAAX.line, borderRadius: 22, padding: 16 },
  logoWrap: { flexDirection: "row", alignItems: "center", gap: 9 },
  logoBadge: { width: 36, height: 36, borderRadius: 12, backgroundColor: CWAAX.green, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-8deg" }] },
  logoLetter: { color: "#FFFFFF", fontSize: 23, fontWeight: "900", transform: [{ rotate: "8deg" }] },
  logoText: { color: CWAAX.ink, fontSize: 22, fontWeight: "800", letterSpacing: -0.8 },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: CWAAX.card, borderWidth: 1, borderColor: "rgba(79,128,255,0.4)", alignItems: "center", justifyContent: "center" },
});

const ACCENTS = {
  gold: { bg: "rgba(245,184,46,0.14)", fg: "#F5B82E" },
  blue: { bg: "rgba(79,128,255,0.16)", fg: "#6C95FF" },
  slate: { bg: "#18223D", fg: "#9AA6C0" },
  purple: { bg: "rgba(155,107,255,0.16)", fg: "#9B6BFF" },
  orange: { bg: "rgba(255,150,70,0.16)", fg: "#FF9646" },
  teal: { bg: "rgba(255,107,154,0.16)", fg: "#FF6B9A" },
  green: { bg: CWAAX.greenSoft, fg: CWAAX.green },
  red: { bg: "rgba(255,107,99,0.16)", fg: CWAAX.red },
};

const common = [
  { label: "الإحالة والمكافآت", sub: "ادعُ أصدقاءك واربح", icon: "card-giftcard" as const, route: "/referral", accent: ACCENTS.gold },
  { label: "الإشعارات", sub: "تنبيهات الحساب والعروض", icon: "notifications-none" as const, route: "/notifications", accent: ACCENTS.blue },
  { label: "الإعدادات", sub: "الأمان وبيانات الحساب", icon: "settings" as const, route: "/settings", accent: ACCENTS.slate },
];

const trading = [
  { label: "العقود الآجلة", icon: "show-chart" as const, route: "/(tabs)/trade", accent: ACCENTS.purple },
  { label: "معركة السوق", icon: "flash-on" as const, route: "/(tabs)/trade", accent: ACCENTS.orange },
  { label: "تجارة الاتجاه", icon: "insights" as const, route: "/(tabs)/trade", accent: ACCENTS.teal },
  { label: "تأكيد الهوية", icon: "badge" as const, route: "/verify-identity", accent: ACCENTS.green },
];

export default function MenuScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);
  const [language, setLanguage] = useState("العربية");
  const [languageOpen, setLanguageOpen] = useState(false);

  const isAdmin = ["admin", "owner", "superadmin", "administrator"].includes(
    String(user?.role ?? "").toLowerCase().trim()
  );

  const renderGroup = (
    items: { label: string; sub?: string; icon: keyof typeof MaterialIcons.glyphMap; route: string; accent: { bg: string; fg: string } }[]
  ) => (
    <Card style={styles.groupCard}>
      {items.map((item, index) => (
        <Pressable
          key={item.label}
          onPress={() => router.push(item.route as never)}
          style={({ pressed }) => [
            styles.menuRow,
            index === items.length - 1 && styles.menuRowLast,
            pressed && styles.pressed,
          ]}
        >
          <View style={[styles.menuIcon, { backgroundColor: item.accent.bg }]}>
            <MaterialIcons name={item.icon} size={19} color={item.accent.fg} />
          </View>
          <View style={styles.menuCopy}>
            <Text style={styles.menuLabel}>{item.label}</Text>
            {item.sub ? <Text style={styles.menuSub}>{item.sub}</Text> : null}
          </View>
          <View style={styles.chevronWrap}>
            <MaterialIcons name="chevron-left" size={18} color="#6F7C99" />
          </View>
        </Pressable>
      ))}
    </Card>
  );

  return (
    <ScreenContainer className="px-0" edges={["top", "left", "right"]}>
    <View style={{ flex: 1, backgroundColor: CWAAX.bg, paddingHorizontal: 20 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <IconButton icon="close" label="إغلاق" onPress={() => router.back()} />
          <CwaLogo />
          <View style={{ width: 42 }} />
        </View>

        <Text style={styles.title}>الحساب</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileGlowOne} />
          <View style={styles.profileGlowTwo} />
          <View style={styles.profileTop}>
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(user?.name || user?.username || "C").trim().charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.profileCopy}>
              <Text style={styles.name} numberOfLines={1}>
                {user?.name || user?.username || "المستخدم"}
                {isAdmin ? "  ·  Admin" : ""}
              </Text>
              <Text style={styles.uid}>UID {user?.id ?? "—"}</Text>
            </View>
            <View style={styles.verifiedPill}>
              <MaterialIcons name="verified" size={13} color="#FFFFFF" />
              <Text style={styles.verifiedPillText}>موثق</Text>
            </View>
          </View>
          <View style={styles.profileFoot}>
            <Text style={styles.email} numberOfLines={1}>{user?.email || ""}</Text>
            <Pressable
              onPress={() => router.push("/profile")}
              style={({ pressed }) => [styles.viewProfile, pressed && styles.pressed]}
            >
              <Text style={styles.viewProfileText}>عرض الملف</Text>
              <MaterialIcons name="chevron-left" size={15} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/referral")}
          style={({ pressed }) => [styles.vipCard, pressed && styles.pressed]}
        >
          <View style={styles.vipIcon}>
            <MaterialIcons name="workspace-premium" size={23} color="#A8721A" />
          </View>
          <View style={styles.vipCopy}>
            <Text style={styles.vipTitle}>عضوية CwaAX VIP</Text>
            <Text style={styles.vipSub}>خصومات رسوم + مكافآت حصرية</Text>
          </View>
          <View style={styles.vipChevron}>
            <MaterialIcons name="chevron-left" size={18} color="#A8721A" />
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>شائع</Text>
        {renderGroup(common)}

        <Text style={styles.sectionTitle}>التجارة</Text>
        {renderGroup(trading)}

        <Text style={styles.sectionTitle}>تفضيلات التطبيق</Text>
        <Card style={styles.groupCard}>
          <View style={styles.menuRow}>
            <View style={[styles.menuIcon, { backgroundColor: ACCENTS.slate.bg }]}>
              <MaterialIcons name="dark-mode" size={19} color={ACCENTS.slate.fg} />
            </View>
            <View style={styles.menuCopy}>
              <Text style={styles.menuLabel}>الوضع الداكن</Text>
            </View>
            <Switch
              value={dark}
              onValueChange={setDark}
              trackColor={{ false: "#2A3558", true: "#3D63D8" }}
              thumbColor={dark ? "#FFFFFF" : "#9AA6C0"}
            />
          </View>

          <Pressable
            onPress={() => setLanguageOpen(true)}
            style={({ pressed }) => [styles.menuRow, styles.menuRowLast, pressed && styles.pressed]}
          >
            <View style={[styles.menuIcon, { backgroundColor: ACCENTS.blue.bg }]}>
              <MaterialIcons name="language" size={19} color={ACCENTS.blue.fg} />
            </View>
            <View style={styles.menuCopy}>
              <Text style={styles.menuLabel}>اللغة</Text>
            </View>
            <Text style={styles.preference}>{language}</Text>
            <MaterialIcons name="chevron-left" size={18} color="#6F7C99" />
          </Pressable>
        </Card>

        {isAdmin && (
          <Pressable
            onPress={() => router.push("/admin")}
            style={({ pressed }) => [styles.adminLink, pressed && styles.pressed]}
          >
            <MaterialIcons name="admin-panel-settings" size={18} color={CWAAX.green} />
            <Text style={styles.adminText}>لوحة تحكم المسؤول</Text>
          </Pressable>
        )}

        <Pressable
          onPress={async () => {
            const confirmed = await confirmAsync("تسجيل الخروج", "هل تريد تسجيل الخروج من CwaAX؟", "تسجيل الخروج");
            if (confirmed) {
              await logout();
              router.replace("/login");
            }
          }}
          style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
        >
          <MaterialIcons name="logout" size={18} color={CWAAX.red} />
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </Pressable>

        <View style={{ height: 24 }} />
      </ScrollView>

      <Modal
        visible={languageOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setLanguageOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>اختيار اللغة</Text>
            {["العربية", "English", "Русский"].map((item) => (
              <Pressable
                key={item}
                onPress={() => {
                  setLanguage(item);
                  setLanguageOpen(false);
                }}
                style={({ pressed }) => [
                  styles.languageOption,
                  language === item && styles.languageSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.languageText, language === item && styles.languageTextSelected]}>{item}</Text>
                {language === item && (
                  <View style={styles.languageCheck}>
                    <MaterialIcons name="check" size={14} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 12, paddingBottom: 26 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: CWAAX.ink, fontSize: 28, fontWeight: "900", textAlign: "right", marginTop: 22, marginBottom: 14 },

  profileCard: {
    backgroundColor: "#1B2A6B",
    borderWidth: 1,
    borderColor: "rgba(110,150,255,0.45)",
    borderRadius: 26,
    padding: 17,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  profileGlowOne: { position: "absolute", width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.07)", top: -70, left: -40 },
  profileGlowTwo: { position: "absolute", width: 110, height: 110, borderRadius: 55, backgroundColor: "rgba(255,255,255,0.06)", bottom: -55, right: -30 },
  profileTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarRing: { width: 54, height: 54, borderRadius: 19, borderWidth: 2, borderColor: "rgba(255,255,255,0.35)", alignItems: "center", justifyContent: "center" },
  avatar: { width: 44, height: 44, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  avatarText: { color: CWAAX.white, fontSize: 19, fontWeight: "900" },
  profileCopy: { flex: 1 },
  name: { color: CWAAX.white, fontSize: 15, fontWeight: "900", textAlign: "right" },
  uid: { color: "rgba(255,255,255,0.72)", fontSize: 10, marginTop: 4, textAlign: "right" },
  verifiedPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5 },
  verifiedPillText: { color: CWAAX.white, fontSize: 10, fontWeight: "800" },
  profileFoot: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.16)", marginTop: 15, paddingTop: 13 },
  email: { color: "rgba(255,255,255,0.72)", fontSize: 10.5, flex: 1, textAlign: "right" },
  viewProfile: { flexDirection: "row", alignItems: "center", gap: 3 },
  viewProfileText: { color: CWAAX.white, fontWeight: "800", fontSize: 11 },

  vipCard: { flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: "rgba(245,184,46,0.14)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", padding: 14, borderRadius: 20, marginBottom: 22 },
  vipIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: "rgba(245,184,46,0.14)", alignItems: "center", justifyContent: "center" },
  vipCopy: { flex: 1 },
  vipTitle: { color: "#F5B82E", fontWeight: "900", fontSize: 13, textAlign: "right" },
  vipSub: { color: "#9A7B34", fontSize: 10, marginTop: 4, textAlign: "right" },
  vipChevron: { width: 26, height: 26, borderRadius: 13, backgroundColor: "rgba(245,184,46,0.14)", alignItems: "center", justifyContent: "center" },

  sectionTitle: { color: CWAAX.muted, fontWeight: "800", fontSize: 12, textAlign: "right", marginBottom: 9, marginTop: 8 },

  groupCard: { padding: 6, marginBottom: 4 },
  menuRow: { minHeight: 60, flexDirection: "row", alignItems: "center", gap: 11, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: CWAAX.line },
  menuRowLast: { borderBottomWidth: 0 },
  menuIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  menuCopy: { flex: 1 },
  menuLabel: { color: CWAAX.ink, fontSize: 13, fontWeight: "800", textAlign: "right" },
  menuSub: { color: CWAAX.muted, fontSize: 10, marginTop: 2, textAlign: "right" },
  preference: { color: CWAAX.muted, fontSize: 11, marginRight: 2 },
  chevronWrap: { alignItems: "center", justifyContent: "center" },

  adminLink: { marginTop: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "#18223D", borderRadius: 16, padding: 13, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 7 },
  adminText: { color: CWAAX.green, fontSize: 12, fontWeight: "900" },
  logout: { marginTop: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "#18223D", borderRadius: 16, padding: 13, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 7 },
  logoutText: { color: CWAAX.red, fontSize: 12, fontWeight: "900" },
  pressed: { opacity: 0.6 },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,.4)", justifyContent: "center", padding: 22 },
  modalCard: { backgroundColor: CWAAX.card2, borderRadius: 24, padding: 18 },
  modalTitle: { color: CWAAX.ink, fontSize: 18, fontWeight: "900", textAlign: "right", marginBottom: 12 },
  languageOption: { minHeight: 50, borderRadius: 14, paddingHorizontal: 13, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  languageSelected: { backgroundColor: CWAAX.greenSoft },
  languageText: { color: CWAAX.ink, fontSize: 12.5, fontWeight: "700" },
  languageTextSelected: { color: CWAAX.green, fontWeight: "900" },
  languageCheck: { width: 20, height: 20, borderRadius: 10, backgroundColor: CWAAX.green, alignItems: "center", justifyContent: "center" },
});
