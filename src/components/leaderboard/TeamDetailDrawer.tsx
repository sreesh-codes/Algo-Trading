"use client";

import React from "react";
import { LeaderboardEntry } from "@/data/mock/leaderboard";
import {
  X,
  Shield,
  TrendingUp,
  Activity,
  Lock,
  Award,
  Globe,
  Clock,
  Zap,
  BarChart2,
  CheckCircle2,
} from "lucide-react";

interface TeamDetailDrawerProps {
  team: LeaderboardEntry | null;
  onClose: () => void;
}

export const TeamDetailDrawer: React.FC<TeamDetailDrawerProps> = ({
  team,
  onClose,
}) => {
  if (!team) return null;

  // Generate SVG path for equity curve
  const points = team.equityCurve || [];
  const minEquity = Math.min(...points.map((p) => p.equity));
  const maxEquity = Math.max(...points.map((p) => p.equity));
  const range = maxEquity - minEquity || 1;

  const width = 420;
  const height = 140;
  const padding = 15;

  const svgPoints = points.map((p, i) => {
    const x = padding + (i / (points.length - 1)) * (width - 2 * padding);
    const y =
      height -
      padding -
      ((p.equity - minEquity) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pathD = `M ${svgPoints.join(" L ")}`;
  const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${
    height - padding
  } Z`;

  const isTop3 = team.rank <= 3;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background click to dismiss */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-[#080B14] border-l border-white/12 h-full shadow-2xl overflow-y-auto flex flex-col slide-in-from-right duration-300">
        {/* Drawer Accent Top Strip */}
        <div
          className={`h-1.5 transition-all ${
            team.rank === 1
              ? "bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#D4AF37]"
              : team.rank === 2
              ? "bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300"
              : team.rank === 3
              ? "bg-gradient-to-r from-[#00F0FF] via-[#05CD99] to-[#00F0FF]"
              : "bg-white/10"
          }`}
        />

        {/* Drawer Header */}
        <div className="p-5 md:p-6 border-b border-white/8 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              {/* Rank Pill */}
              <div
                className={`px-3 py-1 rounded-lg font-mono text-sm font-black tracking-wider border ${
                  team.rank === 1
                    ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                    : team.rank === 2
                    ? "bg-slate-300/20 border-slate-300 text-slate-200"
                    : team.rank === 3
                    ? "bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]"
                    : "bg-white/5 border-white/10 text-slate-300"
                }`}
              >
                RANK #{team.rank}
              </div>

              {team.isCurrentUser && (
                <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-[10px] font-bold tracking-wider uppercase">
                  YOUR TEAM
                </span>
              )}

              <span className="text-[11px] font-mono text-slate-400">
                {team.countryCode} • {team.language}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight font-sans">
              {team.teamName}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              {team.institution} • {team.country}
            </p>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-5 md:p-6 space-y-6 flex-1">
          {/* Primary PnL Hero Card */}
          <div className="bg-[#050811] border border-white/8 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                AUDITED SCORE & P&L
              </span>
              <span className="text-xs font-mono text-[#05CD99] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#05CD99] animate-pulse" />
                DMX-35 CERTIFIED
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl md:text-3xl font-black text-[#05CD99] font-mono tracking-tight">
                  +{team.cumulativePnLBlitz.toLocaleString()} Blitz
                </div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  +{team.cumulativePnLPercent.toFixed(2)}% Net Capital Gain
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">
                  COMPETITION SCORE
                </span>
                <span className="text-2xl font-extrabold text-white font-mono">
                  {team.score.toFixed(1)}
                  <span className="text-xs text-slate-500 font-normal"> / 100</span>
                </span>
              </div>
            </div>
          </div>

          {/* Equity Curve Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                EQUITY PROGRESSION CURVE
              </span>
              <span className="text-[11px] text-slate-500">
                1M Blitz Start → {(team.cumulativePnLBlitz / 1000000 + 1).toFixed(2)}M End
              </span>
            </div>

            <div className="bg-[#05070E] border border-white/8 rounded-xl p-3 relative overflow-hidden">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-36 overflow-visible"
              >
                <defs>
                  <linearGradient id="drawerCurveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#05CD99" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#05CD99" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line
                  x1={padding}
                  y1={height / 2}
                  x2={width - padding}
                  y2={height / 2}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                />

                {/* Filled Area */}
                <path d={areaD} fill="url(#drawerCurveGrad)" />

                {/* Line Path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#05CD99"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* End Point Dot */}
                {svgPoints.length > 0 && (
                  <circle
                    cx={svgPoints[svgPoints.length - 1].split(",")[0]}
                    cy={svgPoints[svgPoints.length - 1].split(",")[1]}
                    r="4.5"
                    fill="#05CD99"
                    stroke="#080B14"
                    strokeWidth="2"
                  />
                )}
              </svg>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-white/5">
                <span>ROUND 01 LAUNCH</span>
                <span>MID-SESSION</span>
                <span>ROUND 02 LIVE</span>
              </div>
            </div>
          </div>

          {/* Round Performance Breakdown */}
          <div className="space-y-2">
            <span className="text-slate-300 font-bold uppercase tracking-wider font-mono text-xs flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              ROUND PERFORMANCE AUDIT
            </span>

            <div className="grid grid-cols-3 gap-2.5 font-mono text-xs">
              <div className="bg-[#050811] border border-white/6 rounded-lg p-3 text-center space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">ROUND 01</span>
                <span className="text-white font-bold text-sm block">
                  {team.roundScores.r1.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400">Baseload Spot</span>
              </div>

              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-3 text-center space-y-1 shadow-[0_0_12px_rgba(212,175,55,0.1)]">
                <span className="text-[10px] text-[#D4AF37] uppercase font-bold block">
                  ROUND 02 (LIVE)
                </span>
                <span className="text-[#D4AF37] font-black text-sm block">
                  {team.roundScores.r2.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400">The Arbitrage</span>
              </div>

              <div className="bg-[#050811] border border-white/6 rounded-lg p-3 text-center space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">ROUND 03</span>
                <span className="text-slate-300 font-bold text-sm block">
                  {team.roundScores.r3.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-500">Quantum Grid</span>
              </div>
            </div>
          </div>

          {/* Risk & Quantitative Metrics Grid */}
          <div className="space-y-2">
            <span className="text-slate-300 font-bold uppercase tracking-wider font-mono text-xs flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#05CD99]" />
              INSTITUTIONAL RISK METRICS
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
              <div className="bg-[#050811] border border-white/6 rounded-lg p-2.5">
                <span className="text-[10px] text-slate-500 block uppercase">SHARPE RATIO</span>
                <span className="text-white font-bold text-sm mt-0.5 block">
                  {team.sharpeRatio.toFixed(2)}
                </span>
              </div>

              <div className="bg-[#050811] border border-white/6 rounded-lg p-2.5">
                <span className="text-[10px] text-slate-500 block uppercase">SORTINO RATIO</span>
                <span className="text-[#05CD99] font-bold text-sm mt-0.5 block">
                  {team.sortinoRatio.toFixed(2)}
                </span>
              </div>

              <div className="bg-[#050811] border border-white/6 rounded-lg p-2.5">
                <span className="text-[10px] text-slate-500 block uppercase">MAX DRAWDOWN</span>
                <span className="text-rose-400 font-bold text-sm mt-0.5 block">
                  -{team.maxDrawdownPercent.toFixed(2)}%
                </span>
              </div>

              <div className="bg-[#050811] border border-white/6 rounded-lg p-2.5">
                <span className="text-[10px] text-slate-500 block uppercase">CALMAR RATIO</span>
                <span className="text-slate-200 font-bold text-sm mt-0.5 block">
                  {team.calmarRatio.toFixed(1)}
                </span>
              </div>

              <div className="bg-[#050811] border border-white/6 rounded-lg p-2.5">
                <span className="text-[10px] text-slate-500 block uppercase">WIN RATE</span>
                <span className="text-slate-200 font-bold text-sm mt-0.5 block">
                  {team.winRate.toFixed(1)}%
                </span>
              </div>

              <div className="bg-[#050811] border border-white/6 rounded-lg p-2.5">
                <span className="text-[10px] text-slate-500 block uppercase">DAILY VOLATILITY</span>
                <span className="text-slate-200 font-bold text-sm mt-0.5 block">
                  {team.dailyVolatility.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Strategy Style & Enclave Security Guard */}
          <div className="bg-[#050811] border border-white/8 rounded-xl p-3.5 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold uppercase text-[11px]">
              <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
              ACTIVE STRATEGY CLASSIFICATION
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
              {team.strategyStyle}
            </p>

            {/* Confidential Strategy Code Notice */}
            <div className="mt-3 pt-3 border-t border-white/6 flex items-start gap-2 text-[10px] text-slate-500 font-sans leading-relaxed">
              <Lock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-300 font-semibold">
                  Confidential Strategy Source Code:
                </strong>{" "}
                In strict compliance with DMX-35 exchange protocol, intellectual property and execution logic are encrypted in secure hardware enclaves and cannot be inspected.
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/8 bg-[#060811] flex items-center justify-between font-mono text-[11px] text-slate-500">
          <span>Last Fill: {team.lastOrderTime}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
