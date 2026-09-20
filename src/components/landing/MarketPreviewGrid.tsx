"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp, Sparkles } from "lucide-react";

interface FictionalAsset {
  id: string;
  ticker: string;
  name: string;
  category: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  sparkline: number[];
  high: number;
  low: number;
  lastTickDir?: "up" | "down";
}

const INITIAL_ASSETS: FictionalAsset[] = [
  {
    id: "dune",
    ticker: "DUNE-NRG",
    name: "DUNE ENERGY",
    category: "Baseload Solar & Molten Salt",
    price: 428.60,
    change: 25.80,
    changePercent: 6.40,
    volume: "48.2M Blitz",
    high: 435.0,
    low: 402.5,
    sparkline: [402, 408, 415, 412, 420, 424, 422, 428.6],
  },
  {
    id: "nexus",
    ticker: "NEX-AI",
    name: "NEXUS AI",
    category: "Neuromorphic Qubit Compute",
    price: 1842.20,
    change: 208.50,
    changePercent: 12.76,
    volume: "132.5M Blitz",
    high: 1870.0,
    low: 1630.0,
    sparkline: [1630, 1680, 1720, 1710, 1790, 1820, 1805, 1842.2],
  },
  {
    id: "orbit",
    ticker: "ORBT-LOG",
    name: "ORBIT LOGISTICS",
    category: "Autonomous Freight & Hyperloop",
    price: 745.50,
    change: -10.20,
    changePercent: -1.35,
    volume: "29.7M Blitz",
    high: 765.0,
    low: 738.0,
    sparkline: [760, 755, 762, 750, 742, 748, 740, 745.5],
  },
  {
    id: "hydrogen",
    ticker: "DES-H2",
    name: "DESERT HYDROGEN",
    category: "Cryogenic Green Marine Fuel",
    price: 518.75,
    change: 16.10,
    changePercent: 3.20,
    volume: "61.4M Blitz",
    high: 524.0,
    low: 501.2,
    sparkline: [502, 508, 506, 512, 510, 515, 514, 518.75],
  },
  {
    id: "difc100",
    ticker: "DIFC-100",
    name: "DIFC-100",
    category: "Sovereign Composite Benchmark",
    price: 14892.40,
    change: 588.20,
    changePercent: 4.11,
    volume: "480.9M Blitz",
    high: 14950.0,
    low: 14280.0,
    sparkline: [14300, 14450, 14520, 14600, 14720, 14800, 14780, 14892.4],
  },
];

export const MarketPreviewGrid: React.FC = () => {
  const [assets, setAssets] = useState<FictionalAsset[]>(INITIAL_ASSETS);
  const [activeAsset, setActiveAsset] = useState<string>("dune");

  // Subtle live price tick animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prev) => {
        const next = [...prev];
        // Pick 1 or 2 random assets to tick
        const count = Math.random() > 0.5 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const targetIdx = Math.floor(Math.random() * next.length);
          const current = next[targetIdx];
          const deltaPercent = (Math.random() - 0.48) * 0.008; // -0.4% to +0.4%
          const priceDelta = current.price * deltaPercent;
          const newPrice = Number((current.price + priceDelta).toFixed(2));
          const dir: "up" | "down" = priceDelta >= 0 ? "up" : "down";

          const newSparkline = [...current.sparkline.slice(1), newPrice];

          next[targetIdx] = {
            ...current,
            price: newPrice,
            change: Number((current.change + priceDelta).toFixed(2)),
            changePercent: Number(
              (((newPrice - (current.price - current.change)) / (current.price - current.change)) * 100).toFixed(2)
            ),
            sparkline: newSparkline,
            high: Math.max(current.high, newPrice),
            low: Math.min(current.low, newPrice),
            lastTickDir: dir,
          };
        }
        return next;
      });

      // Clear tick pulse after 700ms
      setTimeout(() => {
        setAssets((prev) =>
          prev.map((a) => (a.lastTickDir ? { ...a, lastTickDir: undefined } : a))
        );
      }, 700);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4 font-sans">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#05CD99] animate-pulse" />
            <span className="font-mono text-xs tracking-wider text-[#D4AF37] uppercase font-semibold">
              Synthetic Continuous Order Flow
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Liquid Markets of 2035
          </h3>
          <p className="text-sm text-[#94A3B8] font-sans mt-1 max-w-xl leading-relaxed">
            Sovereign high-frequency contracts cleared via the DMX-35 Cryogenic Engine. Sub-millisecond matching across clean energy baseload, quantum tensor allocations, and hyperloop logistics.
          </p>
        </div>

        <Link
          href="/markets"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] hover:text-white font-sans text-xs font-semibold transition-all"
        >
          <span>View all 5 contracts</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Grid of 5 assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {assets.map((asset) => {
          const isUp = asset.changePercent >= 0;
          const isTickingUp = asset.lastTickDir === "up";
          const isTickingDown = asset.lastTickDir === "down";

          // Calculate SVG sparkline points
          const min = Math.min(...asset.sparkline);
          const max = Math.max(...asset.sparkline);
          const range = max - min || 1;
          const points = asset.sparkline
            .map((val, idx) => {
              const x = (idx / (asset.sparkline.length - 1)) * 140;
              const y = 45 - ((val - min) / range) * 35;
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <div
              key={asset.id}
              onClick={() => setActiveAsset(asset.id)}
              className={`relative rounded-xl p-4 select-none cursor-pointer transition-all duration-200 border flex flex-col justify-between ${
                activeAsset === asset.id
                  ? "bg-[#0C1425] border-[#D4AF37]/60 shadow-[0_0_24px_rgba(212,175,55,0.12)]"
                  : "bg-[#080D18]/90 border-white/10 hover:border-white/25 hover:bg-[#0A1120]"
              } ${
                isTickingUp
                  ? "border-[#05CD99] shadow-[0_0_16px_rgba(5,205,153,0.3)] transition-none"
                  : isTickingDown
                  ? "border-[#EF4444] shadow-[0_0_16px_rgba(239,68,68,0.3)] transition-none"
                  : ""
              }`}
            >
              <div>
                {/* Ticker & Category */}
                <div className="flex items-center justify-between gap-1 mb-1 font-mono">
                  <span className="text-xs font-bold text-[#D4AF37]">
                    {asset.ticker}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#94A3B8] border border-white/5 truncate max-w-[90px]">
                    {asset.category.split(" ")[0]}
                  </span>
                </div>

                {/* Asset Full Name (Natural title case) */}
                <div className="text-sm font-semibold text-white tracking-tight font-sans mb-3 truncate">
                  {asset.name === "DUNE ENERGY" ? "Dune Energy" :
                   asset.name === "NEXUS AI" ? "Nexus AI" :
                   asset.name === "ORBIT LOGISTICS" ? "Orbit Logistics" :
                   asset.name === "DESERT HYDROGEN" ? "Desert Hydrogen" : asset.name}
                </div>

                {/* Price and Live Flash */}
                <div className="flex items-baseline justify-between mb-1.5 font-mono tabular-nums">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-xl font-bold tracking-tight transition-colors duration-200 ${
                        isTickingUp
                          ? "text-[#05CD99]"
                          : isTickingDown
                          ? "text-[#EF4444]"
                          : "text-white"
                      }`}
                    >
                      {asset.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">Blitz</span>
                  </div>

                  {/* Change badge */}
                  <div
                    className={`inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${
                      isUp
                        ? "text-[#05CD99] bg-[#05CD99]/10"
                        : "text-[#EF4444] bg-[#EF4444]/10"
                    }`}
                  >
                    {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    <span>{Math.abs(asset.changePercent)}%</span>
                  </div>
                </div>

                {/* High / Low range indicator */}
                <div className="text-[9px] text-[#64748B] flex justify-between mb-3">
                  <span>L: {asset.low.toFixed(1)}</span>
                  <span>H: {asset.high.toFixed(1)}</span>
                </div>

                {/* SVG Sparkline with glowing gradient */}
                <div className="w-full h-14 relative my-1">
                  <svg
                    viewBox="0 0 140 50"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id={`grad-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor={isUp ? "#05CD99" : "#EF4444"}
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor={isUp ? "#05CD99" : "#EF4444"}
                          stopOpacity="0.0"
                        />
                      </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <polygon
                      points={`0,50 ${points} 140,50`}
                      fill={`url(#grad-${asset.id})`}
                    />

                    {/* Stroke line */}
                    <polyline
                      fill="none"
                      stroke={isUp ? "#05CD99" : "#EF4444"}
                      strokeWidth="2"
                      points={points}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Final point ping dot */}
                    {asset.sparkline.length > 0 && (
                      <circle
                        cx="140"
                        cy={45 - ((asset.sparkline[asset.sparkline.length - 1] - min) / range) * 35}
                        r="2.5"
                        fill="#FFFFFF"
                        stroke={isUp ? "#05CD99" : "#EF4444"}
                        strokeWidth="1.5"
                      />
                    )}
                  </svg>
                </div>
              </div>

              {/* Volume & Trade action */}
              <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="text-[#64748B]">VOL: {asset.volume}</span>
                <Link
                  href={`/markets`}
                  className="text-[#D4AF37] hover:text-white flex items-center gap-0.5 font-semibold transition-colors"
                >
                  <span>TRADE</span>
                  <ArrowUpRight size={11} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
