"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2, X, Lock } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

export type ActionSeverity = "destructive" | "warning" | "success" | "info";

export interface AdminConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  actionLabel: string;
  severity?: ActionSeverity;
  description: string;
  consequences: string[];
  requireTypingPhrase?: string; // e.g. "CONFIRM" or "END ROUND"
  requireAcknowledgmentCheckbox?: boolean;
  isLoading?: boolean;
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  actionLabel,
  severity = "warning",
  description,
  consequences,
  requireTypingPhrase,
  requireAcknowledgmentCheckbox = false,
  isLoading = false,
}) => {
  const [typedPhrase, setTypedPhrase] = useState("");
  const [acknowledged, setAcknowledged] = useState(!requireAcknowledgmentCheckbox);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Synchronize state when modal is opened
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setTypedPhrase("");
      setAcknowledged(!requireAcknowledgmentCheckbox);
    }
  }

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const phraseMatches = requireTypingPhrase
    ? typedPhrase.trim().toUpperCase() === requireTypingPhrase.trim().toUpperCase()
    : true;

  const canExecute = phraseMatches && (requireAcknowledgmentCheckbox ? acknowledged : true) && !isLoading;

  const severityConfig = {
    destructive: {
      border: "border-[#EF4444]",
      glow: "shadow-[0_0_30px_rgba(239,68,68,0.25)]",
      badgeBg: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40",
      icon: ShieldAlert,
      iconColor: "text-[#EF4444]",
      buttonVariant: "danger" as const,
      accentText: "text-[#EF4444]",
    },
    warning: {
      border: "border-[#D4AF37]",
      glow: "shadow-[0_0_30px_rgba(212,175,55,0.25)]",
      badgeBg: "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40",
      icon: AlertTriangle,
      iconColor: "text-[#D4AF37]",
      buttonVariant: "primary" as const,
      accentText: "text-[#D4AF37]",
    },
    success: {
      border: "border-[#05CD99]",
      glow: "shadow-[0_0_30px_rgba(5,205,153,0.25)]",
      badgeBg: "bg-[#05CD99]/15 text-[#05CD99] border-[#05CD99]/40",
      icon: CheckCircle2,
      iconColor: "text-[#05CD99]",
      buttonVariant: "success" as const,
      accentText: "text-[#05CD99]",
    },
    info: {
      border: "border-[#00F0FF]",
      glow: "shadow-[0_0_30px_rgba(0,240,255,0.25)]",
      badgeBg: "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40",
      icon: Lock,
      iconColor: "text-[#00F0FF]",
      buttonVariant: "secondary" as const,
      accentText: "text-[#00F0FF]",
    },
  }[severity];

  const Icon = severityConfig.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="flex min-h-full items-center justify-center p-4 py-12">
        <div
          className="fixed inset-0"
          onClick={() => {
            if (!isLoading) onClose();
          }}
          aria-hidden="true"
        />

        <div className={clsx("relative w-full max-w-lg z-10 transition-all")}>
          <GlassPanel
            variant="solid"
            hudCorners
            className={clsx(
              "p-6 border bg-[#0A0E1A] space-y-5",
              severityConfig.border,
              severityConfig.glow
            )}
          >
          {/* Top Bar with Icon and Title */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-start gap-3">
              <div
                className={clsx(
                  "p-2.5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5",
                  severityConfig.badgeBg
                )}
              >
                <Icon size={22} className={severityConfig.iconColor} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={clsx(
                      "text-[10px] font-mono-tech px-2 py-0.5 rounded border uppercase tracking-wider",
                      severityConfig.badgeBg
                    )}
                  >
                    CONFIRMATION SAFEGUARD
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono-tech">
                    EXCHANGE ROOT ACTION
                  </span>
                </div>
                <h3 className="text-lg font-bold font-mono-tech tracking-wide text-white uppercase">
                  {title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1 rounded text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Core Description */}
          <div className="space-y-3">
            <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
              {description}
            </p>

            {/* Impact Consequences List */}
            {consequences.length > 0 && (
              <div className="p-3.5 rounded-lg bg-black/50 border border-white/8 space-y-2">
                <span className="text-[10px] font-mono-tech uppercase font-bold text-[#94A3B8] tracking-wider block">
                  System Impact Assessment:
                </span>
                <ul className="space-y-1.5">
                  {consequences.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs font-mono-tech text-[#CBD5E1] flex items-start gap-2"
                    >
                      <span className={clsx("shrink-0 mt-0.5", severityConfig.accentText)}>
                        ▸
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Verification Guard: Type confirmation phrase */}
          {requireTypingPhrase && (
            <div className="space-y-2 p-3 rounded-lg bg-black/40 border border-white/10">
              <label className="block text-xs font-mono-tech text-[#94A3B8]">
                Type{" "}
                <span className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded font-mono">
                  {requireTypingPhrase}
                </span>{" "}
                to unlock confirmation:
              </label>
              <input
                type="text"
                value={typedPhrase}
                onChange={(e) => setTypedPhrase(e.target.value)}
                placeholder={`Type "${requireTypingPhrase}" here...`}
                disabled={isLoading}
                className="w-full px-3 py-2 rounded bg-[#070A12] border border-white/20 text-white font-mono text-sm placeholder:text-[#64748B] focus:outline-none focus:border-[#D4AF37] transition-all"
                autoFocus
              />
            </div>
          )}

          {/* Verification Guard: Explicit Acknowledgment Checkbox */}
          {requireAcknowledgmentCheckbox && (
            <label className="flex items-start gap-2.5 text-xs text-[#94A3B8] font-sans cursor-pointer select-none p-2 rounded hover:bg-white/5 transition-colors">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                disabled={isLoading}
                className="mt-0.5 rounded border-white/20 bg-black/40 text-[#D4AF37] focus:ring-0 cursor-pointer"
              />
              <span>
                I acknowledge the operational risks and confirm this instruction should be broadcast to all matching engine partitions.
              </span>
            </label>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs font-mono-tech uppercase"
            >
              Cancel (ESC)
            </Button>

            <Button
              variant={severityConfig.buttonVariant}
              onClick={onConfirm}
              disabled={!canExecute}
              className="text-xs font-mono-tech uppercase min-w-[130px]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Broadcasting...
                </span>
              ) : (
                actionLabel
              )}
            </Button>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
