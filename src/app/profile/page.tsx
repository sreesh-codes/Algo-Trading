"use client";

import React, { useState } from "react";
import { MOCK_PROFILE_DATA } from "@/data/mock/profile";
import { ProfileEquityChart } from "@/components/profile/ProfileEquityChart";
import { RoundPerformanceGrid } from "@/components/profile/RoundPerformanceGrid";
import { SubmissionsListCard } from "@/components/profile/SubmissionsListCard";
import { AchievementsCard } from "@/components/profile/AchievementsCard";
import {
  Shield,
  Award,
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  Activity,
  Terminal,
  Zap,
  TrendingUp,
} from "lucide-react";

export default function ProfilePage() {
  const profile = MOCK_PROFILE_DATA;
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText("dmx_live_pk_8f01a99b42e1058471928");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-8">
      {/* Required Header */}
      <div className="bg-[#080B14] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle accent top line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#05CD99] to-[#00F0FF]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-500 uppercase tracking-widest">
                MERCANTILE EXCHANGE PORTFOLIO
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-[#05CD99] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#05CD99] animate-pulse" />
                ACTIVE ARENA ALLOCATION
              </span>
            </div>

            {/* TEAM: QUANTUM DESERT */}
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-xs font-mono text-slate-500 uppercase">TEAM:</span>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase font-sans">
                {profile.teamName}
              </h1>
            </div>

            <p className="text-xs text-slate-400 font-sans">
              {profile.institution} • {profile.division} • Node: <code className="text-slate-300 font-mono">{profile.containerId}</code>
            </p>
          </div>

          {/* RANK: #07 & SCORE: 18,421 */}
          <div className="flex items-center gap-4 bg-[#05070E] border border-white/8 rounded-xl p-4 shrink-0 font-mono">
            {/* RANK */}
            <div className="space-y-0.5 pr-4 border-r border-white/8">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                RANK
              </span>
              <span className="text-2xl md:text-3xl font-black text-[#D4AF37] tracking-wider block">
                {profile.rank}
              </span>
              <span className="text-[10px] text-[#05CD99] block font-bold">
                TOP 10 ARENA
              </span>
            </div>

            {/* SCORE */}
            <div className="space-y-0.5 pl-2">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                SCORE
              </span>
              <span className="text-2xl md:text-3xl font-black text-white tracking-tight tabular-nums block">
                {profile.score}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Audited Points
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Mandatory Quant Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 font-mono text-xs">
        {/* TOTAL PNL */}
        <div className="bg-[#080B14] border border-white/8 rounded-xl p-4 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">TOTAL PNL</span>
          <span className="text-base md:text-lg font-black text-[#05CD99] tabular-nums block">
            +{profile.metrics.totalPnlBlitz.toLocaleString()} Blitz
          </span>
          <span className="text-[10px] text-slate-500 block">Cumulative Alpha</span>
        </div>

        {/* RETURN */}
        <div className="bg-[#080B14] border border-white/8 rounded-xl p-4 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">RETURN</span>
          <span className="text-base md:text-lg font-black text-white tabular-nums block">
            +{profile.metrics.returnPercent.toFixed(2)}%
          </span>
          <span className="text-[10px] text-[#05CD99] block">+16.2% vs Benchmark</span>
        </div>

        {/* SHARPE */}
        <div className="bg-[#080B14] border border-white/8 rounded-xl p-4 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">SHARPE</span>
          <span className="text-base md:text-lg font-black text-[#D4AF37] tabular-nums block">
            {profile.metrics.sharpe.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500 block">Sortino: 3.84</span>
        </div>

        {/* MAX DD */}
        <div className="bg-[#080B14] border border-white/8 rounded-xl p-4 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">MAX DD</span>
          <span className="text-base md:text-lg font-black text-rose-400 tabular-nums block">
            -{profile.metrics.maxDrawdownPercent.toFixed(2)}%
          </span>
          <span className="text-[10px] text-slate-500 block">Cap: 8.0% Collar</span>
        </div>

        {/* WIN RATE */}
        <div className="bg-[#080B14] border border-white/8 rounded-xl p-4 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">WIN RATE</span>
          <span className="text-base md:text-lg font-black text-white tabular-nums block">
            {profile.metrics.winRatePercent.toFixed(1)}%
          </span>
          <span className="text-[10px] text-slate-500 block">12,800 Orders</span>
        </div>

        {/* TURNOVER */}
        <div className="bg-[#080B14] border border-white/8 rounded-xl p-4 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">TURNOVER</span>
          <span className="text-base md:text-lg font-black text-[#00F0FF] tabular-nums block">
            {profile.metrics.turnoverRate}
          </span>
          <span className="text-[10px] text-slate-500 block">High Velocity</span>
        </div>
      </div>

      {/* Large Interactive Equity Curve */}
      <ProfileEquityChart data={profile.equityCurve} />

      {/* Round Performance Breakdown (Round 1, Round 2, Round 3, Final) */}
      <RoundPerformanceGrid rounds={profile.roundPerformance} />

      {/* Submissions List & Subtle Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Submissions Versions (v12, v11, v10...) (6 cols) */}
        <div className="lg:col-span-6">
          <SubmissionsListCard submissions={profile.submissions} />
        </div>

        {/* Right: Subtle Institutional Achievements (6 cols) */}
        <div className="lg:col-span-6">
          <AchievementsCard achievements={profile.achievements} />
        </div>
      </div>

      {/* API Access & Execution Container Telemetry */}
      <div className="bg-[#080B14] border border-white/8 rounded-xl p-5 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-white/8 pb-3">
          <div className="flex items-center gap-2 text-slate-300 font-bold uppercase">
            <Key className="w-4 h-4 text-[#00F0FF]" />
            DMX-35 Production Trading Credentials
          </div>
          <span className="text-[#05CD99] text-[10px] font-bold">
            VALIDATED HARDWARE ENCLAVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block mb-1">
              PUBLIC API KEY
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="dmx_live_pk_8f01a99b42e1058471928"
                className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-slate-300 text-xs font-mono outline-none"
              />
              <button
                type="button"
                onClick={handleCopyKey}
                className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer"
              >
                {copiedKey ? (
                  <Check className="w-3.5 h-3.5 text-[#05CD99]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase block mb-1">
              API SECRET TOKEN
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={
                  showSecret
                    ? "dmx_sec_7fa99b42e105847192837f4019234f9"
                    : "••••••••••••••••••••••••••••••••••••••••"
                }
                className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-slate-300 text-xs font-mono outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer"
              >
                {showSecret ? (
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
