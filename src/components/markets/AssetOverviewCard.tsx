"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Activity, ArrowRight, TrendingUp } from "lucide-react";
import { AssetContract } from "@/data/mock/assets";

interface AssetOverviewCardProps {
  asset: AssetContract;
}

export function AssetOverviewCard({ asset }: AssetOverviewCardProps) {
  const [currentPrice, setCurrentPrice] = useState(asset.lastPrice);
  const [lastTick, setLastTick] = useState<"up" | "down" | null>(null);
  const [sparkline, setSparkline] = useState<number[]>(asset.sparkline);

  // Subtle live simulated tick
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.45) {
        const delta = (Math.random() - 0.47) * (asset.lastPrice * 0.002);
        const nextPrice = Number((currentPrice + delta).toFixed(2));
        setLastTick(delta >= 0 ? "up" : "down");
        setCurrentPrice(nextPrice);
        setSparkline((prev) => [...prev.slice(1), nextPrice]);

        setTimeout(() => {
          setLastTick(null);
        }, 800);
      }
    }, 2800 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [currentPrice, asset.lastPrice]);

  const isPositive = asset.change24h >= 0;

  // Generate SVG points for mini chart
  const minPrice = Math.min(...sparkline);
  const maxPrice = Math.max(...sparkline);
  const range = maxPrice - minPrice || 1;

  const width = 160;
  const height = 48;
  const points = sparkline
    .map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - minPrice) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPoints = `${points} ${width},${height} 0,${height}`;

  const strokeColor = isPositive ? "#05CD99" : "#EF4444";
  const fillColor = isPositive ? "url(#greenAreaGrad)" : "url(#redAreaGrad)";

  const volatilityColor = {
    LOW: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    MEDIUM: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    HIGH: "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30",
    EXTREME: "text-rose-400 bg-rose-500/10 border-rose-500/30",
  }[asset.volatility];

  return (
    <Link
      href="/markets"
      className={`group relative block rounded-xl border bg-[#0b101d]/90 p-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] select-none ${
        lastTick === "up"
          ? "border-emerald-500/50 bg-emerald-950/20"
          : lastTick === "down"
          ? "border-rose-500/50 bg-rose-950/20"
          : "border-white/10 hover:border-[#D4AF37]/40"
      }`}
    >
      {/* Top Asset Header with Image Thumbnail */}
      <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/15 shrink-0 bg-black/60 shadow-sm">
            <img
              src={asset.image}
              alt={asset.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white group-hover:text-[#D4AF37] font-sans transition-colors tracking-tight">
                {asset.name}
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                {asset.ticker}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-sans mt-0.5">
              {asset.sector}
            </div>
          </div>
        </div>

        {/* Volatility Badge */}
        <div className="text-right">
          <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${volatilityColor}`}>
            Vol: {asset.volatilityPct}%
          </span>
        </div>
      </div>

      {/* Center: Price & Mini Chart */}
      <div className="py-3 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-xl sm:text-2xl font-semibold font-mono tabular-nums tracking-tight transition-colors ${
                lastTick === "up"
                  ? "text-emerald-400"
                  : lastTick === "down"
                  ? "text-rose-400"
                  : "text-white"
              }`}
            >
              {currentPrice.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400 font-sans">Blitz</span>
          </div>

          <div
            className={`flex items-center gap-1 text-xs font-mono font-medium tabular-nums mt-0.5 ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>
              {isPositive ? "+" : ""}
              {asset.change24h.toFixed(2)} ({isPositive ? "+" : ""}
              {asset.change24hPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Mini SVG Sparkline Chart */}
        <div className="w-[140px] sm:w-[160px] h-[48px] relative shrink-0">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="greenAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#05CD99" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#05CD99" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="redAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <polygon points={areaPoints} fill={fillColor} />
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Bottom Metrics Bar: Volume & Spread */}
      <div className="pt-2.5 border-t border-white/5 grid grid-cols-3 gap-2 text-[10px]">
        <div>
          <span className="text-[10px] text-gray-500 font-sans block">24h Volume</span>
          <span className="text-gray-200 font-mono font-medium text-xs tabular-nums">
            {(asset.volume24hBlitz / 1000000).toFixed(1)}M Blitz
          </span>
        </div>

        <div>
          <span className="text-[10px] text-gray-500 font-sans block">Spread</span>
          <span className="text-cyan-400 font-mono font-medium text-xs tabular-nums">
            {asset.spread.toFixed(2)} Blitz ({((asset.spread / asset.lastPrice) * 10000).toFixed(1)} bps)
          </span>
        </div>

        <div className="text-right flex items-center justify-end">
          <span className="text-cyan-400 group-hover:text-white flex items-center gap-1 text-xs font-sans font-medium transition-colors">
            Trade terminal
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
