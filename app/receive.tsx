import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import QRCode from "qrcode";
import { ScreenContainer } from "@/components/screen-container";
import { NetworkIcon } from "@/components/network-icon";
import { UsdtIcon } from "@/components/usdt-icon";
import { getNetwork } from "@/constants/networks";
import { DEPOSIT_ADDRESSES } from "@/constants/receive-addresses";
import { confirmAsync, notify } from "@/lib/_core/native-alert";
import { getSelectedNetwork, subscribeNetwork } from "@/lib/_core/network-store";
import { trpc } from "@/lib/trpc";


// ألوان الثيم الداكن (نفس الصفحة الرئيسية)
const D = {
  bg: "#04100D",
  card: "#0B1A17",
  card2: "#12241F",
  border: "rgba(255,255,255,0.10)",
  greenBorder: "rgba(47,227,154,0.45)",
  text: "#FFFFFF",
  muted: "#9FB3AD",
  green: "#19D27C",
  greenDeep: "#0F6B45",
  greenSoft: "rgba(25,210,124,0.15)",
  red: "#FF5C5C",
  redSoft: "rgba(255,92,92,0.16)",
};

const BLACK = "#04100D";
const BLACK_SOFT = "#1E8F5E";

export default function ReceiveScreen() {
  const router = useRouter();
  const [networkCode, setNetworkCode] = useState(getSelectedNetwork());
  const [mode, setMode] = useState<"offchain" | "onchain">("onchain");
  const [qrUri, setQrUri] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sentAmount, setSentAmount] = useState("");

  useEffect(() => subscribeNetwork(setNetworkCode), []);

  const network = getNetwork(networkCode === "internal" ? "TRC20" : networkCode);
  const address = DEPOSIT_ADDRESSES[network.code];

  const createDeposit = trpc.wallet.createDeposit.useMutation({
    onSuccess: () => {
      notify("تم ارسال طلبك");
      setShowConfirm(false);
      setSentAmount("");
    },
    onError: (err) => notify("تعذر الإرسال", err.message || "حاول مرة أخرى."),
  });

  const handleConfirmSent = async () => {
    const amount = Number(sentAmount);
    if (!amount || amount <= 0) {
      notify("تحقق من المبلغ", "أدخل المبلغ الذي أرسلته بالضبط.");
      return;
    }
    const confirmed = await confirmAsync(
      "تأكيد الإيداع",
      `المبلغ: ${amount} USDT\nالشبكة: ${network.name}`,
      "تأكيد وإرسال",
    );
    if (!confirmed) return;
    createDeposit.mutate({
      currency: "USDT",
      amount,
      network: network.code,
      paymentMethod: "on-chain-transfer",
    });
  };

  useEffect(() => {
    setQrUri(null);
    if (!address) return;
    QRCode.toDataURL(address, {
      margin: 2,
      width: 400,
      errorCorrectionLevel: "M",
      color: { dark: "#101A16", light: "#FFFFFF" },
    })
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

  const handleShare = async () => {
    if (!address) return;

    const shareText = `عنواني لاستقبال USDT على شبكة ${network.name}:\n${address}`;

    if (typeof navigator === "undefined" || !("share" in navigator)) {
      copyAddress();
      return;
    }

    try {
      const shareData: ShareData & { files?: File[] } = {
        title: "عنوان استقبال CwaAX",
        text: shareText,
      };

      if (qrUri) {
        try {
          const blob = await (await fetch(qrUri)).blob();
          const file = new File([blob], "cwaax-address-qr.png", { type: "image/png" });
          if (!navigator.canShare || navigator.canShare({ files: [file] })) {
            shareData.files = [file];
          }
        } catch {
          // sharing without the image file is still fine
        }
      }

      await navigator.share(shareData);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        copyAddress();
      }
    }
  };

  return (
    <ScreenContainer className="px-0" edges={["top", "left", "right"]}>
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
            <MaterialIcons name="arrow-forward" size={22} color={D.text} />
          </Pressable>
          <Text style={styles.title}>استقبال</Text>
          <View style={{ width: 44 }} />
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

        {/* زر تأكيد الإيداع مباشرة تحت التبويبات وفي المنتصف */}
        {mode === "onchain" && address ? (
          !showConfirm ? (
            <Pressable
              onPress={() => setShowConfirm(true)}
              style={({ pressed }) => [styles.sentBtn, pressed && styles.pressed]}
            >
              <View style={styles.sentBtnIcon}>
                <MaterialIcons name="check" size={15} color={BLACK} />
              </View>
              <Text style={styles.sentBtnText}>اضغط هنا للتأكيد ايداع</Text>
            </Pressable>
          ) : (
            <View style={styles.confirmBox}>
              <Text style={styles.confirmLabel}>كم المبلغ الذي أرسلته؟ (USDT)</Text>
              <TextInput
                value={sentAmount}
                onChangeText={setSentAmount}
                placeholder="مثال: 50"
                placeholderTextColor="#5F746D"
                keyboardType="decimal-pad"
                style={styles.confirmInput}
                textAlign="center"
              />
              <View style={styles.confirmActions}>
                <Pressable onPress={() => setShowConfirm(false)} style={styles.confirmCancel}>
                  <Text style={styles.confirmCancelText}>إلغاء</Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirmSent}
                  disabled={createDeposit.isPending}
                  style={({ pressed }) => [styles.confirmSubmit, (pressed || createDeposit.isPending) && styles.pressed]}
                >
                  <MaterialIcons name="arrow-back" size={16} color={"#FFFFFF"} />
                  <Text style={styles.confirmSubmitText}>
                    {createDeposit.isPending ? "جاري الإرسال..." : "تأكيد الإرسال"}
                  </Text>
                </Pressable>
              </View>
            </View>
          )
        ) : null}

        {mode === "offchain" ? (
          <View style={styles.comingSoon}>
            <MaterialIcons name="hourglass-empty" size={30} color={D.muted} />
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
                  <View style={styles.selectorAvatar}>
                    <UsdtIcon size={18} />
                  </View>
                  <Text style={styles.selectorValue}>USDT</Text>
                </View>
              </View>

              <View style={styles.selectorCol}>
                <Text style={styles.selectorLabel}>على الشبكة</Text>
                <Pressable onPress={() => router.push("/network-select")} style={styles.selectorPill}>
                  <View style={styles.selectorAvatar}>
                    <NetworkIcon network={network} size={18} />
                  </View>
                  <Text style={styles.selectorValue}>{network.name}</Text>
                  <MaterialIcons name="unfold-more" size={14} color={D.muted} />
                </Pressable>
              </View>
            </View>

            <View style={styles.qrCard}>
              <View style={styles.qrBrandRow}>
                <Pressable onPress={handleShare} hitSlop={8} style={styles.shareBtn}>
                  <MaterialIcons name="ios-share" size={18} color={D.text} />
                </Pressable>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.brand}>CwaAX</Text>
                  <Text style={styles.brandSub}>DIGITAL WALLET</Text>
                </View>
              </View>

              {!address ? (
                <View style={styles.noAddress}>
                  <MaterialIcons name="error-outline" size={30} color={D.muted} />
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
                  <Pressable onPress={copyAddress} style={styles.addressChip}>
                    <Text style={styles.address}>{address}</Text>
                  </Pressable>

                  <Pressable onPress={copyAddress} style={({ pressed }) => [styles.copyBtn, pressed && styles.pressed]}>
                    <View style={styles.copyBtnIcon}>
                      <MaterialIcons name="content-copy" size={14} color={"#FFFFFF"} />
                    </View>
                    <Text style={styles.copyBtnText}>نسخ العنوان</Text>
                  </Pressable>
                </>
              )}
            </View>

            {address ? (
              <View style={styles.noteRow}>
                <MaterialIcons name="info-outline" size={16} color={D.muted} />
                <Text style={styles.note}>
                  فقط رمز USDT على شبكة {network.name} المُرسل إلى هذا العنوان سيصل إلى محفظتك. إرسال أي عملة أو شبكة أخرى قد يؤدي لفقدانها.
                </Text>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: D.bg, paddingHorizontal: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: D.greenBorder, backgroundColor: D.card, alignItems: "center", justifyContent: "center" },
  content: { paddingTop: 12, paddingBottom: 30 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  title: { color: D.text, fontSize: 19, fontWeight: "900" },
  badgeRow: { alignItems: "center", marginBottom: 16 },
  freeBadge: { borderWidth: 1, borderColor: D.greenBorder, backgroundColor: D.greenSoft, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  freeBadgeText: { color: D.green, fontSize: 11, fontWeight: "800" },
  tabs: { flexDirection: "row", backgroundColor: D.card, borderWidth: 1, borderColor: D.border, borderRadius: 999, padding: 4, marginBottom: 22 },
  tab: { flex: 1, alignItems: "center", paddingVertical: 11, borderRadius: 999 },
  tabActive: {
    backgroundColor: D.greenDeep, borderWidth: 1.5, borderColor: D.greenBorder,
    shadowColor: BLACK,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  tabText: { color: D.muted, fontSize: 12, fontWeight: "800" },
  tabTextActive: { color: "#FFFFFF" },
  comingSoon: { alignItems: "center", paddingVertical: 50, gap: 12 },
  comingSoonText: { color: D.muted, fontSize: 12, textAlign: "center", lineHeight: 19, paddingHorizontal: 20 },
  selectorsRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  selectorCol: { flex: 1 },
  selectorLabel: { color: D.muted, fontSize: 10, textAlign: "right", marginBottom: 6 },
  selectorPill: { flexDirection: "row-reverse", alignItems: "center", gap: 8, backgroundColor: D.card, borderWidth: 1.5, borderColor: D.border, borderRadius: 999, paddingHorizontal: 8, height: 46 },
  selectorAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: D.card2, alignItems: "center", justifyContent: "center" },
  selectorValue: { color: D.text, fontSize: 13, fontWeight: "800", flex: 1, textAlign: "right" },
  qrCard: { backgroundColor: D.card, borderWidth: 1, borderColor: D.greenBorder, borderRadius: 26, padding: 18, alignItems: "center" },
  qrBrandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 16 },
  shareBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: D.card2, alignItems: "center", justifyContent: "center" },
  brand: { color: D.text, fontSize: 20, fontWeight: "900" },
  brandSub: { color: D.muted, fontSize: 9, fontWeight: "700", letterSpacing: 1, marginTop: 2 },
  qrFrame: { width: 220, height: 220, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 18, borderWidth: 2, borderColor: D.border },
  qrImage: { width: 200, height: 200 },
  qrBadge: { position: "absolute", width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff", shadowColor: "#15231c", shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  addressLabel: { color: D.muted, fontSize: 10, marginBottom: 8 },
  addressChip: { backgroundColor: D.card2, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: D.border },
  address: { color: D.green, fontSize: 13, fontWeight: "800", textAlign: "center", lineHeight: 20 },
  copyBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    backgroundColor: D.greenDeep, borderWidth: 1.5, borderColor: D.greenBorder,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 9,
    shadowColor: BLACK,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  copyBtnIcon: { width: 25, height: 25, borderRadius: 13, backgroundColor: BLACK_SOFT, alignItems: "center", justifyContent: "center" },
  copyBtnText: { color: "#FFFFFF", fontSize: 12.5, fontWeight: "800", marginLeft: 6 },
  noAddress: { alignItems: "center", paddingVertical: 40, gap: 10 },
  noAddressText: { color: D.muted, fontSize: 12, textAlign: "center", paddingHorizontal: 20 },
  noteRow: { flexDirection: "row-reverse", gap: 8, marginTop: 18, paddingHorizontal: 4 },
  note: { flex: 1, color: D.muted, fontSize: 10.5, lineHeight: 17, textAlign: "right" },
  pressed: { opacity: 0.6 },
  sentBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: D.greenDeep, borderWidth: 1.5, borderColor: D.greenBorder,
    borderRadius: 999,
    height: 54,
    marginTop: 4,
    marginBottom: 18,
    alignSelf: "center",
    width: "100%",
    shadowColor: BLACK,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  sentBtnIcon: { width: 25, height: 25, borderRadius: 13, backgroundColor: D.green, alignItems: "center", justifyContent: "center" },
  sentBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  confirmBox: {
    backgroundColor: D.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    marginBottom: 18,
    width: "100%",
    alignSelf: "center",
  },
  confirmLabel: { color: D.text, fontSize: 12, fontWeight: "800", textAlign: "center", marginBottom: 10 },
  confirmInput: { backgroundColor: D.card2, borderRadius: 12, borderWidth: 1, borderColor: D.border, height: 46, fontSize: 15, fontWeight: "800", color: D.text },
  confirmHint: { color: D.muted, fontSize: 10, textAlign: "center", marginTop: 10, lineHeight: 16 },
  confirmActions: { flexDirection: "row", gap: 8, marginTop: 14 },
  confirmCancel: { flex: 1, height: 48, borderRadius: 999, borderWidth: 1.5, borderColor: D.border, backgroundColor: D.card2, alignItems: "center", justifyContent: "center" },
  confirmCancelText: { color: D.text, fontSize: 12, fontWeight: "800" },
  confirmSubmit: {
    flex: 2,
    height: 48,
    borderRadius: 999,
    backgroundColor: D.greenDeep, borderWidth: 1.5, borderColor: D.greenBorder,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row-reverse",
    gap: 6,
    shadowColor: BLACK,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  confirmSubmitText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
});
