"use client";

import React from "react";
import { 
  BarChart, 
  TrendingDown, 
  TrendingUp, 
  HelpCircle, 
  Activity, 
  Percent, 
  Scale, 
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { AssetStatistics, ResearchFeature } from "@/services/api/research";

interface StatisticsMetricsBarProps {
  statistics: AssetStatistics;
  feature: ResearchFeature;
}

export function StatisticsMetricsBar({
  statistics,
  feature,
}: StatisticsMetricsBarProps) {
  const isPositiveMean = statistics.mean >= 0;
  const isLeptokurtic = statistics.kurtosis > 0;
  const isNegSkew = statistics.skewness < 0;

  return (
    <div className="bg-[#0b101d]/90 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-md select-none space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#D4AF37]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-white font-sans">
            Descriptive Statistics & Higher Moments
          </h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
          <span>SAMPLE: {statistics.sampleCount.toLocaleString()} OBSERVATIONS</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">
            {statistics.stationarityStatus}
          </span>
        </div>
      </div>

      {/* 7 Required Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {/* 1. MEAN */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-medium text-gray-400 block font-sans">
            Mean (μ)
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-base sm:text-lg font-mono font-semibold tabular-nums ${
                isPositiveMean ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {isPositiveMean ? "+" : ""}
              {statistics.mean.toFixed(4)}%
            </span>
          </div>
          <span className="text-[10px] text-gray-500 font-sans block">
            Expected value
          </span>
        </div>

        {/* 2. MEDIAN */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-medium text-gray-400 block font-sans">
            Median (50th)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-mono font-semibold tabular-nums text-white">
              {statistics.median >= 0 ? "+" : ""}
              {statistics.median.toFixed(4)}%
            </span>
          </div>
          <span className="text-[10px] text-gray-500 font-sans block">
            IQR: ±{statistics.interquartileRange.toFixed(3)}%
          </span>
        </div>

        {/* 3. STANDARD DEVIATION */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-medium text-gray-400 block font-sans">
            Std Dev (σ)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-mono font-semibold tabular-nums text-cyan-300">
              {statistics.stdDev.toFixed(4)}%
            </span>
          </div>
          <span className="text-[10px] text-gray-500 font-sans block">
            Interval dispersion
          </span>
        </div>

        {/* 4. SKEWNESS */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-medium text-gray-400 block font-sans">
            Skewness (S)
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-base sm:text-lg font-mono font-semibold tabular-nums ${
                Math.abs(statistics.skewness) < 0.2
                  ? "text-gray-200"
                  : isNegSkew
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              {statistics.skewness > 0 ? "+" : ""}
              {statistics.skewness.toFixed(3)}
            </span>
          </div>
          <span className="text-[10px] font-sans text-gray-400 block">
            {Math.abs(statistics.skewness) < 0.2
              ? "Symmetric"
              : isNegSkew
              ? "Left tail risk"
              : "Right tail skew"}
          </span>
        </div>

        {/* 5. KURTOSIS */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-medium text-gray-400 block font-sans">
            Excess Kurtosis (K)
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-base sm:text-lg font-mono font-semibold tabular-nums ${
                isLeptokurtic ? "text-[#D4AF37]" : "text-gray-300"
              }`}
            >
              {statistics.kurtosis > 0 ? "+" : ""}
              {statistics.kurtosis.toFixed(3)}
            </span>
          </div>
          <span className="text-[10px] font-sans text-gray-400 block">
            {isLeptokurtic ? "Fat tails (leptokurtic)" : "Mesokurtic normal"}
          </span>
        </div>

        {/* 6. AUTOCORRELATION LAG 1 */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-medium text-gray-400 block font-sans">
            Autocorr (ρ₁)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-mono font-semibold tabular-nums text-emerald-400">
              {statistics.autocorrelationLag1 > 0 ? "+" : ""}
              {statistics.autocorrelationLag1.toFixed(4)}
            </span>
          </div>
          <span className="text-[10px] font-sans text-gray-500 block">
            {Math.abs(statistics.autocorrelationLag1) < 0.05
              ? "Random walk (i.i.d.)"
              : statistics.autocorrelationLag1 < 0
              ? "Mean-reverting"
              : "Momentum persistence"}
          </span>
        </div>

        {/* 7. VOLATILITY (ANNUALIZED) */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
          <span className="text-[11px] font-medium text-gray-400 block font-sans">
            Annualized Vol
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-mono font-semibold tabular-nums text-[#D4AF37]">
              {statistics.annualizedVolatility.toFixed(2)}%
            </span>
          </div>
          <span className="text-[10px] font-sans text-gray-500 block">
            VaR (95%): {statistics.var95.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}
