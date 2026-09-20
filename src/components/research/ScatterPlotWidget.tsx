"use client";

import React, { useState, useMemo } from "react";
import { ScatterPlotResult, ScatterDataPoint } from "@/services/api/research";
import { TrendingUp, Info, HelpCircle } from "lucide-react";

interface ScatterPlotWidgetProps {
  scatter: ScatterPlotResult;
}

export function ScatterPlotWidget({ scatter }: ScatterPlotWidgetProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ScatterDataPoint | null>(null);

  const { minX, maxX, minY, maxY } = useMemo(() => {
    if (scatter.points.length === 0) {
      return { minX: -1, maxX: 1, minY: -1, maxY: 1 };
    }
    const xVals = scatter.points.map((p) => p.xVal);
    const yVals = scatter.points.map((p) => p.yVal);

    const rawMinX = Math.min(...xVals);
    const rawMaxX = Math.max(...xVals);
    const rawMinY = Math.min(...yVals);
    const rawMaxY = Math.max(...yVals);

    const padX = (rawMaxX - rawMinX) * 0.1 || 0.1;
    const padY = (rawMaxY - rawMinY) * 0.1 || 0.1;

    return {
      minX: rawMinX - padX,
      maxX: rawMaxX + padX,
      minY: rawMinY - padY,
      maxY: rawMaxY + padY,
    };
  }, [scatter]);

  const width = 600;
  const height = 280;
  const padding = { top: 20, right: 25, bottom: 35, left: 45 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const getX = (val: number) => {
    if (maxX === minX) return padding.left + chartWidth / 2;
    return padding.left + ((val - minX) / (maxX - minX)) * chartWidth;
  };

  const getY = (val: number) => {
    if (maxY === minY) return padding.top + chartHeight / 2;
    return padding.top + chartHeight - ((val - minY) / (maxY - minY)) * chartHeight;
  };

  // Trendline endpoints
  const trendX1 = minX;
  const trendY1 = scatter.interceptAlpha + scatter.slopeBeta * trendX1;
  const trendX2 = maxX;
  const trendY2 = scatter.interceptAlpha + scatter.slopeBeta * trendX2;

  return (
    <div className="bg-[#0b101d]/90 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-md select-none space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-sans">
              2D Regression Scatter — {scatter.assetA} vs {scatter.assetB}
            </h3>
            <span className="text-[11px] text-gray-400 font-sans">
              Ordinary Least Squares (OLS) fit with empirical joint distribution
            </span>
          </div>
        </div>

        {/* Model Metrics */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-gray-400">
            Slope (β):{" "}
            <span className="text-emerald-400 font-semibold tabular-nums">
              {scatter.slopeBeta.toFixed(4)}
            </span>
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400">
            R²:{" "}
            <span className="text-[#D4AF37] font-semibold tabular-nums">
              {scatter.rSquared.toFixed(4)}
            </span>
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400">
            r:{" "}
            <span className="text-cyan-300 font-semibold tabular-nums">
              {scatter.correlation >= 0 ? "+" : ""}
              {scatter.correlation.toFixed(3)}
            </span>
          </span>
        </div>
      </div>

      {/* SVG Scatter Plot */}
      <div className="w-full relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padding.top + pct * chartHeight;
            const val = maxY - pct * (maxY - minY);
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
                  {val.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Zero Axis lines */}
          {minX < 0 && maxX > 0 && (
            <line
              x1={getX(0)}
              y1={padding.top}
              x2={getX(0)}
              y2={padding.top + chartHeight}
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="2 2"
            />
          )}
          {minY < 0 && maxY > 0 && (
            <line
              x1={padding.left}
              y1={getY(0)}
              x2={width - padding.right}
              y2={getY(0)}
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="2 2"
            />
          )}

          {/* OLS Regression Trendline */}
          <line
            x1={getX(trendX1)}
            y1={getY(trendY1)}
            x2={getX(trendX2)}
            y2={getY(trendY2)}
            stroke="#D4AF37"
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.85"
          />

          {/* Scatter Points */}
          {scatter.points.map((p, idx) => {
            const cx = getX(p.xVal);
            const cy = getY(p.yVal);
            const isHovered = hoveredPoint === p;

            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={isHovered ? 5 : 2.5}
                fill={isHovered ? "#38bdf8" : "#00F0FF"}
                fillOpacity={isHovered ? 1.0 : 0.6}
                stroke={isHovered ? "#fff" : "none"}
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}

          {/* X Axis Title */}
          <text
            x={width / 2}
            y={height - 6}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="10"
            fontFamily="sans-serif"
          >
            {scatter.featureX}
          </text>

          {/* Y Axis Title */}
          <text
            x={12}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90 12 ${height / 2})`}
            fill="rgba(255,255,255,0.5)"
            fontSize="10"
            fontFamily="sans-serif"
          >
            {scatter.featureY}
          </text>
        </svg>
      </div>

      {/* Hover Telemetry Footer */}
      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-sans min-h-[42px] flex items-center justify-between text-xs">
        {hoveredPoint ? (
          <div className="flex items-center gap-3 flex-wrap font-mono">
            <span className="text-gray-400">
              Observation: <span className="text-white font-semibold">{hoveredPoint.label} ({hoveredPoint.timestamp})</span>
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">
              X: <span className="text-cyan-300 font-semibold">{hoveredPoint.xVal.toFixed(3)}</span>
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">
              Y: <span className="text-[#D4AF37] font-semibold">{hoveredPoint.yVal.toFixed(3)}</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-gray-400 text-xs font-mono">
            <span>Model: y = {scatter.interceptAlpha >= 0 ? "+" : ""}{scatter.interceptAlpha.toFixed(4)} + {scatter.slopeBeta.toFixed(4)}x</span>
            <span className="text-cyan-300">R² = {(scatter.rSquared * 100).toFixed(2)}% Explained Variance</span>
          </div>
        )}
      </div>
    </div>
  );
}
