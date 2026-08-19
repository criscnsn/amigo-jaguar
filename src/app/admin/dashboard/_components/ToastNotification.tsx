"use client";

import { ToastMessage } from "../_types/dashboard";

interface ToastNotificationProps {
  toast: ToastMessage | null;
}

/**
 * ToastNotification
 * Banner emergente centrado en la parte superior de la pantalla.
 * Muestra alertas visuales sin interrumpir el flujo con popups del navegador.
 */
export function ToastNotification({ toast }: ToastNotificationProps) {
  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 300,
        padding: "0.875rem 1.75rem",
        borderRadius: "0.625rem",
        fontWeight: 700,
        fontSize: "0.9375rem",
        color: "#ffffff",
        backgroundColor: toast.type === "success" ? "#15803d" : "#dc2626",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25)",
        textAlign: "center",
        minWidth: "280px",
      }}
    >
      {toast.message}
    </div>
  );
}