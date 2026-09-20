"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOCK_ASSETS } from "@/data/mock/assets";
import { PriceChange } from "./PriceChange";
import { ShieldCheck, Activity } from "lucide-react";

export const MarketTicker: React.FC = () => {
  const pathname = usePathname();
  if (pathname === "/") return null;

  // Duplicate assets to produce an infinite seamless marquee loop
  const duplicatedAssets = [...MOCK_ASSETS, ...MOCK_ASSETS];

  return (
    <div className="w-full bg-[#070A10] border-b border-white/8 h-9 overflow-hidden flex items-center select-none relative z-20">
      {/* Left Fixed Ticker Badge */}
      <div className="shrink-0 bg-[#0B0F19] px-3 h-full flex items-center gap-2 border-r border-white/10 z-10 shadow-lg">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#05CD99] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#05CD99]" />
        </span>
        <span className="font-mono-tech text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold flex items-center gap-1">
          <Activity size={11} /> DMX-35 LIVE
        </span>
      </div>

      {/* Marquee Track */}
      <div className="flex overflow-hidden relative flex-1">
        <div className="animate-marquee flex items-center">
          {duplicatedAssets.map((asset, idx) => (
            <Link
              key={`${asset.ticker}-${idx}`}
              href="/markets"
              className="inline-flex items-center gap-2.5 px-4 h-full border-r border-white/5 hover:bg-white/5 transition-colors cursor-pointer group shrink-0"
            >
              <span className="font-mono-tech font-bold text-xs text-white group-hover:text-[#D4AF37] transition-colors">
                {asset.ticker}
              </span>
              <span className="font-mono-tech text-xs text-[#CBD5E1]">
                {asset.lastPrice.toFixed(2)} Blitz
              </span>
              <PriceChange
                value={asset.change24h}
                percent={asset.change24hPercent}
                size="sm"
                showIcon={false}
              />
              <span className="font-mono-tech text-[10px] text-[#64748B]">
                SP:{asset.spread.toFixed(2)}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Right Fixed Engine Health */}
      <div className="hidden lg:flex shrink-0 bg-[#0B0F19] px-3 h-full items-center gap-2 border-l border-white/10 z-10 font-mono-tech text-[10px] text-[#94A3B8]">
        <ShieldCheck size={12} className="text-[#05CD99]" />
        <span>MATCHING: 1.18ms</span>
      </div>
    </div>
  );
};
