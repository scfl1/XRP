import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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

/* ---------- الألوان: غيّر P إلى LIGHT للحصول على النسخة الفاتحة ---------- */
const DARK = {
  bg: "#000000",
  card: "#1A1A1C",
  border: "rgba(255,255,255,0.10)",
  text: "#FFFFFF",
  muted: "#8A8A8E",
  accent: "#FFE600",
  onAccent: "#14120A",
  primaryBg: "#FFE600",
  primaryText: "#14120A",
  secondaryBg: "#242427",
  secondaryText: "#FFFFFF",
  inputBg: "#242427",
  danger: "#FF5C5C",
};
const LIGHT = {
  bg: "#FFFFFF",
  card: "#F3F3F5",
  border: "#E7E8EB",
  text: "#111214",
  muted: "#8A8F98",
  accent: "#F0B90B",
  onAccent: "#14120A",
  primaryBg: "#111214",
  primaryText: "#FFFFFF",
  secondaryBg: "#EEEFF1",
  secondaryText: "#111214",
  inputBg: "#F3F3F5",
  danger: "#E5484D",
};
const P = DARK;
const YELLOW_CTA = "#FFE600";

export default function ReceiveScreen() {
  const router = useRouter();
  const [networkCode, setNetworkCode] = useState(getSelectedNetwork());
  const [qrUri, setQrUri] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sentAmount, setSentAmount] = useState("");

  useEffect(() => subscribeNetwork(setNetworkCode), []);

  const network = getNetwork(networkCode === "internal" ? "TRC20" : networkCode);
  const address = DEPOSIT_ADDRESSES[network.code];

  const createDeposit = trpc.wallet.createDeposit.useMutation({
    onSuccess: () => {
      notify("تم إرسال طلبك");
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
      margin: 1,
      width: 400,
      errorCorrectionLevel: "Q",
      color: { dark: "#000000", light: "#FFFFFF" },
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
          // المشاركة بدون صورة تبقى مقبولة
        }
      }

      await navigator.share(shareData);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        copyAddress();
      }
    }
  };

  const head = address ? address.slice(0, 6) : "";
  const mid = address ? address.slice(6, -6) : "";
  const tail = address ? address.slice(-6) : "";

  return (
    <ScreenContainer className="px-0" edges={["top", "left", "right"]}>
      <View style={styles.root}>
        {/* الهيدر */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.headerBtn}>
            <MaterialIcons name="chevron-right" size={30} color={P.text} />
          </Pressable>
          <Text style={styles.title}>إيداع</Text>
          <Pressable onPress={() => router.push("/transactions")} hitSlop={12} style={styles.headerBtn}>
            <MaterialIcons name="more-horiz" size={26} color={P.text} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* العملة */}
          <View style={styles.coinRow}>
            <MaterialIcons name="arrow-drop-down" size={26} color={P.text} />
            <Text style={styles.coinText}>USDT</Text>
            <UsdtIcon size={30} />
          </View>

          {!address ? (
            <View style={styles.noAddress}>
              <MaterialIcons name="error-outline" size={34} color={P.muted} />
              <Text style={styles.noAddressText}>الاستقبال عبر شبكة {network.name} غير متاح حالياً.</Text>
              <Pressable onPress={() => router.push("/network-select")} style={styles.changeNetBtn}>
                <Text style={styles.changeNetText}>اختر شبكة أخرى</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* QR */}
              <View style={styles.qrCard}>
                {qrUri ? <Image source={{ uri: qrUri }} style={styles.qrImage} /> : <View style={styles.qrImage} />}
                <View style={styles.qrBadge}>
                  <UsdtIcon size={34} />
                </View>
              </View>

              {/* الشبكة */}
              <Text style={styles.fieldLabel}>الشبكة</Text>
              <Pressable onPress={() => router.push("/network-select")} style={({ pressed }) => [styles.networkRow, pressed && styles.pressed]}>
                <View style={styles.networkNameWrap}>
                  <NetworkIcon network={network} size={26} />
                  <Text style={styles.networkName}>{network.chain} ({network.name})</Text>
                </View>
                <MaterialIcons name="swap-horiz" size={26} color={P.text} />
              </Pressable>

              {/* العنوان */}
              <Text style={[styles.fieldLabel, { marginTop: 26 }]}>عنوان الإيداع</Text>
              <View style={styles.addressRow}>
                <Text style={styles.addressText} selectable>
                  <Text style={styles.addressHi}>{head}</Text>
                  {mid}
                  <Text style={styles.addressHi}>{tail}</Text>
                </Text>
                <Pressable onPress={copyAddress} style={({ pressed }) => [styles.copyCircle, pressed && styles.pressed]}>
                  <MaterialIcons name="content-copy" size={22} color={P.text} />
                </Pressable>
              </View>

              <View style={styles.divider} />

              {/* تفاصيل */}
              <InfoRow label="إيداع إلى" value="محفظة CwaAX" />
              <InfoRow label="العملة" value="USDT" />
              <InfoRow label="الشبكة" value={network.name} />

              {/* بطاقة تأكيد الإيداع */}
              <View style={styles.confirmCard}>
                <View style={styles.confirmIcon}>
                  <MaterialIcons name="task-alt" size={26} color={P.onAccent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.confirmTitle}>هل أرسلت المبلغ؟</Text>
                  <Text style={styles.confirmSub}>بعد التحويل اضغط تأكيد الإيداع وأدخل المبلغ ليُراجع طلبك.</Text>
                </View>
              </View>
              <Pressable
                onPress={() => setShowConfirm(true)}
                style={({ pressed }) => [styles.confirmBtn, pressed && styles.pressed]}
              >
                <MaterialIcons name="check-circle" size={22} color="#14120A" />
                <Text style={styles.confirmBtnText}>تأكيد الإيداع</Text>
              </Pressable>

              <View style={styles.noteRow}>
                <MaterialIcons name="info-outline" size={16} color={P.muted} />
                <Text style={styles.note}>
                  فقط رمز USDT على شبكة {network.name} المُرسل إلى هذا العنوان سيصل إلى محفظتك. إرسال أي عملة أو شبكة أخرى قد يؤدي لفقدانها.
                </Text>
              </View>
            </>
          )}
        </ScrollView>

        {/* شريط الأزرار السفلي */}
        {address ? (
          <View style={styles.bottomBar}>
            <Pressable onPress={handleShare} style={({ pressed }) => [styles.bottomBtn, styles.secondaryBtn, pressed && styles.pressed]}>
              <Text style={styles.secondaryText}>مشاركة</Text>
            </Pressable>
            <Pressable onPress={copyAddress} style={({ pressed }) => [styles.bottomBtn, styles.primaryBtn, pressed && styles.pressed]}>
              <Text style={styles.primaryText}>انسخ العنوان</Text>
            </Pressable>
          </View>
        ) : null}

        {/* نافذة إدخال مبلغ التأكيد */}
        <Modal visible={showConfirm} transparent animationType="slide" onRequestClose={() => setShowConfirm(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalRoot}>
            <Pressable style={styles.backdrop} onPress={() => setShowConfirm(false)} />
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <View style={styles.sheetIcon}>
                <MaterialIcons name="check" size={30} color={P.onAccent} />
              </View>
              <Text style={styles.sheetTitle}>تأكيد الإيداع</Text>
              <Text style={styles.sheetSub}>أدخل المبلغ الذي أرسلته بالضبط إلى عنوان الإيداع</Text>

              <View style={styles.amountBox}>
                <TextInput
                  value={sentAmount}
                  onChangeText={setSentAmount}
                  placeholder="0.00"
                  placeholderTextColor={P.muted}
                  keyboardType="decimal-pad"
                  style={styles.amountInput}
                  textAlign="center"
                  autoFocus
                />
                <Text style={styles.amountUnit}>USDT</Text>
              </View>

              <View style={styles.netChip}>
                <NetworkIcon network={network} size={18} />
                <Text style={styles.netChipText}>الشبكة: {network.name}</Text>
              </View>

              <View style={styles.sheetActions}>
                <Pressable onPress={() => setShowConfirm(false)} style={({ pressed }) => [styles.sheetCancel, pressed && styles.pressed]}>
                  <Text style={styles.sheetCancelText}>إلغاء</Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirmSent}
                  disabled={createDeposit.isPending}
                  style={({ pressed }) => [styles.sheetOk, (pressed || createDeposit.isPending) && styles.pressed]}
                >
                  <MaterialIcons name="check-circle" size={20} color="#14120A" />
                  <Text style={styles.sheetOkText}>{createDeposit.isPending ? "جاري الإرسال..." : "تأكيد الإرسال"}</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </ScreenContainer>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: P.bg },
  pressed: { opacity: 0.65 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 },
  headerBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { color: P.text, fontSize: 18, fontWeight: "800" },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 130 },

  coinRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 },
  coinText: { color: P.text, fontSize: 24, fontWeight: "900" },

  qrCard: {
    alignSelf: "center", width: 240, height: 240, borderRadius: 28, backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center", marginTop: 18, marginBottom: 30,
  },
  qrImage: { width: 210, height: 210 },
  qrBadge: {
    position: "absolute", width: 48, height: 48, borderRadius: 24, backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center",
  },

  fieldLabel: { color: P.muted, fontSize: 14, textAlign: "right", marginBottom: 12 },
  networkRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  networkNameWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  networkName: { color: P.text, fontSize: 22, fontWeight: "800" },

  addressRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  addressText: { flex: 1, color: P.text, fontSize: 21, fontWeight: "700", lineHeight: 30, textAlign: "left", writingDirection: "ltr" },
  addressHi: { color: P.accent },
  copyCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: P.card, alignItems: "center", justifyContent: "center" },
  divider: { height: 1, backgroundColor: P.border, marginTop: 22, marginBottom: 8 },

  infoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 13 },
  infoLabel: { color: P.muted, fontSize: 15 },
  infoValue: { color: P.text, fontSize: 16, fontWeight: "600" },

  confirmCard: {
    flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: P.card, borderRadius: 18,
    borderWidth: 1, borderColor: P.border, padding: 14, marginTop: 20,
  },
  confirmIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: YELLOW_CTA, alignItems: "center", justifyContent: "center" },
  confirmTitle: { color: P.text, fontSize: 15, fontWeight: "800", textAlign: "right" },
  confirmSub: { color: P.muted, fontSize: 12, lineHeight: 18, marginTop: 3, textAlign: "right" },
  confirmBtn: {
    height: 58, borderRadius: 29, backgroundColor: YELLOW_CTA, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 10, marginTop: 12,
    shadowColor: "#FFE600", shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  confirmBtnText: { color: "#14120A", fontSize: 17, fontWeight: "900" },

  noteRow: { flexDirection: "row", gap: 8, marginTop: 20 },
  note: { flex: 1, color: P.muted, fontSize: 11.5, lineHeight: 18, textAlign: "right" },

  noAddress: { alignItems: "center", paddingVertical: 60, gap: 12 },
  noAddressText: { color: P.muted, fontSize: 13, textAlign: "center", paddingHorizontal: 20 },
  changeNetBtn: { marginTop: 8, backgroundColor: P.primaryBg, borderRadius: 24, paddingHorizontal: 22, paddingVertical: 12 },
  changeNetText: { color: P.primaryText, fontWeight: "800", fontSize: 13 },

  bottomBar: {
    position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", gap: 12,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 18, backgroundColor: P.bg,
    borderTopWidth: 1, borderTopColor: P.border,
  },
  bottomBtn: { flex: 1, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  primaryBtn: { backgroundColor: P.primaryBg },
  primaryText: { color: P.primaryText, fontSize: 16, fontWeight: "800" },
  secondaryBtn: { backgroundColor: P.secondaryBg },
  secondaryText: { color: P.secondaryText, fontSize: 16, fontWeight: "800" },

  modalRoot: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: { backgroundColor: P.bg === "#000000" ? "#141416" : P.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 30, alignItems: "center" },
  handle: { width: 44, height: 5, borderRadius: 3, backgroundColor: P.border, marginBottom: 18 },
  sheetIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: YELLOW_CTA, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  sheetTitle: { color: P.text, fontSize: 20, fontWeight: "900" },
  sheetSub: { color: P.muted, fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 20 },
  amountBox: {
    flexDirection: "row", alignItems: "center", alignSelf: "stretch", backgroundColor: P.inputBg, borderRadius: 18,
    borderWidth: 1.5, borderColor: P.border, height: 66, paddingHorizontal: 16, marginTop: 20, gap: 8,
  },
  amountInput: { flex: 1, color: P.text, fontSize: 28, fontWeight: "900", paddingVertical: 0 },
  amountUnit: { color: P.muted, fontSize: 15, fontWeight: "800" },
  netChip: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 14 },
  netChipText: { color: P.muted, fontSize: 12.5 },
  sheetActions: { flexDirection: "row", gap: 10, alignSelf: "stretch", marginTop: 22 },
  sheetCancel: { flex: 1, height: 54, borderRadius: 27, backgroundColor: P.secondaryBg, alignItems: "center", justifyContent: "center" },
  sheetCancelText: { color: P.secondaryText, fontSize: 15, fontWeight: "800" },
  sheetOk: { flex: 2, height: 54, borderRadius: 27, backgroundColor: YELLOW_CTA, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  sheetOkText: { color: "#14120A", fontSize: 16, fontWeight: "900" },
});
