"use client";

import React, { useState } from "react";
import { ProfileEquityPoint } from "@/data/mock/profile";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart2,
  Calendar,
  Layers,
} from "lucide-react";

interface ProfileEquityChartProps {
  data: ProfileEquityPoint[];
}

export const ProfileEquityChart: React.FC<ProfileEquityChartProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<"EQUITY" | "DRAWDOWN" | "DAILY_PNL">("EQUITY");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activePoint =
    hoveredIndex !== null && data[hoveredIndex] ? data[hoveredIndex] : data[data.length - 1];

  const width = 800;
  const height = 240;
  const paddingX = 20;
  const paddingY = 20;

  // Render SVG Paths based on activeTab
  let svgContent = null;

  if (activeTab === "EQUITY") {
    const minVal = Math.min(...data.map((d) => Math.min(d.equity, d.benchmark))) * 0.95;
    const maxVal = Math.max(...data.map((d) => Math.max(d.equity, d.benchmark))) * 1.05;
    const range = maxVal - minVal || 1;

    const equityPoints = data.map((d, i) => {
      const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((d.equity - minVal) / range) * (height - 2 * paddingY);
      return `${x},${y}`;
    });

    const benchPoints = data.map((d, i) => {
      const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((d.benchmark - minVal) / range) * (height - 2 * paddingY);
      return `${x},${y}`;
    });

    const pathEquity = `M ${equityPoints.join(" L ")}`;
    const areaEquity = `${pathEquity} L ${width - paddingX},${height - paddingY} L ${paddingX},${
      height - paddingY
    } Z`;
    const pathBench = `M ${benchPoints.join(" L ")}`;

    svgContent = (
      <>
        <defs>
          <linearGradient id="equityProfileGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#05CD99" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#05CD99" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid guide */}
        <line
          x1={paddingX}
          y1={height / 2}
          x2={width - paddingX}
          y2={height / 2}
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="3 3"
        />

        {/* Benchmark Line (Slate dashed) */}
        <path
          d={pathBench}
          fill="none"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Main Equity Area & Line */}
        <path key={`area-${activeTab}`} d={areaEquity} fill="url(#equityProfileGrad)" className="animate-chart-area" />
        <path
          key={`line-${activeTab}`}
          d={pathEquity}
          fill="none"
          stroke="#05CD99"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="animate-draw-line"
        />

        {/* Active Hover crosshair dot */}
        {hoveredIndex !== null && equityPoints[hoveredIndex] && (
          <circle
            cx={equityPoints[hoveredIndex].split(",")[0]}
            cy={equityPoints[hoveredIndex].split(",")[1]}
            r="5"
            fill="#05CD99"
            stroke="#080B14"
            strokeWidth="2.5"
          />
        )}
      </>
    );
  } else if (activeTab === "DRAWDOWN") {
    const minVal = -6.0;
    const maxVal = 0.0;
    const range = 6.0;

    const ddPoints = data.map((d, i) => {
      const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
      const y = paddingY + ((0 - d.drawdown) / range) * (height - 2 * paddingY);
      return `${x},${y}`;
    });

    const pathDD = `M ${ddPoints.join(" L ")}`;
    const areaDD = `M ${paddingX},${paddingY} L ${ddPoints.join(" L ")} L ${
      width - paddingX
    },${paddingY} Z`;

    svgContent = (
      <>
        <defs>
          <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Zero baseline */}
        <line
          x1={paddingX}
          y1={paddingY}
          x2={width - paddingX}
          y2={paddingY}
          stroke="rgba(255,255,255,0.2)"
        />

        {/* 4% limit threshold */}
        <line
          x1={paddingX}
          y1={paddingY + (4 / 6) * (height - 2 * paddingY)}
          x2={width - paddingX}
          y2={paddingY + (4 / 6) * (height - 2 * paddingY)}
          stroke="rgba(239,68,68,0.4)"
          strokeDasharray="3 3"
        />

        <path key={`dd-area-${activeTab}`} d={areaDD} fill="url(#ddGrad)" className="animate-chart-area" />
        <path
          key={`dd-line-${activeTab}`}
          d={pathDD}
          fill="none"
          stroke="#EF4444"
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-draw-line"
        />
      </>
    );
  } else {
    // DAILY PNL Bars
    const maxBar = 65000;
    const barWidth = (width - 2 * paddingX) / data.length - 4;

    svgContent = (
      <>
        <line
          x1={paddingX}
          y1={height / 2}
          x2={width - paddingX}
          y2={height / 2}
          stroke="rgba(255,255,255,0.15)"
        />

        {data.map((d, i) => {
          const x = paddingX + i * ((width - 2 * paddingX) / data.length);
          const isPositive = d.dailyPnl >= 0;
          const barHeight = Math.min(
            height / 2 - paddingY,
            (Math.abs(d.dailyPnl) / maxBar) * (height / 2 - paddingY)
          );
          const y = isPositive ? height / 2 - barHeight : height / 2;

          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={Math.max(2, barWidth)}
              height={Math.max(2, barHeight)}
              fill={isPositive ? "#05CD99" : "#EF4444"}
              opacity={hoveredIndex === i ? 1 : 0.8}
              rx="1"
            />
          );
        })}
      </>
    );
  }

  return (
    <div className="w-full bg-[#080B14] border border-white/10 rounded-2xl p-5 md:p-6 space-y-5 shadow-2xl">
      {/* Chart Titlebar & Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#05CD99]/15 border border-[#05CD99]/30 text-[#05CD99] font-mono text-[10px] font-bold uppercase tracking-wider">
              QUANTITATIVE PERFORMANCE TRACK RECORD
            </span>
            <span className="text-xs font-mono text-slate-500">
              AUDITED AUM TRAJECTORY
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl md:text-3xl font-black text-white font-mono tracking-tight">
              {activeTab === "EQUITY"
                ? `${(activePoint.equity / 1000000).toFixed(3)}M Blitz`
                : activeTab === "DRAWDOWN"
                ? `${activePoint.drawdown.toFixed(2)}%`
                : `+${activePoint.dailyPnl.toLocaleString()} Blitz`}
            </span>
            <span className="text-xs font-mono text-[#05CD99] font-bold">
              +1,428,950 Blitz (+28.58%) Total Net
            </span>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1 bg-[#05070E] p-1 rounded-xl border border-white/8 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("EQUITY")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-bold text-[11px] ${
              activeTab === "EQUITY"
                ? "bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.25)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            EQUITY (AUM)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("DRAWDOWN")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-bold text-[11px] ${
              activeTab === "DRAWDOWN"
                ? "bg-rose-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            MAX DRAWDOWN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("DAILY_PNL")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-bold text-[11px] ${
              activeTab === "DAILY_PNL"
                ? "bg-white/15 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            SESSION P&L
          </button>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full bg-[#05070E] border border-white/6 rounded-xl p-4 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 md:h-64 overflow-visible"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const idx = Math.round(
              ((relX - paddingX) / (rect.width - 2 * paddingX)) * (data.length - 1)
            );
            if (idx >= 0 && idx < data.length) setHoveredIndex(idx);
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {svgContent}
        </svg>

        {/* Legend / Reference labels */}
        <div className="pt-3 border-t border-white/6 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#05CD99]" />
              Quantum Desert Alpha
            </span>
            {activeTab === "EQUITY" && (
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-3 h-[1px] bg-slate-500 border-t border-dashed border-slate-400" />
                DIFC-100 Benchmark Index (+12.4%)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span>Date: {activePoint.date}</span>
            <span className="text-slate-600">|</span>
            <span>
              Valuation:{" "}
              <strong className="text-white">
                {activePoint.equity.toLocaleString()} Blitz
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
