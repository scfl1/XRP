import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScreenContainer } from "@/components/screen-container";
import { Card, CoinMark, CwaLogo, IconButton, SectionTitle } from "@/components/cwaax-ui";
import { CWAAX, TRADE_PLANS } from "@/constants/cwaax";
import { notify, confirmAsync } from "@/lib/_core/native-alert";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";

const DAY_MS = 24 * 60 * 60 * 1000;

export default function TradeScreen() {
  const { user } = useAuth();
  const balances = trpc.wallet.balances.useQuery(undefined, { enabled: !!user, staleTime: 15_000 });
  const contracts = trpc.trade.contracts.useQuery(undefined, { enabled: !!user, staleTime: 10_000 });
  const startContract = trpc.trade.startContract.useMutation({
    onSuccess: async () => {
      await Promise.all([balances.refetch(), contracts.refetch()]);
    },
  });
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!contracts.data?.length) return;
    const hasDue = contracts.data.some((contract: any) => contract.status === "active" && new Date(contract.nextPayoutAt).getTime() <= now);
    if (hasDue) void contracts.refetch();
  }, [now, contracts.data, contracts.refetch]);

  const activeAmounts = useMemo(() => new Set(
    (contracts.data || [])
      .filter((contract: any) => contract.status === "active")
      .map((contract: any) => Number(contract.principal))
  ), [contracts.data]);
  const usdtBalance = useMemo(() => Number((balances.data || []).find((b: any) => b.currency === "USDT")?.amount || 0), [balances.data]);

  const start = async (amount: number) => {
    if (!user) {
      notify("تسجيل الدخول مطلوب", "سجّل الدخول أولاً لبدء العقد.");
      return;
    }
    if (usdtBalance < amount) {
      notify("الرصيد غير كافٍ", `رصيدك المتاح ${usdtBalance.toFixed(2)} USDT.`);
      return;
    }
    const confirmed = await confirmAsync("تأكيد بدء العقد", `سيتم خصم ${amount.toFixed(2)} USDT من رصيدك وبدء العقد. هل تريد المتابعة؟`, "تأكيد");
    if (!confirmed) return;
    setSelectedAmount(amount);
    try {
      await startContract.mutateAsync({ amount });
      notify("تم بدء العقد", `تم حجز ${amount.toFixed(2)} USDT، وأُضيف ربحك الفوري مباشرة لرصيدك.`);
    } catch (error: any) {
      notify("تعذر بدء العقد", error?.message || "حدث خطأ، حاول مرة أخرى.");
    } finally {
      setSelectedAmount(null);
    }
  };

  return <ScreenContainer className="px-5" edges={["top", "left", "right"]}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.header}><CwaLogo/><IconButton icon="tune" label="إعدادات التداول" onPress={() => notify("عقود التداول", "اختر مبلغ العقد من البطاقات أدناه.")} /></View>
      <View style={styles.titleRow}><View style={styles.live}><View style={styles.liveDot}/><Text style={styles.liveText}>عقود متاحة</Text></View><View><Text style={styles.kicker}>استثمر من رصيدك</Text><Text style={styles.title}>تجارة</Text></View></View>

      <Card style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <View style={styles.usdtIcon}><CoinMark mark="USDT" color="#26A17B" size={48}/></View>
          <View style={styles.balanceText}><Text style={styles.balanceTitle}>رصيد التداول</Text><Text style={styles.balanceSub}>الرصيد الحقيقي في محفظتك</Text></View>
        </View>
        <View style={styles.balanceBottom}><Text style={styles.balanceValue}>{usdtBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })} <Text style={styles.balanceUnit}>USDT</Text></Text><View style={styles.realPill}><MaterialIcons name="verified" size={13} color={CWAAX.green}/><Text style={styles.realPillText}>رصيد مباشر</Text></View></View>
      </Card>

      <SectionTitle title="خطط التداول" action={`${TRADE_PLANS.length} خطة`} />
      <View style={styles.planList}>
        {TRADE_PLANS.map((plan) => {
          const daily = plan.amount * 0.02;
          const existing = (contracts.data || []).find((contract: any) => contract.status === "active" && Number(contract.principal) === plan.amount);
          const busy = selectedAmount === plan.amount && startContract.isPending;
          const remainingMs = existing ? Math.max(0, new Date(existing.nextPayoutAt).getTime() - now) : 0;
          const totalSeconds = Math.floor(remainingMs / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          const countdown = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
          return <Card key={plan.amount} style={styles.planCard}>
            <View style={styles.planHeader}>
              <View style={styles.coinWrap}><CoinMark mark={plan.coin} color="#26A17B" size={42}/></View>
              <View style={styles.planIdentity}><Text style={styles.planAmount}>{plan.amount.toLocaleString("en-US")} USDT</Text><Text style={styles.planType}>عقد تداول USDT</Text></View>
              <View style={styles.rateBadge}><Text style={styles.rateValue}>2%</Text><Text style={styles.rateLabel}>يوميًا</Text></View>
            </View>
            <View style={styles.planStats}>
              <View><Text style={styles.statLabel}>العائد اليومي المحسوب</Text><Text style={styles.statValue}>+{daily.toFixed(2)} USDT</Text></View>
              <View style={styles.locked}><MaterialIcons name="lock-outline" size={16} color={CWAAX.green}/><Text style={styles.lockedText}>مدة العقد 365 يوم</Text></View>
            </View>
            {existing ? (
              <View style={styles.activeContractBox}>
                <View style={styles.activeContractStatus}>
                  <MaterialIcons name="check-circle" size={20} color={CWAAX.green} />
                  <Text style={styles.activeContractText}>العقد مفعل</Text>
                </View>
                <View style={styles.timerBox}>
                  <Text style={styles.timerLabel}>الربح القادم بعد</Text>
                  <Text style={styles.timerValue}>{countdown}</Text>
                </View>
              </View>
            ) : (
              <Pressable disabled={startContract.isPending || activeAmounts.has(plan.amount)} onPress={() => start(plan.amount)} style={({ pressed }) => [styles.contractButton, pressed && styles.pressed, (startContract.isPending || activeAmounts.has(plan.amount)) && styles.disabled]}>
                <Text style={styles.contractButtonText}>{busy ? "جاري بدء العقد..." : "ابدأ العقد"}</Text>
                <MaterialIcons name={busy ? "hourglass-top" : "arrow-back"} size={18} color={CWAAX.white}/>
              </Pressable>
            )}
          </Card>;
        })}
      </View>

      {contracts.data?.length ? <><SectionTitle title="عقودي الحالية" action={`${contracts.data.length} عقد`} /><View style={styles.activeList}>{contracts.data.slice(0, 10).map((contract: any) => { const matchingPlan = TRADE_PLANS.find((p) => p.amount === Number(contract.principal)); return <View key={contract.id} style={styles.activeRow}><CoinMark mark={matchingPlan?.coin || "USDT"} color="#26A17B" size={34}/><View style={styles.activeInfo}><Text style={styles.activeAmount}>{Number(contract.principal).toLocaleString("en-US")} USDT</Text><Text style={styles.activeMeta}>{contract.status === "active" ? "نشط" : "مكتمل"} • {contract.payoutCount} دفعة</Text></View><View style={styles.activeProfit}><Text style={styles.activeProfitValue}>+{Number(contract.totalProfitPaid).toFixed(2)}</Text><Text style={styles.activeProfitLabel}>USDT أرباح</Text></View></View>; })}</View></> : null}
    </ScrollView>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 12, paddingBottom: 35 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 25, marginBottom: 16 },
  kicker: { color: CWAAX.muted, fontSize: 12, textAlign: "right" }, title: { color: CWAAX.ink, fontSize: 28, fontWeight: "900", textAlign: "right", marginTop: 3 },
  live: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: CWAAX.greenSoft, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 6 }, liveDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: CWAAX.green }, liveText: { color: CWAAX.green, fontSize: 10, fontWeight: "800" },
  balanceCard: { backgroundColor: CWAAX.ink, borderColor: CWAAX.ink, marginBottom: 22, padding: 18 }, balanceTop: { flexDirection: "row", alignItems: "center", gap: 12 }, usdtIcon: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#173A2D" }, balanceText: { flex: 1 }, balanceTitle: { color: CWAAX.white, fontSize: 14, fontWeight: "900", textAlign: "right" }, balanceSub: { color: "#93A49C", fontSize: 10, marginTop: 4, textAlign: "right" }, balanceBottom: { marginTop: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, balanceValue: { color: CWAAX.white, fontSize: 27, fontWeight: "900" }, balanceUnit: { color: "#8FDBAD", fontSize: 12 }, realPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#E8F7EF", paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 }, realPillText: { color: CWAAX.green, fontSize: 9, fontWeight: "800" },
  planList: { gap: 12, marginBottom: 26 }, planCard: { padding: 15, borderRadius: 20 }, planHeader: { flexDirection: "row", alignItems: "center", gap: 10 }, coinWrap: { width: 45, height: 45, borderRadius: 15, backgroundColor: "#F0F9F4", alignItems: "center", justifyContent: "center" }, planIdentity: { flex: 1 }, planAmount: { color: CWAAX.ink, fontSize: 16, fontWeight: "900", textAlign: "right" }, planType: { color: CWAAX.muted, fontSize: 10, marginTop: 4, textAlign: "right" }, rateBadge: { backgroundColor: CWAAX.greenSoft, minWidth: 58, paddingHorizontal: 8, paddingVertical: 7, borderRadius: 12, alignItems: "center" }, rateValue: { color: CWAAX.green, fontSize: 16, fontWeight: "900" }, rateLabel: { color: CWAAX.green, fontSize: 8, fontWeight: "800", marginTop: 1 },
  planStats: { marginTop: 14, paddingTop: 13, borderTopWidth: 1, borderTopColor: CWAAX.line, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, statLabel: { color: CWAAX.muted, fontSize: 9, textAlign: "right" }, statValue: { color: CWAAX.green, fontSize: 14, fontWeight: "900", marginTop: 3, textAlign: "right" }, locked: { flexDirection: "row", alignItems: "center", gap: 4 }, lockedText: { color: CWAAX.muted, fontSize: 9 },
  contractButton: { marginTop: 14, height: 48, borderRadius: 14, backgroundColor: CWAAX.green, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 7 },
  activeContractBox: { marginTop: 14, minHeight: 58, borderRadius: 14, backgroundColor: CWAAX.greenSoft, borderWidth: 1, borderColor: "#CBECDD", paddingHorizontal: 12, paddingVertical: 9, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  activeContractStatus: { flexDirection: "row", alignItems: "center", gap: 6 },
  activeContractText: { color: CWAAX.green, fontSize: 12, fontWeight: "900" },
  timerBox: { alignItems: "flex-end" },
  timerLabel: { color: CWAAX.muted, fontSize: 8, fontWeight: "700" },
  timerValue: { color: CWAAX.ink, fontSize: 15, fontWeight: "900", marginTop: 2 }, contractButtonText: { color: CWAAX.white, fontSize: 13, fontWeight: "900" }, disabled: { opacity: 0.65 }, pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  activeList: { borderWidth: 1, borderColor: CWAAX.line, borderRadius: 18, overflow: "hidden" }, activeRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 13, borderBottomWidth: 1, borderBottomColor: CWAAX.line }, activeInfo: { flex: 1 }, activeAmount: { color: CWAAX.ink, fontSize: 12, fontWeight: "900", textAlign: "right" }, activeMeta: { color: CWAAX.muted, fontSize: 9, marginTop: 4, textAlign: "right" }, activeProfit: { alignItems: "flex-end" }, activeProfitValue: { color: CWAAX.green, fontSize: 12, fontWeight: "900" }, activeProfitLabel: { color: CWAAX.muted, fontSize: 8, marginTop: 3 },
});
