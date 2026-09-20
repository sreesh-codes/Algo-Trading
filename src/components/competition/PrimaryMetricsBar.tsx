"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  Shield,
  Activity,
  Coins,
  Percent,
} from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  subtext: string;
  badge: string;
  badgeColor: "green" | "gold" | "cyan" | "amber";
  delta?: string;
  isPositive?: boolean;
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  badge,
  badgeColor,
  delta,
  isPositive = true,
  delay = 0,
}) => {
  const badgeClasses = {
    green: "text-[#05CD99] bg-[#05CD99]/10 border-[#05CD99]/30",
    gold: "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30",
    cyan: "text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/30",
    amber: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="p-4 rounded-xl border border-white/10 bg-[#080D1A]/95 backdrop-blur-md relative overflow-hidden select-none flex flex-col justify-between hover:border-white/25 transition-all group shadow-lg"
    >
      {/* Corner HUD Markers */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />

      <div>
        {/* Header Label and Badge */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-xs font-medium text-[#94A3B8] font-sans">
            {label}
          </span>
          <span
            className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${badgeClasses[badgeColor]}`}
          >
            {badge}
          </span>
        </div>

        {/* Primary Value */}
        <div className="flex items-baseline gap-1.5 mb-1.5">
          <span
            className={`text-xl sm:text-2xl font-semibold font-mono tabular-nums tracking-tight ${
              isPositive ? "text-white group-hover:text-[#05CD99]" : "text-[#EF4444]"
            } transition-colors`}
          >
            {value}
          </span>
          {delta && (
            <span
              className={`text-xs font-mono font-medium tabular-nums flex items-center ${
                isPositive ? "text-[#05CD99]" : "text-[#EF4444]"
              }`}
            >
              {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {delta}
            </span>
          )}
        </div>
      </div>

      {/* Subtext info */}
      <div className="text-[11px] font-sans text-[#64748B] pt-2 border-t border-white/5 truncate">
        {subtext}
      </div>
    </motion.div>
  );
};

export const PrimaryMetricsBar: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      <MetricCard
        label="Total P&L"
        value="+1,428,950"
        delta="+28.58%"
        subtext="+142,390 Blitz today"
        badge="Profit"
        badgeColor="green"
        isPositive={true}
        delay={0.05}
      />
      <MetricCard
        label="Return"
        value="+28.58%"
        delta="+2.26%"
        subtext="Benchmark: +14.38%"
        badge="Alpha +14.2%"
        badgeColor="green"
        isPositive={true}
        delay={0.1}
      />
      <MetricCard
        label="League Rank"
        value="#7"
        delta="▲ 2"
        subtext="Top 29% of 24 teams"
        badge="Tier I"
        badgeColor="gold"
        isPositive={true}
        delay={0.15}
      />
      <MetricCard
        label="Sharpe Ratio"
        value="2.84"
        subtext="Sortino: 3.45 • Calmar: 6.9"
        badge="Optimal"
        badgeColor="cyan"
        isPositive={true}
        delay={0.2}
      />
      <MetricCard
        label="Max Drawdown"
        value="-4.12%"
        subtext="Liquidation limit: -8.00%"
        badge="Safe buffer"
        badgeColor="amber"
        isPositive={false}
        delay={0.25}
      />
      <MetricCard
        label="Portfolio Capital"
        value="6,428,950"
        subtext="Avail: 4.20M • Margin: 13.3%"
        badge="Blitz"
        badgeColor="gold"
        isPositive={true}
        delay={0.3}
      />
    </div>
  );
};
