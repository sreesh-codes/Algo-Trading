"use client";

import React from "react";
import { RoundOption, ACTIVE_ROUNDS } from "@/services/api/submission";
import { Shield, Clock, Zap, AlertCircle, CheckCircle2, Lock } from "lucide-react";

interface RoundSelectorCardProps {
  selectedRound: RoundOption;
  onSelectRound: (round: RoundOption) => void;
}

export const RoundSelectorCard: React.FC<RoundSelectorCardProps> = ({
  selectedRound,
  onSelectRound,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-sans">
            1. Select Target Competition Round
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Algorithms are compiled and executed inside the designated round arena matching engine.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>CURRENT: ROUND 02</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {ACTIVE_ROUNDS.map((round) => {
          const isSelected = selectedRound.roundNumber === round.roundNumber;
          const isActive = round.status === "ACTIVE";
          const isCompleted = round.status === "COMPLETED";

          return (
            <div
              key={round.roundNumber}
              onClick={() => onSelectRound(round)}
              className={`relative rounded-xl p-4 border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#101624] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/50"
                  : "bg-[#090C15] border-white/8 hover:border-white/20 hover:bg-[#0c111e]"
              }`}
            >
              {/* Status Header Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-bold tracking-wider text-slate-400">
                  {round.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase ${
                    isActive
                      ? "bg-[#05CD99]/15 text-[#05CD99] border border-[#05CD99]/30"
                      : isCompleted
                      ? "bg-slate-800 text-slate-400 border border-slate-700"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}
                >
                  {round.status}
                </span>
              </div>

              {/* Title & Theme */}
              <div className="text-base font-bold text-white tracking-tight mb-1 font-sans">
                {round.title}
              </div>
              <div className="text-xs text-slate-400 line-clamp-1 mb-3">
                {round.theme}
              </div>

              {/* Specs & Metrics */}
              <div className="pt-2.5 border-t border-white/6 grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">TIME REMAINING</span>
                  <span
                    className={`font-semibold ${
                      isActive ? "text-[#D4AF37]" : "text-slate-400"
                    }`}
                  >
                    {round.remainingTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">RATE LIMIT</span>
                  <span className="text-slate-300 font-medium">
                    ≤ {round.orderLimitPerSec} / sec
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">MAX LEVERAGE</span>
                  <span className="text-slate-300 font-medium">
                    {round.maxLeverage}x MARGIN
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">CIRCUIT COLLAR</span>
                  <span className="text-slate-300 font-medium">
                    ±{round.circuitBreakerPct.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Selected indicator checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Institutional Exchange Rules Banner */}
      <div className="bg-[#0A0E18] border border-white/6 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Shield className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span>
            <strong className="text-white font-semibold">DMX-35 Execution Container:</strong> Python 3.12 sandbox, 512MB RAM ceiling, air-gapped matching interface.
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-[#05CD99]">
            <CheckCircle2 className="w-3.5 h-3.5" /> No External Sockets
          </span>
          <span className="flex items-center gap-1 text-[#05CD99]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Zero-Copy Memory
          </span>
        </div>
      </div>
    </div>
  );
};
