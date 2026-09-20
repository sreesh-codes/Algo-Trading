"use client";

import React, { useState, useRef, useMemo } from "react";
import { 
  BarChart3, 
  Maximize2, 
  Eye, 
  TrendingUp, 
  Layers, 
  Activity, 
  Crosshair, 
  Sliders 
} from "lucide-react";
import { 
  ResearchTimeseriesPoint, 
  ResearchFeature, 
  AssetStatistics 
} from "@/services/api/research";
import { AssetContract } from "@/data/mock/assets";

interface PriceVolumeChartProps {
  points: ResearchTimeseriesPoint[];
  asset: AssetContract;
  feature: ResearchFeature;
  statistics: AssetStatistics;
}

export function PriceVolumeChart({
  points,
  asset,
  feature,
  statistics,
}: PriceVolumeChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showSma, setShowSma] = useState(true);
  const [chartMode, setChartMode] = useState<"area" | "line">("area");
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive value bounds based on active feature
  const { values, minVal, maxVal, formatVal, unitLabel } = useMemo(() => {
    let vals: number[] = [];
    let format = (v: number) => v.toFixed(2);
    let unit = "Blitz";

    if (feature === "returns") {
      vals = points.map((p) => p.returnPct);
      format = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(3)}%`;
      unit = "%";
    } else if (feature === "volatility") {
      vals = points.map((p) => p.rollingVolPct);
      format = (v: number) => `${v.toFixed(2)}%`;
      unit = "% (Ann)";
    } else if (feature === "spread") {
      vals = points.map((p) => p.spreadBps);
      format = (v: number) => `${v.toFixed(1)} bps`;
      unit = "bps";
    } else if (feature === "imbalance") {
      vals = points.map((p) => p.orderImbalance);
      format = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(3)}`;
      unit = "skew";
    } else if (feature === "volume") {
      vals = points.map((p) => p.volume);
      format = (v: number) => v.toLocaleString();
      unit = "units";
    } else {
      // Default: Price
      vals = points.map((p) => p.price);
      format = (v: number) => `${v.toFixed(2)} Blitz`;
      unit = "Blitz";
    }

    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const pad = (max - min) * 0.08 || 1;

    return {
      values: vals,
      minVal: min - pad,
      maxVal: max + pad,
      formatVal: format,
      unitLabel: unit,
    };
  }, [points, feature]);

  // Volume bounds for lower pane
  const maxVolume = useMemo(() => {
    return Math.max(...points.map((p) => p.volume), 1);
  }, [points]);

  // SVG dimensions
  const width = 900;
  const upperHeight = 280;
  const lowerHeight = 80;
  const gap = 16;
  const totalHeight = upperHeight + lowerHeight + gap;

  // Coordinate scales
  const getX = (i: number) => {
    return points.length > 1 ? (i / (points.length - 1)) * width : width / 2;
  };

  const getY = (val: number) => {
    if (maxVal === minVal) return upperHeight / 2;
    return upperHeight - ((val - minVal) / (maxVal - minVal)) * (upperHeight - 20) - 10;
  };

  const getVolY = (vol: number) => {
    return lowerHeight - (vol / maxVolume) * (lowerHeight - 10);
  };

  // SVG Paths
  const linePath = useMemo(() => {
    if (points.length === 0) return "";
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i).toFixed(1)} ${getY(values[i]).toFixed(1)}`)
      .join(" ");
  }, [points, values, minVal, maxVal]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const base = getY(minVal);
    const firstX = getX(0).toFixed(1);
    const lastX = getX(points.length - 1).toFixed(1);
    return `${linePath} L ${lastX} ${upperHeight} L ${firstX} ${upperHeight} Z`;
  }, [linePath, points, minVal]);

  const smaPath = useMemo(() => {
    if (!showSma || feature !== "price") return "";
    const validPoints = points.filter((p) => p.sma20 !== undefined);
    if (validPoints.length === 0) return "";
    return validPoints
      .map((p, idx) => {
        const i = p.index;
        return `${idx === 0 ? "M" : "L"} ${getX(i).toFixed(1)} ${getY(p.sma20!).toFixed(1)}`;
      })
      .join(" ");
  }, [points, showSma, feature, minVal, maxVal]);

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current || points.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const idx = Math.round(pct * (points.length - 1));
    setHoverIndex(idx);
  };

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];
  const activeVal = hoverIndex !== null && values[hoverIndex] !== undefined ? values[hoverIndex] : values[values.length - 1];

  return (
    <div className="bg-[#0b101d]/90 border border-[#D4AF37]/20 rounded-xl p-4 sm:p-5 backdrop-blur-md select-none space-y-3 relative group overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.05)] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-500 hover:border-[#D4AF37]/40">
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Top Header & Chart Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#D4AF37]" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-sans">
              Continuous Telemetry Series — {asset.name} ({asset.ticker})
            </h3>
            <span className="text-[11px] text-gray-400 font-sans">
              Feature: <span className="text-white capitalize font-medium">{feature}</span> • Frequency: {points.length} sampled frames
            </span>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {feature === "price" && (
            <button
              onClick={() => setShowSma(!showSma)}
              className={`text-[11px] px-2.5 py-1 rounded font-mono font-medium transition-colors border ${
                showSma
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40"
                  : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
              }`}
            >
              SMA (20)
            </button>
          )}

          <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 font-sans text-xs">
            <button
              onClick={() => setChartMode("area")}
              className={`px-2.5 py-0.5 rounded transition-colors ${
                chartMode === "area"
                  ? "bg-white/10 text-white font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartMode("line")}
              className={`px-2.5 py-0.5 rounded transition-colors ${
                chartMode === "line"
                  ? "bg-white/10 text-white font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      {/* Floating Readout Bar on Hover */}
      {activePoint && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-black/50 border border-white/5 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="text-gray-400">
              {activePoint.dateStr} {activePoint.timeStr}
            </span>
            <span className="text-gray-600">|</span>
            <span className="font-semibold text-white">
              {formatVal(activeVal)}
            </span>
            {activePoint.sma20 && showSma && feature === "price" && (
              <span className="text-[#D4AF37] text-[11px]">
                SMA(20): {activePoint.sma20.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span>Vol: <span className="text-white font-medium">{activePoint.volume.toLocaleString()}</span></span>
            <span>Spread: <span className="text-cyan-300 font-medium">{activePoint.spreadBps} bps</span></span>
            <span>Imbalance: <span className="text-emerald-400 font-medium">{activePoint.orderImbalance >= 0 ? "+" : ""}{activePoint.orderImbalance}</span></span>
          </div>
        </div>
      )}

      {/* Interactive SVG Chart Container */}
      <div ref={containerRef} className="w-full relative overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${totalHeight}`}
          className="w-full h-auto cursor-crosshair overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Feature Area Gradient */}
            <linearGradient id="researchAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
            </linearGradient>

            {/* Cyan Gradient for Volatility/Spread */}
            <linearGradient id="cyanAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.30" />
              <stop offset="70%" stopColor="#00F0FF" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines - Horizontal */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = 10 + pct * (upperHeight - 20);
            const val = maxVal - pct * (maxVal - minVal);
            return (
              <g key={pct}>
                <line
                  x1="0"
                  y1={y}
                  x2={width}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 4"
                />
                <text
                  x={width - 6}
                  y={y - 4}
                  textAnchor="end"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {formatVal(val)}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {chartMode === "area" && (
            <path
              d={areaPath}
              fill={feature === "volatility" || feature === "spread" ? "url(#cyanAreaGrad)" : "url(#researchAreaGrad)"}
            />
          )}

          {/* Primary Curve */}
          <path
            d={linePath}
            fill="none"
            stroke={feature === "volatility" || feature === "spread" ? "#00F0FF" : "#D4AF37"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* SMA 20 Overlay Line */}
          {smaPath && (
            <path
              d={smaPath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              strokeOpacity="0.85"
            />
          )}

          {/* Lower Pane: Volume Dynamics & Histogram */}
          <g transform={`translate(0, ${upperHeight + gap})`}>
            {/* Divider */}
            <line
              x1="0"
              y1="0"
              x2={width}
              y2="0"
              stroke="rgba(255,255,255,0.1)"
            />
            <text
              x="6"
              y="12"
              fill="rgba(255,255,255,0.35)"
              fontSize="9"
              fontFamily="monospace"
            >
              INTERVAL VOLUME DYNAMICS
            </text>

            {points.map((p, i) => {
              const x = getX(i);
              const barWidth = Math.max(1.5, width / points.length - 1.5);
              const barHeight = Math.max(2, (p.volume / maxVolume) * (lowerHeight - 16));
              const y = lowerHeight - barHeight;
              const isUp = p.returnPct >= 0;

              return (
                <rect
                  key={i}
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={isUp ? "#10B981" : "#F43F5E"}
                  fillOpacity={hoverIndex === i ? 0.95 : 0.45}
                  rx="0.5"
                />
              );
            })}
          </g>

          {/* Interactive Hover Crosshair & Pointer Marker */}
          {hoverIndex !== null && (
            <g>
              {/* Vertical crosshair line */}
              <line
                x1={getX(hoverIndex)}
                y1={0}
                x2={getX(hoverIndex)}
                y2={totalHeight}
                stroke="#D4AF37"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.8"
              />

              {/* Point Indicator Dot */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(activeVal)}
                r="4"
                fill="#D4AF37"
                stroke="#0b101d"
                strokeWidth="2"
              />

              {/* Pulsing ring */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(activeVal)}
                r="7"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1"
                opacity="0.5"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
