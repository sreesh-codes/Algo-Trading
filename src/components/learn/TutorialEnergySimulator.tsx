"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Zap,
  Activity,
  CheckCircle2,
  DollarSign,
  Layers,
} from "lucide-react";

interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
  depthPercent: number;
}

export const TutorialEnergySimulator: React.FC = () => {
  const [midPrice, setMidPrice] = useState<number>(100.25);
  const [spread, setSpread] = useState<number>(0.30);
  const [position, setPosition] = useState<number>(0);
  const [avgEntryPrice, setAvgEntryPrice] = useState<number>(0);
  const [realizedPnl, setRealizedPnl] = useState<number>(0);
  const [lastAction, setLastAction] = useState<string>("Simulator initialized. Ready for order placement.");

  const bestBid = +(midPrice - spread / 2).toFixed(2);
  const bestAsk = +(midPrice + spread / 2).toFixed(2);

  // Micro-price oscillation to demonstrate mark-to-market unrealized PnL
  useEffect(() => {
    const timer = setInterval(() => {
      setMidPrice((prev) => {
        const delta = (Math.random() - 0.5) * 0.08;
        return +(prev + delta).toFixed(2);
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Compute Unrealized PnL
  const unrealizedPnl =
    position !== 0 ? +(position * (midPrice - avgEntryPrice)).toFixed(2) : 0;
  const totalPnl = +(realizedPnl + unrealizedPnl).toFixed(2);

  // Simulated Order Book levels
  const bids: OrderBookLevel[] = [
    { price: bestBid, size: 25, total: 25, depthPercent: 40 },
    { price: +(bestBid - 0.10).toFixed(2), size: 45, total: 70, depthPercent: 70 },
    { price: +(bestBid - 0.20).toFixed(2), size: 60, total: 130, depthPercent: 100 },
  ];

  const asks: OrderBookLevel[] = [
    { price: +(bestAsk + 0.20).toFixed(2), size: 55, total: 125, depthPercent: 100 },
    { price: +(bestAsk + 0.10).toFixed(2), size: 40, total: 70, depthPercent: 65 },
    { price: bestAsk, size: 30, total: 30, depthPercent: 45 },
  ];

  // Actions
  const handleLimitBuy = () => {
    const qty = 10;
    const fillPrice = bestBid;
    const newPos = position + qty;
    const newAvg =
      position <= 0
        ? fillPrice
        : (position * avgEntryPrice + qty * fillPrice) / newPos;

    setPosition(newPos);
    setAvgEntryPrice(+newAvg.toFixed(2));
    setLastAction(`Filled LIMIT BUY ${qty} contracts @ ${fillPrice.toFixed(2)} Blitz`);
  };

  const handleLimitSell = () => {
    const qty = 10;
    const fillPrice = bestAsk;
    const newPos = position - qty;

    if (position > 0) {
      // Realize profit on long
      const pnlGain = (fillPrice - avgEntryPrice) * qty;
      setRealizedPnl((prev) => +(prev + pnlGain).toFixed(2));
    }

    const newAvg =
      position >= 0
        ? fillPrice
        : (Math.abs(position) * avgEntryPrice + qty * fillPrice) / Math.abs(newPos);

    setPosition(newPos);
    setAvgEntryPrice(+newAvg.toFixed(2));
    setLastAction(`Filled LIMIT SELL ${qty} contracts @ ${fillPrice.toFixed(2)} Blitz`);
  };

  const handleMarketBuy = () => {
    const qty = 10;
    const fillPrice = bestAsk; // Sweeps best ask
    const newPos = position + qty;
    const newAvg =
      position <= 0
        ? fillPrice
        : (position * avgEntryPrice + qty * fillPrice) / newPos;

    setPosition(newPos);
    setAvgEntryPrice(+newAvg.toFixed(2));
    setLastAction(`Executed MARKET BUY ${qty} @ ${fillPrice.toFixed(2)} Blitz (Crossed Spread)`);
  };

  const handleMarketSell = () => {
    const qty = 10;
    const fillPrice = bestBid; // Sweeps best bid
    const newPos = position - qty;

    if (position > 0) {
      const pnlGain = (fillPrice - avgEntryPrice) * qty;
      setRealizedPnl((prev) => +(prev + pnlGain).toFixed(2));
    }

    setPosition(newPos);
    setAvgEntryPrice(fillPrice);
    setLastAction(`Executed MARKET SELL ${qty} @ ${fillPrice.toFixed(2)} Blitz (Crossed Spread)`);
  };

  const handleReset = () => {
    setPosition(0);
    setAvgEntryPrice(0);
    setRealizedPnl(0);
    setMidPrice(100.25);
    setLastAction("Simulator reset to zero position & neutral cash.");
  };

  return (
    <div className="w-full bg-[#080B14] border border-white/10 rounded-2xl p-5 md:p-6 space-y-6 shadow-2xl">
      {/* Simulator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/8 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] font-mono text-[11px] font-bold tracking-wider uppercase">
              INTERACTIVE MARKET SIMULATOR
            </span>
            <span className="text-xs font-mono text-[#05CD99] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#05CD99] animate-pulse" />
              LIVE TICKING
            </span>
          </div>
          <h3 className="text-xl font-bold text-white font-sans mt-1">
            TUTORIAL ENERGY (TUT-NRG)
          </h3>
          <p className="text-xs text-slate-400">
            Fictional micro-market contract for practicing orders, queue priority, and mark-to-market accounting.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition border border-white/10 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Simulator</span>
        </button>
      </div>

      {/* Primary Financial Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
        <div className="bg-[#05070E] border border-white/6 rounded-xl p-3">
          <span className="text-[10px] text-slate-500 uppercase block">MID PRICE</span>
          <span className="text-base font-black text-white mt-0.5 block tabular-nums">
            {midPrice.toFixed(2)} <span className="text-[10px] text-slate-500 font-normal">Blitz</span>
          </span>
        </div>

        <div className="bg-[#05070E] border border-white/6 rounded-xl p-3">
          <span className="text-[10px] text-slate-500 uppercase block">BEST BID / ASK</span>
          <div className="text-xs font-bold mt-0.5 tabular-nums">
            <span className="text-[#05CD99]">{bestBid.toFixed(2)}</span>
            <span className="text-slate-600 mx-1">/</span>
            <span className="text-rose-400">{bestAsk.toFixed(2)}</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Spread: {spread.toFixed(2)}</span>
        </div>

        <div className="bg-[#05070E] border border-white/6 rounded-xl p-3">
          <span className="text-[10px] text-slate-500 uppercase block">NET POSITION</span>
          <span
            className={`text-base font-black mt-0.5 block tabular-nums ${
              position > 0
                ? "text-[#05CD99]"
                : position < 0
                ? "text-rose-400"
                : "text-slate-300"
            }`}
          >
            {position > 0 ? `+${position}` : position} lots
          </span>
          <span className="text-[10px] text-slate-500 block">
            {position !== 0 ? `@ avg ${avgEntryPrice.toFixed(2)}` : "Flat"}
          </span>
        </div>

        <div className="bg-[#05070E] border border-white/6 rounded-xl p-3">
          <span className="text-[10px] text-slate-500 uppercase block">UNREALIZED P&L</span>
          <span
            className={`text-base font-black mt-0.5 block tabular-nums ${
              unrealizedPnl > 0
                ? "text-[#05CD99]"
                : unrealizedPnl < 0
                ? "text-rose-400"
                : "text-slate-400"
            }`}
          >
            {unrealizedPnl >= 0 ? "+" : ""}
            {unrealizedPnl.toFixed(2)} Blitz
          </span>
          <span className="text-[10px] text-slate-500 block">Mark-to-Market</span>
        </div>

        <div className="bg-[#05070E] border border-white/6 rounded-xl p-3 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-500 uppercase block">TOTAL P&L</span>
          <span
            className={`text-base font-black mt-0.5 block tabular-nums ${
              totalPnl > 0
                ? "text-[#05CD99]"
                : totalPnl < 0
                ? "text-rose-400"
                : "text-slate-300"
            }`}
          >
            {totalPnl >= 0 ? "+" : ""}
            {totalPnl.toFixed(2)} Blitz
          </span>
          <span className="text-[10px] text-slate-500 block">
            Realized: {realizedPnl >= 0 ? "+" : ""}
            {realizedPnl.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Interactive Mini Order Book & Order Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Mini Level 2 Order Book (7 cols) */}
        <div className="lg:col-span-7 bg-[#05070E] border border-white/8 rounded-xl p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/6 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
              LEVEL 2 MATCHING QUEUE
            </span>
            <span>Price-Time Priority (FIFO)</span>
          </div>

          {/* Asks (Sells, descending) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase px-1">
              <span>ASK (SELLERS)</span>
              <span>SIZE</span>
              <span>DEPTH</span>
            </div>
            {asks.map((ask, i) => (
              <div
                key={`ask-${i}`}
                className="relative flex items-center justify-between px-2 py-1 rounded bg-rose-500/[0.04] border border-rose-500/10 overflow-hidden"
              >
                <div
                  className="absolute right-0 top-0 bottom-0 bg-rose-500/15 pointer-events-none transition-all"
                  style={{ width: `${ask.depthPercent}%` }}
                />
                <span className="text-rose-400 font-bold relative z-10">
                  {ask.price.toFixed(2)}
                </span>
                <span className="text-slate-300 relative z-10">{ask.size}</span>
                <span className="text-slate-500 text-[10px] relative z-10">
                  {ask.total}
                </span>
              </div>
            ))}
          </div>

          {/* Spread Indicator Bar */}
          <div className="py-2 px-3 bg-black/50 rounded-lg border border-white/6 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              SPREAD: <strong className="text-white">{spread.toFixed(2)} Blitz</strong>
            </span>
            <span className="text-[#D4AF37] font-bold">
              MID: {midPrice.toFixed(2)} Blitz
            </span>
          </div>

          {/* Bids (Buys, descending) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase px-1">
              <span>BID (BUYERS)</span>
              <span>SIZE</span>
              <span>DEPTH</span>
            </div>
            {bids.map((bid, i) => (
              <div
                key={`bid-${i}`}
                className="relative flex items-center justify-between px-2 py-1 rounded bg-[#05CD99]/[0.04] border border-[#05CD99]/10 overflow-hidden"
              >
                <div
                  className="absolute right-0 top-0 bottom-0 bg-[#05CD99]/15 pointer-events-none transition-all"
                  style={{ width: `${bid.depthPercent}%` }}
                />
                <span className="text-[#05CD99] font-bold relative z-10">
                  {bid.price.toFixed(2)}
                </span>
                <span className="text-slate-300 relative z-10">{bid.size}</span>
                <span className="text-slate-500 text-[10px] relative z-10">
                  {bid.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Tactile Order Execution Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[#05070E] border border-white/8 rounded-xl p-4 space-y-4 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/6 pb-2 mb-3">
              <span className="font-bold text-white uppercase">ORDER DISPATCH</span>
              <span className="text-[#05CD99]">1-CLICK EXECUTION</span>
            </div>

            <div className="space-y-2.5">
              {/* Limit Orders */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleLimitBuy}
                  className="p-2.5 rounded-lg bg-[#05CD99]/15 hover:bg-[#05CD99]/25 border border-[#05CD99]/30 text-[#05CD99] text-xs font-bold transition cursor-pointer text-left"
                >
                  <div className="text-[10px] text-slate-400">LIMIT BUY 10</div>
                  <div className="text-sm font-black">@{bestBid.toFixed(2)}</div>
                </button>

                <button
                  type="button"
                  onClick={handleLimitSell}
                  className="p-2.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-bold transition cursor-pointer text-left"
                >
                  <div className="text-[10px] text-slate-400">LIMIT SELL 10</div>
                  <div className="text-sm font-black">@{bestAsk.toFixed(2)}</div>
                </button>
              </div>

              {/* Market Orders */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleMarketBuy}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition cursor-pointer text-left"
                >
                  <div className="text-[10px] text-slate-500">TAKE (SWEEP ASK)</div>
                  <div>MARKET BUY</div>
                </button>

                <button
                  type="button"
                  onClick={handleMarketSell}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition cursor-pointer text-left"
                >
                  <div className="text-[10px] text-slate-500">HIT (SWEEP BID)</div>
                  <div>MARKET SELL</div>
                </button>
              </div>
            </div>
          </div>

          {/* Action Log Message */}
          <div className="p-3 rounded-lg bg-black/60 border border-white/6 text-[11px] text-slate-300 leading-relaxed font-mono">
            <span className="text-slate-500 uppercase text-[10px] block mb-0.5">
              LAST MATCHING ENGINE EVENT
            </span>
            {lastAction}
          </div>
        </div>
      </div>
    </div>
  );
};
