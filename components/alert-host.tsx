import React, { useEffect, useState } from "react";
import {
  getCurrentAlert,
  subscribeAlert,
  closeAlert,
} from "./alert-service";

export default function AlertHost() {
  const [, tick] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeAlert(() => {
      tick((n) => n + 1);
    });

    return unsubscribe;
  }, []);

  const current = getCurrentAlert();

  if (!current) return null;

  const {
    title,
    message,
    type = "info",
    confirmText = "تأكيد",
    cancelText = "إلغاء",
    onConfirm,
    onCancel,
  } = current;

  const handleConfirm = () => {
    closeAlert();
    if (onConfirm) onConfirm();
  };

  const handleCancel = () => {
    closeAlert();
    if (onCancel) onCancel();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 18,
          padding: 24,
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>
          {title}
        </h3>

        <p style={{ marginBottom: 24 }}>
          {message}
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
          }}
        >
          {onCancel && (
            <button
              onClick={handleCancel}
              style={{
                padding: "12px 20px",
                borderRadius: 10,
                border: "1px solid #ccc",
                background: "#eee",
                cursor: "pointer",
              }}
            >
              {cancelText}
            </button>
          )}

          <button
            onClick={handleConfirm}
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              border: "none",
              background:
                type === "error"
                  ? "#d9534f"
                  : "#1677ff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
