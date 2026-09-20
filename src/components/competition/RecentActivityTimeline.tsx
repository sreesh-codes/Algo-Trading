"use client";

import React, { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Terminal,
  ExternalLink
} from "lucide-react";

type ActivityCategory = "ALL" | "ORDERS" | "FILLS" | "SYSTEM";

interface ActivityItem {
  id: string;
  timestamp: string;
  category: "ORDERS" | "FILLS" | "SYSTEM";
  title: string;
  asset?: string;
  side?: "BUY" | "SELL";
  price?: number;
  qty?: number;
  status: "FILLED" | "PENDING" | "CANCELED" | "ACKNOWLEDGED" | "RESOLVED";
  latencyMs?: number;
  feeOrRebate?: string;
  details: string;
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-01",
    timestamp: "14:42:18.092",
    category: "FILLS",
    title: "Maker fill executed",
    asset: "Dune Energy",
    side: "BUY",
    price: 142.85,
    qty: 250,
    status: "FILLED",
    latencyMs: 0.38,
    feeOrRebate: "+0.5 bps rebate",
    details: "Matched against Dark Liquidity Pool DIP-4 at passive limit price."
  },
  {
    id: "act-02",
    timestamp: "14:41:55.310",
    category: "ORDERS",
    title: "Limit order submitted",
    asset: "Nexus AI",
    side: "SELL",
    price: 489.10,
    qty: 80,
    status: "PENDING",
    latencyMs: 0.42,
    details: "Resting on Order Book Level 2. Spread captured: 0.45 Blitz."
  },
  {
    id: "act-03",
    timestamp: "14:40:12.784",
    category: "SYSTEM",
    title: "Volatility band adjustment",
    status: "ACKNOWLEDGED",
    details: "Exchange widened dynamic circuit collar on Energy Sector to ±6.5%."
  },
  {
    id: "act-04",
    timestamp: "14:38:44.205",
    category: "FILLS",
    title: "Cross-venue arbitrage fill",
    asset: "Orbit Logistics",
    side: "SELL",
    price: 312.40,
    qty: 120,
    status: "FILLED",
    latencyMs: 0.29,
    feeOrRebate: "-1.1 bps taker",
    details: "DIFC-Jebel Ali latency leg settled. Gross spread captured: 1.82 Blitz."
  },
  {
    id: "act-05",
    timestamp: "14:35:02.110",
    category: "ORDERS",
    title: "Stop cancelled & replaced",
    asset: "Desert Hydrogen",
    side: "BUY",
    price: 88.50,
    qty: 400,
    status: "ACKNOWLEDGED",
    latencyMs: 0.51,
    details: "Trailing stop ratcheted to lock in unrealized delta."
  },
  {
    id: "act-06",
    timestamp: "14:31:19.489",
    category: "SYSTEM",
    title: "Telemetry sync verified",
    status: "RESOLVED",
    details: "L3 Market Feed heartbeat ping: 0.41ms roundtrip. Zero packet loss."
  },
  {
    id: "act-07",
    timestamp: "14:27:08.665",
    category: "FILLS",
    title: "VWAP slice completed",
    asset: "DIFC-100",
    side: "BUY",
    price: 5410.20,
    qty: 15,
    status: "FILLED",
    latencyMs: 0.35,
    feeOrRebate: "+0.4 bps rebate",
    details: "Algorithm completed 10-minute micro-slice batch without market impact."
  }
];

export function RecentActivityTimeline() {
  const [filter, setFilter] = useState<ActivityCategory>("ALL");

  const filterTabs: { key: ActivityCategory; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "ORDERS", label: "Orders" },
    { key: "FILLS", label: "Fills" },
    { key: "SYSTEM", label: "System" },
  ];

  const filteredItems = INITIAL_ACTIVITIES.filter(
    (item) => filter === "ALL" || item.category === filter
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0C1222]/95 to-[#060912]/95 border border-[#D4AF37]/20 rounded-xl p-4 sm:p-5 flex flex-col backdrop-blur-xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)]">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-xs font-semibold text-white font-sans tracking-normal">
            Execution Stream & Audit Log
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
            {filteredItems.length} events
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`text-xs font-sans px-2.5 py-1 rounded transition-colors ${
                filter === tab.key
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="mt-3 divide-y divide-white/5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="py-3 px-3 rounded-lg hover:bg-gradient-to-r hover:from-white/[0.04] hover:to-transparent border border-transparent hover:border-white/5 transition-all duration-300 flex items-start justify-between gap-3 group"
          >
            {/* Left Column: Icon + Description */}
            <div className="flex items-start gap-3 min-w-0">
              {/* Category Icon Badge */}
              <div
                className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                  item.category === "FILLS"
                    ? item.side === "BUY"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    : item.category === "ORDERS"
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                }`}
              >
                {item.category === "FILLS" && (
                  item.side === "BUY" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />
                )}
                {item.category === "ORDERS" && <Clock className="w-3.5 h-3.5" />}
                {item.category === "SYSTEM" && <Cpu className="w-3.5 h-3.5" />}
              </div>

              {/* Text metadata */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-white font-sans">
                    {item.title}
                  </span>
                  {item.asset && (
                    <span className="text-[11px] font-sans font-medium px-1.5 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                      {item.asset}
                    </span>
                  )}
                  {item.side && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                        item.side === "BUY"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-rose-500/15 text-rose-300"
                      }`}
                    >
                      {item.side}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                      item.status === "FILLED"
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                        : item.status === "PENDING"
                        ? "border-cyan-500/30 text-cyan-400 bg-cyan-500/5"
                        : item.status === "ACKNOWLEDGED"
                        ? "border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5"
                        : "border-gray-500/30 text-gray-400 bg-gray-500/5"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-gray-400 font-sans mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">
                  {item.details}
                </p>

                {/* Subtext info */}
                <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-gray-500 tabular-nums">
                  {item.price && (
                    <span>
                      Px: <span className="text-gray-300">{item.price.toFixed(2)} Blitz</span>
                    </span>
                  )}
                  {item.qty && (
                    <span>
                      Qty: <span className="text-gray-300">{item.qty}</span>
                    </span>
                  )}
                  {item.latencyMs && (
                    <span>
                      Latency: <span className="text-cyan-400">{item.latencyMs}ms</span>
                    </span>
                  )}
                  {item.feeOrRebate && (
                    <span className={item.feeOrRebate.includes("rebate") ? "text-emerald-400" : "text-gray-400"}>
                      {item.feeOrRebate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Exact High-Precision Timestamp */}
            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-gray-400 block">
                {item.timestamp}
              </span>
              <span className="text-[9px] font-mono text-gray-600">
                UTC+4
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          DIFC Matching Engine: Sub-millisecond FIX Protocol v4.4 Active
        </span>
        <span className="text-gray-400">BUFFER: 2,048 MSG/SEC</span>
      </div>
      </div>
    </div>
  );
}
