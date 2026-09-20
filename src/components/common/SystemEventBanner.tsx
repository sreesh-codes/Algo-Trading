"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, ShieldAlert, Radio, X, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export type SystemEventSeverity = "NORMAL" | "ALERT" | "CRITICAL";

export interface SystemEventData {
  id: string;
  severity: SystemEventSeverity;
  headline: string;
  subtext: string;
  district: string;
  timestamp: string;
  linkHref?: string;
}

const INITIAL_EVENTS: SystemEventData[] = [
  {
    id: "evt-01",
    severity: "ALERT",
    headline: "MARKET ADVISORY: MBR SOLAR SECTOR 7 THERMAL VARIANCE",
    subtext: "Baseload supply fluctuating -6.2%. Automated cross-hedging bots should monitor SOL-MWH spread buffers.",
    district: "DEWA Solar Park",
    timestamp: "14:32 GST",
  },
];

export const SystemEventBanner: React.FC = () => {
  const pathname = usePathname();
  const [currentEvent, setCurrentEvent] = useState<SystemEventData | null>(INITIAL_EVENTS[0]);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Listen to dynamic window events (e.g. from Admin shock triggers or Intelligence bulletins)
  useEffect(() => {
    if (pathname === "/") return;
    const handleEventBroadcast = (e: Event) => {
      const customEvent = e as CustomEvent<SystemEventData>;
      if (customEvent.detail) {
        setCurrentEvent(customEvent.detail);
        setIsDismissed(false);
      }
    };

    window.addEventListener("system-event-broadcast", handleEventBroadcast);
    return () => window.removeEventListener("system-event-broadcast", handleEventBroadcast);
  }, [pathname]);

  if (pathname === "/" || !currentEvent || isDismissed || currentEvent.severity === "NORMAL") {
    return null;
  }

  const isCritical = currentEvent.severity === "CRITICAL";

  return (
    <aside
      role="region"
      aria-label="System Market Advisory Banner"
      className={clsx(
        "w-full px-4 py-2 border-b text-xs font-mono-tech transition-all duration-300 relative z-50 flex items-center justify-between gap-3 select-none backdrop-blur-md",
        isCritical
          ? "bg-[#16080A]/95 border-[#EF4444]/40 text-white shadow-[0_4px_20px_rgba(239,68,68,0.15)]"
          : "bg-[#140F06]/95 border-[#D4AF37]/35 text-[#CBD5E1] shadow-[0_4px_20px_rgba(212,175,55,0.08)]"
      )}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Pulsing indicator tag */}
        <div
          className={clsx(
            "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0 flex items-center gap-1.5 border",
            isCritical
              ? "bg-[#EF4444]/20 border-[#EF4444]/60 text-[#EF4444]"
              : "bg-[#D4AF37]/20 border-[#D4AF37]/60 text-[#D4AF37]"
          )}
        >
          <span
            className={clsx(
              "w-1.5 h-1.5 rounded-full animate-ping",
              isCritical ? "bg-[#EF4444]" : "bg-[#D4AF37]"
            )}
          />
          <span>{currentEvent.severity}</span>
        </div>

        {/* Headline and details */}
        <div className="flex items-center gap-2 truncate text-xs">
          <span className="font-bold text-white uppercase tracking-tight shrink-0">
            {currentEvent.headline}
          </span>
          <span className="text-[#64748B] hidden md:inline">|</span>
          <span className="text-[11px] text-[#94A3B8] truncate hidden sm:inline font-sans">
            {currentEvent.subtext}
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {currentEvent.linkHref && (
          <Link
            href={currentEvent.linkHref}
            className={clsx(
              "text-[10px] uppercase font-bold flex items-center gap-1 transition-colors px-2 py-0.5 rounded border",
              isCritical
                ? "border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/15"
                : "border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/15"
            )}
          >
            <span>INTELLIGENCE</span>
            <ChevronRight size={11} />
          </Link>
        )}

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Dismiss advisory"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
};
