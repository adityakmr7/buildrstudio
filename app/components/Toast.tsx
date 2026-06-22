"use client";

import { useState, useCallback, createContext, useContext } from "react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, action?: ToastItem["action"]) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success", action?: ToastItem["action"]) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type, action }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const iconMap: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  const bgMap: Record<ToastType, string> = {
    success: "var(--fill)",
    error: "#dc2626",
    info: "var(--surface)",
  };

  const colorMap: Record<ToastType, string> = {
    success: "var(--fill-text)",
    error: "#fff",
    info: "var(--text-1)",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        zIndex: 9999,
        pointerEvents: "none",
        width: "calc(100% - 32px)",
        maxWidth: "420px",
        alignItems: "center",
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            style={{
              background: bgMap[t.type],
              color: colorMap[t.type],
              padding: "12px 20px",
              borderRadius: "var(--r-xl, 20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "var(--font)",
              pointerEvents: "auto",
              cursor: "pointer",
              animation: "toastSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              border: t.type === "info" ? "1px solid var(--border)" : "none",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "15px", fontWeight: 800, flexShrink: 0 }}>{iconMap[t.type]}</span>
            <span style={{ flex: 1 }}>{t.message}</span>
            {t.action && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  t.action!.onClick();
                  dismiss(t.id);
                }}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "var(--r-full, 9999px)",
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "inherit",
                  cursor: "pointer",
                  fontFamily: "var(--font)",
                  whiteSpace: "nowrap",
                }}
              >
                {t.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
