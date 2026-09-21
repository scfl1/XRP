/**
 * بطاقة التأكيد معطّلة مؤقتاً للتشخيص.
 * notify / confirmAsync يعملان بدون ConfirmModal / AlertHost.
 */

import { Platform, Alert } from "react-native";

export function notify(title: string, message?: string, onDismiss?: () => void) {
  const text = message ? `\( {title}\n\n \){message}` : title;

  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.alert(text);
    onDismiss?.();
    return;
  }

  Alert.alert(title, message, [{ text: "حسناً", onPress: () => onDismiss?.() }]);
}

export function confirmAsync(
  title: string,
  message?: string,
  _confirmLabel = "تأكيد",
): Promise<boolean> {
  const text = message ? `\( {title}\n\n \){message}` : title;

  if (Platform.OS === "web" && typeof window !== "undefined") {
    return Promise.resolve(window.confirm(text));
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: "إلغاء", style: "cancel", onPress: () => resolve(false) },
      { text: "تأكيد", onPress: () => resolve(true) },
    ]);
  });
}
