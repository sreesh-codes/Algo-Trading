import React from "react";
import { GlassPanel } from "./GlassPanel";
import { TechnicalLabel } from "./TechnicalLabel";
import { AnimatedNumber } from "./AnimatedNumber";
import { PriceChange } from "./PriceChange";
import { Sparkline } from "./Sparkline";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface MetricCardProps {
  title: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  tag?: string;
  tagVariant?: "gold" | "cyan" | "silver" | "amber" | "green" | "red";
  change?: number;
  changePercent?: number;
  changeSuffix?: string;
  sparklineData?: number[];
  sparklineColor?: "green" | "red" | "gold" | "cyan";
  subtext?: string;
  variant?: "default" | "gold" | "cyan";
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  decimals = 2,
  prefix = "",
  suffix = "",
  tag,
  tagVariant = "silver",
  change,
  changePercent,
  changeSuffix,
  sparklineData,
  sparklineColor,
  subtext,
  variant = "default",
  className,
}) => {
  return (
    <GlassPanel
      variant={variant}
      hudCorners
      interactive
      className={twMerge(
        clsx(
          "p-4 group flex flex-col justify-between",
          className
        )
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs text-[#94A3B8] font-mono-tech tracking-wider uppercase">
            {title}
          </span>
          {tag && <TechnicalLabel variant={tagVariant}>{tag}</TechnicalLabel>}
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono-tech">
            <AnimatedNumber
              value={value}
              decimals={decimals}
              prefix={prefix}
              suffix={suffix}
              flashOnChange={true}
            />
          </div>

          {sparklineData && (
            <div className="hidden sm:block">
              <Sparkline
                data={sparklineData}
                color={sparklineColor}
                width={80}
                height={28}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
        {change !== undefined ? (
          <PriceChange
            value={change}
            percent={changePercent}
            suffix={changeSuffix}
            size="sm"
          />
        ) : (
          <span className="text-[#64748B] text-[11px] font-mono-tech">—</span>
        )}

        {subtext && (
          <span className="text-[11px] text-[#94A3B8] font-mono-tech">
            {subtext}
          </span>
        )}
      </div>
    </GlassPanel>
  );
};
