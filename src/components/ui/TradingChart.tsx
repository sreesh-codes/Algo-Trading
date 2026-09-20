"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { HistoricalPoint } from "@/data/mock/assets";
import { GlassPanel } from "./GlassPanel";
import { clsx } from "clsx";

interface TradingChartProps {
  ticker: string;
  data: HistoricalPoint[];
  currentPrice: number;
  height?: number;
  className?: string;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  ticker,
  data,
  currentPrice,
  height = 340,
  className,
}) => {
  const [timeframe, setTimeframe] = useState<"1M" | "5M" | "1H" | "1D" | "ALL">("1H");

  const minPrice = Math.min(...data.map((d) => d.low)) * 0.995;
  const maxPrice = Math.max(...data.map((d) => d.high)) * 1.005;

  const isPositive = data.length > 1 && data[data.length - 1].close >= data[0].open;
  const strokeColor = isPositive ? "#05CD99" : "#EF4444";

  return (
    <GlassPanel hudCorners className={clsx("p-4 flex flex-col", className)}>
      {/* Chart Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono-tech font-bold text-lg text-white">
              {ticker}
            </span>
            <span className="font-mono-tech text-base text-[#D4AF37] font-semibold">
              {currentPrice.toFixed(2)} Blitz
            </span>
          </div>
          <span
            className={clsx(
              "font-mono-tech text-xs px-2 py-0.5 rounded border",
              isPositive
                ? "text-[#05CD99] bg-[#05CD99]/10 border-[#05CD99]/30"
                : "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30"
            )}
          >
            {isPositive ? "BULLISH TREND" : "BEARISH TREND"}
          </span>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 bg-[#05070B] p-0.5 rounded border border-white/10 text-xs font-mono-tech">
          {(["1M", "5M", "1H", "1D", "ALL"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={clsx(
                "px-2.5 py-1 rounded transition-colors cursor-pointer",
                timeframe === tf
                  ? "bg-[#D4AF37] text-[#05070B] font-bold shadow"
                  : "text-[#94A3B8] hover:text-white"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div style={{ height }} className="w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="timeLabel"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              fontFamily="var(--font-mono)"
            />

            <YAxis
              yAxisId="price"
              domain={[minPrice, maxPrice]}
              stroke="#64748B"
              fontSize={11}
              orientation="right"
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickFormatter={(v) => v.toFixed(1)}
              fontFamily="var(--font-mono)"
            />

            <YAxis
              yAxisId="volume"
              domain={[0, (dataMax: number) => dataMax * 3.5]}
              orientation="left"
              hide
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as HistoricalPoint;
                  return (
                    <div className="bg-[#0A0E1A]/95 border border-[#D4AF37]/40 p-3 rounded shadow-2xl backdrop-blur-md font-mono-tech text-xs space-y-1">
                      <div className="text-[#D4AF37] font-bold border-b border-white/10 pb-1">
                        {ticker} • {d.timeLabel} GST
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[#CBD5E1] text-[11px]">
                        <span>OPEN:</span> <span className="text-right">{d.open.toFixed(2)}</span>
                        <span>HIGH:</span> <span className="text-right text-[#05CD99]">{d.high.toFixed(2)}</span>
                        <span>LOW:</span> <span className="text-right text-[#EF4444]">{d.low.toFixed(2)}</span>
                        <span>CLOSE:</span> <span className="text-right font-bold">{d.close.toFixed(2)}</span>
                        <span className="text-[#94A3B8]">VOLUME:</span>
                        <span className="text-right text-[#94A3B8]">{d.volume.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Volume Bars */}
            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill="rgba(255,255,255,0.08)"
              radius={[2, 2, 0, 0]}
              isAnimationActive={true}
              animationDuration={750}
              animationEasing="ease-out"
            />

            {/* Price Area */}
            <Area
              yAxisId="price"
              type="monotone"
              dataKey="close"
              stroke={strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
              isAnimationActive={true}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
};
