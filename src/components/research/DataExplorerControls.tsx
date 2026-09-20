"use client";

import React from "react";
import { 
  BarChart2, 
  TrendingUp, 
  Layers, 
  Activity, 
  Maximize2, 
  SlidersHorizontal,
  Clock,
  Calendar,
  Zap,
  ArrowRightLeft
} from "lucide-react";
import { 
  ResearchFeature, 
  SamplingInterval, 
  DateRangeKey, 
  ResearchQueryParams 
} from "@/services/api/research";
import { MOCK_ASSETS, AssetContract } from "@/data/mock/assets";

interface DataExplorerControlsProps {
  params: ResearchQueryParams;
  onChangeParams: (updated: Partial<ResearchQueryParams>) => void;
}

const ASSET_ITEMS: { ticker: string; name: string; category: string; image: string }[] = [
  { ticker: "DUNE-NRG", name: "Dune Energy", category: "Energy", image: "/assets/dune-energy.jpg" },
  { ticker: "NEX-AI", name: "Nexus AI", category: "Compute", image: "/assets/nexus-ai.jpg" },
  { ticker: "ORBT-LOG", name: "Orbit Logistics", category: "Logistics", image: "/assets/orbit-logistics.jpg" },
  { ticker: "DES-H2", name: "Desert Hydrogen", category: "Clean Tech", image: "/assets/desert-hydrogen.jpg" },
  { ticker: "DIFC-100", name: "DIFC-100", category: "Index Benchmark", image: "/assets/difc-100.jpg" },
];

const FEATURES: { key: ResearchFeature; label: string; desc: string }[] = [
  { key: "price", label: "Price", desc: "Mid / Last continuous execution" },
  { key: "returns", label: "Returns", desc: "Log / percentage delta" },
  { key: "volume", label: "Volume", desc: "Interval turnover dynamics" },
  { key: "volatility", label: "Volatility", desc: "Rolling realized volatility" },
  { key: "spread", label: "Spread", desc: "Bid-ask spread & basis points" },
  { key: "imbalance", label: "Imbalance", desc: "Order book queue skew (B-A)/(B+A)" },
];

const INTERVALS: { key: SamplingInterval; label: string }[] = [
  { key: "1s", label: "1s" },
  { key: "1m", label: "1m" },
  { key: "5m", label: "5m" },
  { key: "15m", label: "15m" },
  { key: "1h", label: "1h" },
  { key: "1d", label: "1d" },
];

const DATE_RANGES: { key: DateRangeKey; label: string }[] = [
  { key: "24h", label: "24h" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "all", label: "Session" },
];

export function DataExplorerControls({
  params,
  onChangeParams,
}: DataExplorerControlsProps) {
  const isCorrelationOrScatter =
    params.feature === "correlation";

  return (
    <div className="bg-[#0b101d]/90 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-md select-none space-y-4">
      {/* 1. Primary Asset Selector Ribbon */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-gray-400 font-sans flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
            Primary Target Instrument
          </span>
          <span className="text-[10px] font-mono text-gray-500">
            5 Core Continuous Auction Assets
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {ASSET_ITEMS.map((item) => {
            const isSelected = params.asset.toUpperCase() === item.ticker.toUpperCase();
            return (
              <button
                key={item.ticker}
                onClick={() => onChangeParams({ asset: item.ticker })}
                className={`p-2.5 rounded-lg border text-left transition-all relative ${
                  isSelected
                    ? "bg-[#D4AF37]/15 border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.12)]"
                    : "bg-black/40 border-white/5 hover:border-white/15 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-7 h-7 rounded-full object-cover border border-white/20"
                    />
                    <span
                      className={`text-base font-extrabold block truncate ${
                        isSelected ? "text-white" : "text-gray-200"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded ${
                      isSelected
                        ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                        : "bg-white/5 text-gray-400"
                    }`}
                  >
                    {item.ticker}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 block mt-1 font-sans">
                  {item.category}
                </span>
                {isSelected && (
                  <span className="absolute -bottom-px left-3 right-3 h-[2px] bg-[#D4AF37] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Controls Grid: Features */}
      <div className="pt-3 border-t border-white/5">
        <span className="text-[11px] font-medium text-gray-400 font-sans block mb-2">
          Statistical Feature / Channel
        </span>
        <div className="flex w-full items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-white/5">
          {FEATURES.map((feat) => {
            const isActive = params.feature === feat.key;
            return (
              <button
                key={feat.key}
                onClick={() => onChangeParams({ feature: feat.key })}
                title={feat.desc}
                className={`flex-1 text-sm px-4 py-2 rounded-md transition-all font-sans font-medium text-center ${
                  isActive
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {feat.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
