"use client";

import React, { useState, useMemo } from "react";
import { Activity, Info } from "lucide-react";
import { ResearchTimeseriesPoint, AssetStatistics } from "@/services/api/research";

interface RollingVolatilityChartProps {
  points: ResearchTimeseriesPoint[];
  statistics: AssetStatistics;
}

export function RollingVolatilityChart({
  points,
  statistics,
}: RollingVolatilityChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const vols = useMemo(() => points.map((p) => p.rollingVolPct), [points]);
  const minVol = Math.max(0, Math.min(...vols) * 0.85);
  const maxVol = Math.max(...vols) * 1.15 || 50;
  const meanVol = statistics.annualizedVolatility;

  const width = 600;
  const height = 240;
  const padding = { top: 20, right: 25, bottom: 35, left: 35 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const getX = (idx: number) => {
    return points.length > 1
      ? padding.left + (idx / (points.length - 1)) * chartWidth
      : padding.left + chartWidth / 2;
  };

  const getY = (val: number) => {
    return padding.top + chartHeight - ((val - minVol) / (maxVol - minVol)) * chartHeight;
  };

  const linePath = useMemo(() => {
    if (points.length === 0) return "";
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i).toFixed(1)} ${getY(p.rollingVolPct).toFixed(1)}`)
      .join(" ");
  }, [points, minVol, maxVol]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const firstX = getX(0).toFixed(1);
    const lastX = getX(points.length - 1).toFixed(1);
    const bottomY = (padding.top + chartHeight).toFixed(1);
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [linePath, points, minVol, maxVol]);

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  return (
    <div className="bg-[#0b101d]/90 border border-cyan-500/20 rounded-xl p-4 sm:p-5 backdrop-blur-md select-none space-y-3 relative group overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.05)] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 hover:border-cyan-500/40">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-sans">
              Rolling Realized Volatility Dynamic (GARCH Regime)
            </h3>
            <span className="text-[11px] text-gray-400 font-sans">
              Annualized standard deviation of returns with volatility clustering spikes
            </span>
          </div>
        </div>

        {/* Current Volatility Readout */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-gray-400">
            Current Vol:{" "}
            <span className="text-cyan-300 font-semibold tabular-nums">
              {activePoint ? activePoint.rollingVolPct.toFixed(2) : meanVol.toFixed(2)}%
            </span>
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400">
            Session Mean:{" "}
            <span className="text-white font-semibold tabular-nums">
              {meanVol.toFixed(2)}%
            </span>
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - (padding.left / width) * rect.width;
            const usableW = (chartWidth / width) * rect.width;
            const pct = Math.max(0, Math.min(1, x / usableW));
            const idx = Math.round(pct * (points.length - 1));
            setHoverIndex(idx);
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="volAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.30" />
              <stop offset="60%" stopColor="#00F0FF" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padding.top + pct * chartHeight;
            const val = maxVol - pct * (maxVol - minVol);
            return (
              <g key={pct}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {val.toFixed(1)}%
                </text>
              </g>
            );
          })}

          {/* Session Mean Line */}
          <line
            x1={padding.left}
            y1={getY(meanVol)}
            x2={width - padding.right}
            y2={getY(meanVol)}
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.8"
          />
          <text
            x={width - padding.right}
            y={getY(meanVol) - 3}
            textAnchor="end"
            fill="#D4AF37"
            fontSize="8"
            fontFamily="monospace"
            opacity="0.8"
          >
            MEAN {meanVol.toFixed(1)}%
          </text>

          {/* Area Fill */}
          <path d={areaPath} fill="url(#volAreaGrad)" />

          {/* Line Curve */}
          <path
            d={linePath}
            fill="none"
            stroke="#00F0FF"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Hover Marker */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + chartHeight}
                stroke="#00F0FF"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(points[hoverIndex].rollingVolPct)}
                r="4"
                fill="#00F0FF"
                stroke="#0b101d"
                strokeWidth="2"
              />
            </g>
          )}

          {/* X Axis Time Labels */}
          {points
            .filter((_, idx) => idx % Math.floor(points.length / 5) === 0 || idx === points.length - 1)
            .map((p, idx) => (
              <text
                key={idx}
                x={getX(p.index)}
                y={height - 8}
                textAnchor="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="9"
                fontFamily="monospace"
              >
                {p.timeStr}
              </text>
            ))}
        </svg>
      </div>

      {/* Hover Telemetry Footer */}
      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-sans min-h-[42px] flex items-center justify-between text-xs">
        {hoverIndex !== null && activePoint ? (
          <div className="flex items-center gap-3 flex-wrap font-mono">
            <span className="text-gray-400">
              Frame: <span className="text-white font-semibold">{activePoint.dateStr} {activePoint.timeStr}</span>
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">
              Volatility: <span className="text-cyan-300 font-semibold">{activePoint.rollingVolPct.toFixed(2)}%</span>
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">
              Deviation from Mean:{" "}
              <span className={activePoint.rollingVolPct >= meanVol ? "text-rose-400" : "text-emerald-400"}>
                {activePoint.rollingVolPct >= meanVol ? "+" : ""}
                {(activePoint.rollingVolPct - meanVol).toFixed(2)}%
              </span>
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-gray-400 text-xs font-mono">
            <span>Regime: <span className="text-emerald-400 font-semibold">Mean-Reverting GARCH(1,1)</span></span>
            <span className="text-gray-500">Peak Volatility: {Math.max(...vols).toFixed(2)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
