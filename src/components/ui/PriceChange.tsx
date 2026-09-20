import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface PriceChangeProps {
  value: number;
  percent?: number;
  showIcon?: boolean;
  prefix?: string;
  suffix?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PriceChange: React.FC<PriceChangeProps> = ({
  value,
  percent,
  showIcon = true,
  prefix = "",
  suffix = "",
  size = "md",
  className,
}) => {
  const isPositive = value > 0;
  const isZero = value === 0;

  const colorClass = isZero
    ? "text-[#94A3B8] bg-white/5 border-white/10"
    : isPositive
    ? "text-[#05CD99] bg-[#05CD99]/10 border-[#05CD99]/30"
    : "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30";

  const sizeClass = {
    sm: "text-[11px] px-1.5 py-0.5 font-mono-tech gap-0.5",
    md: "text-xs px-2 py-0.5 font-mono-tech gap-1",
    lg: "text-sm px-2.5 py-1 font-mono-tech gap-1.5 font-semibold",
  };

  const formattedValue = `${isPositive ? "+" : ""}${value.toFixed(2)}${suffix}`;
  const formattedPercent =
    percent !== undefined
      ? ` (${isPositive ? "+" : ""}${percent.toFixed(2)}%)`
      : "";

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center rounded border font-medium",
          colorClass,
          sizeClass[size],
          className
        )
      )}
    >
      {showIcon && (
        <span className="shrink-0">
          {isZero ? (
            <Minus size={12} />
          ) : isPositive ? (
            <ArrowUpRight size={13} />
          ) : (
            <ArrowDownRight size={13} />
          )}
        </span>
      )}
      <span>
        {prefix}
        {formattedValue}
        {formattedPercent}
      </span>
    </span>
  );
};
