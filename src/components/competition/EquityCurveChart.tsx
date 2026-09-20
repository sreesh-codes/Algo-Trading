"use client";

import React, { useState, useRef, useMemo } from "react";
import { TrendingUp, Layers, Eye, Maximize2, ShieldCheck, Activity } from "lucide-react";

type ChartTab = "EQUITY" | "PNL" | "DRAWDOWN" | "POSITION";

interface DataPoint {
  time: string;
  equity: number;
  benchmark: number;
  pnl: number;
  drawdown: number;
  position: number;
}

const REALISTIC_CHART_DATA: DataPoint[] = [
  { time: "10:00", equity: 5000000, benchmark: 5000000, pnl: 0, drawdown: 0, position: 840000 },
  { time: "11:00", equity: 5082000, benchmark: 5035000, pnl: 82000, drawdown: 0, position: 1240000 },
  { time: "12:00", equity: 5195000, benchmark: 5070000, pnl: 195000, drawdown: 0, position: 1680000 },
  { time: "13:00", equity: 5140000, benchmark: 5110000, pnl: 140000, drawdown: -1.06, position: 1120000 },
  { time: "14:00", equity: 5310000, benchmark: 5145000, pnl: 310000, drawdown: 0, position: 1940000 },
  { time: "15:00", equity: 5490000, benchmark: 5210000, pnl: 490000, drawdown: 0, position: 2150000 },
  { time: "16:00", equity: 5420000, benchmark: 5240000, pnl: 420000, drawdown: -1.28, position: 1450000 },
  { time: "17:00", equity: 5680000, benchmark: 5320000, pnl: 680000, drawdown: 0, position: 1820000 },
  { time: "18:00", equity: 5890000, benchmark: 5390000, pnl: 890000, drawdown: 0, position: 2280000 },
  { time: "19:00", equity: 5760000, benchmark: 5450000, pnl: 760000, drawdown: -2.21, position: 1390000 },
  { time: "20:00", equity: 6050000, benchmark: 5520000, pnl: 1050000, drawdown: 0, position: 2420000 },
  { time: "21:00", equity: 6240000, benchmark: 5610000, pnl: 1240000, drawdown: 0, position: 1980000 },
  { time: "22:00", equity: 6180000, benchmark: 5680000, pnl: 1180000, drawdown: -0.96, position: 1540000 },
  { time: "23:00", equity: 6390000, benchmark: 5710000, pnl: 1390000, drawdown: 0, position: 2120000 },
  { time: "23:35", equity: 6428950, benchmark: 5720000, pnl: 1428950, drawdown: 0, position: 1670600 },
];

export const EquityCurveChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ChartTab>("EQUITY");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const points = REALISTIC_CHART_DATA;

  // Compute domain bounds based on active tab
  const { minVal, maxVal, getYValue, formatVal, unit } = useMemo(() => {
    switch (activeTab) {
      case "EQUITY":
        return {
          minVal: 4800000,
          maxVal: 6600000,
          getYValue: (d: DataPoint) => d.equity,
          formatVal: (v: number) => `${(v / 1000000).toFixed(2)}M Blitz`,
          unit: "Blitz",
        };
      case "PNL":
        return {
          minVal: -100000,
          maxVal: 1600000,
          getYValue: (d: DataPoint) => d.pnl,
          formatVal: (v: number) => `+${(v / 1000).toFixed(0)}K Blitz`,
          unit: "Blitz",
        };
      case "DRAWDOWN":
        return {
          minVal: -6.0,
          maxVal: 0.5,
          getYValue: (d: DataPoint) => d.drawdown,
          formatVal: (v: number) => `${v.toFixed(2)}%`,
          unit: "%",
        };
      case "POSITION":
        return {
          minVal: 500000,
          maxVal: 2800000,
          getYValue: (d: DataPoint) => d.position,
          formatVal: (v: number) => `${(v / 1000000).toFixed(2)}M Blitz`,
          unit: "Blitz",
        };
    }
  }, [activeTab]);

  // SVG dimensions
  const svgWidth = 840;
  const svgHeight = 280;
  const padLeft = 20;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  // Coordinate mapping
  const getCoords = (index: number, val: number) => {
    const x = padLeft + (index / (points.length - 1)) * chartW;
    const y = padTop + (1 - (val - minVal) / (maxVal - minVal)) * chartH;
    return { x, y };
  };

  // Main strategy curve
  const pathString = useMemo(() => {
    return points
      .map((pt, i) => {
        const { x, y } = getCoords(i, getYValue(pt));
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }, [points, minVal, maxVal, getYValue]);

  // Area fill under main curve
  const areaString = useMemo(() => {
    const lastCoord = getCoords(points.length - 1, getYValue(points[points.length - 1]));
    const firstCoord = getCoords(0, getYValue(points[0]));
    const bottomY = padTop + chartH;
    return `${pathString} L ${lastCoord.x} ${bottomY} L ${firstCoord.x} ${bottomY} Z`;
  }, [pathString, points, chartH]);

  // Benchmark curve (only for EQUITY tab)
  const benchmarkPath = useMemo(() => {
    if (activeTab !== "EQUITY") return null;
    return points
      .map((pt, i) => {
        const { x, y } = getCoords(i, pt.benchmark);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }, [points, minVal, maxVal, activeTab]);

  // Mouse move handler for interactive crosshair
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const mouseY = ((e.clientY - rect.top) / rect.height) * svgHeight;

    const clampedX = Math.max(padLeft, Math.min(padLeft + chartW, mouseX));
    const ratio = (clampedX - padLeft) / chartW;
    const rawIndex = ratio * (points.length - 1);
    const index = Math.round(rawIndex);

    setHoverIndex(index);
    const targetY = getCoords(index, getYValue(points[index])).y;
    setCrosshairPos({ x: clampedX, y: targetY });
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setCrosshairPos(null);
  };

  const hoveredData = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  const tabs: { key: ChartTab; label: string }[] = [
    { key: "EQUITY", label: "Equity" },
    { key: "PNL", label: "P&L" },
    { key: "DRAWDOWN", label: "Drawdown" },
    { key: "POSITION", label: "Position" },
  ];

  return (
    <div className="w-full p-5 sm:p-6 rounded-xl border border-white/10 bg-[#080D1A]/95 backdrop-blur-md shadow-2xl select-none relative overflow-hidden flex flex-col justify-between">
      {/* Corner HUD Markers */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#05CD99]" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#00F0FF]" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#00F0FF]" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#05CD99]" />

      {/* Top Header: Title, Telemetry, and Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-3">
        {/* Left Title & Key Snapshot Stats */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#05CD99] animate-pulse" />
            <span className="text-xs font-semibold text-white font-sans tracking-normal">
              Intraday Performance Trajectory
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">DMX Cryogenic Match</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3 text-xs">
            <span className="text-2xl font-semibold font-mono tabular-nums text-white tracking-tight">
              {formatVal(getYValue(hoveredData))}
            </span>
            {activeTab === "EQUITY" && (
              <span className="text-[#05CD99] font-mono font-medium text-xs tabular-nums">
                Alpha: +14.20% vs DIFC-100
              </span>
            )}
            <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
              Time: {hoveredData.time} GST
            </span>
          </div>
        </div>

        {/* Right Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/50 border border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1 rounded text-xs font-sans font-medium transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.3)] font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive SVG Chart */}
      <div className="w-full relative h-[260px] sm:h-[300px]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Primary Gradient for Area Fill */}
            <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#05CD99" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#05CD99" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#05CD99" stopOpacity="0.0" />
            </linearGradient>

            {/* PnL Blue/Cyan Gradient */}
            <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
            </linearGradient>

            {/* Drawdown Red Gradient */}
            <linearGradient id="drawdownGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines (Horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac, idx) => {
            const y = padTop + frac * chartH;
            const val = maxVal - frac * (maxVal - minVal);
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={padLeft + chartW}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padLeft + chartW + 4}
                  y={y + 3}
                  fill="#64748B"
                  fontSize="9"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {formatVal(val)}
                </text>
              </g>
            );
          })}

          {/* Time Tick Labels along bottom */}
          {points.map((pt, idx) => {
            if (idx % 2 !== 0 && idx !== points.length - 1) return null;
            const { x } = getCoords(idx, minVal);
            return (
              <text
                key={idx}
                x={x}
                y={svgHeight - 8}
                textAnchor="middle"
                fill="#64748B"
                fontSize="9"
                fontFamily="'JetBrains Mono', monospace"
              >
                {pt.time}
              </text>
            );
          })}

          {/* Drawdown Threshold line if DRAWDOWN tab is active */}
          {activeTab === "DRAWDOWN" && (
            <g>
              <line
                x1={padLeft}
                y1={getCoords(0, -5.0).y}
                x2={padLeft + chartW}
                y2={getCoords(0, -5.0).y}
                stroke="#EF4444"
                strokeWidth="1.2"
                strokeDasharray="6 3"
              />
              <text
                x={padLeft + 6}
                y={getCoords(0, -5.0).y - 4}
                fill="#EF4444"
                fontSize="10"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
              >
                Risk liquidation threshold (-8.00%)
              </text>
            </g>
          )}

          {/* Area polygon fill */}
          <polygon
            key={`area-${activeTab}`}
            points={areaString.replace(/[MLZ]/g, "").trim()}
            fill={
              activeTab === "DRAWDOWN"
                ? "url(#drawdownGrad)"
                : activeTab === "PNL"
                ? "url(#pnlGrad)"
                : "url(#equityGrad)"
            }
            className="animate-chart-area"
          />

          {/* Benchmark line (dashed amber/silver line) */}
          {benchmarkPath && (
            <path
              d={benchmarkPath}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.65"
            />
          )}

          {/* Main Strategy Line with Natural Draw Entrance */}
          <path
            key={`line-${activeTab}`}
            d={pathString}
            fill="none"
            stroke={
              activeTab === "DRAWDOWN"
                ? "#EF4444"
                : activeTab === "PNL"
                ? "#00F0FF"
                : "#05CD99"
            }
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-line"
          />

          {/* Interactive Hover Crosshair Lines */}
          {crosshairPos && (
            <g>
              {/* Vertical Time Guideline */}
              <line
                x1={crosshairPos.x}
                y1={padTop}
                x2={crosshairPos.x}
                y2={padTop + chartH}
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Horizontal Price Guideline */}
              <line
                x1={padLeft}
                y1={crosshairPos.y}
                x2={padLeft + chartW}
                y2={crosshairPos.y}
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Active Snapping Dot */}
              <circle
                cx={crosshairPos.x}
                cy={crosshairPos.y}
                r="4.5"
                fill="#FFFFFF"
                stroke={activeTab === "DRAWDOWN" ? "#EF4444" : "#05CD99"}
                strokeWidth="2.5"
              />

              {/* Halo Glow */}
              <circle
                cx={crosshairPos.x}
                cy={crosshairPos.y}
                r="10"
                fill={activeTab === "DRAWDOWN" ? "#EF4444" : "#05CD99"}
                opacity="0.3"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Chart Footer Legend & Microstructure Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs text-[#94A3B8]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-sans">
            <span className="w-2.5 h-1 rounded bg-[#05CD99]" />
            <span className="text-white font-medium">Falcon Arbitrage (Your Bot)</span>
          </div>

          {activeTab === "EQUITY" && (
            <div className="flex items-center gap-1.5 text-[#D4AF37] font-sans">
              <span className="w-2.5 h-[1.5px] border-b border-dashed border-[#D4AF37]" />
              <span className="font-medium">DIFC-100 Benchmark</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-[#64748B]">
          <span>Max inventory: 5,000 contracts</span>
          <span>•</span>
          <span className="text-[#05CD99]">Sortino: 3.45</span>
          <span>•</span>
          <span>Tick resolution: 100ms</span>
        </div>
      </div>
    </div>
  );
};
