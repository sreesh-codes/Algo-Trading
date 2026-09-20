"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, BarChart2, BookOpen, Send, Trophy, Radio, Terminal } from "lucide-react";
import { MOCK_ASSETS } from "@/data/mock/assets";
import { GlassPanel } from "./GlassPanel";

const QUICK_ACTIONS = [
  { title: "Browse All Energy & Commodities", href: "/markets", icon: BarChart2, category: "Market" },
  { title: "Strategy Backtesting Simulation", href: "/backtest", icon: Terminal, category: "Lab" },
  { title: "Upload New Python Bot (Round 3)", href: "/submit", icon: Send, category: "Execution" },
  { title: "View Global Institutional Leaderboard", href: "/leaderboard", icon: Trophy, category: "Rankings" },
  { title: "Quantitative Papers & Parquet Datasets", href: "/research", icon: BookOpen, category: "Data" },
];

export const CommandBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-bar", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-bar", handleCustomOpen);
    };
  }, []);

  if (!isOpen) return null;

  const filteredAssets = MOCK_ASSETS.filter(
    (a) =>
      a.ticker.toLowerCase().includes(query.toLowerCase()) ||
      a.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = QUICK_ACTIONS.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={() => setIsOpen(false)} aria-hidden="true" />
      <div className="relative w-full max-w-xl z-10">
        <GlassPanel variant="gold" hudCorners className="p-0 overflow-hidden shadow-2xl">
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#0B0F1C]">
            <Search size={18} className="text-[#D4AF37]" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search contracts, tickers, backtests, or command routes..."
              className="flex-1 bg-transparent text-sm text-white placeholder-[#64748B] outline-none font-mono-tech"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#64748B] hover:text-white transition-colors cursor-pointer text-xs font-mono-tech px-1.5 py-0.5 rounded border border-white/10"
            >
              ESC
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5 font-mono-tech text-xs">
            {/* Asset Contracts Section */}
            {filteredAssets.length > 0 && (
              <div className="py-2">
                <div className="px-3 py-1 text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                  Asset Contracts
                </div>
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.ticker}
                    onClick={() => handleSelect("/markets")}
                    className="flex items-center justify-between px-3 py-2 rounded hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-white group-hover:text-[#D4AF37]">
                        {asset.ticker}
                      </span>
                      <span className="text-[#94A3B8] truncate max-w-[220px]">
                        {asset.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4AF37] font-semibold">
                        {asset.lastPrice.toFixed(2)} Blitz
                      </span>
                      <ArrowRight size={13} className="text-[#64748B] group-hover:text-white" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions Section */}
            {filteredActions.length > 0 && (
              <div className="py-2">
                <div className="px-3 py-1 text-[10px] text-[#00F0FF] uppercase tracking-wider font-semibold">
                  Navigation & Tools
                </div>
                {filteredActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={action.href}
                      onClick={() => handleSelect(action.href)}
                      className="flex items-center justify-between px-3 py-2 rounded hover:bg-white/5 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 text-white">
                        <Icon size={14} className="text-[#94A3B8] group-hover:text-[#00F0FF]" />
                        <span>{action.title}</span>
                      </div>
                      <span className="text-[10px] text-[#64748B] uppercase">
                        {action.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {filteredAssets.length === 0 && filteredActions.length === 0 && (
              <div className="py-8 text-center text-[#64748B]">
                No matching contracts or commands found for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
