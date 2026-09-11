import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { ScreenContainer } from "@/components/screen-container";
import { CWAAX } from "@/constants/cwaax";
import { NETWORKS } from "@/constants/networks";
import { getSelectedNetwork, setSelectedNetwork } from "@/lib/_core/network-store";

/* ================================================================== */
/*  NetworkIcon — شعارات الشبكات الرسمية (Simple Icons / CC0)          */
/*  كل الشعارات مرسومة 100% بالكود عبر react-native-svg                */
/* ================================================================== */

type NetworkIconProps = { code: string; size?: number };

export function NetworkIcon({ code, size = 40 }: NetworkIconProps) {
  const s = size;
  const vb = "0 0 24 24";

  switch ((code || "").toUpperCase()) {
    /* ---------------- TRON / TRC20 ---------------- */
    case "TRC20":
    case "TRON":
      return (
        <Svg width={s} height={s} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#EF0027" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="#FFFFFF"
              d="M3.256 3.225c3.52.41 11.532 1.35 17.49 2.043-3.075 3.316-8.745 9.4-11.343 12.19-2.032-3.24-4.236-10.428-6.147-14.233zm.66 2.636a131.294 131.294 0 0 0 4.116 9.786c1.916-2.06 6.375-6.848 8.402-9.032-2.98-.35-9.289-1.087-12.518-1.454zm3.357 2.196a10.14 10.14 0 0 1 2.573-.296c.868.02 1.7.31 2.353.813.457.36.766.85.917 1.404.15.553.14 1.14-.03 1.686a2.29 2.29 0 0 1-1.044 1.288 3.24 3.24 0 0 1-1.786.42c-.605-.016-1.198-.157-1.74-.414a3.05 3.05 0 0 1-1.222-1.09 2.79 2.79 0 0 1-.45-1.62c.02-.62.234-1.222.61-1.71.372-.486.9-.84 1.5-1.001.347-.1.71-.149 1.075-.148zm.245.834a2.14 2.14 0 0 0-1.364.55c-.31.288-.51.68-.57 1.104a1.98 1.98 0 0 0 .298 1.24c.243.373.6.66 1.017.82.418.16.88.184 1.315.068.435-.115.82-.374 1.096-.736.276-.36.42-.803.41-1.256a1.87 1.87 0 0 0-.33-1.005c-.19-.295-.46-.535-.782-.694a2.4 2.4 0 0 0-1.09-.09z"
            />
          </G>
        </Svg>
      );

    /* ---------------- Ethereum / ERC20 ---------------- */
    case "ERC20":
    case "ETH":
    case "ETHEREUM":
      return (
        <Svg width={s} height={s} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#627EEA" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path fill="#FFFFFF" fillOpacity="0.602" d="M11.998 3v6.652l5.623 2.512z" />
            <Path fill="#FFFFFF" d="M11.998 3 6.375 12.164l5.623-2.512z" />
            <Path fill="#FFFFFF" fillOpacity="0.602" d="M11.998 16.476v4.52l5.627-7.784z" />
            <Path fill="#FFFFFF" d="M11.998 20.996v-4.52L6.375 13.212z" />
            <Path fill="#FFFFFF" fillOpacity="0.2" d="m11.998 15.429 5.623-3.265-5.623-2.51z" />
            <Path fill="#FFFFFF" fillOpacity="0.602" d="m6.375 12.164 5.623 3.265v-5.775z" />
          </G>
        </Svg>
      );

    /* ---------------- Optimism ---------------- */
    case "OPTIMISM":
    case "OP":
      return (
        <Svg width={s} height={s} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#FF0420" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="#FFFFFF"
              d="M8.14 15.375c-.879 0-1.602-.207-2.168-.62-.566-.42-.85-1.02-.85-1.805 0-.16.02-.355.055-.586.098-.543.238-1.195.42-1.957.508-2.035 1.844-3.05 4.008-3.05.586 0 1.113.098 1.582.293.469.191.84.473 1.113.844.273.367.41.797.41 1.289 0 .152-.02.34-.058.562a9.434 9.434 0 0 1-.418 1.938c-.262.805-.66 1.406-1.195 1.804-.535.395-1.238.594-2.11.594zm.137-1.535c.344 0 .637-.102.88-.305.246-.203.418-.523.515-.96.176-.793.29-1.348.343-1.665a2.16 2.16 0 0 0 .027-.398c0-.555-.289-.832-.867-.832-.344 0-.641.101-.891.305-.246.203-.414.523-.504.96a8.795 8.795 0 0 0-.34 1.665 1.85 1.85 0 0 0-.023.371c0 .57.286.859.86.859zm4.234 1.398a.234.234 0 0 1-.184-.086.256.256 0 0 1-.039-.219l1.387-6.504a.27.27 0 0 1 .101-.176.256.256 0 0 1 .184-.07h2.66c.75 0 1.348.156 1.797.469.453.312.68.762.68 1.348 0 .168-.024.348-.07.539-.129.586-.402 1.055-.82 1.406-.415.348-1.008.52-1.782.52h-1.352l-.453 2.468a.27.27 0 0 1-.102.176.256.256 0 0 1-.184.07h-1.621zm3.281-3.625c.274 0 .512-.078.715-.234.207-.16.34-.387.402-.684.024-.121.035-.234.035-.34 0-.215-.062-.379-.187-.492-.125-.117-.328-.176-.61-.176h-1.21l-.375 1.926h1.23z"
            />
          </G>
        </Svg>
      );

    /* ---------------- Arbitrum ---------------- */
    case "ARETH":
    case "ARBITRUM":
    case "ARB":
      return (
        <Svg width={s} height={s} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#213147" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="#12AAFF"
              d="M9.756 13.717 8.593 16.918a.4.4 0 0 0 .234.512l2.03.585a.4.4 0 0 0 .49-.28l1.203-3.325a.4.4 0 0 0-.234-.51l-2.03-.586a.4.4 0 0 0-.49.28zm4.42-8.486a.4.4 0 0 0-.362 0L6.166 8.85a.4.4 0 0 0-.241.367v7.567a.4.4 0 0 0 .241.367l7.648 3.618a.4.4 0 0 0 .362 0l7.648-3.618a.4.4 0 0 0 .241-.367V9.216a.4.4 0 0 0-.24-.367zM14.34 4.281l7.193 3.401a.4.4 0 0 1 .224.355v7.925a.4.4 0 0 1-.223.355l-7.193 3.401a.4.4 0 0 1-.347 0l-7.194-3.4a.4.4 0 0 1-.223-.356V8.037a.4.4 0 0 1 .223-.355l7.194-3.4a.4.4 0 0 1 .346 0z"
            />
            <Path
              fill="#12AAFF"
              d="m11.532 10.417-2.425 6.706a.4.4 0 0 0 .238.512l1.049.302a.4.4 0 0 0 .494-.28l2.4-6.646a.4.4 0 0 0-.235-.51l-1.03-.34a.4.4 0 0 0-.49.256z"
            />
            <Path
              fill="#9DCCED"
              d="M15.416 8.35c.153 0 .303.006.45.02l-3.867 10.7-3.867-10.7c.147-.014.297-.02.45-.02z"
              opacity="0"
            />
            <Path
              fill="#FFFFFF"
              d="M13.35 8.35c.29 0 .578.043.85.123l-3.2 8.85-3.2-8.85c.272-.08.56-.123.85-.123z"
              opacity="0.9"
            />
          </G>
        </Svg>
      );

    /* ---------------- Avalanche ---------------- */
    case "AVAX":
    case "AVALANCHE":
      return (
        <Svg width={s} height={s} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#E84142" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="#FFFFFF"
              d="M11.34 2.34c-.35-.62-1.23-.62-1.58 0L6.516 8.47c-.28.49.075 1.095.63 1.095h3.28c.233 0 .45-.123.57-.325l1.65-2.86a1.26 1.26 0 0 0 0-1.27zM16.34 8.78c-.35-.62-1.23-.62-1.58 0l-4.87 8.44c-.28.49.075 1.095.63 1.095h9.74c.555 0 .91-.605.63-1.095zM10.62 15.83c.28-.49-.075-1.095-.63-1.095H5.69c-.555 0-.91.605-.63 1.095l2.15 3.72c.35.62 1.23.62 1.58 0z"
            />
          </G>
        </Svg>
      );

    /* ---------------- BNB / opBNB / BEP20 ---------------- */
    case "OPBNB":
    case "BEP20":
    case "BNB":
      return (
        <Svg width={s} height={s} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#F3BA2F" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="#FFFFFF"
              d="M7.3 9.6 9.6 7.3 12 9.6l-2.4 2.4zM4.6 12.3 6.9 10l2.4 2.3-2.4 2.4zM9.6 14.6l2.4-2.3 2.4 2.3-2.4 2.4zM14.7 9.6 17.1 7.3l2.3 2.3-2.3 2.4zM11.7 12.3l2.4-2.3 2.3 2.3-2.3 2.4zM9.6 12.3l2.4-2.3 2.4 2.3-2.4 2.4z"
            />
          </G>
        </Svg>
      );

    /* ---------------- Solana ---------------- */
    case "SOL":
    case "SOLANA":
      return (
        <Svg width={s} height={s} viewBox={vb}>
          <Defs>
            <LinearGradient id="solGrad" x1="0" y1="1" x2="1" y2="0">
              <Stop offset="0" stopColor="#00FFA3" />
              <Stop offset="1" stopColor="#DC1FFF" />
            </LinearGradient>
          </Defs>
          <Circle cx="12" cy="12" r="12" fill="#000000" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="url(#solGrad)"
              d="M17.75 6.65a.43.43 0 0 1 .3-.13h7.34c.22 0 .34.26.18.42l-1.42 1.42a.43.43 0 0 1-.3.13h-7.34a.3.3 0 0 1-.18-.42z"
              transform="translate(-3.3 -1)"
            />
            <Path
              fill="url(#solGrad)"
              d="M17.75 6.65a.43.43 0 0 1 .3-.13h7.34c.22 0 .34.26.18.42l-1.42 1.42a.43.43 0 0 1-.3.13h-7.34a.3.3 0 0 1-.18-.42z"
              transform="translate(-5.6 3.6) scale(0.92)"
            />
            <Path
              fill="url(#solGrad)"
              d="M17.75 6.65a.43.43 0 0 1 .3-.13h7.34c.22 0 .34.26.18.42l-1.42 1.42a.43.43 0 0 1-.3.13h-7.34a.3.3 0 0 1-.18-.42z"
              transform="translate(-5.6 8.2) scale(1.08)"
            />
          </G>
        </Svg>
      );

    /* ---------------- TON ---------------- */
    case "TON":
      return (
        <Svg width={s} height={s} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#0098EA" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="#FFFFFF"
              d="M16.375 4.5H7.625a.75.75 0 0 0-.643 1.135l4.375 7.5a.75.75 0 0 0 1.286 0l4.375-7.5A.75.75 0 0 0 16.375 4.5zM11.25 8.5h1.5v6.55l-1.5-2.57z"
            />
          </G>
        </Svg>
      );

    /* ---------------- Polygon ---------------- */
    case "POLYGON":
    case "MATIC":
      return (
        <Svg width={s} height={s} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#7B3FE4" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="#FFFFFF"
              d="M16.336 9.775a.52.52 0 0 0-.516 0l-2.415 1.406-1.635.947-2.376 1.406a.52.52 0 0 1-.516 0l-1.864-1.11a.52.52 0 0 1-.258-.446v-2.18a.5.5 0 0 1 .258-.445l1.86-1.075a.52.52 0 0 1 .515 0l1.86 1.075a.52.52 0 0 1 .257.445v1.406l1.635-.96V9.4a.5.5 0 0 0-.257-.446L10.6 7.376a.52.52 0 0 0-.516 0L6.79 9.4a.5.5 0 0 0-.258.445v4.073a.5.5 0 0 0 .258.445l3.293 1.94a.52.52 0 0 0 .516 0l2.376-1.371 1.635-.96 2.376-1.371a.52.52 0 0 1 .516 0l1.86 1.075a.52.52 0 0 1 .257.445v2.18a.5.5 0 0 1-.258.445l-1.86 1.11a.52.52 0 0 1-.515 0l-1.86-1.075a.52.52 0 0 1-.257-.445v-1.406l-1.635.96v1.406a.5.5 0 0 0 .258.446l3.292 1.94a.52.52 0 0 0 .516 0l3.292-1.94a.5.5 0 0 0 .258-.446V9.775a.5.5 0 0 0-.258-.446l-3.297-1.953z"
            />
          </G>
        </Svg>
      );

    /* ---------------- Celo ---------------- */
    case "CELO":
      return (
        <Svg width={s} height={s} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#FCFF52" />
          <G transform="translate(2.4 2.4) scale(0.8)">
            <Path
              fill="#35D07F"
              d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9zm0 1.8a7.2 7.2 0 1 1 0 14.4A7.2 7.2 0 0 1 12 4.8z"
            />
            <Path
              fill="#FBCC5C"
              d="M12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zm0 1.8a3.7 3.7 0 1 1 0 7.4 3.7 3.7 0 0 1 0-7.4z"
            />
            <Path
              fill="#35D07F"
              d="M12 9.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z"
            />
          </G>
        </Svg>
      );

    /* ---------------- Fallback ---------------- */
    default:
      return (
        <Svg width={s} height={s} viewBox={vb}>
          <Circle cx="12" cy="12" r="12" fill="#94A3B8" />
          <Path
            fill="#FFFFFF"
            d="M12 5 19 12 12 19 5 12z"
            opacity="0.9"
          />
        </Svg>
      );
  }
}

/* ================================================================== */
/*  Screen                                                             */
/* ================================================================== */

export default function NetworkSelectScreen() {
  const router = useRouter();
  const current = getSelectedNetwork();

  const choose = (code: string) => {
    setSelectedNetwork(code);
    router.back();
  };

  return (
    <ScreenContainer className="px-5" edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <MaterialIcons name="close" size={24} color={CWAAX.ink} />
        </Pressable>
        <Text style={styles.title}>تغيير الشبكة/السلسلة</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.warning}>
        <MaterialIcons name="info-outline" size={18} color={CWAAX.muted} />
        <Text style={styles.warningText}>
          تحقق مع المستفيد إذا لم تكن متأكداً. ستُفقد التوكنات المُرسلة على الشبكة الخاطئة.
        </Text>
      </View>

      <View style={styles.colHeader}>
        <Text style={styles.colHeaderText}>رسوم الغاز التقديرية</Text>
        <Text style={styles.colHeaderText}>شبكة</Text>
      </View>

      <FlatList
        data={NETWORKS}
        keyExtractor={(n) => n.code}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => choose(item.code)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={styles.icon}>
              <NetworkIcon code={item.code} size={40} />
            </View>

            <View style={styles.copy}>
              <View style={styles.nameRow}>
                {item.code === current && (
                  <View style={styles.selectedTag}>
                    <Text style={styles.selectedTagText}>محدد</Text>
                  </View>
                )}
                <Text style={styles.name}>{item.name}</Text>
              </View>
              <Text style={styles.chain}>{item.chain}</Text>
            </View>

            <View style={styles.feeCol}>
              <Text style={styles.feeUsd}>
                {item.internal ? "مجاني" : `$${item.feeUsd.toFixed(2)}`}
              </Text>
              {!item.internal && <Text style={styles.feeToken}>{item.feeToken}</Text>}
            </View>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    marginBottom: 20,
  },
  title: { color: CWAAX.ink, fontSize: 17, fontWeight: "900" },
  warning: {
    flexDirection: "row-reverse",
    gap: 8,
    backgroundColor: CWAAX.surface,
    borderRadius: 12,
    padding: 13,
    marginBottom: 22,
  },
  warningText: {
    flex: 1,
    color: CWAAX.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: "right",
  },
  colHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  colHeaderText: { color: CWAAX.muted, fontSize: 10 },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: CWAAX.line,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  copy: { flex: 1 },
  nameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  name: { color: CWAAX.ink, fontSize: 14, fontWeight: "900" },
  selectedTag: {
    backgroundColor: "#E4F7E9",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  selectedTagText: { color: CWAAX.green, fontSize: 9, fontWeight: "800" },
  chain: {
    color: CWAAX.muted,
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  feeCol: { alignItems: "flex-start" },
  feeUsd: { color: CWAAX.ink, fontSize: 13, fontWeight: "800" },
  feeToken: { color: CWAAX.muted, fontSize: 10, marginTop: 4 },
  pressed: { opacity: 0.6 },
});
