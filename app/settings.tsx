import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Card, IconButton } from "@/components/cwaax-ui";
import { CWAAX } from "@/constants/cwaax";

const currencies = ["USD · الدولار الأمريكي", "EUR · اليورو", "GBP · الجنيه الإسترليني"];
const languages = ["العربية", "English", "Русский"];

export default function SettingsScreen() {
  const router = useRouter();
  const [twoFactor, setTwoFactor] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState(currencies[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [selector, setSelector] = useState<"currency" | "language" | null>(null);

  const selectorItems = selector === "currency" ? currencies : languages;
  const selectorTitle = selector === "currency" ? "العملة الأصلية" : "اللغة";

  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <IconButton icon="arrow-forward" label="رجوع" onPress={() => router.back()} />
          <Text style={styles.title}>الإعدادات</Text>
          <View style={{ width: 42 }} />
        </View>

        <Card style={styles.banner}>
          <MaterialIcons name="security" size={23} color={CWAAX.green} />
          <View style={styles.bannerCopy}>
            <Text style={styles.bannerTitle}>اجعل حسابك أكثر أماناً</Text>
            <Text style={styles.bannerSub}>فعّل المصادقة الثنائية الآن</Text>
          </View>
          <Pressable onPress={() => setTwoFactor((value) => !value)} style={({ pressed }) => [styles.enable, pressed && styles.pressed]}>
            <Text style={styles.enableText}>{twoFactor ? "مفعّلة" : "تفعيل"}</Text>
          </Pressable>
        </Card>

        <Text style={styles.section}>الأمان والخصوصية</Text>
        <Card>
          <Pressable onPress={() => setTwoFactor((value) => !value)} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <View style={styles.icon}><MaterialIcons name="verified-user" size={18} color={CWAAX.green} /></View>
            <View style={styles.copy}><Text style={styles.label}>المصادقة الثنائية</Text><Text style={styles.sub}>{twoFactor ? "مفعّلة لحماية حسابك" : "حماية إضافية لحسابك"}</Text></View>
            <Switch value={twoFactor} onValueChange={setTwoFactor} trackColor={{ false: "#DDE4E0", true: "#9BD5B4" }} thumbColor={twoFactor ? CWAAX.green : "#fff"} />
          </Pressable>
          <Pressable onPress={() => setNotifications((value) => !value)} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <View style={styles.icon}><MaterialIcons name="notifications-none" size={18} color={CWAAX.green} /></View>
            <View style={styles.copy}><Text style={styles.label}>الإشعارات</Text><Text style={styles.sub}>{notifications ? "تنبيهات الأسعار والعمليات مفعّلة" : "الإشعارات متوقفة"}</Text></View>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: "#DDE4E0", true: "#9BD5B4" }} thumbColor={notifications ? CWAAX.green : "#fff"} />
          </Pressable>
          <Pressable onPress={() => setSelector("currency")} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <View style={styles.icon}><MaterialIcons name="paid" size={18} color={CWAAX.green} /></View>
            <View style={styles.copy}><Text style={styles.label}>العملة الأصلية</Text><Text style={styles.sub}>{currency}</Text></View>
            <MaterialIcons name="chevron-left" size={19} color="#A0AAA4" />
          </Pressable>
          <Pressable onPress={() => setSelector("language")} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <View style={styles.icon}><MaterialIcons name="language" size={18} color={CWAAX.green} /></View>
            <View style={styles.copy}><Text style={styles.label}>اللغة</Text><Text style={styles.sub}>{language}</Text></View>
            <MaterialIcons name="chevron-left" size={19} color="#A0AAA4" />
          </Pressable>
        </Card>

        <Text style={styles.section}>الدعم</Text>
        <Card>
          <Pressable onPress={() => router.push("/support")} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <View style={[styles.icon, { backgroundColor: "#FFF5DE" }]}><MaterialIcons name="support-agent" size={18} color={CWAAX.gold} /></View>
            <View style={styles.copy}><Text style={styles.label}>مركز الدعم</Text><Text style={styles.sub}>نحن هنا لمساعدتك</Text></View>
            <MaterialIcons name="chevron-left" size={19} color="#A0AAA4" />
          </Pressable>
          <Pressable onPress={() => Alert.alert("الشروط والسياسات", "باستخدام CwaAX توافق على شروط الاستخدام وسياسة الخصوصية. لا تشارك كلمة المرور أو رموز التحقق مع أي شخص." )} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <View style={[styles.icon, { backgroundColor: "#F2F3F2" }]}><MaterialIcons name="description" size={18} color={CWAAX.ink} /></View>
            <View style={styles.copy}><Text style={styles.label}>الشروط والسياسات</Text><Text style={styles.sub}>آخر تحديث: سبتمبر 2026</Text></View>
            <MaterialIcons name="chevron-left" size={19} color="#A0AAA4" />
          </Pressable>
        </Card>
        <Text style={styles.version}>CwaAX Wallet · الإصدار 1.0.0</Text>
      </ScrollView>

      <Modal visible={selector !== null} transparent animationType="fade" onRequestClose={() => setSelector(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setSelector(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>{selectorTitle}</Text>
            {selectorItems.map((item) => {
              const selected = (selector === "currency" ? currency : language) === item;
              return <Pressable key={item} onPress={() => { if (selector === "currency") setCurrency(item); else setLanguage(item); setSelector(null); }} style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}>
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{item}</Text>
                {selected && <MaterialIcons name="check" size={19} color={CWAAX.green} />}
              </Pressable>;
            })}
            <Pressable onPress={() => setSelector(null)} style={styles.cancel}><Text style={styles.cancelText}>إلغاء</Text></Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 12, paddingBottom: 30 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 23 },
  title: { color: CWAAX.ink, fontSize: 20, fontWeight: "900" },
  banner: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F0F9F4", borderColor: "#D8F0E1", marginBottom: 22 },
  bannerCopy: { flex: 1 }, bannerTitle: { color: CWAAX.ink, fontSize: 12, fontWeight: "900", textAlign: "right" }, bannerSub: { color: CWAAX.muted, fontSize: 10, marginTop: 4, textAlign: "right" },
  enable: { backgroundColor: CWAAX.green, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 7 }, enableText: { color: CWAAX.white, fontSize: 10, fontWeight: "800" },
  section: { color: CWAAX.muted, fontWeight: "800", fontSize: 12, textAlign: "right", marginBottom: 9, marginTop: 5 },
  row: { minHeight: 65, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: CWAAX.line },
  icon: { width: 35, height: 35, borderRadius: 12, backgroundColor: CWAAX.greenSoft, alignItems: "center", justifyContent: "center" }, copy: { flex: 1 },
  label: { color: CWAAX.ink, fontSize: 12, fontWeight: "800", textAlign: "right" }, sub: { color: CWAAX.muted, fontSize: 10, marginTop: 4, textAlign: "right" },
  version: { color: "#A3AEA7", textAlign: "center", fontSize: 10, marginTop: 23 }, pressed: { opacity: .62 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,.35)", justifyContent: "center", padding: 22 },
  modalCard: { backgroundColor: CWAAX.white, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: CWAAX.line },
  modalTitle: { color: CWAAX.ink, fontSize: 18, fontWeight: "900", textAlign: "right", marginBottom: 12 },
  option: { minHeight: 50, borderRadius: 12, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, marginBottom: 6 },
  optionSelected: { backgroundColor: CWAAX.greenSoft }, optionText: { color: CWAAX.ink, fontSize: 12, fontWeight: "700" }, optionTextSelected: { color: CWAAX.green },
  cancel: { alignItems: "center", paddingVertical: 12, marginTop: 4 }, cancelText: { color: CWAAX.red, fontSize: 12, fontWeight: "800" },
});
