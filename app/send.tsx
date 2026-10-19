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
import { CWAAX } from "@/constants/cwaax";
import { getNetwork } from "@/constants/networks";
import { confirmAsync } from "@/lib/_core/native-alert";
import { getSelectedNetwork, subscribeNetwork } from "@/lib/_core/network-store";
import { consumePendingScan } from "@/lib/_core/qr-store";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";

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
    <ScreenContainer className="px-5" edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/network-select")}
          style={[styles.networkPill, webCursor]}
          activeOpacity={0.7}
        >
          <MaterialIcons name="unfold-more" size={15} color={CWAAX.muted} />
          <View>
            <Text style={styles.networkLabel}>الشبكة/السلسلة</Text>
            <Text style={styles.networkValue}>{network.name}</Text>
          </View>
          <View style={styles.networkAvatar}>
            <NetworkIcon network={network} size={18} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={[styles.backBtn, webCursor]} activeOpacity={0.7}>
          <MaterialIcons name="chevron-left" size={22} color={CWAAX.ink} />
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
            <MaterialIcons name="qr-code-scanner" size={17} color={CWAAX.ink} />
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
            <MaterialIcons name="content-paste" size={17} color={CWAAX.ink} />
          </TouchableOpacity>
          <TextInput
            style={styles.addressInput}
            value={address}
            onChangeText={setAddress}
            placeholder="عنوان المحفظة"
            placeholderTextColor="#9CA8A1"
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
            <Text style={[styles.pct, { color: CWAAX.green }]}>MAX</Text>
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
                    <MaterialIcons name="backspace" size={17} color={CWAAX.red} />
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
        <Text style={styles.submitText}>
          {createWithdrawal.isPending ? "جاري الإرسال..." : "إرسال"}
        </Text>
        <View style={styles.submitIcon}>
          <MaterialIcons name="arrow-back" size={16} color={canSend ? CWAAX.green : CWAAX.muted} />
        </View>
      </TouchableOpacity>

      {toast ? (
        <View style={styles.toast} pointerEvents="none">
          <MaterialIcons name="info-outline" size={18} color={CWAAX.white} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: CWAAX.surface,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  networkAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: CWAAX.white, alignItems: "center", justifyContent: "center" },
  networkLabel: { color: CWAAX.muted, fontSize: 9, textAlign: "right" },
  networkValue: { color: CWAAX.ink, fontSize: 13, fontWeight: "900", textAlign: "right" },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: CWAAX.surface, alignItems: "center", justifyContent: "center" },
  content: { paddingBottom: 8 },
  currencyRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
  },
  currencyText: { color: CWAAX.ink, fontSize: 17, fontWeight: "900" },
  sendLabel: { color: CWAAX.muted, fontSize: 15 },
  amount: { color: "#B9C2BD", fontSize: 48, fontWeight: "800", textAlign: "center", marginTop: 10 },
  amountActive: { color: CWAAX.ink },
  usdRow: { flexDirection: "row-reverse", justifyContent: "center", gap: 6, marginTop: 4 },
  usdValue: { color: CWAAX.muted, fontSize: 13, fontWeight: "700" },
  usdLabel: { color: CWAAX.muted, fontSize: 13 },
  addressRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: CWAAX.line,
    borderRadius: 999,
    paddingHorizontal: 8,
    height: 54,
    marginTop: 18,
    backgroundColor: CWAAX.surface,
  },
  addressRowValid: { borderColor: CWAAX.green, backgroundColor: CWAAX.greenSoft },
  addressIconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: CWAAX.white, alignItems: "center", justifyContent: "center" },
  addressInput: { flex: 1, color: CWAAX.ink, fontSize: 13, paddingVertical: 8 },
  addressLabel: { color: CWAAX.muted, fontSize: 12, marginRight: 4 },
  quickRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 14 },
  pctChip: { backgroundColor: CWAAX.surface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  pctChipMax: { backgroundColor: CWAAX.greenSoft },
  pct: { color: CWAAX.ink, fontSize: 12, fontWeight: "900" },
  balanceRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  balancePill: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  balanceText: { color: CWAAX.ink, fontSize: 13, fontWeight: "900" },
  balanceLabel: { color: CWAAX.muted, fontSize: 11 },
  keypad: { flexDirection: "row", marginTop: 14, gap: 10, flexShrink: 0 },
  opsCol: { width: 58, gap: 10, alignItems: "center" },
  opKey: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: CWAAX.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  opKeyActive: { backgroundColor: CWAAX.green },
  opText: { color: CWAAX.ink, fontSize: 19, fontWeight: "800" },
  opTextActive: { color: CWAAX.white },
  digitsGrid: { flex: 1, gap: 10 },
  digitRow: { flexDirection: "row", justifyContent: "space-between" },
  digitKey: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CWAAX.surface,
  },
  backKey: { backgroundColor: "#FDECEB" },
  digitText: { color: CWAAX.ink, fontSize: 21, fontWeight: "700" },
  submit: {
    flexDirection: "row-reverse",
    backgroundColor: "#CBD5CF",
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  submitActive: { backgroundColor: CWAAX.green },
  submitIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: CWAAX.white, alignItems: "center", justifyContent: "center" },
  submitText: { color: CWAAX.white, fontSize: 15, fontWeight: "900" },
  pressed: { opacity: 0.6 },
  toast: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 90,
    backgroundColor: "#1A2B24",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    zIndex: 1000,
  },
  toastText: { color: CWAAX.white, fontSize: 13, fontWeight: "700", flex: 1, textAlign: "right" },
});
