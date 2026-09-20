"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { clsx } from "clsx";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: "md" | "lg" | "xl";
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = "lg",
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

  const widthClass = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }[width];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className={clsx("relative w-full h-full z-10", widthClass)}>
        <GlassPanel
          variant="solid"
          className="h-full rounded-none border-l border-white/10 p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold font-mono-tech tracking-wide uppercase text-white flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-[#00F0FF] rounded-xs" />
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
                className="p-1.5 rounded text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-120px)] pr-1">
              {children}
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
