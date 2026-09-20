import React, { useId } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SparklineProps {
  data: number[];
  color?: "green" | "red" | "gold" | "cyan";
  width?: number;
  height?: number;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color,
  width = 120,
  height = 36,
  className,
}) => {
  const reactId = useId().replace(/:/g, "");

  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Auto-detect color from trend if not specified
  const isUp = data[data.length - 1] >= data[0];
  const strokeColor = color
    ? {
        green: "#05CD99",
        red: "#EF4444",
        gold: "#D4AF37",
        cyan: "#00F0FF",
      }[color]
    : isUp
    ? "#05CD99"
    : "#EF4444";

  const padding = 2;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * usableWidth;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

  const gradientId = `spark-grad-${reactId}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={twMerge(clsx("overflow-visible shrink-0", className))}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradientId})`} />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
