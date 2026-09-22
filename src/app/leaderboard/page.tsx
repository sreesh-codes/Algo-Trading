"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { MOCK_LEADERBOARD, LeaderboardEntry } from "@/data/mock/leaderboard";
import { LeaderboardRow } from "@/components/leaderboard/LeaderboardRow";
import { TeamDetailDrawer } from "@/components/leaderboard/TeamDetailDrawer";
import {
  Trophy,
  Search,
  SlidersHorizontal,
  Clock,
  Activity,
  Shield,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

type RoundFilter = "ALL" | "R1" | "R2" | "R3" | "FINAL";
type SortField = "score" | "pnl" | "sharpe" | "drawdown";

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [selectedTeam, setSelectedTeam] = useState<LeaderboardEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roundFilter, setRoundFilter] = useState<RoundFilter>("ALL");
  const [sortField, setSortField] = useState<SortField>("score");
  const [recentlyMoved, setRecentlyMoved] = useState<Set<string>>(new Set());
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>("14:32:17 GST");
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isTimerInitialized, setIsTimerInitialized] = useState(false);

  // Fetch real competition end time
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/competition/status");
        if (res.ok) {
          const data = await res.json();
          if (data.end) {
            const end = new Date(data.end).getTime();
            const now = Date.now();
            const diff = Math.max(0, Math.floor((end - now) / 1000));
            setRemainingSeconds(diff);
          }
        }
      } catch (err) {
        console.error("Failed to fetch competition status", err);
      } finally {
        setIsTimerInitialized(true);
      }
    }
    fetchStatus();
  }, []);

  // Live countdown timer for round remaining time
  useEffect(() => {
    if (!isTimerInitialized) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerInitialized]);

  const formattedRemainingTime = useMemo(() => {
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }, [remainingSeconds]);

  // Live updated GST clock
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      // Emulate GST offset (UTC+4)
      const gstHours = String((now.getUTCHours() + 4) % 24).padStart(2, "0");
      const gstMinutes = String(now.getUTCMinutes()).padStart(2, "0");
      const gstSecs = String(now.getUTCSeconds()).padStart(2, "0");
      setLastUpdatedTime(`${gstHours}:${gstMinutes}:${gstSecs} GST`);
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Believable live movement engine (fires every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setTeams((prevTeams) => {
        // Pick 2 adjacent teams between rank 4 and rank 18 to swap or adjust believably
        // This ensures the top 2 remain relatively stable while active mid-tier battles happen
        const candidates = [
          [4, 5],
          [6, 7], // Falcon Arbitrage #7 moving to #6 or #5
          [8, 9],
          [10, 11],
          [13, 14],
          [16, 17],
        ];

        const pair = candidates[Math.floor(Math.random() * candidates.length)];
        const idxA = prevTeams.findIndex((t) => t.rank === pair[0]);
        const idxB = prevTeams.findIndex((t) => t.rank === pair[1]);

        if (idxA === -1 || idxB === -1) return prevTeams;

        const teamA = { ...prevTeams[idxA] };
        const teamB = { ...prevTeams[idxB] };

        // Subtle PnL & score micro-update
        const pnlBump = Math.round(15000 + Math.random() * 25000);
        teamB.cumulativePnLBlitz += pnlBump;
        teamB.score = Math.min(99.0, +(teamB.score + 0.35).toFixed(1));
        teamB.trend = [...teamB.trend.slice(1), teamB.trend[teamB.trend.length - 1] + 2];

        // Swap their ranks: B moves up, A moves down
        const oldRankA = teamA.rank;
        const oldRankB = teamB.rank;

        teamB.prevRank = oldRankB;
        teamB.rank = oldRankA;
        teamB.rankDelta = oldRankB - oldRankA; // e.g. +1 or +2

        teamA.prevRank = oldRankA;
        teamA.rank = oldRankB;
        teamA.rankDelta = oldRankA - oldRankB; // e.g. -1

        // Highlight these two teams
        setRecentlyMoved(new Set([teamA.teamName, teamB.teamName]));
        setTimeout(() => setRecentlyMoved(new Set()), 2800);

        const newTeams = [...prevTeams];
        newTeams[idxA] = teamB;
        newTeams[idxB] = teamA;

        // Ensure sorted by rank
        return newTeams.sort((a, b) => a.rank - b.rank);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filtered & Sorted teams
  const processedTeams = useMemo(() => {
    let result = [...teams];

    // Filter by Round
    if (roundFilter === "R1") {
      result = result.map((t) => ({ ...t, score: t.roundScores.r1 }));
    } else if (roundFilter === "R2") {
      result = result.map((t) => ({ ...t, score: t.roundScores.r2 }));
    } else if (roundFilter === "R3") {
      result = result.map((t) => ({ ...t, score: t.roundScores.r3 }));
    } else if (roundFilter === "FINAL") {
      result = result.map((t) => ({ ...t, score: t.roundScores.finalProjected }));
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.teamName.toLowerCase().includes(q) ||
          t.institution.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q) ||
          t.countryCode.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortField === "score") {
      result.sort((a, b) => b.score - a.score);
    } else if (sortField === "pnl") {
      result.sort((a, b) => b.cumulativePnLBlitz - a.cumulativePnLBlitz);
    } else if (sortField === "sharpe") {
      result.sort((a, b) => b.sharpeRatio - a.sharpeRatio);
    } else if (sortField === "drawdown") {
      result.sort((a, b) => a.maxDrawdownPercent - b.maxDrawdownPercent);
    }

    return result;
  }, [teams, roundFilter, searchQuery, sortField]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/8 pb-6">
        <div className="relative">
          <div className="absolute top-4 left-0 w-64 h-32 bg-amber-500/10 blur-[80px] pointer-events-none" />
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-amber-400 drop-shadow-[0_2px_24px_rgba(251,191,36,0.3)] font-sans relative z-10">
            Leaderboard
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-slate-200 font-normal leading-relaxed mt-3 max-w-4xl relative z-10">
            Continuous algorithmic matching telemetry across 24 global institutional quant teams.
          </p>
        </div>

        {/* Header Telemetry Pill */}
        <div className="flex items-center gap-4 bg-[#080B14] border border-white/10 rounded-xl p-3.5 shrink-0 font-mono text-xs z-10">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase block">TIME REMAINING</span>
            <span className="text-[#05CD99] font-bold text-lg tracking-widest">{formattedRemainingTime}</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">


          <div className="relative flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search team or university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#070A12] border border-white/8 text-white text-xs font-mono focus:border-[#D4AF37] outline-none w-full sm:w-52 placeholder-slate-500"
            />
          </div>
      </div>

      {/* Institutional Leaderboard Table Container */}
      <div className="w-full bg-[#070A12] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.02] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold w-24">RANK</th>
                <th className="py-3 px-4 font-semibold">TEAM</th>
                <th className="py-3 px-4 font-semibold">SCORE</th>
                <th className="py-3 px-4 font-semibold text-right">PNL</th>
                <th className="py-3 px-4 font-semibold text-center w-28">TREND</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {processedTeams.map((entry) => (
                <LeaderboardRow
                  key={entry.teamName}
                  entry={entry}
                  isRecentlyMoved={recentlyMoved.has(entry.teamName)}
                  onSelectTeam={(team) => setSelectedTeam(team)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Telemetry */}
        <div className="p-3 bg-[#05070E] border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-400 px-4">
          <div className="flex items-center gap-3">
            <span>
              Displaying <strong className="text-white">{processedTeams.length}</strong> of 24 qualified teams
            </span>
          </div>
        </div>
      </div>



      {/* Team Detail Side Panel Drawer */}
      <TeamDetailDrawer
        team={selectedTeam}
        onClose={() => setSelectedTeam(null)}
      />
    </div>
  );
}
