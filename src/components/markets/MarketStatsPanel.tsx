"use client";

import React from "react";
import { 
  TrendingUp, 
  ArrowDown, 
  ArrowUp, 
  FileText, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Coins, 
  Compass, 
  BarChart3 
} from "lucide-react";
import { AssetContract } from "@/data/mock/assets";

interface MarketStatsPanelProps {
  asset: AssetContract;
}

export function MarketStatsPanel({ asset }: MarketStatsPanelProps) {
  const vwap = Number((asset.lastPrice * 0.998).toFixed(2));
  const turnoverBlitz = asset.volume24hBlitz;
  const spreadBps = Number(((asset.spread / asset.lastPrice) * 10000).toFixed(1));

  return (
    <div className="bg-[#0b101d]/90 border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col backdrop-blur-md select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
            Market Statistics & Specifications
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
          Session: 2035-S4
        </span>
      </div>

      {/* Primary Key Stats Grid (24H High, 24H Low, Volume, Volatility, Spread, Open Interest) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* 24H HIGH */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[11px] font-medium text-gray-400 block">
            24h High
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base sm:text-lg font-mono font-semibold tabular-nums text-emerald-400">
              {asset.high24h.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-gray-500">Blitz</span>
          </div>
          <span className="text-[10px] font-mono tabular-nums text-gray-400 mt-0.5 block">
            +{((asset.high24h - asset.lastPrice) / asset.lastPrice * 100).toFixed(1)}% peak delta
          </span>
        </div>

        {/* 24H LOW */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[11px] font-medium text-gray-400 block">
            24h Low
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base sm:text-lg font-mono font-semibold tabular-nums text-rose-400">
              {asset.low24h.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-gray-500">Blitz</span>
          </div>
          <span className="text-[10px] font-mono tabular-nums text-gray-400 mt-0.5 block">
            -{((asset.lastPrice - asset.low24h) / asset.lastPrice * 100).toFixed(1)}% trough delta
          </span>
        </div>

        {/* 24H VOLUME */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[11px] font-medium text-gray-400 block">
            24h Volume
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base sm:text-lg font-mono font-semibold tabular-nums text-white">
              {asset.volume24h.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-gray-500">units</span>
          </div>
          <span className="text-[10px] font-mono tabular-nums text-cyan-400/90 mt-0.5 block">
            {(turnoverBlitz / 1000000).toFixed(2)}M Blitz turnover
          </span>
        </div>

        {/* VOLATILITY */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[11px] font-medium text-gray-400 block">
            Volatility
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base sm:text-lg font-mono font-semibold tabular-nums text-[#D4AF37]">
              {asset.volatilityPct}%
            </span>
            <span className="text-[10px] text-gray-500 font-sans">annualized</span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 mt-0.5 block">
            Tier: {asset.volatility}
          </span>
        </div>

        {/* SPREAD */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[11px] font-medium text-gray-400 block">
            Spread
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base sm:text-lg font-mono font-semibold tabular-nums text-cyan-300">
              {asset.spread.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-gray-500">Blitz</span>
          </div>
          <span className="text-[10px] font-mono tabular-nums text-emerald-400/90 mt-0.5 block">
            {spreadBps} bps
          </span>
        </div>

        {/* OPEN INTEREST */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[11px] font-medium text-gray-400 block">
            Open Interest
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base sm:text-lg font-mono font-semibold tabular-nums text-white">
              {asset.openInterest ? asset.openInterest.toLocaleString() : "—"}
            </span>
            <span className="text-[10px] font-mono text-gray-500">ctrs</span>
          </div>
          <span className="text-[10px] font-mono tabular-nums text-gray-400 mt-0.5 block">
            {asset.openInterestBlitz ? `${(asset.openInterestBlitz / 1000000).toFixed(1)}M Blitz notional` : "Index benchmark"}
          </span>
        </div>
      </div>

      {/* Historical Statistics & Session Benchmarks */}
      <div className="border-t border-white/5 pt-3">
        <span className="text-[11px] text-gray-400 block mb-2 font-medium">
          Historical Microstructure & Risk
        </span>

        <div className="divide-y divide-white/5 text-xs">
          <div className="py-2 flex items-center justify-between">
            <span className="text-gray-400">Session VWAP</span>
            <span className="text-white font-mono tabular-nums font-medium">{vwap.toFixed(2)} Blitz</span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-gray-400">Initial Margin Requirement</span>
            <span className="text-[#D4AF37] font-mono tabular-nums font-medium">{asset.marginRequirement}% (Leverage: {Math.round(100 / asset.marginRequirement)}x)</span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-gray-400">Minimum Tick Size</span>
            <span className="text-gray-300 font-mono tabular-nums font-medium">{asset.tickSize.toFixed(2)} Blitz</span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-gray-400">Liquidation Risk Band</span>
            <span className="text-emerald-400 font-mono tabular-nums font-medium">±6.5% Dynamic Circular</span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-gray-400">Settlement Venue</span>
            <span className="text-cyan-300 font-medium">DIFC Subterranean Clearing</span>
          </div>
        </div>
      </div>

      {/* Contract Specification Description */}
      <div className="border-t border-white/5 pt-3">
        <div className="flex items-center gap-2 mb-1.5">
          <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-xs font-semibold text-white">
            Contract Deliverable Specs
          </span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          {asset.description}
        </p>
        <div className="mt-2 text-xs text-gray-400">
          Deliverable unit: <span className="font-mono text-gray-200">{asset.contractSize}</span>
        </div>
      </div>
    </div>
  );
}
