"use client";

import React from "react";
import { NetworkThreatLevel } from "@/services/api/intelligence";
import { ShieldCheck, AlertTriangle, AlertOctagon, Activity, Radio, Sparkles } from "lucide-react";

interface NetworkStatusBannerProps {
  currentThreatLevel: NetworkThreatLevel;
  onChangeThreatLevel: (level: NetworkThreatLevel) => void;
  activeAlertCount: number;
}

export const NetworkStatusBanner: React.FC<NetworkStatusBannerProps> = ({
  currentThreatLevel,
  onChangeThreatLevel,
  activeAlertCount,
}) => {
  const isStable = currentThreatLevel === "STABLE";
  const isElevated = currentThreatLevel === "ELEVATED VOLATILITY";
  const isSystemic = currentThreatLevel === "SYSTEMIC EVENT DETECTED";

  return (
    <div
      className={`relative w-full rounded-2xl p-5 border transition-all duration-500 overflow-hidden shadow-2xl ${
        isStable
          ? "bg-[#060A14] border-white/10 shadow-[0_0_20px_rgba(5,205,153,0.05)]"
          : isElevated
          ? "bg-[#140D04] border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20"
          : "bg-[#160507] border-rose-500/50 shadow-[0_0_40px_rgba(239,68,68,0.25)] ring-1 ring-rose-500/30"
      }`}
    >
      {/* Dynamic atmospheric top glow beam */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 transition-all duration-500 ${
          isStable
            ? "bg-gradient-to-r from-transparent via-[#05CD99] to-transparent"
            : isElevated
            ? "bg-gradient-to-r from-transparent via-amber-400 to-transparent"
            : "bg-gradient-to-r from-transparent via-rose-500 to-transparent"
        }`}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
        {/* Left: Network Status Display */}
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500 ${
              isStable
                ? "bg-[#05CD99]/15 border-[#05CD99]/30 text-[#05CD99]"
                : isElevated
                ? "bg-amber-500/20 border-amber-500/40 text-amber-400 animate-pulse"
                : "bg-rose-500/20 border-rose-500/50 text-rose-400 animate-bounce"
            }`}
          >
            {isStable ? (
              <ShieldCheck className="w-6 h-6" />
            ) : isElevated ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <AlertOctagon className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                MARKET NETWORK STATUS
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isStable
                    ? "bg-[#05CD99]"
                    : isElevated
                    ? "bg-amber-400 animate-ping"
                    : "bg-rose-500 animate-ping"
                }`}
              />
            </div>

            <h2
              className={`text-xl md:text-2xl font-black uppercase font-sans tracking-tight transition-colors duration-500 ${
                isStable
                  ? "text-white"
                  : isElevated
                  ? "text-amber-300"
                  : "text-rose-400"
              }`}
            >
              {isStable
                ? "MARKET NETWORK: STABLE"
                : isElevated
                ? "MARKET NETWORK: ELEVATED VOLATILITY"
                : "MARKET NETWORK: SYSTEMIC EVENT DETECTED"}
            </h2>

            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed font-sans">
              {isStable
                ? "Continuous matching engine reports nominal baseline spread stability across all five commercial districts. Automated circuit collar bands at standard 8.0%."
                : isElevated
                ? "Cross-district order flow deviations observed. Energy grid diversion and logistics basis shifts have expanded quoting volatility bands."
                : "CRITICAL REPLAY ACTIVE: Substation load-shedding and high-velocity algorithmic sweeps detected. Dynamic margin cushions expanded to 12.0%."}
            </p>
          </div>
        </div>

        {/* Right: Interactive State Tester (Backend Simulation Controller) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 bg-black/40 p-2.5 rounded-xl border border-white/8">
          <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1.5 px-2">
            <Radio className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>THREAT SIMULATOR:</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => onChangeThreatLevel("STABLE")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-bold text-[11px] ${
                isStable
                  ? "bg-[#05CD99] text-black shadow-[0_0_10px_rgba(5,205,153,0.3)]"
                  : "text-slate-400 hover:text-white bg-white/5"
              }`}
            >
              STABLE
            </button>

            <button
              type="button"
              onClick={() => onChangeThreatLevel("ELEVATED VOLATILITY")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-bold text-[11px] ${
                isElevated
                  ? "bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                  : "text-slate-400 hover:text-white bg-white/5"
              }`}
            >
              ALERT
            </button>

            <button
              type="button"
              onClick={() => onChangeThreatLevel("SYSTEMIC EVENT DETECTED")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-bold text-[11px] ${
                isSystemic
                  ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  : "text-slate-400 hover:text-white bg-white/5"
              }`}
            >
              CRITICAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
