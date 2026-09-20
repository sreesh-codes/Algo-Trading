"use client";

import React, { useState, useRef, useMemo } from "react";
import { 
  BarChart2, 
  TrendingUp, 
  Activity, 
  Layers, 
  Maximize2, 
  Crosshair, 
  Compass, 
  Calendar,
  Clock
} from "lucide-react";
import { AssetContract, HistoricalPoint } from "@/data/mock/assets";

type Timeframe = "1M" | "5M" | "15M" | "1H" | "4H" | "1D" | "ALL";
type ChartMode = "PRICE" | "VOLUME" | "VOLATILITY";

interface TerminalChartProps {
  asset: AssetContract;
}

export function TerminalChart({ asset }: TerminalChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("1H");
  const [chartMode, setChartMode] = useState<ChartMode>("PRICE");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // Generate synthetic points tailored to selected timeframe based on asset base price
  const chartData = useMemo(() => {
    const basePrice = asset.lastPrice;
    const baseVol = asset.volume24hBlitz / 24;

    const countMap: Record<Timeframe, number> = {
      "1M": 30,
      "5M": 24,
      "15M": 24,
      "1H": 24,
      "4H": 18,
      "1D": 30,
      "ALL": 36,
    };

    const count = countMap[timeframe];
    const points: HistoricalPoint[] = [];

    // Deterministic pseudo-random seed based on asset.ticker + timeframe
    let price = basePrice * 0.96;
    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      // Trend upward slightly toward lastPrice
      const drift = (basePrice - price) * 0.12;
      const noise = (Math.sin(i * 1.3) + Math.cos(i * 0.7)) * (basePrice * 0.008);
      price = Number((price + drift + noise).toFixed(2));
      
      const high = Number((price + Math.abs(noise * 1.5) + 0.2).toFixed(2));
      const low = Number((price - Math.abs(noise * 1.4) - 0.2).toFixed(2));
      const open = Number((price - drift * 0.5).toFixed(2));
      const volume = Math.round(baseVol * (0.6 + Math.abs(Math.sin(i)) * 0.8));
      const volatility = Number((14 + Math.abs(Math.sin(i * 1.8)) * 18).toFixed(1));

      let timeLabel = "";
      if (timeframe === "1M") {
        timeLabel = `14:${String(i).padStart(2, "0")}`;
      } else if (timeframe === "5M") {
        timeLabel = `12:${String(i * 5 % 60).padStart(2, "0")}`;
      } else if (timeframe === "15M") {
        timeLabel = `${String(8 + Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`;
      } else if (timeframe === "1H") {
        timeLabel = `${String(i).padStart(2, "0")}:00`;
      } else if (timeframe === "4H") {
        timeLabel = `D${Math.floor(i / 6) + 1} 0${(i % 6) * 4}:00`;
      } else if (timeframe === "1D") {
        timeLabel = `APR ${i + 1}`;
      } else {
        timeLabel = `M${i + 1}`;
      }

      points.push({
        timestamp: `2035-04-17 ${timeLabel}:00 GST`,
        timeLabel,
        open,
        high,
        low,
        close: price,
        volume,
        volatility
      });
    }

    // Ensure the last point matches asset.lastPrice
    points[points.length - 1].close = asset.lastPrice;
    return points;
  }, [asset.lastPrice, asset.volume24hBlitz, timeframe]);

  // Dimension computations
  const svgWidth = 860;
  const svgHeight = 360;
  const padding = { top: 25, right: 75, bottom: 40, left: 20 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Domain computation depending on chartMode
  const { minVal, maxVal, getYValue, unit, formatVal } = useMemo(() => {
    if (chartMode === "PRICE") {
      const minP = Math.min(...chartData.map((d) => d.low)) * 0.995;
      const maxP = Math.max(...chartData.map((d) => d.high)) * 1.005;
      return {
        minVal: minP,
        maxVal: maxP,
        getYValue: (d: HistoricalPoint) => d.close,
        unit: "Blitz",
        formatVal: (v: number) => `${v.toFixed(2)} Blitz`,
      };
    } else if (chartMode === "VOLUME") {
      const maxV = Math.max(...chartData.map((d) => d.volume)) * 1.15;
      return {
        minVal: 0,
        maxVal: maxV,
        getYValue: (d: HistoricalPoint) => d.volume,
        unit: "VOL",
        formatVal: (v: number) => `${(v / 1000).toFixed(0)}K`,
      };
    } else {
      // VOLATILITY
      const minVol = Math.min(...chartData.map((d) => d.volatility || 15)) * 0.85;
      const maxVol = Math.max(...chartData.map((d) => d.volatility || 25)) * 1.15;
      return {
        minVal: minVol,
        maxVal: maxVol,
        getYValue: (d: HistoricalPoint) => d.volatility || 20,
        unit: "%",
        formatVal: (v: number) => `${v.toFixed(1)}%`,
      };
    }
  }, [chartData, chartMode]);

  const range = maxVal - minVal || 1;

  // Coordinate mapper
  const getX = (index: number) => padding.left + (index / (chartData.length - 1)) * plotWidth;
  const getY = (val: number) => padding.top + plotHeight - ((val - minVal) / range) * plotHeight;

  // Path generators
  const linePoints = chartData.map((d, i) => `${getX(i).toFixed(1)},${getY(getYValue(d)).toFixed(1)}`).join(" ");
  const areaPoints = `${linePoints} ${getX(chartData.length - 1).toFixed(1)},${(padding.top + plotHeight).toFixed(1)} ${getX(0).toFixed(1)},${(padding.top + plotHeight).toFixed(1)}`;

  // Handle Mouse Events for Crosshairs
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const scaleX = svgWidth / rect.width;
    const scaleY = svgHeight / rect.height;

    const curSvgX = clientX * scaleX;
    const curSvgY = clientY * scaleY;

    // Clamp within plotting region
    const clampedX = Math.max(padding.left, Math.min(curSvgX, padding.left + plotWidth));
    const clampedY = Math.max(padding.top, Math.min(curSvgY, padding.top + plotHeight));

    // Find closest index
    const relX = (clampedX - padding.left) / plotWidth;
    const idx = Math.round(relX * (chartData.length - 1));
    const safeIdx = Math.max(0, Math.min(idx, chartData.length - 1));

    setHoverIndex(safeIdx);
    setCrosshairPos({ x: getX(safeIdx), y: clampedY });
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setCrosshairPos(null);
  };

  const activeHoverItem = hoverIndex !== null ? chartData[hoverIndex] : chartData[chartData.length - 1];

  // Grid levels (5 horizontal bands)
  const gridLevels = [0, 0.25, 0.5, 0.75, 1].map((pct) => {
    const val = minVal + pct * range;
    const y = getY(val);
    return { val, y };
  });

  const chartModes: { key: ChartMode; label: string; icon: React.ReactNode }[] = [
    { key: "PRICE", label: "Price", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { key: "VOLUME", label: "Volume", icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { key: "VOLATILITY", label: "Volatility", icon: <Activity className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full bg-[#0b101d]/95 border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col backdrop-blur-md select-none">
      {/* Top Controls: Timeframe Selector & Chart Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5 font-mono">
          {(["1M", "5M", "15M", "1H", "4H", "1D", "ALL"] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${
                timeframe === tf
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-semibold shadow-[0_0_8px_rgba(212,175,55,0.2)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Mode Buttons */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          {chartModes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => setChartMode(mode.key)}
              className={`text-xs font-sans font-medium px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                chartMode === mode.key
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-[0_0_8px_rgba(0,240,255,0.2)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Active Point Telemetry Bar */}
      <div className="py-2.5 px-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/5 font-sans">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-gray-400 flex items-center gap-1 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-white font-medium tabular-nums">{activeHoverItem.timestamp}</span>
          </span>
          <span>•</span>
          <span className="text-gray-400">
            Close: <span className="text-white font-mono font-semibold tabular-nums">{activeHoverItem.close.toFixed(2)} Blitz</span>
          </span>
          <span>•</span>
          <span className="text-gray-400">
            High: <span className="text-emerald-400 font-mono font-medium tabular-nums">{activeHoverItem.high.toFixed(2)}</span>
          </span>
          <span>•</span>
          <span className="text-gray-400">
            Low: <span className="text-rose-400 font-mono font-medium tabular-nums">{activeHoverItem.low.toFixed(2)}</span>
          </span>
          <span>•</span>
          <span className="text-gray-400">
            Vol: <span className="text-cyan-400 font-mono font-medium tabular-nums">{activeHoverItem.volume.toLocaleString()}</span>
          </span>
        </div>

        <div className="text-xs font-mono text-gray-400 flex items-center gap-2 tabular-nums">
          <span>Tick size: {asset.tickSize.toFixed(2)} Blitz</span>
          <span>•</span>
          <span className="text-emerald-400">Spread: {asset.spread.toFixed(2)} Blitz</span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[360px] mt-2 cursor-crosshair">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Price Line Gradient */}
            <linearGradient id="priceLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="60%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#05CD99" />
            </linearGradient>

            {/* Area Fill Gradient */}
            <linearGradient id="priceAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
            </linearGradient>

            {/* Volume Bar Gradient */}
            <linearGradient id="volBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.1" />
            </linearGradient>

            {/* Volatility Line Gradient */}
            <linearGradient id="volatilityLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Grid Lines & Y-Axis Labels */}
          {gridLevels.map(({ val, y }, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + plotWidth}
                y2={y}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left + plotWidth + 8}
                y={y + 3.5}
                fill="#64748B"
                fontSize="10"
                fontFamily="monospace"
              >
                {formatVal(val)}
              </text>
            </g>
          ))}

          {/* Time Labels (X-Axis) */}
          {chartData.map((d, i) => {
            if (i % Math.ceil(chartData.length / 6) === 0 || i === chartData.length - 1) {
              const x = getX(i);
              return (
                <text
                  key={i}
                  x={x}
                  y={svgHeight - 12}
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {d.timeLabel}
                </text>
              );
            }
            return null;
          })}

          {/* Main Visualizations based on chartMode */}
          {chartMode === "PRICE" && (
            <>
              {/* Shaded Area under Curve */}
              <polygon points={areaPoints} fill="url(#priceAreaGrad)" />

              {/* Glowing Stroke Path */}
              <polyline
                fill="none"
                stroke="url(#priceLineGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePoints}
              />
            </>
          )}

          {chartMode === "VOLUME" && (
            <g>
              {chartData.map((d, i) => {
                const x = getX(i);
                const barWidth = Math.max(3, plotWidth / chartData.length - 3);
                const y = getY(d.volume);
                const h = padding.top + plotHeight - y;
                return (
                  <rect
                    key={i}
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={h}
                    fill="url(#volBarGrad)"
                    rx="1"
                  />
                );
              })}
            </g>
          )}

          {chartMode === "VOLATILITY" && (
            <>
              <polygon points={areaPoints} fill="rgba(245, 158, 11, 0.12)" />
              <polyline
                fill="none"
                stroke="url(#volatilityLineGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePoints}
              />
            </>
          )}

          {/* Crosshair Overlay */}
          {crosshairPos && (
            <g pointerEvents="none">
              {/* Vertical Crosshair Line */}
              <line
                x1={crosshairPos.x}
                y1={padding.top}
                x2={crosshairPos.x}
                y2={padding.top + plotHeight}
                stroke="#D4AF37"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.75"
              />

              {/* Horizontal Crosshair Line */}
              <line
                x1={padding.left}
                y1={crosshairPos.y}
                x2={padding.left + plotWidth}
                y2={crosshairPos.y}
                stroke="#D4AF37"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.75"
              />

              {/* Intersection Pulse Dot */}
              <circle
                cx={crosshairPos.x}
                cy={getY(getYValue(activeHoverItem))}
                r="4.5"
                fill="#D4AF37"
                stroke="#000"
                strokeWidth="2"
                className="animate-pulse"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-sans">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Feed: DMX-35 Level 3 Telemetry Enclave
        </span>
        <span className="text-gray-400 font-mono text-[11px]">
          Resolution: Reconstructed
        </span>
      </div>
    </div>
  );
}
