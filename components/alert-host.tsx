import { useEffect, useState } from "react";
import { ConfirmModal } from "@/components/cwaax-ui";
import { getCurrentAlert, resolveCurrentAlert, subscribeAlert } from "@/lib/_core/alert-store";

export function AlertHost() {
  const [, tick] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") window.alert("[تشخيص] AlertHost اشترك بالاستماع");
    return subscribeAlert(() => {
      if (typeof window !== "undefined") window.alert("[تشخيص] AlertHost استلم إشعار جديد");
      tick((n) => n + 1);
    });
  }, []);

  const current = getCurrentAlert();

  if (typeof window !== "undefined") {
    console.log("[تشخيص] AlertHost render، current:", current);
  }

  if (!current) return null;

  if (typeof window !== "undefined") window.alert("[تشخيص] AlertHost رح يعرض نافذة: " + current.title);

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
