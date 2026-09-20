"use client";

import React, { useState, useEffect } from "react";
import { Activity, ArrowUpRight, ArrowDownRight, Clock, ShieldCheck } from "lucide-react";
import { ExecutedTrade } from "@/data/mock/trades";

interface RecentTradesTapeProps {
  initialTrades: ExecutedTrade[];
  ticker: string;
  lastPrice: number;
}

export function RecentTradesTape({ initialTrades, ticker, lastPrice }: RecentTradesTapeProps) {
  const [trades, setTrades] = useState<ExecutedTrade[]>(initialTrades);
  const [newTradeId, setNewTradeId] = useState<string | null>(null);

  // Simulate continuous newly arriving trades
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.4) {
        const side: "BUY" | "SELL" = Math.random() > 0.48 ? "BUY" : "SELL";
        const delta = (Math.random() - 0.48) * (lastPrice * 0.001);
        const price = Number((lastPrice + delta).toFixed(2));
        const quantity = Math.floor(20 + Math.random() * 250);

        const now = new Date();
        const hours = String((now.getUTCHours() + 4) % 24).padStart(2, "0");
        const mins = String(now.getUTCMinutes()).padStart(2, "0");
        const secs = String(now.getUTCSeconds()).padStart(2, "0");
        const ms = String(Math.floor(Math.random() * 900) + 100);
        const timestamp = `${hours}:${mins}:${secs}.${ms}`;

        const tradeId = `TRD-${Date.now().toString().slice(-5)}`;

        const newTrade: ExecutedTrade = {
          tradeId,
          ticker,
          timestamp,
          side,
          price,
          quantity,
          volumeBlitz: Number((price * quantity).toFixed(2)),
          buyer: side === "BUY" ? "Aggressive Taker Pool" : "Falcon Arbitrage DIFC",
          seller: side === "SELL" ? "Liquidity Provider DIP" : "Apex Quant Zurich",
          latencyMs: Number((0.25 + Math.random() * 0.25).toFixed(2))
        };

        setNewTradeId(tradeId);
        setTrades((prev) => [newTrade, ...prev.slice(0, 14)]);

        setTimeout(() => {
          setNewTradeId(null);
        }, 1200);
      }
    }, 2400);

    return () => clearInterval(timer);
  }, [ticker, lastPrice]);

  return (
    <div className="bg-[#0b101d]/90 border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col backdrop-blur-md select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold text-white font-sans tracking-normal">
            Recent Executions Tape
          </h3>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
          <span className="flex items-center gap-1 text-cyan-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Real-time matched
          </span>
          <span>•</span>
          <span>{ticker}</span>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-12 gap-2 py-2 border-b border-white/5 text-[11px] font-sans font-medium text-gray-400">
        <div className="col-span-3">Time</div>
        <div className="col-span-2">Side</div>
        <div className="col-span-3 text-right">Price (Blitz)</div>
        <div className="col-span-2 text-right">Size</div>
        <div className="col-span-2 text-right">Latency</div>
      </div>

      {/* Trades Stream */}
      <div className="divide-y divide-white/5 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
        {trades.map((t) => {
          const isNew = t.tradeId === newTradeId;
          const isBuy = t.side === "BUY";
          return (
            <div
              key={t.tradeId}
              className={`grid grid-cols-12 gap-2 py-2 px-1 text-xs items-center transition-all duration-300 rounded ${
                isNew
                  ? isBuy
                    ? "bg-emerald-500/20 border border-emerald-500/40 shadow-[0_0_10px_rgba(5,205,153,0.3)]"
                    : "bg-rose-500/20 border border-rose-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                  : "hover:bg-white/[0.02]"
              }`}
            >
              {/* Timestamp */}
              <div className="col-span-3 text-[11px] font-mono text-gray-400 truncate tabular-nums">
                {t.timestamp}
              </div>

              {/* Side */}
              <div className="col-span-2 flex items-center gap-1">
                <span
                  className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                    isBuy
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {t.side}
                </span>
              </div>

              {/* Price */}
              <div
                className={`col-span-3 text-right font-mono font-semibold tabular-nums ${
                  isBuy ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {t.price.toFixed(2)}
              </div>

              {/* Size */}
              <div className="col-span-2 text-right font-mono text-xs tabular-nums text-gray-300 font-medium">
                {t.quantity.toLocaleString()}
              </div>

              {/* Latency */}
              <div className="col-span-2 text-right text-[11px] font-mono tabular-nums text-gray-500">
                {t.latencyMs.toFixed(2)}ms
              </div>
            </div>
          );
        })}
      </div>

      {/* Tape Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
        <span>Feed buffer: Shared memory</span>
        <span className="text-gray-400">Synced with DIFC Router</span>
      </div>
    </div>
  );
}
