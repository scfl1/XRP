import { useEffect, useState } from "react";
import { ConfirmModal } from "@/components/cwaax-ui";
import { getCurrentAlert, resolveCurrentAlert, subscribeAlert } from "@/lib/_core/alert-store";

/**
 * Mount once near the root (see app/_layout.tsx). Renders the app's
 * styled ConfirmModal for whatever notify()/confirmAsync() call is
 * currently pending, anywhere in the app.
 */
export function AlertHost() {
  const [, tick] = useState(0);

  useEffect(() => subscribeAlert(() => tick((n) => n + 1)), []);

  const current = getCurrentAlert();
  if (!current) return null;

  return (
    <ConfirmModal
      visible
      title={current.title}
      message={current.message}
      confirmLabel={current.confirmLabel}
      danger={current.danger}
      onConfirm={() => resolveCurrentAlert(true)}
      onCancel={current.cancelLabel ? () => resolveCurrentAlert(false) : undefined}
    />
  );
}
