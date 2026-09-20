"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Layers, Activity, ShieldAlert, ArrowUpDown } from "lucide-react";
import { OrderBook, OrderBookLevel } from "@/data/mock/markets";

interface OrderBookWidgetProps {
  initialOrderBook: OrderBook;
  tickSize: number;
}

export function OrderBookWidget({ initialOrderBook, tickSize }: OrderBookWidgetProps) {
  const [bids, setBids] = useState<OrderBookLevel[]>(initialOrderBook.bids);
  const [asks, setAsks] = useState<OrderBookLevel[]>(initialOrderBook.asks);
  const [lastPrice, setLastPrice] = useState<number>(initialOrderBook.lastPrice);
  const [lastDirection, setLastDirection] = useState<"up" | "down" | null>(null);

  // Subtle live updates using mock timers
  useEffect(() => {
    const timer = setInterval(() => {
      // Fluctuate size on random bid or ask level
      if (Math.random() > 0.35) {
        const isBid = Math.random() > 0.5;
        if (isBid) {
          setBids((prev) => {
            const targetIdx = Math.floor(Math.random() * prev.length);
            const deltaSize = Math.floor((Math.random() - 0.45) * 40);
            return prev.map((lvl, idx) => {
              if (idx === targetIdx) {
                const newSize = Math.max(20, lvl.size + deltaSize);
                return { ...lvl, size: newSize };
              }
              return lvl;
            });
          });
        } else {
          setAsks((prev) => {
            const targetIdx = Math.floor(Math.random() * prev.length);
            const deltaSize = Math.floor((Math.random() - 0.45) * 40);
            return prev.map((lvl, idx) => {
              if (idx === targetIdx) {
                const newSize = Math.max(20, lvl.size + deltaSize);
                return { ...lvl, size: newSize };
              }
              return lvl;
            });
          });
        }
      }

      // Micro price update on top of book
      if (Math.random() > 0.8) {
        const delta = (Math.random() > 0.5 ? 1 : -1) * tickSize;
        const newPx = Number((lastPrice + delta).toFixed(2));
        setLastDirection(delta >= 0 ? "up" : "down");
        setLastPrice(newPx);
        setTimeout(() => setLastDirection(null), 600);
      }
    }, 1800);

    return () => clearInterval(timer);
  }, [lastPrice, tickSize]);

  // Compute cumulative depth and percentages
  const maxBidTotal = bids.reduce((acc, b) => acc + b.size, 0) || 1;
  const maxAskTotal = asks.reduce((acc, a) => acc + a.size, 0) || 1;
  const maxDepth = Math.max(maxBidTotal, maxAskTotal);

  const computedBids = useMemo(() => {
    return bids.reduce<Array<OrderBookLevel & { total: number; depthPercent: number }>>((acc, b) => {
      const prevTotal = acc.length > 0 ? acc[acc.length - 1].total : 0;
      const total = prevTotal + b.size;
      acc.push({
        ...b,
        total,
        depthPercent: Math.min(100, Math.round((total / maxDepth) * 100)),
      });
      return acc;
    }, []);
  }, [bids, maxDepth]);

  const computedAsks = useMemo(() => {
    return asks.reduce<Array<OrderBookLevel & { total: number; depthPercent: number }>>((acc, a) => {
      const prevTotal = acc.length > 0 ? acc[acc.length - 1].total : 0;
      const total = prevTotal + a.size;
      acc.push({
        ...a,
        total,
        depthPercent: Math.min(100, Math.round((total / maxDepth) * 100)),
      });
      return acc;
    }, []);
  }, [asks, maxDepth]);

  const bestBid = computedBids[0]?.price || lastPrice - tickSize;
  const bestAsk = computedAsks[0]?.price || lastPrice + tickSize;
  const spread = Math.max(0, Number((bestAsk - bestBid).toFixed(2)));
  const spreadBps = Number(((spread / lastPrice) * 10000).toFixed(1));

  return (
    <div className="bg-[#0b101d]/90 border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col backdrop-blur-md select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-xs font-semibold text-white font-sans tracking-normal">
            Central Limit Order Book (L2)
          </h3>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live depth
          </span>
          <span>•</span>
          <span>Tick: {tickSize.toFixed(2)}</span>
        </div>
      </div>

      {/* Columns Label */}
      <div className="grid grid-cols-2 gap-4 py-2 border-b border-white/5 text-[11px] font-sans font-medium text-gray-400">
        {/* Bids Header */}
        <div className="flex items-center justify-between pr-2">
          <span className="text-emerald-400 font-medium">Bids (Size)</span>
          <span className="text-emerald-400 font-medium">Price (Blitz)</span>
        </div>

        {/* Asks Header */}
        <div className="flex items-center justify-between pl-2">
          <span className="text-rose-400 font-medium">Price (Blitz)</span>
          <span className="text-rose-400 font-medium">Asks (Size)</span>
        </div>
      </div>

      {/* Dual Side Order Book Display */}
      <div className="grid grid-cols-2 gap-4 py-2 font-mono text-xs">
        {/* BIDS COLUMN */}
        <div className="space-y-1 pr-1 border-r border-white/5">
          {computedBids.map((b, idx) => (
            <div
              key={`bid-${idx}`}
              className="relative flex items-center justify-between py-1 px-2 rounded overflow-hidden group hover:bg-white/[0.04] transition-colors"
            >
              {/* Green Horizontal Depth Bar */}
              <div
                className="absolute top-0 right-0 h-full bg-emerald-500/15 group-hover:bg-emerald-500/25 pointer-events-none transition-all duration-300"
                style={{ width: `${b.depthPercent}%` }}
              />

              <span className="relative z-10 text-gray-300 tabular-nums">
                {b.size.toLocaleString()}
              </span>

              <span className="relative z-10 text-emerald-400 font-semibold tabular-nums">
                {b.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* ASKS COLUMN */}
        <div className="space-y-1 pl-1">
          {computedAsks.map((a, idx) => (
            <div
              key={`ask-${idx}`}
              className="relative flex items-center justify-between py-1 px-2 rounded overflow-hidden group hover:bg-white/[0.04] transition-colors"
            >
              {/* Red Horizontal Depth Bar */}
              <div
                className="absolute top-0 left-0 h-full bg-rose-500/15 group-hover:bg-rose-500/25 pointer-events-none transition-all duration-300"
                style={{ width: `${a.depthPercent}%` }}
              />

              <span className="relative z-10 text-rose-400 font-semibold tabular-nums">
                {a.price.toFixed(2)}
              </span>

              <span className="relative z-10 text-gray-300 tabular-nums">
                {a.size.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Center Spread Bar */}
      <div className="my-2 py-2 px-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-sans text-gray-400">Spread:</span>
          <span className="font-semibold text-cyan-300 font-mono tabular-nums">
            {spread.toFixed(2)} Blitz
          </span>
          <span className="text-[10px] text-gray-400 font-mono tabular-nums">
            ({spreadBps} bps)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-sans text-gray-400">Last match:</span>
          <span
            className={`font-semibold font-mono tabular-nums transition-colors ${
              lastDirection === "up"
                ? "text-emerald-400"
                : lastDirection === "down"
                ? "text-rose-400"
                : "text-white"
            }`}
          >
            {lastPrice.toFixed(2)} Blitz
          </span>
        </div>
      </div>

      {/* Footer Liquidity Metrics */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400 tabular-nums">
        <span>Bid depth: {maxBidTotal.toLocaleString()}</span>
        <span>Ask depth: {maxAskTotal.toLocaleString()}</span>
        <span>Ratio: {(maxBidTotal / (maxAskTotal || 1)).toFixed(2)}x</span>
      </div>
    </div>
  );
}
