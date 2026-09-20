"use client";

import React from "react";
import {
  IntelligenceEvent,
  EventSeverity,
  DistrictName,
} from "@/services/api/intelligence";
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Eye,
  Radio,
  Zap,
  Clock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

interface VerticalTimelineProps {
  events: IntelligenceEvent[];
  onSelectEvent: (event: IntelligenceEvent) => void;
}

const SEVERITY_CONFIG: Record<
  EventSeverity,
  {
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    nodeColor: string;
    glowClass: string;
    icon: React.ReactNode;
  }
> = {
  NORMAL: {
    badgeBg: "bg-[#05CD99]/15",
    badgeText: "text-[#05CD99]",
    badgeBorder: "border-[#05CD99]/30",
    nodeColor: "bg-[#05CD99]",
    glowClass: "shadow-[0_0_10px_rgba(5,205,153,0.3)]",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
  },
  WATCH: {
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-400",
    badgeBorder: "border-amber-500/30",
    nodeColor: "bg-amber-400",
    glowClass: "shadow-[0_0_10px_rgba(245,158,11,0.3)]",
    icon: <Eye className="w-3.5 h-3.5" />,
  },
  ALERT: {
    badgeBg: "bg-orange-500/15",
    badgeText: "text-orange-400",
    badgeBorder: "border-orange-500/30",
    nodeColor: "bg-orange-400",
    glowClass: "shadow-[0_0_12px_rgba(249,115,22,0.35)]",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  CRITICAL: {
    badgeBg: "bg-rose-500/15",
    badgeText: "text-rose-400",
    badgeBorder: "border-rose-500/40",
    nodeColor: "bg-rose-500",
    glowClass: "shadow-[0_0_15px_rgba(239,68,68,0.4)]",
    icon: <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />,
  },
  SYSTEMIC: {
    badgeBg: "bg-purple-500/20",
    badgeText: "text-purple-300",
    badgeBorder: "border-purple-500/40",
    nodeColor: "bg-purple-500",
    glowClass: "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
    icon: <Radio className="w-3.5 h-3.5 animate-spin" />,
  },
};

export const VerticalTimeline: React.FC<VerticalTimelineProps> = ({
  events,
  onSelectEvent,
}) => {
  return (
    <div className="relative space-y-6">
      {/* Central Illuminated Trunk Line */}
      <div className="absolute left-[39px] sm:left-[51px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#D4AF37]/50 via-white/10 to-transparent pointer-events-none" />

      <div className="space-y-6">
        {events.map((event) => {
          const config = SEVERITY_CONFIG[event.severity];

          return (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="relative flex items-start gap-4 sm:gap-6 group cursor-pointer"
            >
              {/* Timestamp & Node Beacon */}
              <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 pt-3">
                <span className="w-12 sm:w-16 font-mono text-xs font-bold text-slate-400 group-hover:text-white transition-colors text-right">
                  {event.timestamp}
                </span>

                {/* Severity Node Indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 border border-black/80 transition-transform duration-300 group-hover:scale-125 ${config.nodeColor} ${config.glowClass}`}
                >
                  <div className="w-2 h-2 rounded-full bg-black/70" />
                </div>
              </div>

              {/* Event Content Card */}
              <div className="flex-1 bg-[#070A12] hover:bg-[#0B0F19] border border-white/8 hover:border-white/20 rounded-xl p-4 sm:p-5 transition-all shadow-lg group-hover:shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {/* Severity Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${config.badgeBg} ${config.badgeText} ${config.badgeBorder}`}
                    >
                      {config.icon}
                      <span>{event.severity}</span>
                    </span>

                    {/* District Tag */}
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono text-[10px] font-semibold uppercase">
                      {event.district}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    {event.relativeTime}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors font-sans tracking-tight">
                  {event.headline}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-slate-400 mt-1.5 font-sans leading-relaxed">
                  {event.shortDescription}
                </p>

                {/* Footer Telemetry Strip */}
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">
                    Affected Asset:{" "}
                    <span className="text-[#00F0FF] font-semibold">
                      {event.affectedAsset}
                    </span>
                  </span>

                  <span className="text-[#D4AF37] flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Inspect Briefing</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
