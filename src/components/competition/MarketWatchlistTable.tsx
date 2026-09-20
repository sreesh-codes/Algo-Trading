"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Activity, ArrowRight } from "lucide-react";

interface WatchlistAsset {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change24h: number;
  changePercent: number;
  volume: string;
  spread: number;
  positionQty: number;
  positionSide: "LONG" | "SHORT" | "FLAT";
  positionPnl: string;
  lastTick?: "up" | "down";
}

const INITIAL_WATCHLIST: WatchlistAsset[] = [
  {
    ticker: "DUNE-NRG",
    name: "Dune Energy",
    sector: "Clean Solar & Storage",
    price: 428.60,
    change24h: 25.80,
    changePercent: 6.40,
    volume: "48.2M",
    spread: 0.10,
    positionQty: 1200,
    positionSide: "LONG",
    positionPnl: "+15,960 Blitz",
  },
  {
    ticker: "NEX-AI",
    name: "Nexus AI",
    sector: "Neuromorphic Qubits",
    price: 1842.20,
    change24h: 208.50,
    changePercent: 12.76,
    volume: "132.5M",
    spread: 0.50,
    positionQty: 0,
    positionSide: "FLAT",
    positionPnl: "—",
  },
  {
    ticker: "ORBT-LOG",
    name: "Orbit Logistics",
    sector: "Pneumatic Hyperloop",
    price: 745.50,
    change24h: -10.20,
    changePercent: -1.35,
    volume: "29.7M",
    spread: 0.25,
    positionQty: 800,
    positionSide: "LONG",
    positionPnl: "+61,640 Blitz",
  },
  {
    ticker: "DES-H2",
    name: "Desert Hydrogen",
    sector: "Cryogenic Green Fuel",
    price: 518.75,
    change24h: 16.10,
    changePercent: 3.20,
    volume: "61.4M",
    spread: 0.20,
    positionQty: -450,
    positionSide: "SHORT",
    positionPnl: "+8,750 Blitz",
  },
  {
    ticker: "DIFC-100",
    name: "DIFC-100",
    sector: "Sovereign Composite",
    price: 14892.40,
    change24h: 588.20,
    changePercent: 4.11,
    volume: "480.9M",
    spread: 2.00,
    positionQty: 0,
    positionSide: "FLAT",
    positionPnl: "—",
  },
];

export const MarketWatchlistTable: React.FC = () => {
  const [items, setItems] = useState<WatchlistAsset[]>(INITIAL_WATCHLIST);

  // Subtle live simulated price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const next = [...prev];
        const targetIdx = Math.floor(Math.random() * next.length);
        const item = next[targetIdx];
        const delta = (Math.random() - 0.48) * 0.006 * item.price;
        const newPrice = Number((item.price + delta).toFixed(2));
        const dir: "up" | "down" = delta >= 0 ? "up" : "down";

        next[targetIdx] = {
          ...item,
          price: newPrice,
          changePercent: Number(
            (item.changePercent + (delta / item.price) * 100).toFixed(2)
          ),
          lastTick: dir,
        };
        return next;
      });

      setTimeout(() => {
        setItems((prev) =>
          prev.map((i) => (i.lastTick ? { ...i, lastTick: undefined } : i))
        );
      }, 700);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full p-4 sm:p-5 rounded-xl border border-white/10 bg-[#080D1A]/95 backdrop-blur-md shadow-2xl select-none flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-[#D4AF37]" />
          <span className="text-xs font-semibold text-white font-sans tracking-normal">
            Market Watchlist
          </span>
          <span className="text-[10px] font-mono text-[#05CD99]">Live L2</span>
        </div>

        <Link
          href="/markets"
          className="text-xs font-sans text-[#D4AF37] hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>All contracts</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-2 py-2 text-[11px] text-[#64748B] font-sans font-medium border-b border-white/5">
        <div className="col-span-4">Asset</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-2 text-right">24h</div>
        <div className="col-span-2 text-right">Vol</div>
        <div className="col-span-2 text-right">Position</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5 text-xs">
        {items.map((asset) => {
          const isUp = asset.changePercent >= 0;
          const isTickingUp = asset.lastTick === "up";
          const isTickingDown = asset.lastTick === "down";

          return (
            <div
              key={asset.ticker}
              className={`grid grid-cols-12 px-2 py-3 items-center hover:bg-white/[0.03] transition-colors rounded ${
                isTickingUp
                  ? "bg-[#05CD99]/10 transition-none"
                  : isTickingDown
                  ? "bg-[#EF4444]/10 transition-none"
                  : ""
              }`}
            >
              {/* Asset Name & Ticker */}
              <div className="col-span-4 pr-2">
                <div className="font-medium text-white text-xs font-sans truncate">
                  {asset.name}
                </div>
                <div className="text-[10px] font-mono text-[#64748B] truncate">
                  {asset.ticker} • Sp:{asset.spread.toFixed(2)}
                </div>
              </div>

              {/* Price with Live Tick Color */}
              <div className="col-span-2 text-right">
                <span
                  className={`font-semibold font-mono tabular-nums text-xs transition-colors duration-200 ${
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
              </div>

              {/* 24H Return */}
              <div className="col-span-2 text-right">
                <span
                  className={`inline-flex items-center text-xs font-mono font-medium tabular-nums ${
                    isUp ? "text-[#05CD99]" : "text-[#EF4444]"
                  }`}
                >
                  {isUp ? "+" : ""}
                  {asset.changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Volume */}
              <div className="col-span-2 text-right text-[#CBD5E1] text-[11px] font-mono tabular-nums">
                {asset.volume}
              </div>

              {/* Position */}
              <div className="col-span-2 text-right">
                {asset.positionSide === "FLAT" ? (
                  <span className="text-[10px] font-mono text-[#64748B]">Flat</span>
                ) : (
                  <div>
                    <span
                      className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border tabular-nums ${
                        asset.positionSide === "LONG"
                          ? "text-[#05CD99] border-[#05CD99]/30 bg-[#05CD99]/10"
                          : "text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/10"
                      }`}
                    >
                      {asset.positionSide === "LONG" ? "+" : ""}
                      {asset.positionQty}
                    </span>
                    <div className="text-[10px] text-[#05CD99] font-mono tabular-nums truncate">
                      {asset.positionPnl}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
