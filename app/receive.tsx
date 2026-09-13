import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import QRCode from "qrcode";
import { ScreenContainer } from "@/components/screen-container";
import { IconButton } from "@/components/cwaax-ui";
import { NetworkIcon } from "@/components/network-icon";
import { UsdtIcon } from "@/components/usdt-icon";
import { CWAAX } from "@/constants/cwaax";
import { getNetwork } from "@/constants/networks";
import { DEPOSIT_ADDRESSES } from "@/constants/receive-addresses";
import { notify } from "@/lib/_core/native-alert";
import { getSelectedNetwork, subscribeNetwork } from "@/lib/_core/network-store";

export default function ReceiveScreen() {
  const router = useRouter();
  const [networkCode, setNetworkCode] = useState(getSelectedNetwork());
  const [mode, setMode] = useState<"offchain" | "onchain">("onchain");
  const [qrUri, setQrUri] = useState<string | null>(null);

  useEffect(() => subscribeNetwork(setNetworkCode), []);

  const network = getNetwork(networkCode === "internal" ? "TRC20" : networkCode);
  const address = DEPOSIT_ADDRESSES[network.code];

  useEffect(() => {
    setQrUri(null);
    if (!address) return;
    QRCode.toDataURL(address, { margin: 1, width: 400, color: { dark: "#101A16", light: "#00000000" } })
      .then(setQrUri)
      .catch(() => setQrUri(null));
  }, [address]);

  const copyAddress = () => {
    if (!address) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(address);
      notify("تم النسخ", "تم نسخ العنوان إلى الحافظة.");
    } else {
      notify("العنوان", address);
    }
  };

  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <IconButton icon="arrow-forward" label="رجوع" onPress={() => router.back()} />
          <Text style={styles.title}>استقبال</Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={styles.badgeRow}>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>بدون رسوم غاز!</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          <Pressable onPress={() => setMode("offchain")} style={[styles.tab, mode === "offchain" && styles.tabActive]}>
            <Text style={[styles.tabText, mode === "offchain" && styles.tabTextActive]}>Off-chain</Text>
          </Pressable>
          <Pressable onPress={() => setMode("onchain")} style={[styles.tab, mode === "onchain" && styles.tabActive]}>
            <Text style={[styles.tabText, mode === "onchain" && styles.tabTextActive]}>On-chain</Text>
          </Pressable>
        </View>

        {mode === "offchain" ? (
          <View style={styles.comingSoon}>
            <MaterialIcons name="hourglass-empty" size={30} color={CWAAX.muted} />
            <Text style={styles.comingSoonText}>
              التحويل الداخلي بين حسابات CwaAX قيد التطوير ولم يُفعَّل بعد.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.selectorsRow}>
              <View style={styles.selectorCol}>
                <Text style={styles.selectorLabel}>استقبال</Text>
                <View style={styles.selectorPill}>
                  <UsdtIcon size={20} />
                  <Text style={styles.selectorValue}>USDT</Text>
                </View>
              </View>

              <View style={styles.selectorCol}>
                <Text style={styles.selectorLabel}>على الشبكة</Text>
                <Pressable onPress={() => router.push("/network-select")} style={styles.selectorPill}>
                  <NetworkIcon network={network} size={20} />
                  <Text style={styles.selectorValue}>{network.name}</Text>
                  <MaterialIcons name="unfold-more" size={14} color={CWAAX.muted} />
                </Pressable>
              </View>
            </View>

            <View style={styles.qrCard}>
              <View style={styles.qrBrandRow}>
                <Pressable onPress={copyAddress} hitSlop={8}>
                  <MaterialIcons name="ios-share" size={20} color={CWAAX.ink} />
                </Pressable>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.brand}>CwaAX</Text>
                  <Text style={styles.brandSub}>DIGITAL WALLET</Text>
                </View>
              </View>

              {!address ? (
                <View style={styles.noAddress}>
                  <MaterialIcons name="error-outline" size={30} color={CWAAX.muted} />
                  <Text style={styles.noAddressText}>
                    الاستقبال عبر شبكة {network.name} غير متاح حالياً.
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.qrFrame}>
                    {qrUri && <Image source={{ uri: qrUri }} style={styles.qrImage} />}
                    <View style={styles.qrBadge}>
                      <NetworkIcon network={network} size={26} />
                    </View>
                  </View>

                  <Text style={styles.addressLabel}>عنوانك</Text>
                  <Pressable onPress={copyAddress}>
                    <Text style={styles.address}>{address}</Text>
                  </Pressable>
                </>
              )}
            </View>

            {address && (
              <View style={styles.noteRow}>
                <MaterialIcons name="info-outline" size={16} color={CWAAX.muted} />
                <Text style={styles.note}>
                  فقط رمز USDT على شبكة {network.name} المُرسل إلى هذا العنوان سيصل إلى محفظتك. إرسال أي عملة أو شبكة أخرى قد يؤدي لفقدانها.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 12, paddingBottom: 30 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  title: { color: CWAAX.ink, fontSize: 19, fontWeight: "900" },
  badgeRow: { alignItems: "center", marginBottom: 16 },
  freeBadge: { backgroundColor: CWAAX.greenSoft, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  freeBadgeText: { color: CWAAX.green, fontSize: 11, fontWeight: "800" },
  tabs: { flexDirection: "row", backgroundColor: CWAAX.surface, borderRadius: 14, padding: 4, marginBottom: 22 },
  tab: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 11 },
  tabActive: { backgroundColor: "#fff" },
  tabText: { color: CWAAX.muted, fontSize: 12, fontWeight: "800" },
  tabTextActive: { color: CWAAX.ink },
  comingSoon: { alignItems: "center", paddingVertical: 50, gap: 12 },
  comingSoonText: { color: CWAAX.muted, fontSize: 12, textAlign: "center", lineHeight: 19, paddingHorizontal: 20 },
  selectorsRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  selectorCol: { flex: 1 },
  selectorLabel: { color: CWAAX.muted, fontSize: 10, textAlign: "right", marginBottom: 6 },
  selectorPill: { flexDirection: "row-reverse", alignItems: "center", gap: 6, backgroundColor: CWAAX.surface, borderRadius: 12, paddingHorizontal: 10, height: 42 },
  selectorValue: { color: CWAAX.ink, fontSize: 13, fontWeight: "800", flex: 1, textAlign: "right" },
  qrCard: { backgroundColor: CWAAX.surface, borderRadius: 22, padding: 18, alignItems: "center" },
  qrBrandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 16 },
  brand: { color: CWAAX.ink, fontSize: 20, fontWeight: "900" },
  brandSub: { color: CWAAX.muted, fontSize: 9, fontWeight: "700", letterSpacing: 1, marginTop: 2 },
  qrFrame: { width: 220, height: 220, backgroundColor: "#fff", borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  qrImage: { width: 200, height: 200 },
  qrBadge: { position: "absolute", width: 34, height: 34, borderRadius: 17, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff" },
  addressLabel: { color: CWAAX.muted, fontSize: 10, marginBottom: 8 },
  address: { color: CWAAX.green, fontSize: 13, fontWeight: "800", textAlign: "center", lineHeight: 20 },
  noAddress: { alignItems: "center", paddingVertical: 40, gap: 10 },
  noAddressText: { color: CWAAX.muted, fontSize: 12, textAlign: "center", paddingHorizontal: 20 },
  noteRow: { flexDirection: "row-reverse", gap: 8, marginTop: 18, paddingHorizontal: 4 },
  note: { flex: 1, color: CWAAX.muted, fontSize: 10.5, lineHeight: 17, textAlign: "right" },
});
