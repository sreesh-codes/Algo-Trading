"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PlaySquare, Send, Code, Terminal, CheckCircle2, Cpu } from "lucide-react";

export const StrategiesLabSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"python" | "cpp">("python");

  const pythonSnippet = `import mercantile as mc
from mercantile.quantum import calculate_microstructure_skew

class SovereignMarketMaker(mc.Strategy):
    def initialize(self):
        self.asset = "DUNE-NRG"
        self.max_inventory = 5000
        self.target_spread_bps = 8.5

    def on_tick(self, book: mc.OrderBook, telemetry: mc.Telemetry):
        # Calculate real-time skew across Dubai solar irradiance index
        skew = calculate_microstructure_skew(book.bids, book.asks)
        mid_price = (book.best_bid + book.best_ask) / 2.0
        
        # Cryogenic spread optimization with inventory dampening
        quote_bid = mid_price - (self.target_spread_bps * 0.001) - (self.inventory * 0.0002)
        quote_ask = mid_price + (self.target_spread_bps * 0.001) - (self.inventory * 0.0002)

        if abs(self.inventory) < self.max_inventory:
            self.submit_limit_order(mc.BUY, quote_bid, size=100)
            self.submit_limit_order(mc.SELL, quote_ask, size=100)`;

  const cppSnippet = `#include <mercantile/engine.hpp>
#include <mercantile/quantum_mesh.hpp>

class HighFrequencyArb : public mc::Strategy {
public:
    void on_depth_update(const mc::DepthBook& book) override {
        // Zero-copy sub-microsecond cross-arbitrage execution
        const double fair_mid = book.calculate_vwap(5);
        if (book.has_imbalance(0.72)) {
            dispatch_sweep_order(mc::Side::Buy, 250);
        }
    }
};`;

  return (
    <div className="w-full space-y-6 font-mono-tech">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4 font-sans">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="font-mono text-xs tracking-wider text-[#D4AF37] uppercase font-semibold">
              Chapter 04 • Algorithmic Execution Lab
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Quantitative Strategy Lab
          </h3>
          <p className="text-sm text-[#94A3B8] font-sans mt-1 max-w-xl leading-relaxed">
            Develop, backtest, and deploy high-frequency algorithms in Python or C++. Stress-test strategies across synthetic liquidity cascades and market regimes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/backtest"
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black text-xs font-bold tracking-wider transition-all"
          >
            <PlaySquare size={14} />
            <span>LAUNCH STRATEGY LAB</span>
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold tracking-wider transition-all"
          >
            <Send size={14} />
            <span>SUBMIT BOT</span>
          </Link>
        </div>
      </div>

      {/* Code Editor Preview & Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Code Editor Window (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-white/15 bg-[#070B14] overflow-hidden shadow-2xl flex flex-col justify-between">
          {/* Editor Title Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0B101D] border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#05CD99]" />
              </div>
              <span className="text-[#94A3B8] text-[11px] ml-2">
                strategy_agent_v4.{activeTab === "python" ? "py" : "cpp"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px]">
              <button
                onClick={() => setActiveTab("python")}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  activeTab === "python"
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] font-bold"
                    : "text-[#64748B] hover:text-white"
                }`}
              >
                Python SDK
              </button>
              <button
                onClick={() => setActiveTab("cpp")}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  activeTab === "cpp"
                    ? "bg-[#00F0FF]/20 text-[#00F0FF] font-bold"
                    : "text-[#64748B] hover:text-white"
                }`}
              >
                C++ Core
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <pre className="p-4 text-xs text-[#CBD5E1] overflow-x-auto leading-relaxed bg-[#050811] font-mono-tech select-text">
            <code>{activeTab === "python" ? pythonSnippet : cppSnippet}</code>
          </pre>

          {/* Status Bar */}
          <div className="px-4 py-2 bg-[#0A0E1A] border-t border-white/5 flex items-center justify-between text-[10px] text-[#64748B]">
            <span className="flex items-center gap-1.5 text-[#05CD99]">
              <CheckCircle2 size={12} /> SYNTAX VERIFIED • DMX-COMPILER READY
            </span>
            <span>MEMORY FOOTPRINT: 12.4 MB</span>
          </div>
        </div>

        {/* Feature Highlights & Lab Telemetry (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl border border-white/10 bg-[#070B14]/90 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              HIGH-PRECISION SIMULATION ENVIRONMENT
            </div>

            <div className="space-y-3 text-xs">
              {[
                {
                  title: "Nanosecond Tick Replay",
                  desc: "Deterministic backtesting with accurate packet propagation delays and matching priority queue models.",
                },
                {
                  title: "Adverse Selection Stress Tests",
                  desc: "Simulate sudden liquidity drain, hyperloop transit delays, and solar flash outages.",
                },
                {
                  title: "Institutional Sharpe & Drawdown Profiler",
                  desc: "Instant breakdown of Sortino ratio, max drawdown, inventory volatility, and fill ratios.",
                },
              ].map((feat, idx) => (
                <div key={idx} className="p-3 rounded bg-black/40 border border-white/5 space-y-1">
                  <div className="text-white font-semibold text-[11px] flex items-center gap-1.5">
                    <Cpu size={12} className="text-[#D4AF37]" />
                    {feat.title}
                  </div>
                  <p className="text-[#94A3B8] text-[10px] leading-relaxed font-sans">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-[#64748B]">BACKTEST LATENCY: &lt; 0.04s / 1M TICKS</span>
            <Link
              href="/learn"
              className="text-[#D4AF37] hover:underline text-[11px]"
            >
              QUANT DOCUMENTATION →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
