"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { clsx } from "clsx";

export interface ToastMessage {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  description?: string;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((t) => {
          const typeStyle = {
            success: "border-[#05CD99]/50 bg-[#0A1616]/95 text-[#05CD99]",
            warning: "border-[#F59E0B]/50 bg-[#16120A]/95 text-[#F59E0B]",
            error: "border-[#EF4444]/50 bg-[#190B0F]/95 text-[#EF4444]",
            info: "border-[#00F0FF]/50 bg-[#09151F]/95 text-[#00F0FF]",
          }[t.type];

          const Icon = {
            success: CheckCircle2,
            warning: AlertTriangle,
            error: AlertTriangle,
            info: Info,
          }[t.type];

          return (
            <div
              key={t.id}
              className={clsx(
                "pointer-events-auto p-3.5 rounded border shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all duration-300 transform translate-y-0",
                typeStyle
              )}
            >
              <Icon size={18} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="text-xs font-bold font-mono-tech tracking-wider uppercase text-white">
                  {t.title}
                </h5>
                {t.description && (
                  <p className="text-[11px] text-[#CBD5E1] font-sans mt-0.5 leading-snug">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-[#64748B] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
