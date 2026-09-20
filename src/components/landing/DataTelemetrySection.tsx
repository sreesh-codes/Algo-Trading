"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Cpu, ArrowUpRight, Layers } from "lucide-react";

interface OrderBookRow {
  price: number;
  size: number;
  total: number;
}

export const DataTelemetrySection: React.FC = () => {
  const [matchingLatency, setMatchingLatency] = useState<number>(1.18);
  const [messagesPerSec, setMessagesPerSec] = useState<number>(248500);

  // Subtle tick fluctuation in engine telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setMatchingLatency(Number((1.12 + Math.random() * 0.12).toFixed(2)));
      setMessagesPerSec(Math.floor(245000 + Math.random() * 8000));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const bids: OrderBookRow[] = [
    { price: 428.5, size: 2400, total: 2400 },
    { price: 428.4, size: 4800, total: 7200 },
    { price: 428.3, size: 8500, total: 15700 },
    { price: 428.1, size: 12400, total: 28100 },
    { price: 428.0, size: 28000, total: 56100 },
  ];

  const asks: OrderBookRow[] = [
    { price: 428.6, size: 2100, total: 2100 },
    { price: 428.7, size: 5200, total: 7300 },
    { price: 428.8, size: 9100, total: 16400 },
    { price: 429.0, size: 14200, total: 30600 },
    { price: 429.2, size: 25800, total: 56400 },
  ];

  return (
    <div className="w-full space-y-6 font-mono-tech">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4 font-sans">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
            <span className="font-mono text-xs tracking-wider text-[#00F0FF] uppercase font-semibold">
              Chapter 03 • Continuous Depth of Book
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Cryogenic Order Flow & Telemetry
          </h3>
          <p className="text-sm text-[#94A3B8] font-sans mt-1 max-w-xl leading-relaxed">
            Live sub-millisecond Level-2 feed broadcast from the subterranean DIFC quantum matching engine. High-frequency trade reconciliation and zero-slippage execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs">
            <span className="text-[#64748B]">LATENCY:</span>{" "}
            <span className="text-[#05CD99] font-bold">{matchingLatency}ms</span>
          </div>
          <div className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs">
            <span className="text-[#64748B]">FEED:</span>{" "}
            <span className="text-[#D4AF37] font-bold">
              {messagesPerSec.toLocaleString()} msg/s
            </span>
          </div>
        </div>
      </div>

      {/* Depth of Book / Engine Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Order Book Visualizer (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl border border-white/10 bg-[#070B14]/90 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3 text-xs">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-[#00F0FF]" />
              <span className="text-white font-bold tracking-wider uppercase">
                DUNE-NRG // REAL-TIME DEPTH LADDER
              </span>
            </div>
            <span className="text-[#64748B] text-[10px]">SPREAD: 0.10 Blitz</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Asks (Sells) */}
            <div>
              <div className="text-[10px] text-[#EF4444] font-bold uppercase tracking-wider mb-2 flex justify-between">
                <span>ASK (Blitz)</span>
                <span>SIZE</span>
              </div>
              <div className="space-y-1">
                {asks.map((row, i) => (
                  <div
                    key={i}
                    className="relative flex items-center justify-between px-2 py-1 rounded bg-black/40 border border-white/5 overflow-hidden"
                  >
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-[#EF4444]/15 pointer-events-none"
                      style={{ width: `${(row.size / 28000) * 100}%` }}
                    />
                    <span className="text-[#EF4444] font-bold relative z-10">
                      {row.price.toFixed(2)}
                    </span>
                    <span className="text-[#CBD5E1] text-[11px] relative z-10">
                      {row.size.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bids (Buys) */}
            <div>
              <div className="text-[10px] text-[#05CD99] font-bold uppercase tracking-wider mb-2 flex justify-between">
                <span>BID (Blitz)</span>
                <span>SIZE</span>
              </div>
              <div className="space-y-1">
                {bids.map((row, i) => (
                  <div
                    key={i}
                    className="relative flex items-center justify-between px-2 py-1 rounded bg-black/40 border border-white/5 overflow-hidden"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#05CD99]/15 pointer-events-none"
                      style={{ width: `${(row.size / 28000) * 100}%` }}
                    />
                    <span className="text-[#05CD99] font-bold relative z-10">
                      {row.price.toFixed(2)}
                    </span>
                    <span className="text-[#CBD5E1] text-[11px] relative z-10">
                      {row.size.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-[#64748B]">
            <span>ORDER DEPTH: 112,500 CONTRACTS</span>
            <span className="text-[#00F0FF]">DMX CRYOGENIC MATCH PROTOCOL V4</span>
          </div>
        </div>

        {/* Global Node Telemetry Matrix (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl border border-white/10 bg-[#070B14]/90 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-xs">
            <span className="text-white font-bold tracking-wider uppercase">
              DISTRIBUTED CO-LOCATION NODES
            </span>
            <span className="text-[#05CD99] text-[10px]">ALL SYNCHRONIZED</span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { name: "DIFC Cryo Hub A", ping: "0.18ms", status: "COHERENT", p: "99.99%" },
              { name: "Burj Spire Quantum Core", ping: "0.24ms", status: "PRIMARY", p: "100.0%" },
              { name: "Jebel Ali Port Mesh", ping: "0.62ms", status: "STABLE", p: "99.98%" },
              { name: "MBR Solar Substation 4", ping: "0.78ms", status: "ONLINE", p: "99.95%" },
            ].map((node, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5"
              >
                <div>
                  <div className="text-white font-semibold text-[11px]">{node.name}</div>
                  <div className="text-[9px] text-[#64748B]">PING: {node.ping}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-[#D4AF37]">{node.status}</div>
                  <div className="text-[9px] text-[#05CD99]">{node.p} UP</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px]">
            <Link
              href="/markets"
              className="text-[#00F0FF] hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>EXPLORE SYNTHETIC MARKETS</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
