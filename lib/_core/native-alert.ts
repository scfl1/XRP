import { Alert, Platform } from "react-native";

/**
 * React Native's `Alert.alert(title, message, buttons)` does not work on
 * react-native-web: pressing a button silently does nothing, because
 * react-native-web has no real native dialog behind it. Every screen in
 * this app that used `Alert.alert` with a buttons array (logout
 * confirmation, success dialogs with an onPress, etc.) was therefore
 * broken when running as a website. These two helpers behave correctly
 * on both web (window.alert/confirm) and native (Alert.alert).
 */

export function notify(title: string, message?: string, onDismiss?: () => void) {
  if (Platform.OS === "web") {
    window.alert(message ? `${title}\n\n${message}` : title);
    onDismiss?.();
    return;
  }

  Alert.alert(title, message, onDismiss ? [{ text: "حسناً", onPress: onDismiss }] : undefined);
}

export function confirmAsync(title: string, message?: string, confirmLabel = "تأكيد"): Promise<boolean> {
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(message ? `${title}\n\n${message}` : title));
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: "إلغاء", style: "cancel", onPress: () => resolve(false) },
      { text: confirmLabel, style: "destructive", onPress: () => resolve(true) },
    ]);
  });
}
