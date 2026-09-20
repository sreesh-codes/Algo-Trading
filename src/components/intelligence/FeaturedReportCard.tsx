"use client";

import React from "react";
import { IntelligenceEvent } from "@/services/api/intelligence";
import {
  AlertTriangle,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface FeaturedReportCardProps {
  event: IntelligenceEvent;
  onInspectReport: (event: IntelligenceEvent) => void;
}

export const FeaturedReportCard: React.FC<FeaturedReportCardProps> = ({
  event,
  onInspectReport,
}) => {
  return (
    <div className="relative w-full rounded-2xl bg-[#090C16] border border-rose-500/30 p-6 shadow-2xl overflow-hidden group">
      {/* Background district watermark / ambient gradient */}
      <div className="absolute -right-10 -bottom-10 opacity-5 font-black text-9xl text-white font-mono select-none pointer-events-none">
        {event.district}
      </div>

      <div className="relative space-y-5">
        {/* Card Header & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              FEATURED BULLETIN • {event.severity}
            </span>

            <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px] font-semibold uppercase">
              DISTRICT: {event.district}
            </span>

            <span className="text-xs font-mono text-slate-400">
              {event.timestamp} ({event.relativeTime})
            </span>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Affected Contract: <strong className="text-white">{event.affectedAsset}</strong>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-xl md:text-2xl font-black text-white uppercase font-sans tracking-tight leading-snug">
          {event.headline}
        </h2>

        {/* Briefing Narrative */}
        <p className="text-sm text-slate-300 font-sans leading-relaxed max-w-4xl">
          {event.fullBriefing}
        </p>

        {/* Real-time Telemetry Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/8 font-mono">
          {event.telemetryStats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#05070E] border border-white/6 rounded-xl p-3 space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase">
                <span>{stat.label}</span>
                <span
                  className={`flex items-center gap-0.5 font-bold ${
                    stat.trend === "up"
                      ? "text-rose-400"
                      : stat.trend === "down"
                      ? "text-amber-400"
                      : "text-slate-400"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : stat.trend === "down" ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  {stat.delta}
                </span>
              </div>
              <div className="text-lg font-black text-white tracking-tight">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Card Footer Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/8 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate max-w-md">Source: {event.sourceAuthority}</span>
          </div>

          <button
            type="button"
            onClick={() => onInspectReport(event)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 transition cursor-pointer font-semibold shrink-0"
          >
            <span>INSPECT CLASSIFIED TRANSMISSION</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
