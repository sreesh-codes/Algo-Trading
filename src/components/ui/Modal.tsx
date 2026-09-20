"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { clsx } from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "lg",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={clsx("relative w-full z-10", maxWidthClass)}>
        <GlassPanel variant="gold" hudCorners className="p-6">
          <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-4">
            <div>
              <h3 className="text-lg font-bold font-mono-tech tracking-wide uppercase text-white flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#D4AF37] rounded-xs" />
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-[#94A3B8] font-mono-tech mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
          <div className="max-h-[75vh] overflow-y-auto pr-1">{children}</div>
        </GlassPanel>
      </div>
    </div>
  );
};
