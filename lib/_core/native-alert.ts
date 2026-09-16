import { pushAlert } from "./alert-store";

/**
 * Styled replacements for the browser's window.alert()/window.confirm(),
 * which render as the plain OS/browser "site says" dialog (ugly, and on
 * react-native-web a buttons array silently does nothing). These push
 * into the global alert queue (lib/_core/alert-store.ts) instead, which
 * <AlertHost /> (mounted once in app/_layout.tsx) renders as the app's
 * own styled ConfirmModal card. Same signatures as before, so every
 * existing call site across the app gets the nicer UI automatically.
 */

export function notify(title: string, message?: string, onDismiss?: () => void) {
  pushAlert({ title, message, confirmLabel: "حسناً" }).then(() => onDismiss?.());
}

export function confirmAsync(title: string, message?: string, confirmLabel = "تأكيد"): Promise<boolean> {
  return pushAlert({ title, message, confirmLabel, cancelLabel: "إلغاء" });
}
