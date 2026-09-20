"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trophy, Clock, Users, Coins, ArrowRight, ShieldCheck, Flame } from "lucide-react";

interface MiniLeaderboardEntry {
  rank: number;
  team: string;
  institution: string;
  sharpe: number;
  winRate: number;
  pnlFormatted: string;
  changeDir: "up" | "down" | "same";
}

const LEADERBOARD_TEAMS: MiniLeaderboardEntry[] = [
  {
    rank: 1,
    team: "ETH Quantum Syndicate",
    institution: "ETH Zurich • Switzerland",
    sharpe: 3.48,
    winRate: 68.4,
    pnlFormatted: "+2,480,200 MC",
    changeDir: "same",
  },
  {
    rank: 2,
    team: "Oxford Algorithmic Guild",
    institution: "University of Oxford • UK",
    sharpe: 3.22,
    winRate: 65.1,
    pnlFormatted: "+1,940,800 MC",
    changeDir: "up",
  },
  {
    rank: 3,
    team: "MIT Cryo-Arb Lab",
    institution: "MIT • United States",
    sharpe: 3.05,
    winRate: 63.8,
    pnlFormatted: "+1,620,500 MC",
    changeDir: "down",
  },
  {
    rank: 4,
    team: "NUS Hyper-Mesh",
    institution: "National Univ. of Singapore",
    sharpe: 2.89,
    winRate: 61.5,
    pnlFormatted: "+1,340,100 MC",
    changeDir: "up",
  },
  {
    rank: 5,
    team: "KAUST Desert Quant",
    institution: "KAUST • Saudi Arabia",
    sharpe: 2.74,
    winRate: 59.9,
    pnlFormatted: "+1,110,400 MC",
    changeDir: "same",
  },
];

export const CompetitionPreviewCard: React.FC = () => {
  // Live ticking countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 28,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format2 = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="w-full space-y-6">
      {/* Section Headline */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="font-mono-tech text-xs tracking-widest text-[#D4AF37] uppercase font-semibold">
              GLOBAL SOVEREIGN ARENA
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
            COMPETITION TOURNAMENT STATUS
          </h3>
          <p className="text-sm text-[#94A3B8] font-sans mt-1 max-w-xl">
            Season IV algorithmic tournament. Autonomous market-making bots battle across synthetic Dubai order books for sovereign capital allocations.
          </p>
        </div>

        <Link
          href="/competition"
          className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[#00F0FF]/40 bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF] hover:text-white font-mono-tech text-xs font-semibold tracking-wider transition-all"
        >
          <span>VIEW TOURNAMENT RULEBOOK</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Main Tournament Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Round & Macro Parameters (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#0F172A]/90 via-[#0A0F1D]/95 to-[#060912]/95 backdrop-blur-md shadow-2xl relative overflow-hidden font-mono-tech">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />

          {/* Tactical Corner Marks */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />

          <div>
            {/* Round Badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-[11px] px-2.5 py-1 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Flame size={12} /> SEASON IV • ROUND 01
              </span>
              <span className="text-xs text-[#05CD99] font-bold tracking-wider">
                ACTIVE IN PROGRESS
              </span>
            </div>

            {/* Current Round Title */}
            <div className="space-y-1 mb-6 font-sans">
              <div className="text-[11px] text-[#94A3B8] font-mono tracking-wider uppercase">
                CURRENT STAGE
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                The Market Awakens
              </h4>
              <p className="text-sm text-[#CBD5E1] font-sans leading-relaxed pt-1 font-normal">
                Primary liquidity seed stage. Trading bots establish baseload quotes and discover equilibrium spreads across clean solar and quantum compute futures.
              </p>
            </div>

            {/* Time Remaining Countdown Display */}
            <div className="p-4 rounded-lg bg-black/60 border border-white/10 mb-6">
              <div className="flex items-center justify-between text-xs text-[#94A3B8] uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-[#D4AF37]" /> TIME REMAINING
                </span>
                <span className="text-[#05CD99]">LIVE SYNCHRONIZED</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded bg-white/5 border border-white/5">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
                    {format2(timeLeft.days)}
                  </div>
                  <div className="text-[9px] text-[#64748B] uppercase">DAYS</div>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/5">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
                    {format2(timeLeft.hours)}
                  </div>
                  <div className="text-[9px] text-[#64748B] uppercase">HOURS</div>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/5">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
                    {format2(timeLeft.minutes)}
                  </div>
                  <div className="text-[9px] text-[#64748B] uppercase">MINUTES</div>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/5">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#05CD99] tabular-nums tracking-tight">
                    {format2(timeLeft.seconds)}
                  </div>
                  <div className="text-[9px] text-[#64748B] uppercase">SECONDS</div>
                </div>
              </div>
            </div>

            {/* Key Metrics: TEAMS & CAPITAL IN PLAY */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-black/40 border border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] uppercase mb-1">
                  <Users size={13} className="text-[#00F0FF]" /> TEAMS
                </div>
                <div className="text-2xl font-extrabold text-white">24</div>
                <div className="text-[10px] text-[#64748B]">Elite Global Consortia</div>
              </div>

              <div className="p-3.5 rounded-lg bg-black/40 border border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] uppercase mb-1">
                  <Coins size={13} className="text-[#D4AF37]" /> CAPITAL IN PLAY
                </div>
                <div className="text-2xl font-extrabold text-[#D4AF37]">5.84B</div>
                <div className="text-[10px] text-[#64748B]">MC / Blitz Sovereign Pool</div>
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-[#94A3B8]">ROUND 01 PRIZE POOL</span>
            <span className="text-sm font-bold text-white">1,500,000 Blitz</span>
          </div>
        </div>

        {/* Right Column: Miniature Leaderboard (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-xl border border-white/10 bg-[#080D1A]/95 backdrop-blur-md shadow-2xl relative font-mono-tech">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-[#D4AF37]" />
                <span className="text-xs font-bold text-white tracking-wider uppercase">
                  MINIATURE TOURNAMENT LEADERBOARD
                </span>
              </div>
              <span className="text-[10px] text-[#64748B]">
                SORTED BY CUMULATIVE P&L
              </span>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 px-3 py-2 text-[10px] text-[#64748B] uppercase tracking-wider font-semibold border-b border-white/5">
              <div className="col-span-1">#</div>
              <div className="col-span-5">TEAM / INSTITUTION</div>
              <div className="col-span-2 text-right">SHARPE</div>
              <div className="col-span-2 text-right">WIN RATE</div>
              <div className="col-span-2 text-right">P&L (MC)</div>
            </div>

            {/* Team Rows */}
            <div className="divide-y divide-white/5 text-xs">
              {LEADERBOARD_TEAMS.map((team) => {
                const isFirst = team.rank === 1;
                return (
                  <div
                    key={team.rank}
                    className={`grid grid-cols-12 px-3 py-3 items-center hover:bg-white/[0.03] transition-colors ${
                      isFirst ? "bg-[#D4AF37]/5" : ""
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="col-span-1">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded text-[11px] font-bold ${
                          isFirst
                            ? "bg-[#D4AF37] text-black"
                            : team.rank === 2
                            ? "bg-[#E2E8F0] text-black"
                            : team.rank === 3
                            ? "bg-[#CD7F32] text-black"
                            : "text-[#94A3B8]"
                        }`}
                      >
                        {team.rank}
                      </span>
                    </div>

                    {/* Team & School */}
                    <div className="col-span-5 pr-2">
                      <div className="font-semibold text-white truncate text-xs">
                        {team.team}
                      </div>
                      <div className="text-[10px] text-[#64748B] truncate">
                        {team.institution}
                      </div>
                    </div>

                    {/* Sharpe */}
                    <div className="col-span-2 text-right font-medium text-[#CBD5E1]">
                      {team.sharpe.toFixed(2)}
                    </div>

                    {/* Win Rate */}
                    <div className="col-span-2 text-right font-medium text-[#CBD5E1]">
                      {team.winRate.toFixed(1)}%
                    </div>

                    {/* P&L */}
                    <div className="col-span-2 text-right font-bold text-[#05CD99]">
                      {team.pnlFormatted}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer of Leaderboard Card */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#64748B] text-[11px]">
              Showing top 5 of 24 qualified teams
            </span>
            <Link
              href="/leaderboard"
              className="text-[#D4AF37] hover:text-white flex items-center gap-1.5 font-semibold transition-colors"
            >
              <span>EXPLORE FULL LEADERBOARD</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
