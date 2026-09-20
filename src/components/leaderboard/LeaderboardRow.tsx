"use client";

import React from "react";
import { LeaderboardEntry } from "@/data/mock/leaderboard";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  isRecentlyMoved: boolean;
  onSelectTeam: (team: LeaderboardEntry) => void;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  entry,
  isRecentlyMoved,
  onSelectTeam,
}) => {
  const isTop1 = entry.rank === 1;
  const isTop2 = entry.rank === 2;
  const isTop3 = entry.rank === 3;
  const isTopTier = entry.rank <= 3;

  // Render SVG Sparkline
  const trendPoints = entry.trend || [5, 6, 7, 8, 9, 10];
  const minVal = Math.min(...trendPoints);
  const maxVal = Math.max(...trendPoints);
  const range = maxVal - minVal || 1;
  const sparkWidth = 60;
  const sparkHeight = 20;

  const sparkCoords = trendPoints.map((v, i) => {
    const x = (i / (trendPoints.length - 1)) * sparkWidth;
    const y = sparkHeight - ((v - minVal) / range) * (sparkHeight - 4) - 2;
    return `${x},${y}`;
  });
  const sparkPath = `M ${sparkCoords.join(" L ")}`;

  return (
    <tr
      onClick={() => onSelectTeam(entry)}
      className={`group cursor-pointer transition-all duration-500 select-none border-b border-white/5 ${
        isRecentlyMoved
          ? "animate-rank-shift bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)] z-10 relative"
          : isTop1
          ? "bg-gradient-to-r from-[#D4AF37]/[0.08] via-[#D4AF37]/[0.02] to-transparent hover:bg-[#D4AF37]/[0.12]"
          : isTop2
          ? "bg-gradient-to-r from-slate-300/[0.05] via-transparent to-transparent hover:bg-white/[0.04]"
          : isTop3
          ? "bg-gradient-to-r from-[#00F0FF]/[0.04] via-transparent to-transparent hover:bg-white/[0.04]"
          : entry.isCurrentUser
          ? "bg-[#D4AF37]/[0.06] hover:bg-[#D4AF37]/[0.1]"
          : "hover:bg-white/[0.03]"
      }`}
    >
      {/* RANK */}
      <td className="py-3.5 px-4 font-mono">
        <div className="flex items-center gap-2.5">
          {/* Left accent marker for top 3 */}
          <div
            className={`w-1 h-6 rounded-full transition-all ${
              isTop1
                ? "bg-[#D4AF37]"
                : isTop2
                ? "bg-slate-300"
                : isTop3
                ? "bg-[#00F0FF]"
                : "bg-transparent"
            }`}
          />

          <span
            className={`font-black text-sm tracking-wider tabular-nums ${
              isTop1
                ? "text-[#D4AF37] font-extrabold"
                : isTop2
                ? "text-slate-200 font-extrabold"
                : isTop3
                ? "text-[#00F0FF] font-extrabold"
                : "text-slate-400 font-semibold"
            }`}
          >
            #{String(entry.rank).padStart(2, "0")}
          </span>

          {/* Rank Delta Badge */}
          <div className="w-11">
            {entry.rankDelta > 0 ? (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#05CD99]/15 text-[#05CD99] border border-[#05CD99]/30">
                <TrendingUp className="w-2.5 h-2.5 stroke-[3]" />
                <span>{entry.rankDelta}</span>
              </span>
            ) : entry.rankDelta < 0 ? (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <TrendingDown className="w-2.5 h-2.5 stroke-[3]" />
                <span>{Math.abs(entry.rankDelta)}</span>
              </span>
            ) : (
              <span className="inline-flex items-center text-[10px] text-slate-600 font-bold px-1.5">
                <Minus className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      </td>

      {/* TEAM */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded border flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
              entry.isCurrentUser
                ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]"
                : isTopTier
                ? "border-white/20 bg-black/40 text-white"
                : "border-white/10 bg-black/30 text-slate-400"
            }`}
          >
            {entry.countryCode}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`font-semibold tracking-tight truncate text-xs ${
                  isTopTier || entry.isCurrentUser
                    ? "text-white font-bold"
                    : "text-slate-200"
                }`}
              >
                {entry.teamName}
              </span>

              {entry.isCurrentUser && (
                <span className="px-1.5 py-0.2 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-[9px] font-bold uppercase tracking-wider">
                  YOU
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-500 truncate max-w-[200px] md:max-w-[260px]">
              {entry.institution}
            </div>
          </div>
        </div>
      </td>

      {/* SCORE */}
      <td className="py-3.5 px-4 font-mono">
        <div className="flex items-center gap-2">
          <AnimatedNumber
            value={entry.score}
            decimals={1}
            flashOnChange={true}
            durationMs={450}
            className="text-white font-bold text-xs"
          />
          <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden hidden sm:block">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                entry.score >= 90
                  ? "bg-[#05CD99]"
                  : entry.score >= 80
                  ? "bg-[#D4AF37]"
                  : "bg-blue-400"
              }`}
              style={{ width: `${entry.score}%` }}
            />
          </div>
        </div>
      </td>

      {/* PNL */}
      <td className="py-3.5 px-4 text-right font-mono">
        <AnimatedNumber
          value={entry.cumulativePnLBlitz}
          decimals={0}
          prefix={entry.cumulativePnLBlitz >= 0 ? "+" : ""}
          suffix=" Blitz"
          flashOnChange={true}
          durationMs={650}
          className={`font-semibold text-xs ${
            entry.cumulativePnLBlitz >= 0 ? "text-[#05CD99]" : "text-rose-400"
          }`}
        />
      </td>

      {/* TREND (Sparkline) */}
      <td className="py-3.5 px-4 text-center font-mono">
        <div className="flex items-center justify-center gap-1.5">
          <svg
            width={sparkWidth}
            height={sparkHeight}
            className="overflow-visible"
          >
            <path
              d={sparkPath}
              fill="none"
              stroke={
                isTop1
                  ? "#D4AF37"
                  : entry.cumulativePnLBlitz >= 1500000
                  ? "#05CD99"
                  : "#38BDF8"
              }
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white transition-colors" />
        </div>
      </td>
    </tr>
  );
};
