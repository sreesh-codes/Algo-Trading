"use client";

import React, { useState } from "react";
import { 
  AlertOctagon, 
  Radio, 
  ChevronRight, 
  X, 
  Zap, 
  Volume2, 
  VolumeX, 
  Sparkles 
} from "lucide-react";

export function MarketEventAlert() {
  const [dismissed, setDismissed] = useState(false);
  const [muted, setMuted] = useState(true);
  const [expanded, setExpanded] = useState(false);

  if (dismissed) {
    return (
      <div className="flex items-center justify-between px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs font-sans">
        <div className="flex items-center gap-2 text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Market advisory active: 1 unresolved sector anomaly</span>
        </div>
        <button
          onClick={() => setDismissed(false)}
          className="text-gray-400 hover:text-white underline text-xs font-sans"
        >
          Restore broadcast
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-500/40 bg-gradient-to-r from-[#1f1505]/95 via-[#141824]/90 to-[#0b101d]/95 p-3.5 sm:p-4 shadow-[0_0_20px_rgba(245,158,11,0.12)] backdrop-blur-md transition-all">
      {/* Subtle pulsing background glow beam */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none animate-pulse" />
      <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Side: Pulse badge & Alert Headline */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Market Intelligence
              </span>
              <span className="text-[11px] font-mono text-gray-400">
                Alert ID: #EV-2035-084B
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            </div>

            <div className="mt-1 flex items-center gap-2">
              <h4 className="text-sm font-medium text-white font-sans">
                &ldquo;Volatility detected in the Energy Grid.&rdquo;
              </h4>
            </div>
          </div>
        </div>

        {/* Right Controls & Quick Action */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setMuted(!muted)}
            title={muted ? "Unmute Tactical Audio" : "Mute Tactical Audio"}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-sans font-medium px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition-all"
          >
            <span>{expanded ? "Collapse intel" : "Analyze intel"}</span>
            <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>

          <button
            onClick={() => setDismissed(true)}
            title="Acknowledge & Minimize"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Cryptic Intelligence Brief */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-amber-500/20 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="md:col-span-2 text-gray-300 font-sans leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
            <span className="text-amber-400 font-semibold block mb-1 text-xs font-sans">
              Telemetry desynchronization in Sector 4
            </span>
            Mohammed bin Rashid Solar Park feeder array telemetry reports fluctuating output variances exceeding 3.8 standard deviations. Real-time spot price spreads on <strong className="text-white font-mono">DUNE-NRG</strong> and <strong className="text-white font-mono">DESERT HYDROGEN</strong> have decoupled across Jebel Ali energy clearinghouses.
            <div className="mt-2 text-gray-400 text-[11px] font-sans italic">
              Hint: Arbitrageurs should inspect cross-venue synthetic parity before placing passive limit queues.
            </div>
          </div>

          <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex flex-col justify-between font-sans">
            <div>
              <span className="text-gray-400 text-xs block font-medium">Affected instruments</span>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  DUNE-NRG
                </span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  DES-H2
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-sans">Dispatch anomaly</span>
              <span className="text-amber-400 font-mono font-semibold tabular-nums">+4.20 Blitz spread</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
