"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, ChevronUp, ChevronDown, Minus, ExternalLink, ShieldCheck } from "lucide-react";

interface LeaderboardTeam {
  rank: number;
  prevRank: number;
  name: string;
  institution: string;
  pnl: number;
  score: number;
  sharpe: number;
  isCurrentUser?: boolean;
}

const INITIAL_TOP_TEAMS: LeaderboardTeam[] = [
  {
    rank: 1,
    prevRank: 1,
    name: "Q-Hyperion",
    institution: "MIT Quants",
    pnl: 384210,
    score: 98.4,
    sharpe: 4.12
  },
  {
    rank: 2,
    prevRank: 3,
    name: "Caelum Arbitrage",
    institution: "Imperial College London",
    pnl: 341850,
    score: 95.8,
    sharpe: 3.88
  },
  {
    rank: 3,
    prevRank: 2,
    name: "Vortex Delta",
    institution: "ETH Zürich",
    pnl: 319400,
    score: 93.2,
    sharpe: 3.65
  },
  {
    rank: 4,
    prevRank: 5,
    name: "Sovereign Alpha",
    institution: "Khalifa University",
    pnl: 287600,
    score: 91.0,
    sharpe: 3.42
  },
  {
    rank: 5,
    prevRank: 4,
    name: "Dune Nexus",
    institution: "NUS Singapore",
    pnl: 265400,
    score: 89.6,
    sharpe: 3.25
  },
  // Pinned User Team
  {
    rank: 7,
    prevRank: 8,
    name: "Falcon Arbitrage",
    institution: "NYU Abu Dhabi",
    pnl: 218450,
    score: 88.2,
    sharpe: 3.42,
    isCurrentUser: true
  }
];

export function LiveLeaderboardWidget() {
  const [teams, setTeams] = useState<LeaderboardTeam[]>(INITIAL_TOP_TEAMS);
  const [lastUpdated, setLastUpdated] = useState<string>("JUST NOW");

  // Subtle simulated tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTeams((prev) =>
        prev.map((team) => {
          if (Math.random() > 0.6) {
            const delta = (Math.random() - 0.45) * 120;
            return {
              ...team,
              pnl: Math.round(team.pnl + delta)
            };
          }
          return team;
        })
      );
      setLastUpdated("JUST NOW");
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (val: number) => {
    return (val >= 0 ? "+" : "-") + "$" + Math.abs(val).toLocaleString("en-US");
  };

  return (
    <div className="bg-[#0b101d]/90 border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-xs font-semibold text-white font-sans tracking-normal">
            Live Global Standings
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-medium">
            ROUND 02
          </span>
        </div>

        <Link
          href="/leaderboard"
          className="text-xs font-sans text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors group"
        >
          <span>Full board</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Table Headings */}
      <div className="grid grid-cols-12 gap-2 text-[11px] font-sans text-gray-400 py-2 border-b border-white/5 font-medium">
        <div className="col-span-2">Rank</div>
        <div className="col-span-5">Team & Institution</div>
        <div className="col-span-3 text-right">Total P&L</div>
        <div className="col-span-2 text-right">Score</div>
      </div>

      {/* Teams List */}
      <div className="divide-y divide-white/5 my-1">
        {teams.slice(0, 5).map((team) => {
          const rankChange = team.prevRank - team.rank;
          return (
            <div
              key={team.name}
              className="grid grid-cols-12 gap-2 py-2.5 items-center hover:bg-white/[0.02] transition-colors rounded px-1"
            >
              {/* Rank + Delta */}
              <div className="col-span-2 flex items-center gap-1.5">
                <span
                  className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-medium ${
                    team.rank === 1
                      ? "bg-[#D4AF37] text-black shadow-[0_0_8px_rgba(212,175,55,0.5)] font-semibold"
                      : team.rank === 2
                      ? "bg-slate-300 text-black font-semibold"
                      : team.rank === 3
                      ? "bg-amber-700/80 text-white font-semibold"
                      : "bg-white/10 text-gray-300"
                  }`}
                >
                  {team.rank}
                </span>
                {rankChange > 0 ? (
                  <span className="flex items-center text-[9px] font-mono text-emerald-400">
                    <ChevronUp className="w-3 h-3 -mr-0.5" />
                    {rankChange}
                  </span>
                ) : rankChange < 0 ? (
                  <span className="flex items-center text-[9px] font-mono text-rose-400">
                    <ChevronDown className="w-3 h-3 -mr-0.5" />
                    {Math.abs(rankChange)}
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-gray-600">
                    <Minus className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              {/* Team Info */}
              <div className="col-span-5 min-w-0">
                <div className="text-xs font-medium text-white font-sans truncate group-hover:text-cyan-400 transition-colors">
                  {team.name}
                </div>
                <div className="text-[11px] text-gray-400 font-sans truncate">
                  {team.institution}
                </div>
              </div>

              {/* Total PnL */}
              <div className="col-span-3 text-right">
                <div className="text-xs font-mono font-medium text-emerald-400 tabular-nums">
                  {formatCurrency(team.pnl)}
                </div>
                <div className="text-[10px] font-mono text-gray-500 tabular-nums">
                  SR: {team.sharpe.toFixed(2)}
                </div>
              </div>

              {/* Composite Score */}
              <div className="col-span-2 text-right">
                <span className="text-xs font-mono font-semibold text-white tabular-nums">
                  {team.score.toFixed(1)}
                </span>
                <span className="text-[10px] font-mono text-gray-500 block">
                  /100
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pinned Current User Team Row */}
      {teams.find((t) => t.isCurrentUser) && (
        <div className="mt-2 pt-2 border-t border-[#D4AF37]/30">
          <div className="text-[11px] font-sans text-[#D4AF37] mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3" />
              Your team (pinned)
            </span>
            <span className="font-mono text-[10px]">Top 4.8% of league</span>
          </div>

          {(() => {
            const userTeam = teams.find((t) => t.isCurrentUser)!;
            const rankChange = userTeam.prevRank - userTeam.rank;
            return (
              <div className="grid grid-cols-12 gap-2 py-2 px-2 items-center bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg">
                <div className="col-span-2 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-semibold bg-[#D4AF37] text-black shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                    {userTeam.rank}
                  </span>
                  {rankChange > 0 && (
                    <span className="flex items-center text-[9px] font-mono text-emerald-400 font-medium">
                      <ChevronUp className="w-3 h-3 -mr-0.5" />
                      {rankChange}
                    </span>
                  )}
                </div>

                <div className="col-span-5 min-w-0">
                  <div className="text-xs font-medium text-white font-sans flex items-center gap-1.5">
                    {userTeam.name}
                    <span className="text-[9px] px-1 rounded bg-[#D4AF37] text-black font-mono font-bold">
                      YOU
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-300 font-sans truncate">
                    {userTeam.institution}
                  </div>
                </div>

                <div className="col-span-3 text-right">
                  <div className="text-xs font-mono font-semibold text-emerald-400 tabular-nums">
                    {formatCurrency(userTeam.pnl)}
                  </div>
                  <div className="text-[10px] font-mono text-gray-400 tabular-nums">
                    SR: {userTeam.sharpe.toFixed(2)}
                  </div>
                </div>

                <div className="col-span-2 text-right">
                  <span className="text-xs font-mono font-semibold text-[#D4AF37] tabular-nums">
                    {userTeam.score.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 block">
                    /100
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-sans text-gray-500">
        <span>142 teams competing</span>
        <span className="text-gray-400 font-mono text-[10px]">Score sync: {lastUpdated}</span>
      </div>
    </div>
  );
}
