import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { CoinMark } from "@/components/cwaax-ui";
import { CWAAX } from "@/constants/cwaax";
import { getNetwork } from "@/constants/networks";
import { notify } from "@/lib/_core/native-alert";
import { getSelectedNetwork, subscribeNetwork } from "@/lib/_core/network-store";
import { consumePendingScan } from "@/lib/_core/qr-store";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";

type PendingOp = { op: "+" | "-" | "×" | "÷"; base: number } | null;

function applyOp(base: number, op: PendingOp["op"], value: number): number {
  if (op === "+") return base + value;
  if (op === "-") return base - value;
  if (op === "×") return base * value;
  return value === 0 ? base : base / value;
}

export default function SendScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [networkCode, setNetworkCode] = useState(getSelectedNetwork());
  const [display, setDisplay] = useState("0");
  const [pending, setPending] = useState<PendingOp>(null);
  const [address, setAddress] = useState("");

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

  const network = getNetwork(networkCode);
  const amount = Number(display) || 0;

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

  const pressOp = (op: PendingOp["op"]) => {
    const current = Number(display) || 0;
    if (pending) {
      const result = applyOp(pending.base, pending.op, current);
      setPending({ op, base: result });
      setDisplay(String(result));
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

  const handleSend = () => {
    const finalAmount = finalizeAmount();

    if (!finalAmount || finalAmount <= 0) {
      notify("تحقق من المبلغ", "أدخل مبلغاً صحيحاً للمتابعة.");
      return;
    }

    if (finalAmount > usdt) {
      notify("الرصيد غير كافٍ", "المبلغ المطلوب أكبر من رصيدك المتاح.");
      return;
    }

    if (network.internal) {
      notify("غير متاح حالياً", "التحويل الداخلي بين حسابات CwaAX قيد التطوير ولم يُفعَّل بعد. اختر شبكة بلوكتشين حقيقية للإرسال.");
      return;
    }

    if (address.trim().length < 20) {
      notify("عنوان غير صالح", "أدخل عنوان محفظة صحيحاً على شبكة " + network.name + ".");
      return;
    }

    createWithdrawal.mutate(
      { currency: "USDT", amount: finalAmount, network: network.code, address: address.trim() },
      {
        onSuccess: () => {
          notify("تم إرسال الطلب", `طلب إرسال ${finalAmount} USDT عبر ${network.name} قيد المراجعة.`, () => router.back());
        },
        onError: (err) => notify("تعذر إرسال الطلب", err.message || "حاول مرة أخرى."),
      },
    );
  };

  const OPS: PendingOp["op"][] = ["+", "-", "×", "÷"];
  const ROWS = [["7", "8", "9"], ["4", "5", "6"], ["1", "2", "3"], [".", "0", "back"]];

  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/network-select")} style={styles.networkPill}>
          <MaterialIcons name="unfold-more" size={16} color={CWAAX.ink} />
          <View>
            <Text style={styles.networkLabel}>الشبكة/السلسلة</Text>
            <Text style={styles.networkValue}>{network.name}</Text>
          </View>
          <View style={[styles.networkDot, { backgroundColor: network.color }]} />
        </Pressable>

        <Pressable onPress={() => router.back()} hitSlop={10}>
          <MaterialIcons name="chevron-left" size={26} color={CWAAX.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.currencyRow}>
          <CoinMark mark="₮" color="#26A17B" size={22} />
          <Text style={styles.currencyText}>USDT</Text>
          <Text style={styles.sendLabel}>إرسال</Text>
        </View>

        <Text style={styles.amount} numberOfLines={1}>{display}</Text>

        <View style={styles.usdRow}>
          <Text style={styles.usdValue}>${amount.toFixed(2)}</Text>
          <Text style={styles.usdLabel}>USD</Text>
        </View>

        <View style={styles.addressRow}>
          <Pressable onPress={() => router.push("/qr-scanner")} hitSlop={8}>
            <MaterialIcons name="qr-code-scanner" size={19} color={CWAAX.muted} />
          </Pressable>
          <Pressable onPress={() => notify("لصق العنوان", "اضغط مطولاً داخل الحقل للصق العنوان من الحافظة.")} hitSlop={8}>
            <MaterialIcons name="content-paste" size={19} color={CWAAX.muted} />
          </Pressable>
          <TextInput
            style={styles.addressInput}
            value={address}
            onChangeText={setAddress}
            placeholder="عنوان المحفظة"
            placeholderTextColor="#9CA8A1"
            textAlign="right"
          />
          <Text style={styles.addressLabel}>إرسال إلى</Text>
        </View>

        <View style={styles.quickRow}>
          <Pressable onPress={() => router.push("/deposit")}>
            <Text style={styles.addFunds}>إضافة أموال</Text>
          </Pressable>
          <View style={{ flex: 1 }} />
          <Pressable onPress={() => setPercent(0.25)}><Text style={styles.pct}>25%</Text></Pressable>
          <Pressable onPress={() => setPercent(0.5)}><Text style={styles.pct}>50%</Text></Pressable>
          <Pressable onPress={() => setPercent(1)}><Text style={[styles.pct, { color: CWAAX.green }]}>MAX</Text></Pressable>
        </View>

        <View style={styles.balanceRow}>
          <View style={styles.balancePill}>
            <CoinMark mark="₮" color="#26A17B" size={16} />
            <Text style={styles.balanceText}>{usdt.toFixed(2)} USDT</Text>
          </View>
          <Text style={styles.balanceLabel}>رصيد المحفظة</Text>
        </View>

        <View style={styles.keypad}>
          <View style={styles.opsCol}>
            {OPS.map((op) => (
              <Pressable
                key={op}
                onPress={() => pressOp(op)}
                style={({ pressed }) => [styles.opKey, pending?.op === op && styles.opKeyActive, pressed && styles.pressed]}
              >
                <Text style={[styles.opText, pending?.op === op && styles.opTextActive]}>{op}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.digitsGrid}>
            {ROWS.map((row, i) => (
              <View key={i} style={styles.digitRow}>
                {row.map((d) =>
                  d === "back" ? (
                    <Pressable key={d} onPress={pressBackspace} style={({ pressed }) => [styles.digitKey, pressed && styles.pressed]}>
                      <MaterialIcons name="backspace" size={18} color={CWAAX.ink} />
                    </Pressable>
                  ) : (
                    <Pressable key={d} onPress={() => pressDigit(d)} style={({ pressed }) => [styles.digitKey, pressed && styles.pressed]}>
                      <Text style={styles.digitText}>{d}</Text>
                    </Pressable>
                  ),
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Pressable onPress={handleSend} disabled={createWithdrawal.isPending} style={({ pressed }) => [styles.submit, (pressed || createWithdrawal.isPending) && styles.pressed]}>
        <Text style={styles.submitText}>{createWithdrawal.isPending ? "جاري الإرسال..." : "إرسال"}</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", paddingTop: 12, marginBottom: 10 },
  networkPill: { flexDirection: "row-reverse", alignItems: "center", gap: 8, backgroundColor: CWAAX.surface, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 },
  networkLabel: { color: CWAAX.muted, fontSize: 9, textAlign: "right" },
  networkValue: { color: CWAAX.ink, fontSize: 13, fontWeight: "900", textAlign: "right" },
  networkDot: { width: 18, height: 18, borderRadius: 9 },
  content: { paddingBottom: 20 },
  currencyRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 14 },
  currencyText: { color: CWAAX.ink, fontSize: 17, fontWeight: "900" },
  sendLabel: { color: CWAAX.muted, fontSize: 15 },
  amount: { color: "#B9C2BD", fontSize: 52, fontWeight: "800", textAlign: "center", marginTop: 14 },
  usdRow: { flexDirection: "row-reverse", justifyContent: "center", gap: 6, marginTop: 6 },
  usdValue: { color: CWAAX.muted, fontSize: 13, fontWeight: "700" },
  usdLabel: { color: CWAAX.muted, fontSize: 13 },
  addressRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10, borderWidth: 1, borderColor: CWAAX.line, borderRadius: 16, paddingHorizontal: 14, height: 56, marginTop: 26 },
  addressInput: { flex: 1, color: CWAAX.ink, fontSize: 13 },
  addressLabel: { color: CWAAX.muted, fontSize: 12 },
  quickRow: { flexDirection: "row-reverse", alignItems: "center", gap: 16, marginTop: 20 },
  addFunds: { color: CWAAX.ink, fontSize: 11, fontWeight: "800" },
  pct: { color: CWAAX.ink, fontSize: 12, fontWeight: "900" },
  balanceRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
  balancePill: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  balanceText: { color: CWAAX.ink, fontSize: 13, fontWeight: "900" },
  balanceLabel: { color: CWAAX.muted, fontSize: 11 },
  keypad: { flexDirection: "row", marginTop: 18, gap: 8 },
  opsCol: { width: 66, gap: 8 },
  opKey: { flex: 1, backgroundColor: CWAAX.surface, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  opKeyActive: { backgroundColor: CWAAX.green },
  opText: { color: CWAAX.ink, fontSize: 20, fontWeight: "800" },
  opTextActive: { color: CWAAX.white },
  digitsGrid: { flex: 1, gap: 8 },
  digitRow: { flexDirection: "row", gap: 8 },
  digitKey: { flex: 1, height: 58, alignItems: "center", justifyContent: "center", borderRadius: 12 },
  digitText: { color: CWAAX.ink, fontSize: 24, fontWeight: "700" },
  submit: { backgroundColor: "#CBD5CF", height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center", marginTop: 14, marginBottom: 8 },
  submitText: { color: CWAAX.white, fontSize: 15, fontWeight: "900" },
  pressed: { opacity: 0.6 },
});
