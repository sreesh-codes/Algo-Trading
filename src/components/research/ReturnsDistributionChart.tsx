"use client";

import React, { useState } from "react";
import { BarChart, HelpCircle, Info, ShieldAlert, Sparkles } from "lucide-react";
import { ReturnsDistributionBucket, AssetStatistics } from "@/services/api/research";

interface ReturnsDistributionChartProps {
  distribution: ReturnsDistributionBucket[];
  statistics: AssetStatistics;
}

export function ReturnsDistributionChart({
  distribution,
  statistics,
}: ReturnsDistributionChartProps) {
  const [hoveredBucket, setHoveredBucket] = useState<ReturnsDistributionBucket | null>(null);

  const maxFreq = Math.max(...distribution.map((b) => b.frequencyPct), 1);
  const maxDensity = Math.max(...distribution.map((b) => b.normalDensity), 1);

  const width = 600;
  const height = 240;
  const padding = { top: 20, right: 20, bottom: 35, left: 35 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Normal curve path
  const normalCurvePoints = distribution.map((b, i) => {
    const x = padding.left + (i / (distribution.length - 1)) * chartWidth;
    const normPct = (b.normalDensity / maxDensity) * (maxFreq * 1.05);
    const y = padding.top + chartHeight - (normPct / (maxFreq * 1.15)) * chartHeight;
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  const normalCurvePath = normalCurvePoints.join(" ");

  return (
    <div className="bg-[#0b101d]/90 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-md select-none space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <BarChart className="w-4 h-4 text-cyan-400" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-sans">
              Empirical Returns Distribution vs Gaussian Model
            </h3>
            <span className="text-[11px] text-gray-400 font-sans">
              Log returns histogram with theoretical Normal distribution overlay
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 font-mono text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-cyan-500/30 border border-cyan-500/60" />
            <span>Sample Distribution</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-0.5 bg-[#D4AF37]" />
            <span>Normal Bell Curve</span>
          </span>
        </div>
      </div>

      {/* Interactive SVG Histogram */}
      <div className="w-full relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-pointer"
        >
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padding.top + pct * chartHeight;
            const freq = ((1 - pct) * maxFreq * 1.15).toFixed(1);
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
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {freq}%
                </text>
              </g>
            );
          })}

          {/* Histogram Bars */}
          {distribution.map((b, i) => {
            const barWidth = Math.max(2, (chartWidth / distribution.length) - 2);
            const x = padding.left + (i / distribution.length) * chartWidth + 1;
            const barHeight = (b.frequencyPct / (maxFreq * 1.15)) * chartHeight;
            const y = padding.top + chartHeight - barHeight;
            const isHovered = hoveredBucket === b;

            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(1, barHeight)}
                fill={isHovered ? "#00F0FF" : "#0ea5e9"}
                fillOpacity={isHovered ? 0.9 : 0.4}
                stroke={isHovered ? "#38bdf8" : "none"}
                strokeWidth="1"
                rx="1"
                onMouseEnter={() => setHoveredBucket(b)}
                onMouseLeave={() => setHoveredBucket(null)}
              />
            );
          })}

          {/* Theoretical Normal Overlay Curve */}
          <path
            d={normalCurvePath}
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Zero Axis Line */}
          <line
            x1={padding.left + chartWidth / 2}
            y1={padding.top}
            x2={padding.left + chartWidth / 2}
            y2={padding.top + chartHeight}
            stroke="rgba(255,255,255,0.2)"
            strokeDasharray="2 2"
          />

          {/* X Axis Labels */}
          {distribution
            .filter((_, idx) => idx % 4 === 0 || idx === distribution.length - 1)
            .map((b, i) => {
              const originalIdx = distribution.indexOf(b);
              const x = padding.left + (originalIdx / distribution.length) * chartWidth;
              return (
                <text
                  key={b.binLabel}
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {b.binLabel}
                </text>
              );
            })}
        </svg>
      </div>

      {/* Hover Telemetry Footer */}
      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-sans min-h-[42px] flex items-center justify-between text-xs">
        {hoveredBucket ? (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-gray-400 font-mono">
              Bin Range: <span className="text-white font-semibold">{hoveredBucket.binMin}% to {hoveredBucket.binMax}%</span>
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400 font-mono">
              Count: <span className="text-cyan-300 font-semibold">{hoveredBucket.count}</span> ({hoveredBucket.frequencyPct}% of sample)
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400 font-mono">
              Normal Expected: <span className="text-[#D4AF37] font-semibold">{hoveredBucket.normalDensity.toFixed(2)} density</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-gray-400 text-xs font-mono">
            <span>Excess Kurtosis: <span className="text-[#D4AF37] font-semibold">{statistics.kurtosis.toFixed(3)}</span> (Fat-Tailed Risk)</span>
            <span className="text-rose-400">VaR (95%): {statistics.var95.toFixed(2)}% | VaR (99%): {statistics.var99.toFixed(2)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
