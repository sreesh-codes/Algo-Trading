"use client";

import React, { useState, useMemo } from "react";
import { ArrowRightLeft, Info, Activity } from "lucide-react";
import { ResearchTimeseriesPoint } from "@/services/api/research";

interface RollingCorrelationChartProps {
  points: ResearchTimeseriesPoint[];
  assetA: string;
  assetB: string;
}

export function RollingCorrelationChart({
  points,
  assetA,
  assetB,
}: RollingCorrelationChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const validPoints = useMemo(
    () => points.filter((p) => p.rollingCorrelation !== undefined),
    [points]
  );

  const width = 600;
  const height = 240;
  const padding = { top: 20, right: 25, bottom: 35, left: 35 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Correlation bounds always -1.0 to +1.0
  const zeroY = padding.top + chartHeight / 2;

  const getX = (idx: number) => {
    return validPoints.length > 1
      ? padding.left + (idx / (validPoints.length - 1)) * chartWidth
      : padding.left + chartWidth / 2;
  };

  const getY = (corr: number) => {
    return zeroY - corr * (chartHeight / 2);
  };

  const linePath = useMemo(() => {
    if (validPoints.length === 0) return "";
    return validPoints
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${getX(i).toFixed(1)} ${getY(
            p.rollingCorrelation!
          ).toFixed(1)}`
      )
      .join(" ");
  }, [validPoints]);

  const activePoint =
    hoverIndex !== null
      ? validPoints[hoverIndex]
      : validPoints[validPoints.length - 1];

  return (
    <div className="bg-[#0b101d]/90 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-md select-none space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-[#D4AF37]" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-sans">
              30-Period Rolling Correlation — {assetA} vs {assetB}
            </h3>
            <span className="text-[11px] text-gray-400 font-sans">
              Dynamic regime shifts, decoupling events, and cointegration stability
            </span>
          </div>
        </div>

        {/* Current Correlation Readout */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-gray-400">
            Current Correlation:{" "}
            <span
              className={`font-semibold tabular-nums ${
                activePoint && activePoint.rollingCorrelation! >= 0
                  ? "text-cyan-300"
                  : "text-rose-400"
              }`}
            >
              {activePoint
                ? `${activePoint.rollingCorrelation! >= 0 ? "+" : ""}${activePoint.rollingCorrelation!.toFixed(3)}`
                : "—"}
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
            if (validPoints.length === 0) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - (padding.left / width) * rect.width;
            const usableW = (chartWidth / width) * rect.width;
            const pct = Math.max(0, Math.min(1, x / usableW));
            const idx = Math.round(pct * (validPoints.length - 1));
            setHoverIndex(idx);
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Zero Line */}
          <line
            x1={padding.left}
            y1={zeroY}
            x2={width - padding.right}
            y2={zeroY}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
          />
          <text
            x={width - padding.right}
            y={zeroY - 3}
            textAnchor="end"
            fill="rgba(255,255,255,0.4)"
            fontSize="8"
            fontFamily="monospace"
          >
            0.0
          </text>

          {/* Grid lines at +0.5, +1.0, -0.5, -1.0 */}
          {[1.0, 0.5, -0.5, -1.0].map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
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
                  {level >= 0 ? `+${level.toFixed(1)}` : level.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Rolling Correlation Path */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* Hover Indicator */}
          {hoverIndex !== null && validPoints[hoverIndex] && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + chartHeight}
                stroke="#D4AF37"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(validPoints[hoverIndex].rollingCorrelation!)}
                r="4"
                fill="#D4AF37"
                stroke="#0b101d"
                strokeWidth="2"
              />
            </g>
          )}

          {/* X Axis Time Labels */}
          {validPoints
            .filter(
              (_, idx) =>
                idx % Math.floor(validPoints.length / 5) === 0 ||
                idx === validPoints.length - 1
            )
            .map((p, idx) => (
              <text
                key={idx}
                x={getX(idx)}
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
              Window Center:{" "}
              <span className="text-white font-semibold">
                {activePoint.dateStr} {activePoint.timeStr}
              </span>
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">
              30-Period Correlation:{" "}
              <span className="text-[#D4AF37] font-semibold">
                {activePoint.rollingCorrelation! >= 0 ? "+" : ""}
                {activePoint.rollingCorrelation!.toFixed(4)}
              </span>
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">
              Regime:{" "}
              <span
                className={
                  activePoint.rollingCorrelation! > 0.5
                    ? "text-cyan-300"
                    : activePoint.rollingCorrelation! < -0.2
                    ? "text-amber-400"
                    : "text-gray-300"
                }
              >
                {activePoint.rollingCorrelation! > 0.5
                  ? "Strong Co-movement"
                  : activePoint.rollingCorrelation! < -0.2
                  ? "Inverse Hedging Phase"
                  : "Uncorrelated / Orthogonal"}
              </span>
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-gray-400 text-xs font-mono">
            <span>Rolling Window: 30 Observations</span>
            <span className="text-gray-500">Pair: {assetA} vs {assetB}</span>
          </div>
        )}
      </div>
    </div>
  );
}
