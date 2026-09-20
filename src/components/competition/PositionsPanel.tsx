"use client";

import React from "react";
import Link from "next/link";
import { Layers, ShieldCheck, ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";

interface PositionItem {
  ticker: string;
  name: string;
  side: "LONG" | "SHORT";
  quantity: number;
  avgPrice: number;
  markPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  exposureBlitz: number;
  marginBlitz: number;
}

const POSITIONS_DATA: PositionItem[] = [
  {
    ticker: "DUNE-NRG",
    name: "Dune Energy",
    side: "LONG",
    quantity: 1200,
    avgPrice: 371.20,
    markPrice: 428.60,
    unrealizedPnL: 68880.00,
    unrealizedPnLPercent: 15.46,
    exposureBlitz: 514320.00,
    marginBlitz: 41145.60,
  },
  {
    ticker: "ORBT-LOG",
    name: "Orbit Logistics",
    side: "LONG",
    quantity: 800,
    avgPrice: 813.20,
    markPrice: 745.50,
    unrealizedPnL: -54160.00,
    unrealizedPnLPercent: -8.32,
    exposureBlitz: 596400.00,
    marginBlitz: 89460.00,
  },
  {
    ticker: "DES-H2",
    name: "Desert Hydrogen",
    side: "SHORT",
    quantity: 450,
    avgPrice: 538.20,
    markPrice: 518.75,
    unrealizedPnL: 8752.50,
    unrealizedPnLPercent: 3.61,
    exposureBlitz: 233437.50,
    marginBlitz: 28012.50,
  },
];

export const PositionsPanel: React.FC = () => {
  const totalExposure = POSITIONS_DATA.reduce((acc, p) => acc + p.exposureBlitz, 0);
  const totalUnrealizedPnL = POSITIONS_DATA.reduce((acc, p) => acc + p.unrealizedPnL, 0);

  return (
    <div className="w-full p-4 sm:p-5 rounded-xl border border-white/10 bg-[#080D1A]/95 backdrop-blur-md shadow-2xl select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-[#00F0FF]" />
          <span className="text-xs font-semibold text-white font-sans tracking-normal">
            Active Portfolio Positions
          </span>
          <span className="text-[11px] font-mono text-[#94A3B8]">
            ({POSITIONS_DATA.length} open contracts)
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-sans">
          <div>
            <span className="text-[#64748B] text-[11px]">Total exposure: </span>
            <span className="text-white font-mono font-medium tabular-nums">
              {(totalExposure / 1000000).toFixed(2)}M Blitz
            </span>
          </div>
          <div>
            <span className="text-[#64748B] text-[11px]">Net unrealized: </span>
            <span
              className={`font-mono font-medium tabular-nums ${
                totalUnrealizedPnL >= 0 ? "text-[#05CD99]" : "text-[#EF4444]"
              }`}
            >
              {totalUnrealizedPnL >= 0 ? "+" : ""}
              {totalUnrealizedPnL.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              Blitz
            </span>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="overflow-x-auto">
        <div className="min-w-[620px]">
          <div className="grid grid-cols-12 px-3 py-2 text-[11px] text-[#64748B] font-sans font-medium border-b border-white/5">
            <div className="col-span-3">Asset</div>
            <div className="col-span-2 text-right">Position</div>
            <div className="col-span-2 text-right">Avg Price</div>
            <div className="col-span-2 text-right">Mark Price</div>
            <div className="col-span-3 text-right">Unrealized P&L</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5 text-xs">
            {POSITIONS_DATA.map((pos) => {
              const isProfit = pos.unrealizedPnL >= 0;

              return (
                <div
                  key={pos.ticker}
                  className="grid grid-cols-12 px-3 py-3 items-center hover:bg-white/[0.03] transition-colors"
                >
                  {/* Asset */}
                  <div className="col-span-3">
                    <div className="font-medium text-white text-xs font-sans truncate">
                      {pos.name}
                    </div>
                    <div className="text-[10px] font-mono text-[#64748B]">
                      {pos.ticker} • Margin: {(pos.marginBlitz / 1000).toFixed(1)}k
                    </div>
                  </div>

                  {/* Position Side & Qty */}
                  <div className="col-span-2 text-right">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border tabular-nums ${
                        pos.side === "LONG"
                          ? "text-[#05CD99] border-[#05CD99]/30 bg-[#05CD99]/10"
                          : "text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/10"
                      }`}
                    >
                      {pos.side === "LONG" ? "+" : "-"}
                      {pos.quantity} {pos.side}
                    </span>
                  </div>

                  {/* Average Price */}
                  <div className="col-span-2 text-right font-mono text-xs text-[#CBD5E1] tabular-nums">
                    {pos.avgPrice.toFixed(2)} Blitz
                  </div>

                  {/* Mark Price */}
                  <div className="col-span-2 text-right text-white font-mono text-xs font-medium tabular-nums">
                    {pos.markPrice.toFixed(2)} Blitz
                  </div>

                  {/* Unrealized PnL & Exposure */}
                  <div className="col-span-3 text-right">
                    <div
                      className={`font-mono text-xs font-semibold tabular-nums ${
                        isProfit ? "text-[#05CD99]" : "text-[#EF4444]"
                      }`}
                    >
                      {isProfit ? "+" : ""}
                      {pos.unrealizedPnL.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      Blitz
                    </div>
                    <div className="text-[10px] font-mono text-[#64748B] tabular-nums">
                      <span className={isProfit ? "text-[#05CD99]" : "text-[#EF4444]"}>
                        ({isProfit ? "+" : ""}
                        {pos.unrealizedPnLPercent.toFixed(2)}%)
                      </span>{" "}
                      • Exp: {(pos.exposureBlitz / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
