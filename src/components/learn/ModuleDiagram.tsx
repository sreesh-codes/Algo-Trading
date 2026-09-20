"use client";

import React from "react";
import { Activity, Layers, TrendingUp } from "lucide-react";

interface ModuleDiagramProps {
  type: "orderbook" | "inventorySkew" | "cointegration";
}

export const ModuleDiagram: React.FC<ModuleDiagramProps> = ({ type }) => {
  if (type === "orderbook") {
    return (
      <div className="w-full bg-[#05070E] border border-white/8 rounded-xl p-4 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/6 pb-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#00F0FF]" />
            TECHNICAL DIAGRAM: CONTINUOUS DOUBLE AUCTION
          </span>
          <span className="text-[#D4AF37]">FIFO QUEUE PRIORITY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-center">
          {/* Buyers Queue */}
          <div className="p-3 rounded-lg bg-[#05CD99]/10 border border-[#05CD99]/20 space-y-1">
            <span className="text-[10px] text-[#05CD99] font-bold block uppercase">
              BID QUEUE (BUYERS)
            </span>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="p-1 rounded bg-[#05CD99]/20 text-[#05CD99] font-bold">
                100.10 Blitz (Best Bid)
              </div>
              <div className="p-1 rounded bg-black/40">100.00 Blitz</div>
              <div className="p-1 rounded bg-black/40">99.90 Blitz</div>
            </div>
          </div>

          {/* Central Spread Gap */}
          <div className="p-3 rounded-lg bg-black/50 border border-white/6 space-y-2">
            <span className="text-[10px] text-slate-400 block uppercase">
              BID-ASK SPREAD GAP
            </span>
            <div className="text-base font-black text-[#D4AF37]">
              0.30 Blitz
            </div>
            <span className="text-[10px] text-slate-500 block">
              Market Maker Revenue Zone
            </span>
          </div>

          {/* Sellers Queue */}
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 space-y-1">
            <span className="text-[10px] text-rose-400 font-bold block uppercase">
              ASK QUEUE (SELLERS)
            </span>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="p-1 rounded bg-rose-500/20 text-rose-400 font-bold">
                100.40 Blitz (Best Ask)
              </div>
              <div className="p-1 rounded bg-black/40">100.50 Blitz</div>
              <div className="p-1 rounded bg-black/40">100.60 Blitz</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "inventorySkew") {
    return (
      <div className="w-full bg-[#05070E] border border-white/8 rounded-xl p-4 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/6 pb-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#D4AF37]" />
            TECHNICAL DIAGRAM: AVELLANEDA-STOIKOV INVENTORY SKEW
          </span>
          <span className="text-slate-400">r(s, q) = s - q·γ·σ²</span>
        </div>

        <div className="h-32 relative flex items-center justify-between px-6 border border-white/5 rounded-lg bg-black/40">
          {/* Baseline Midprice line */}
          <div className="absolute left-6 right-6 top-1/2 h-[1px] bg-slate-600 border-t border-dashed border-slate-500" />
          <span className="absolute left-7 top-10 text-[10px] text-slate-400">
            Unadjusted Mid-Price ($s$)
          </span>

          {/* Skewed Reservation Curve */}
          <svg className="absolute inset-0 w-full h-full overflow-visible px-6">
            <path
              d="M 20,40 Q 200,64 380,95"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2.5"
            />
          </svg>

          <div className="relative z-10 text-left space-y-0.5">
            <span className="text-[10px] text-[#05CD99] font-bold block">
              SHORT INVENTORY (-q)
            </span>
            <span className="text-[10px] text-slate-400">Quotes Skew Upward</span>
          </div>

          <div className="relative z-10 text-center space-y-0.5">
            <span className="text-[10px] text-white font-bold block">
              NEUTRAL (q = 0)
            </span>
            <span className="text-[10px] text-slate-400">Symmetric Quotes</span>
          </div>

          <div className="relative z-10 text-right space-y-0.5">
            <span className="text-[10px] text-rose-400 font-bold block">
              LONG INVENTORY (+q)
            </span>
            <span className="text-[10px] text-slate-400">Quotes Skew Downward</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "cointegration") {
    return (
      <div className="w-full bg-[#05070E] border border-white/8 rounded-xl p-4 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/6 pb-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#05CD99]" />
            TECHNICAL DIAGRAM: COINTEGRATED SPREAD OSCILLATOR
          </span>
          <span className="text-[#05CD99]">Z-SCORE MEAN-REVERSION</span>
        </div>

        <div className="h-32 relative flex items-center justify-between px-6 border border-white/5 rounded-lg bg-black/40 overflow-hidden">
          {/* Upper Threshold +2.0 */}
          <div className="absolute left-0 right-0 top-6 h-[1px] bg-rose-500/40 border-t border-dashed border-rose-500/60" />
          <span className="absolute right-4 top-2 text-[10px] text-rose-400 font-bold">
            +2.0 Z (SELL SPREAD LEG)
          </span>

          {/* Equilibrium Zero line */}
          <div className="absolute left-0 right-0 top-16 h-[1px] bg-white/20" />
          <span className="absolute right-4 top-13 text-[10px] text-slate-400">
            0.0 μ (FAIR VALUE EQUILIBRIUM)
          </span>

          {/* Lower Threshold -2.0 */}
          <div className="absolute left-0 right-0 bottom-6 h-[1px] bg-[#05CD99]/40 border-t border-dashed border-[#05CD99]/60" />
          <span className="absolute right-4 bottom-2 text-[10px] text-[#05CD99] font-bold">
            -2.0 Z (BUY SPREAD LEG)
          </span>

          {/* Oscillating sine wave */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <path
              d="M 20,64 Q 70,18 120,64 T 220,110 T 320,24 T 420,64"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </div>
    );
  }

  return null;
};
