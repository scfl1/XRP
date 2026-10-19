import { useCallback, useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { UsdtIcon } from "@/components/usdt-icon";
import { NetworkIcon } from "@/components/network-icon";
import { getNetwork } from "@/constants/networks";
import { confirmAsync } from "@/lib/_core/native-alert";
import { getSelectedNetwork, subscribeNetwork } from "@/lib/_core/network-store";
import { consumePendingScan } from "@/lib/_core/qr-store";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";


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

type PendingOp = { op: "+" | "-" | "×" | "÷"; base: number } | null;

function applyOp(base: number, op: NonNullable<PendingOp>["op"], value: number): number {
  if (op === "+") return base + value;
  if (op === "-") return base - value;
  if (op === "×") return base * value;
  return value === 0 ? base : base / value;
}

const webCursor = Platform.OS === "web" ? ({ cursor: "pointer" } as object) : null;

export default function SendScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [networkCode, setNetworkCode] = useState(getSelectedNetwork());
  const [display, setDisplay] = useState("0");
  const [pending, setPending] = useState<PendingOp>(null);
  const [address, setAddress] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const balances = trpc.wallet.balances.useQuery(undefined, { enabled: !!user });
  const usdt = Number(balances.data?.find((b: any) => b.currency === "USDT")?.amount ?? 0);

  const createWithdrawal = trpc.wallet.createWithdrawal.useMutation();

  useEffect(() => subscribeNetwork(setNetworkCode), []);

  useFocusEffect(
    useCallback(() => {
      const scanned = consumePendingScan();
      if (scanned) setAddress(scanned);
    }, []),
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg: string) => setToast(msg);

  const network = getNetwork(networkCode);
  const amount = Number(display) || 0;
  const addressValid = address.trim().length >= 20;
  const canSend =
    amount > 0 &&
    amount <= usdt &&
    addressValid &&
    !network.internal &&
    !createWithdrawal.isPending;

  const pressDigit = (d: string) => {
    setDisplay((cur) => {
      if (d === "." && cur.includes(".")) return cur;
      if (cur === "0" && d !== ".") return d;
      if (cur.length >= 12) return cur;
      return cur + d;
    });
  };

  const pressBackspace = () => {
    setDisplay((cur) => (cur.length <= 1 ? "0" : cur.slice(0, -1)));
  };

  const pressOp = (op: NonNullable<PendingOp>["op"]) => {
    const current = Number(display) || 0;
    if (pending) {
      const result = applyOp(pending.base, pending.op, current);
      setPending({ op, base: result });
    } else {
      setPending({ op, base: current });
    }
    setDisplay("0");
  };

  const finalizeAmount = (): number => {
    const current = Number(display) || 0;
    if (pending) {
      const result = applyOp(pending.base, pending.op, current);
      setPending(null);
      setDisplay(String(result));
      return result;
    }
    return current;
  };

  const setPercent = (pct: number) => {
    setPending(null);
    setDisplay(String(Math.floor(usdt * pct * 100) / 100));
  };

  /** بدون بطاقة تأكيد — window.confirm فقط */
  const handleSendPress = async () => {
    if (createWithdrawal.isPending) return;

    const finalAmount = finalizeAmount();

    if (!finalAmount || finalAmount <= 0) {
      showToast("أدخل مبلغاً صحيحاً أولاً");
      return;
    }

    if (finalAmount > usdt) {
      showToast("الرصيد غير كافٍ");
      return;
    }

    if (network.internal) {
      showToast("اختر شبكة بلوكتشين (مثل TRC20) وليس التحويل الداخلي");
      return;
    }

    if (address.trim().length < 20) {
      showToast("أدخل عنوان محفظة صالحاً (20 حرفاً على الأقل)");
      return;
    }

    const ok = await confirmAsync(
      "تأكيد التحويل",
      `المبلغ: ${finalAmount} USDT\nالشبكة: ${network.name}\nالعنوان: ${address.trim()}`,
    );
    if (!ok) return;

    createWithdrawal.mutate(
      {
        currency: "USDT",
        amount: finalAmount,
        network: network.code,
        address: address.trim(),
      },
      {
        onSuccess: () => {
          showToast(`تم إرسال طلب ${finalAmount} USDT — قيد المراجعة`);
          setDisplay("0");
          setAddress("");
          setTimeout(() => router.back(), 1500);
        },
        onError: (err) => {
          showToast(err.message || "تعذر إرسال الطلب — تحقق من الاتصال");
        },
      },
    );
  };

  const OPS: NonNullable<PendingOp>["op"][] = ["+", "-", "×", "÷"];
  const ROWS = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [".", "0", "back"],
  ];

  return (
    <ScreenContainer className="px-0" edges={["top", "left", "right"]}>
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/network-select")}
          style={[styles.networkPill, webCursor]}
          activeOpacity={0.7}
        >
          <MaterialIcons name="unfold-more" size={15} color={D.muted} />
          <View>
            <Text style={styles.networkLabel}>الشبكة/السلسلة</Text>
            <Text style={styles.networkValue}>{network.name}</Text>
          </View>
          <View style={styles.networkAvatar}>
            <NetworkIcon network={network} size={18} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={[styles.backBtn, webCursor]} activeOpacity={0.7}>
          <MaterialIcons name="chevron-left" size={22} color={D.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        bounces={false}
      >
        <View style={styles.currencyRow}>
          <UsdtIcon size={22} />
          <Text style={styles.currencyText}>USDT</Text>
          <Text style={styles.sendLabel}>إرسال</Text>
        </View>

        <Text style={[styles.amount, amount > 0 && styles.amountActive]} numberOfLines={1}>
          {display}
        </Text>

        <View style={styles.usdRow}>
          <Text style={styles.usdValue}>${amount.toFixed(2)}</Text>
          <Text style={styles.usdLabel}>USD</Text>
        </View>

        <View style={[styles.addressRow, addressValid && styles.addressRowValid]}>
          <TouchableOpacity
            onPress={() => router.push("/qr-scanner")}
            hitSlop={8}
            style={[styles.addressIconBtn, webCursor]}
            activeOpacity={0.7}
          >
            <MaterialIcons name="qr-code-scanner" size={17} color={D.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              try {
                if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
                  const text = (await navigator.clipboard.readText()).trim();
                  if (text) {
                    setAddress(text);
                    showToast("تم لصق العنوان");
                    return;
                  }
                }
              } catch {
                /* ignore */
              }
              showToast("الصق العنوان يدوياً في الحقل");
            }}
            hitSlop={8}
            style={[styles.addressIconBtn, webCursor]}
            activeOpacity={0.7}
          >
            <MaterialIcons name="content-paste" size={17} color={D.text} />
          </TouchableOpacity>
          <TextInput
            style={styles.addressInput}
            value={address}
            onChangeText={setAddress}
            placeholder="عنوان المحفظة"
            placeholderTextColor="#5F746D"
            textAlign="right"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.addressLabel}>إرسال إلى</Text>
        </View>

        <View style={styles.quickRow}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => setPercent(0.25)} style={[styles.pctChip, webCursor]} activeOpacity={0.7}>
            <Text style={styles.pct}>25%</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPercent(0.5)} style={[styles.pctChip, webCursor]} activeOpacity={0.7}>
            <Text style={styles.pct}>50%</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPercent(1)} style={[styles.pctChip, styles.pctChipMax, webCursor]} activeOpacity={0.7}>
            <Text style={[styles.pct, { color: D.green }]}>MAX</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceRow}>
          <View style={styles.balancePill}>
            <UsdtIcon size={16} />
            <Text style={styles.balanceText}>{usdt.toFixed(2)} USDT</Text>
          </View>
          <Text style={styles.balanceLabel}>رصيد المحفظة</Text>
        </View>
      </ScrollView>

      <View style={styles.keypad}>
        <View style={styles.opsCol}>
          {OPS.map((op) => (
            <TouchableOpacity
              key={op}
              onPress={() => pressOp(op)}
              style={[styles.opKey, pending?.op === op && styles.opKeyActive, webCursor]}
              activeOpacity={0.65}
            >
              <Text style={[styles.opText, pending?.op === op && styles.opTextActive]}>{op}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.digitsGrid}>
          {ROWS.map((row, i) => (
            <View key={i} style={styles.digitRow}>
              {row.map((d) =>
                d === "back" ? (
                  <TouchableOpacity
                    key={d}
                    onPress={pressBackspace}
                    style={[styles.digitKey, styles.backKey, webCursor]}
                    activeOpacity={0.65}
                  >
                    <MaterialIcons name="backspace" size={17} color={D.red} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    key={d}
                    onPress={() => pressDigit(d)}
                    style={[styles.digitKey, webCursor]}
                    activeOpacity={0.65}
                  >
                    <Text style={styles.digitText}>{d}</Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSendPress}
        activeOpacity={0.75}
        style={[
          styles.submit,
          canSend && styles.submitActive,
          createWithdrawal.isPending && styles.pressed,
          webCursor,
        ]}
      >
        <Text style={[styles.submitText, canSend && styles.submitTextActive]}>
          {createWithdrawal.isPending ? "جاري الإرسال..." : "إرسال"}
        </Text>
        <View style={styles.submitIcon}>
          <MaterialIcons name="arrow-back" size={16} color={canSend ? D.greenDeep : "#7F938C"} />
        </View>
      </TouchableOpacity>

      {toast ? (
        <View style={styles.toast} pointerEvents="none">
          <MaterialIcons name="info-outline" size={18} color={"#FFFFFF"} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: D.bg, paddingHorizontal: 20 },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    marginBottom: 10,
  },
  networkPill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    backgroundColor: D.card,
    borderWidth: 1,
    borderColor: D.greenBorder,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  networkAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: D.card2, alignItems: "center", justifyContent: "center" },
  networkLabel: { color: D.muted, fontSize: 9, textAlign: "right" },
  networkValue: { color: D.text, fontSize: 13, fontWeight: "900", textAlign: "right" },
  backBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: D.greenBorder, backgroundColor: D.card, alignItems: "center", justifyContent: "center" },
  content: { paddingBottom: 8 },
  currencyRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
  },
  currencyText: { color: D.text, fontSize: 17, fontWeight: "900" },
  sendLabel: { color: D.muted, fontSize: 15 },
  amount: { color: "#3F544D", fontSize: 48, fontWeight: "800", textAlign: "center", marginTop: 10 },
  amountActive: { color: D.text },
  usdRow: { flexDirection: "row-reverse", justifyContent: "center", gap: 6, marginTop: 4 },
  usdValue: { color: D.muted, fontSize: 13, fontWeight: "700" },
  usdLabel: { color: D.muted, fontSize: 13 },
  addressRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: D.border,
    borderRadius: 999,
    paddingHorizontal: 8,
    height: 54,
    marginTop: 18,
    backgroundColor: D.card,
  },
  addressRowValid: { borderColor: D.green, backgroundColor: D.greenSoft },
  addressIconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: D.card2, alignItems: "center", justifyContent: "center" },
  addressInput: { flex: 1, color: D.text, fontSize: 13, paddingVertical: 8 },
  addressLabel: { color: D.muted, fontSize: 12, marginRight: 4 },
  quickRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 14 },
  pctChip: { backgroundColor: D.card, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  pctChipMax: { backgroundColor: D.greenSoft },
  pct: { color: D.text, fontSize: 12, fontWeight: "900" },
  balanceRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  balancePill: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  balanceText: { color: D.text, fontSize: 13, fontWeight: "900" },
  balanceLabel: { color: D.muted, fontSize: 11 },
  keypad: { flexDirection: "row", marginTop: 14, gap: 10, flexShrink: 0 },
  opsCol: { width: 58, gap: 10, alignItems: "center" },
  opKey: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: D.card,
    alignItems: "center",
    justifyContent: "center",
  },
  opKeyActive: { backgroundColor: D.green },
  opText: { color: D.text, fontSize: 19, fontWeight: "800" },
  opTextActive: { color: "#FFFFFF" },
  digitsGrid: { flex: 1, gap: 10 },
  digitRow: { flexDirection: "row", justifyContent: "space-between" },
  digitKey: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: D.card,
  },
  backKey: { backgroundColor: D.redSoft },
  digitText: { color: D.text, fontSize: 21, fontWeight: "700" },
  submit: {
    flexDirection: "row-reverse",
    backgroundColor: "#1B2D28",
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  submitActive: { backgroundColor: D.green },
  submitIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  submitText: { color: "#7F938C", fontSize: 16, fontWeight: "900" },
  submitTextActive: { color: "#04100D" },
  pressed: { opacity: 0.6 },
  toast: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 90,
    backgroundColor: "#12352C",
    borderWidth: 1,
    borderColor: D.greenBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    zIndex: 1000,
  },
  toastText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700", flex: 1, textAlign: "right" },
});
