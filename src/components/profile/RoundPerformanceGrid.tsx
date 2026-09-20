"use client";

import React from "react";
import { RoundPerformanceItem } from "@/data/mock/profile";
import { Award, CheckCircle2, Trophy, Zap, TrendingUp } from "lucide-react";

interface RoundPerformanceGridProps {
  rounds: RoundPerformanceItem[];
}

export const RoundPerformanceGrid: React.FC<RoundPerformanceGridProps> = ({ rounds }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Round Performance Breakdown
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-500">
          DMX-35 SCORING AUDIT
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rounds.map((r) => {
          const isActive = r.status === "ACTIVE";
          const isChampionship = r.status === "CHAMPIONSHIP";

          return (
            <div
              key={r.roundId}
              className={`rounded-xl p-4 border transition-all space-y-3 relative overflow-hidden font-mono ${
                isChampionship
                  ? "bg-[#101625] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/40"
                  : isActive
                  ? "bg-[#0A121E] border-[#05CD99]/40 shadow-[0_0_15px_rgba(5,205,153,0.1)]"
                  : "bg-[#080B14] border-white/8 hover:border-white/15"
              }`}
            >
              {/* Header: Title & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-base font-black text-white font-sans tracking-tight">
                    {r.title}
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans line-clamp-1">
                    {r.subtitle}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase shrink-0 border ${
                    isChampionship
                      ? "bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37]"
                      : isActive
                      ? "bg-[#05CD99]/20 border-[#05CD99]/40 text-[#05CD99]"
                      : "bg-white/5 border-white/10 text-slate-400"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              {/* Three Mandatory Columns: PnL, Score, Rank */}
              <div className="pt-2 border-t border-white/6 space-y-2.5 text-xs">
                {/* PnL */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 uppercase text-[10px]">PNL:</span>
                  <div className="text-right">
                    <span className="text-[#05CD99] font-bold tabular-nums">
                      +{r.pnlBlitz.toLocaleString()} Blitz
                    </span>
                    <span className="text-slate-500 text-[10px] block">
                      +{r.pnlPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                  <span className="text-slate-500 uppercase text-[10px]">SCORE:</span>
                  <span className="text-white font-black tabular-nums text-sm">
                    {r.score.toLocaleString()}
                  </span>
                </div>

                {/* Rank */}
                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                  <span className="text-slate-500 uppercase text-[10px]">RANK:</span>
                  <span
                    className={`font-black text-sm tracking-wider ${
                      isChampionship || isActive
                        ? "text-[#D4AF37]"
                        : "text-slate-200"
                    }`}
                  >
                    {r.rank}
                  </span>
                </div>
              </div>

              {/* Sharpe subtext */}
              <div className="pt-2 border-t border-white/6 flex items-center justify-between text-[10px] text-slate-500">
                <span>Sharpe: {r.sharpe.toFixed(2)}</span>
                <span>{r.tradesCount.toLocaleString()} orders</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
