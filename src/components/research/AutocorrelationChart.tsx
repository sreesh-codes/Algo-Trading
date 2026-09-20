"use client";

import React, { useState } from "react";
import { Activity, HelpCircle, Info } from "lucide-react";
import { AutocorrelationLag } from "@/services/api/research";

interface AutocorrelationChartProps {
  autocorrelation: AutocorrelationLag[];
}

export function AutocorrelationChart({
  autocorrelation,
}: AutocorrelationChartProps) {
  const [hoveredLag, setHoveredLag] = useState<AutocorrelationLag | null>(null);

  const width = 600;
  const height = 240;
  const padding = { top: 20, right: 20, bottom: 35, left: 35 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = 0.5; // symmetrical -0.5 to +0.5 bounds
  const zeroY = padding.top + chartHeight / 2;

  const getY = (val: number) => {
    return zeroY - (val / maxVal) * (chartHeight / 2);
  };

  const confidenceBound =
    autocorrelation.length > 0 ? autocorrelation[0].upperConfidence : 0.05;
  const upperConfidenceY = getY(confidenceBound);
  const lowerConfidenceY = getY(-confidenceBound);

  return (
    <div className="bg-[#0b101d]/90 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-md select-none space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-sans">
              Autocorrelation Function (ACF Correlogram)
            </h3>
            <span className="text-[11px] text-gray-400 font-sans">
              Serial dependence test across 15 lags with 95% Bartlett confidence bands
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 font-mono text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-emerald-400" />
            <span>Significant Lag</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-0.5 border-t border-dashed border-cyan-400" />
            <span>95% CI (±{confidenceBound.toFixed(3)})</span>
          </span>
        </div>
      </div>

      {/* Interactive Correlogram SVG */}
      <div className="w-full relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-pointer"
        >
          {/* Horizontal Zero Axis */}
          <line
            x1={padding.left}
            y1={zeroY}
            x2={width - padding.right}
            y2={zeroY}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
          />

          {/* 95% Confidence Upper Band */}
          <line
            x1={padding.left}
            y1={upperConfidenceY}
            x2={width - padding.right}
            y2={upperConfidenceY}
            stroke="#00F0FF"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.65"
          />
          <text
            x={width - padding.right}
            y={upperConfidenceY - 3}
            textAnchor="end"
            fill="#00F0FF"
            fontSize="8"
            fontFamily="monospace"
            opacity="0.7"
          >
            +95% CI
          </text>

          {/* 95% Confidence Lower Band */}
          <line
            x1={padding.left}
            y1={lowerConfidenceY}
            x2={width - padding.right}
            y2={lowerConfidenceY}
            stroke="#00F0FF"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.65"
          />
          <text
            x={width - padding.right}
            y={lowerConfidenceY + 9}
            textAnchor="end"
            fill="#00F0FF"
            fontSize="8"
            fontFamily="monospace"
            opacity="0.7"
          >
            -95% CI
          </text>

          {/* Y Axis Grid & Labels */}
          {[-0.4, -0.2, 0, 0.2, 0.4].map((v) => {
            const y = getY(v);
            return (
              <text
                key={v}
                x={padding.left - 6}
                y={y + 3}
                textAnchor="end"
                fill="rgba(255,255,255,0.3)"
                fontSize="9"
                fontFamily="monospace"
              >
                {v >= 0 ? `+${v.toFixed(1)}` : v.toFixed(1)}
              </text>
            );
          })}

          {/* Impulse Bar for Each Lag */}
          {autocorrelation.map((item, idx) => {
            const x =
              padding.left +
              ((idx + 0.5) / autocorrelation.length) * chartWidth;
            const barY = getY(item.correlation);
            const isPositive = item.correlation >= 0;
            const isHovered = hoveredLag === item;
            const barHeight = Math.abs(barY - zeroY);
            const topY = isPositive ? barY : zeroY;

            return (
              <g
                key={item.lag}
                onMouseEnter={() => setHoveredLag(item)}
                onMouseLeave={() => setHoveredLag(null)}
              >
                {/* Vertical impulse stem */}
                <line
                  x1={x}
                  y1={zeroY}
                  x2={x}
                  y2={barY}
                  stroke={
                    item.isSignificant
                      ? "#10B981"
                      : isHovered
                      ? "#38bdf8"
                      : "rgba(255,255,255,0.4)"
                  }
                  strokeWidth={isHovered ? "3" : "2"}
                />

                {/* Point head marker */}
                <circle
                  cx={x}
                  cy={barY}
                  r={isHovered ? "4.5" : "3"}
                  fill={
                    item.isSignificant
                      ? "#10B981"
                      : isHovered
                      ? "#38bdf8"
                      : "#94a3b8"
                  }
                  stroke="#0b101d"
                  strokeWidth="1.5"
                />

                {/* X Axis Lag label */}
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  fill={isHovered ? "#fff" : "rgba(255,255,255,0.4)"}
                  fontSize="9"
                  fontFamily="monospace"
                >
                  k={item.lag}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover Telemetry Footer */}
      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-sans min-h-[42px] flex items-center justify-between text-xs">
        {hoveredLag ? (
          <div className="flex items-center gap-3 flex-wrap font-mono">
            <span className="text-gray-300">
              Lag {hoveredLag.lag} (k={hoveredLag.lag}):
            </span>
            <span
              className={`font-semibold ${
                hoveredLag.isSignificant ? "text-emerald-400" : "text-white"
              }`}
            >
              ρ = {hoveredLag.correlation >= 0 ? "+" : ""}
              {hoveredLag.correlation.toFixed(4)}
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">
              Status:{" "}
              <span
                className={
                  hoveredLag.isSignificant
                    ? "text-emerald-400 font-semibold"
                    : "text-gray-400"
                }
              >
                {hoveredLag.isSignificant
                  ? "Statistically Significant (p < 0.05)"
                  : "White Noise (Insig.)"}
              </span>
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-gray-400 text-xs font-mono">
            <span>Lag 1 Autocorrelation: <span className="text-emerald-400 font-semibold">{autocorrelation[0]?.correlation.toFixed(4) || "0.0000"}</span></span>
            <span className="text-gray-500">Barlett Threshold: ±{confidenceBound.toFixed(4)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
