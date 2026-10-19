import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00E5A0",
        tabBarInactiveTintColor: "#8CA6AA",
        tabBarButton: HapticTab,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "800", marginBottom: 2 },
        tabBarStyle: { height: 68 + bottomPadding, paddingTop: 8, paddingBottom: bottomPadding, backgroundColor: "#08161C", borderTopColor: "#1B444A", borderTopWidth: 1.5, elevation: 16, shadowColor: "#00E5A0", shadowOpacity: 0.08, shadowRadius: 16 },
      }}
    >
      <Tabs.Screen name="messages" options={{ title: "المحادثات", tabBarIcon: ({ color }) => <IconSymbol size={22} name="message.fill" color={color} /> }} />
      <Tabs.Screen name="assets" options={{ title: "الأصول", tabBarIcon: ({ color }) => <IconSymbol size={22} name="wallet.fill" color={color} /> }} />
      <Tabs.Screen name="trade" options={{ title: "تجارة", tabBarIcon: ({ color }) => <IconSymbol size={22} name="chart.bar.fill" color={color} /> }} />
      <Tabs.Screen name="predict" options={{ title: "توقع", tabBarIcon: ({ color }) => <IconSymbol size={22} name="sparkles" color={color} /> }} />
      <Tabs.Screen name="index" options={{ title: "الرئيسية", tabBarIcon: ({ color }) => <IconSymbol size={22} name="house.fill" color={color} /> }} />
    </Tabs>
  );
}
