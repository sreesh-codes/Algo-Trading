"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Terminal, Shield } from "lucide-react";

export const PhilosophySection: React.FC = () => {
  return (
    <section className="relative py-28 lg:py-40 overflow-hidden select-none border-y border-white/10 bg-[#030509]">
      {/* Background Ambience: Subtle Dark Coordinate Matrix & Vignette */}
      <div className="absolute inset-0 bg-terminal-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#D4AF37]/10 via-[#00F0FF]/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Coordinate Watermarks */}
      <div className="absolute top-8 left-8 text-[11px] font-mono-tech text-white/20 tracking-widest pointer-events-none">
        {"// PROTOCOL // SOVEREIGN QUANTITATIVE DIRECTIVE"}
      </div>
      <div className="absolute top-8 right-8 text-[11px] font-mono-tech text-white/20 tracking-widest pointer-events-none">
        LAT: 25.1972° N • LON: 55.2744° E
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-12">
        {/* Editorial Sub-tag */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-[1px] bg-[#D4AF37]" />
          <span className="font-mono text-xs tracking-wider text-[#D4AF37] uppercase font-semibold">
            The Mercantile Ethos
          </span>
        </div>

        {/* Editorial Typography (Human Designed, Restrained, High-Impact) */}
        <div className="space-y-2 sm:space-y-4 font-sans max-w-5xl">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] text-white leading-[1.06]">
            &ldquo;The market doesn&rsquo;t tell you how it works.
          </h2>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] text-[#D4AF37] leading-[1.06]">
            You have to figure it out.&rdquo;
          </h2>
        </div>

        {/* Philosophical Narrative Column */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-white/10 items-baseline">
          <div className="md:col-span-4 font-sans text-sm text-[#94A3B8] space-y-2">
            <div className="text-white font-semibold font-sans tracking-normal">
              Axiom 01: Sovereign Truth
            </div>
            <p className="text-[#94A3B8] leading-relaxed">
              No financial textbook prepares you for synthetic liquidity shocks. Every market regime shift is discovered in real-time through telemetry and empirical execution.
            </p>
          </div>

          <div className="md:col-span-5 font-sans text-base sm:text-lg text-[#CBD5E1] leading-relaxed font-normal">
            There are no manuals. No pre-cleared signals. Only deep limit order books, hidden stochastic transitions, and sub-millisecond execution against the world’s most relentless autonomous quants.
          </div>

          <div className="md:col-span-3 flex md:justify-end">
            <Link
              href="/competition"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-sans text-sm font-semibold transition-all duration-200 shadow-[0_0_20px_rgba(212,175,55,0.15)] group"
            >
              <span>Enter the competition</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
