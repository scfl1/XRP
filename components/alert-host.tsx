import React, { useEffect, useState } from "react";
import {
  getAlert,
  subscribeAlert,
  closeAlert,
} from "@/lib/alert";

export default function AlertHost() {
  const [, refresh] = useState(0);

  useEffect(() => {
    return subscribeAlert(() => {
      refresh((v) => v + 1);
    });
  }, []);

  const alert = getAlert();

  if (!alert) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 25,
          width: "90%",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <h3>{alert.title}</h3>

        <p>{alert.message}</p>

        <button
          onClick={() => {
            closeAlert();
            alert.onConfirm?.();
          }}
        >
          {alert.confirmText || "تأكيد"}
        </button>

        {alert.onCancel && (
          <button
            onClick={() => {
              closeAlert();
              alert.onCancel?.();
            }}
          >
            {alert.cancelText || "إلغاء"}
          </button>
        )}
      </div>
    </div>
  );
}
