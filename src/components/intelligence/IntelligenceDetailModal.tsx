"use client";

import React from "react";
import { IntelligenceEvent } from "@/services/api/intelligence";
import {
  X,
  ShieldCheck,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  FileCode2,
  Lock,
  ExternalLink,
} from "lucide-react";

interface IntelligenceDetailModalProps {
  event: IntelligenceEvent | null;
  onClose: () => void;
}

export const IntelligenceDetailModal: React.FC<IntelligenceDetailModalProps> = ({
  event,
  onClose,
}) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#080B14] border border-white/12 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Accent Strip */}
        <div
          className={`h-1.5 ${
            event.severity === "CRITICAL"
              ? "bg-rose-500"
              : event.severity === "ALERT"
              ? "bg-orange-500"
              : event.severity === "WATCH"
              ? "bg-amber-400"
              : event.severity === "SYSTEMIC"
              ? "bg-purple-500"
              : "bg-[#05CD99]"
          }`}
        />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/8 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold uppercase">
                {event.severity}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 uppercase">
                DISTRICT: {event.district}
              </span>
              <span className="text-slate-400">{event.fullTime}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white font-sans tracking-tight">
              {event.headline}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Narrative Full Briefing */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              INTELLIGENCE WIRE DISPATCH
            </span>
            <p className="text-sm text-slate-200 font-sans leading-relaxed">
              {event.fullBriefing}
            </p>
          </div>

          {/* Telemetry Metrics */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              PHYSICAL SENSOR TELEMETRY
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
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
                      {stat.delta}
                    </span>
                  </div>
                  <div className="text-base font-black text-white">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Consequence Notice */}
          <div className="bg-[#050811] border border-white/8 rounded-xl p-4 space-y-2 font-mono text-xs">
            <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              MARKET ORDER BOOK IMPLICATIONS
            </div>
            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              Observed physical deviations indicate elevated localized basis volatility on{" "}
              <strong className="text-white font-mono">{event.affectedAsset}</strong>. Algorithmic market makers are advised to review inventory penalty coefficients and dynamic order cancellation rates.
            </p>
          </div>

          {/* Transmission Provenance */}
          <div className="pt-4 border-t border-white/8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-400">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">
                VERIFIED SOURCE
              </span>
              <span className="text-slate-200 font-medium">
                {event.sourceAuthority}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">
                TRANSMISSION CHECKSUM
              </span>
              <span className="text-[#00F0FF] font-mono">
                {event.transmissionChecksum}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/8 bg-[#05070E] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold transition cursor-pointer"
          >
            DISMISS DISPATCH
          </button>
        </div>
      </div>
    </div>
  );
};
