"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  PlaySquare,
  Trophy,
  Radio,
  BookOpen,
} from "lucide-react";

export const LandingBelowContent: React.FC = () => {
  return (
    <div className="relative z-20 w-full text-slate-100 bg-gradient-to-b from-transparent via-[#05070B]/70 to-[#030508]/85 backdrop-blur-[2px]">
      {/* ========================================================================= */}
      {/* 1. SECTOR OVERVIEW & PILLARS (FLOATING TRANSLUCENT CARDS)                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="space-y-5 max-w-3xl mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            The Financial Architecture of Dubai 2035
          </h2>
          <p className="text-slate-200 font-sans text-lg sm:text-xl lg:text-2xl font-light leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            High-frequency continuous double auctions powered by autonomous execution models.
            Trade synthetic commodities, test algorithmic strategies, and compete for sovereign capital.
          </p>
        </div>

        {/* 3 Key Pillar Cards with Translucent Institutional Styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Markets */}
          <Link
            href="/markets"
            className="group p-6 rounded-xl border border-white/15 bg-[#070B14]/80 hover:bg-[#0A101E]/95 hover:border-[#D4AF37]/50 backdrop-blur-md shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-md bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(212,175,55,0.2)]">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-xl font-semibold font-sans text-white group-hover:text-[#D4AF37] transition-colors">
                Synthetic Markets
              </h3>
              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                Level 2 depth order books for Dune Energy, Nexus AI, Orbit Logistics, and DIFC-100 index.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
              <span>Explore instruments</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Backtest Lab */}
          <Link
            href="/backtest"
            className="group p-6 rounded-xl border border-white/15 bg-[#070B14]/80 hover:bg-[#0A101E]/95 hover:border-[#00F0FF]/50 backdrop-blur-md shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-md bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                <PlaySquare size={20} />
              </div>
              <h3 className="text-xl font-semibold font-sans text-white group-hover:text-[#00F0FF] transition-colors">
                Backtest Lab
              </h3>
              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                Replay tick data against Python algorithmic strategies with realistic fees and leverage.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-mono text-[#00F0FF]">
              <span>Simulate models</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Live Competition */}
          <Link
            href="/competition"
            className="group p-6 rounded-xl border border-white/15 bg-[#070B14]/80 hover:bg-[#0A101E]/95 hover:border-[#05CD99]/50 backdrop-blur-md shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-md bg-[#05CD99]/15 border border-[#05CD99]/30 flex items-center justify-center text-[#05CD99] group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(5,205,153,0.2)]">
                <Trophy size={20} />
              </div>
              <h3 className="text-xl font-semibold font-sans text-white group-hover:text-[#05CD99] transition-colors">
                Trading League
              </h3>
              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                500,000 Blitz prize pool across 5 competitive rounds. Multi-asset arbitrage and momentum.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-mono text-[#05CD99]">
              <span>View round matrix</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>


        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CALL TO ACTION BANNER                                                  */}
      {/* ========================================================================= */}
      <section className="border-y border-white/15 bg-[#070C16]/75 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold font-sans text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Ready to deploy your trading algorithm?
            </h3>
            <p className="text-slate-300 text-sm max-w-xl font-sans drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Enter the competition arena, inspect the order books, and benchmark your strategy on real-time synthetic data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/competition"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded bg-[#D4AF37] hover:bg-[#E5C158] text-black font-semibold text-xs tracking-wider uppercase transition-colors shadow-[0_0_24px_rgba(212,175,55,0.4)] cursor-pointer"
            >
              <span>ENTER THE MERCANTILE</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded border border-white/20 bg-black/60 hover:bg-black/80 text-white font-medium text-xs tracking-wide transition-colors backdrop-blur-sm cursor-pointer shadow-lg"
            >
              <BookOpen size={14} />
              <span>Academy Curriculum</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. COMPREHENSIVE INSTITUTIONAL FOOTER                                     */}
      {/* ========================================================================= */}
      <div className="w-full border-t border-white/10 bg-[#030508]/85 backdrop-blur-md">
        <footer className="max-w-7xl mx-auto px-6 py-16 space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Col 1: Brand Info */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                <span className="font-bold text-base tracking-wider text-white uppercase">
                  THE MERCANTILE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-sm">
                An institutional algorithmic trading competition set in the sovereign financial architecture of Dubai, 2035.
              </p>
              <div className="pt-2 flex items-center gap-2 font-mono text-[11px] text-[#D4AF37]">
                <span>DIFC FINANCIAL CENTRE // UAE</span>
              </div>
            </div>

            {/* Col 2: Platform */}
            <div className="space-y-3 text-xs">
              <div className="font-mono text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                Platform
              </div>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/markets" className="hover:text-[#D4AF37] transition-colors">
                    Markets & Books
                  </Link>
                </li>
                <li>
                  <Link href="/research" className="hover:text-[#D4AF37] transition-colors">
                    Research Lab
                  </Link>
                </li>
                <li>
                  <Link href="/backtest" className="hover:text-[#D4AF37] transition-colors">
                    Backtesting Lab
                  </Link>
                </li>
                <li>
                  <Link href="/submit" className="hover:text-[#D4AF37] transition-colors">
                    Submit Algorithm
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-[#D4AF37] transition-colors">
                    Live Rankings
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Intelligence & Learn */}
            <div className="space-y-3 text-xs">
              <div className="font-mono text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                Knowledge
              </div>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/research" className="hover:text-[#D4AF37] transition-colors">
                    Quantitative Papers
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="hover:text-[#D4AF37] transition-colors">
                    Academy Curriculum
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="hover:text-[#D4AF37] transition-colors">
                    Order Book Tutorial
                  </Link>
                </li>
                <li>
                  <Link href="/competition" className="hover:text-[#D4AF37] transition-colors">
                    Phase Schedule
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Governance */}
            <div className="space-y-3 text-xs">
              <div className="font-mono text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                Governance
              </div>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/competition" className="hover:text-[#D4AF37] transition-colors">
                    Rules of Engagement
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-[#D4AF37] transition-colors">
                    Team Profile
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-[#D4AF37] transition-colors">
                    Control Center
                  </Link>
                </li>
                <li>
                  <span className="text-slate-600">Synthetic Sandbox</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Fine Print */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
            <div>
              © 2035 THE MERCANTILE • DUBAI INTERNATIONAL FINANCIAL CENTRE • ALL TRADING IS SYNTHETIC
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#05CD99]">LIVE EXCHANGE</span>
              <span>•</span>
              <span>AUTONOMOUS SOVEREIGN PROTOCOL</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
