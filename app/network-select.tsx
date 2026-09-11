import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Line,
  Path,
  Polygon,
  Rect,
  Stop,
} from "react-native-svg";
import { ScreenContainer } from "@/components/screen-container";
import { CWAAX } from "@/constants/cwaax";
import { NETWORKS } from "@/constants/networks";
import { getSelectedNetwork, setSelectedNetwork } from "@/lib/_core/network-store";

/* ------------------------------------------------------------------ */
/*  NetworkIcon — يرسم شعار كل شبكة بالكامل باستخدام react-native-svg */
/* ------------------------------------------------------------------ */

type NetworkIconProps = {
  code: string;
  size?: number;
};

export function NetworkIcon({ code, size = 40 }: NetworkIconProps) {
  const s = size;
  const viewBox = "0 0 40 40";

  switch (code.toUpperCase()) {
    /* ---------------------------------------------------------- */
    /* TRON — TRC20                                                */
    /* ---------------------------------------------------------- */
    case "TRC20":
    case "TRON":
      return (
        <Svg width={s} height={s} viewBox={viewBox}>
          <Defs>
            <LinearGradient id="tronBg" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FF060A" />
              <Stop offset="1" stopColor="#B30000" />
            </LinearGradient>
          </Defs>
          <Circle cx="20" cy="20" r="20" fill="url(#tronBg)" />
          <Path
            d="M29.6 11.4 L11.2 9.6 L18.4 17.4 Z
               M30.4 12.6 L19.6 18.6 L25.2 25.6 Z
               M18.4 18.6 L11.4 11 L10.6 28.4 Z"
            fill="#FFFFFF"
          />
        </Svg>
      );

    /* ---------------------------------------------------------- */
    /* Ethereum — ERC20                                            */
    /* ---------------------------------------------------------- */
    case "ERC20":
    case "ETH":
    case "ETHEREUM":
      return (
        <Svg width={s} height={s} viewBox={viewBox}>
          <Circle cx="20" cy="20" r="20" fill="#627EEA" />
          <G opacity="0.6">
            <Path d="M20 5 L20 16.5 L29 20.7 Z" fill="#FFFFFF" />
            <Path d="M20 5 L11 20.7 L20 16.5 Z" fill="#FFFFFF" />
            <Path d="M20 27.4 L20 35 L29 22.8 Z" fill="#FFFFFF" />
            <Path d="M20 35 L20 27.4 L11 22.8 Z" fill="#FFFFFF" />
          </G>
          <Path d="M20 5 L20 16.5 L29 20.7 Z" fill="#FFFFFF" opacity="0.8" />
          <Path d="M20 5 L11 20.7 L20 16.5 Z" fill="#FFFFFF" opacity="0.95" />
          <Path d="M20 25.7 L20 35 L29 22.8 Z" fill="#FFFFFF" opacity="0.8" />
          <Path d="M20 35 L20 25.7 L11 22.8 Z" fill="#FFFFFF" opacity="0.95" />
          <Path d="M20 18.4 L29 22 L20 25.7 L11 22 Z" fill="#FFFFFF" opacity="0.65" />
        </Svg>
      );

    /* ---------------------------------------------------------- */
    /* Optimism — OP                                               */
    /* ---------------------------------------------------------- */
    case "OPTIMISM":
    case "OP":
      return (
        <Svg width={s} height={s} viewBox={viewBox}>
          <Circle cx="20" cy="20" r="20" fill="#FF0420" />
          <Path
            d="M13.2 25.2 C11.6 25.2 10.3 24.8 9.3 24.0 C8.3 23.2 7.8 22.1 7.8 20.7 C7.8 20.4 7.8 20.0 7.9 19.6 C8.1 18.6 8.4 17.4 8.9 16.0 C10.3 12.4 12.9 10.6 16.6 10.6 C17.8 10.6 18.8 10.8 19.6 11.2 C20.4 11.6 21.0 12.1 21.4 12.8 C21.8 13.5 22.0 14.3 22.0 15.2 C22.0 15.5 22.0 15.8 21.9 16.2 C21.7 17.2 21.4 18.4 20.9 19.8 C19.5 23.4 16.9 25.2 13.2 25.2 Z M13.6 22.4 C15.0 22.4 16.0 21.7 16.7 20.3 C17.2 19.2 17.5 18.2 17.7 17.3 C17.8 16.9 17.8 16.6 17.8 16.3 C17.8 15.1 17.2 14.5 16.0 14.5 C14.6 14.5 13.6 15.2 12.9 16.6 C12.4 17.7 12.1 18.7 11.9 19.6 C11.8 20.0 11.8 20.3 11.8 20.6 C11.8 21.8 12.4 22.4 13.6 22.4 Z"
            fill="#FFFFFF"
          />
          <Path
            d="M23.0 10.8 L27.6 10.8 C29.0 10.8 30.1 11.1 30.9 11.7 C31.7 12.3 32.1 13.2 32.1 14.4 C32.1 14.8 32.1 15.2 32.0 15.6 C31.8 16.7 31.4 17.7 30.7 18.5 C29.6 19.7 28.0 20.3 25.9 20.3 L23.6 20.3 L22.8 25.0 L19.0 25.0 L23.0 10.8 Z M25.4 17.6 C26.2 17.6 26.9 17.4 27.4 17.0 C27.9 16.6 28.2 16.0 28.3 15.3 C28.4 15.0 28.4 14.8 28.4 14.6 C28.4 14.0 28.2 13.6 27.8 13.3 C27.4 13.0 26.8 12.9 26.0 12.9 L24.2 12.9 L23.4 17.6 L25.4 17.6 Z"
            fill="#FFFFFF"
          />
        </Svg>
      );

    /* ---------------------------------------------------------- */
    /* Arbitrum — ARETH                                            */
    /* ---------------------------------------------------------- */
    case "ARETH":
    case "ARBITRUM":
    case "ARB":
      return (
        <Svg width={s} height={s} viewBox={viewBox}>
          <Circle cx="20" cy="20" r="20" fill="#213147" />
          <Path
            d="M20 6 L32 13 L32 27 L20 34 L8 27 L8 13 Z"
            fill="#12AAFF"
            opacity="0.15"
          />
          <Path
            d="M20 8 L30.4 14 L30.4 26 L20 32 L9.6 26 L9.6 14 Z"
            fill="#213147"
            stroke="#12AAFF"
            strokeWidth="1.2"
          />
          <Path
            d="M20 12 L26.5 15.8 L26.5 24.2 L20 28 L13.5 24.2 L13.5 15.8 Z"
            fill="#12AAFF"
          />
          <Path
            d="M20 16 L23.5 18 L23.5 22 L20 24 L16.5 22 L16.5 18 Z"
            fill="#213147"
          />
        </Svg>
      );

    /* ---------------------------------------------------------- */
    /* Avalanche — AVAX                                            */
    /* ---------------------------------------------------------- */
    case "AVAX":
    case "AVALANCHE":
      return (
        <Svg width={s} height={s} viewBox={viewBox}>
          <Circle cx="20" cy="20" r="20" fill="#E84142" />
          <Path
            d="M14.6 26.5 C14.2 26.5 13.8 26.3 13.6 26.0 C13.4 25.7 13.4 25.3 13.6 25.0 L18.8 16.0 C19.0 15.7 19.3 15.5 19.7 15.5 C20.1 15.5 20.4 15.7 20.6 16.0 L23.2 20.5 L23.2 20.5 L25.7 24.9 C25.9 25.2 25.9 25.6 25.7 25.9 C25.5 26.2 25.1 26.4 24.7 26.4 L14.6 26.5 Z"
            fill="#FFFFFF"
          />
          <Path
            d="M23.6 13.5 C24.0 13.5 24.4 13.7 24.6 14.0 L28.1 20.0 C28.3 20.3 28.3 20.7 28.1 21.0 C27.9 21.3 27.5 21.5 27.1 21.5 L22.4 21.5 C22.0 21.5 21.6 21.3 21.4 21.0 L19.0 16.9 C18.8 16.6 18.8 16.2 19.0 15.9 L22.6 14.0 C22.9 13.7 23.3 13.5 23.6 13.5 Z"
            fill="#FFFFFF"
          />
        </Svg>
      );

    /* ---------------------------------------------------------- */
    /* BNB / opBNB / BEP20                                         */
    /* ---------------------------------------------------------- */
    case "OPBNB":
    case "BEP20":
    case "BNB":
      return (
        <Svg width={s} height={s} viewBox={viewBox}>
          <Circle cx="20" cy="20" r="20" fill="#F3BA2F" />
          <G fill="#FFFFFF">
            <Path d="M15.6 20 L20 15.6 L24.4 20 L26.6 17.8 L20 11.2 L13.4 17.8 Z" />
            <Path d="M20 24.4 L15.6 20 L13.4 22.2 L20 28.8 L26.6 22.2 L24.4 20 Z" />
            <Path d="M17.8 20 L20 17.8 L22.2 20 L20 22.2 Z" />
            <Path d="M11.2 20 L13.4 17.8 L15.6 20 L13.4 22.2 Z" />
            <Path d="M24.4 20 L26.6 17.8 L28.8 20 L26.6 22.2 Z" />
          </G>
        </Svg>
      );

    /* ---------------------------------------------------------- */
    /* Solana — SOL                                                */
    /* ---------------------------------------------------------- */
    case "SOL":
    case "SOLANA":
      return (
        <Svg width={s} height={s} viewBox={viewBox}>
          <Defs>
            <LinearGradient id="solBg" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#00FFA3" />
              <Stop offset="1" stopColor="#DC1FFF" />
            </LinearGradient>
          </Defs>
          <Circle cx="20" cy="20" r="20" fill="#000000" />
          <G transform="translate(20 20)">
            <Path
              d="M-9 -6 L6.5 -6 L9 -8.5 L-6.5 -8.5 Z"
              fill="url(#solBg)"
              transform="translate(0 3)"
            />
            <Path
              d="M-9 0 L6.5 0 L9 2.5 L-6.5 2.5 Z"
              fill="url(#solBg)"
              transform="translate(0 0)"
            />
            <Path
              d="M-6.5 6 L9 6 L6.5 8.5 L-9 8.5 Z"
              fill="url(#solBg)"
            />
          </G>
        </Svg>
      );

    /* ---------------------------------------------------------- */
    /* TON                                                         */
    /* ---------------------------------------------------------- */
    case "TON":
      return (
        <Svg width={s} height={s} viewBox={viewBox}>
          <Circle cx="20" cy="20" r="20" fill="#0098EA" />
          <Path
            d="M28.5 12.5 L21.2 25.0 C20.8 25.7 19.8 25.7 19.4 25.0 L11.5 12.5 C11.1 11.8 11.6 11 12.4 11 L27.6 11 C28.4 11 28.9 11.8 28.5 12.5 Z"
            fill="#FFFFFF"
            opacity="0.35"
          />
          <Path
            d="M20 27.5 L11.5 12.5 C11.1 11.8 11.6 11 12.4 11 L27.6 11 C28.4 11 28.9 11.8 28.5 12.5 L20 27.5 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.6"
          />
          <Line x1="20" y1="11" x2="20" y2="27.5" stroke="#FFFFFF" strokeWidth="1.4" />
        </Svg>
      );

    /* ---------------------------------------------------------- */
    /* Polygon — POLYGON                                           */
    /* ---------------------------------------------------------- */
    case "POLYGON":
    case "MATIC":
      return (
        <Svg width={s} height={s} viewBox={viewBox}>
          <Circle cx="20" cy="20" r="20" fill="#8247E5" />
          <G fill="#FFFFFF">
            <Path d="M26.4 16.4 C26.1 16.2 25.7 16.2 25.4 16.4 L22.6 18.0 L20.7 19.1 L17.9 20.7 C17.6 20.9 17.2 20.9 16.9 20.7 L14.7 19.5 C14.4 19.3 14.2 19.0 14.2 18.6 L14.2 16.3 C14.2 15.9 14.4 15.6 14.7 15.4 L16.9 14.2 C17.2 14.0 17.6 14.0 17.9 14.2 L20.1 15.5 C20.4 15.7 20.6 16.0 20.6 16.4 L20.6 18.1 L22.5 16.9 L22.5 15.2 C22.5 14.8 22.3 14.5 22.0 14.3 L17.9 11.9 C17.6 11.7 17.2 11.7 16.9 11.9 L12.7 14.3 C12.4 14.5 12.2 14.8 12.2 15.2 L12.2 20.0 C12.2 20.4 12.4 20.7 12.7 20.9 L16.9 23.3 C17.2 23.5 17.6 23.5 17.9 23.3 L20.7 21.7 L22.6 20.5 L25.4 18.9 C25.7 18.7 26.1 18.7 26.4 18.9 L28.6 20.1 C28.9 20.3 29.1 20.6 29.1 21.0 L29.1 23.3 C29.1 23.7 28.9 24.0 28.6 24.2 L26.4 25.5 C26.1 25.7 25.7 25.7 25.4 25.5 L23.2 24.2 C22.9 24.0 22.7 23.7 22.7 23.3 L22.7 21.6 L20.8 22.8 L20.8 24.5 C20.8 24.9 21.0 25.2 21.3 25.4 L25.4 27.8 C25.7 28.0 26.1 28.0 26.4 27.8 L30.6 25.4 C30.9 25.2 31.1 24.9 31.1 24.5 L31.1 19.7 C31.1 19.3 30.9 19.0 30.6 18.8 L26.4 16.4 Z" />
          </G>
        </Svg>
      );

    /* ---------------------------------------------------------- */
    /* Celo — CELO                                                 */
    /* ---------------------------------------------------------- */
    case "CELO":
      return (
        <Svg width={s} height={s} viewBox={viewBox}>
          <Circle cx="20" cy="20" r="20" fill="#FBCC5C" />
          <Circle cx="20" cy="20" r="11" fill="none" stroke="#35D07F" strokeWidth="2.4" />
          <Circle cx="20" cy="20" r="4" fill="#35D07F" />
          <Circle cx="20" cy="13" r="2.4" fill="#FBCC5C" stroke="#35D07F" strokeWidth="1.4" />
          <Circle cx="27" cy="20" r="2.4" fill="#FBCC5C" stroke="#35D07F" strokeWidth="1.4" />
          <Circle cx="20" cy="27" r="2.4" fill="#FBCC5C" stroke="#35D07F" strokeWidth="1.4" />
          <Circle cx="13" cy="20" r="2.4" fill="#FBCC5C" stroke="#35D07F" strokeWidth="1.4" />
        </Svg>
      );

    /* ---------------------------------------------------------- */
    /* Default fallback                                            */
    /* ---------------------------------------------------------- */
    default:
      return (
        <Svg width={s} height={s} viewBox={viewBox}>
          <Circle cx="20" cy="20" r="20" fill="#94A3B8" />
          <Path
            d="M20 12 L27 20 L20 28 L13 20 Z"
            fill="#FFFFFF"
            opacity="0.85"
          />
        </Svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Screen                                                             */
/* ------------------------------------------------------------------ */

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
