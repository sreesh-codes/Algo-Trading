"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clock,
  Shield,
  Activity,
  Flame,
  Award,
  BarChart3,
  BookOpen,
  PlaySquare,
  Send,
  Trophy,
  Radio,
  Sliders,
} from "lucide-react";

export const DashboardHeader: React.FC = () => {
  const pathname = usePathname();

  // Live countdown timer for 03:17:42
  const [secondsRemaining, setSecondsRemaining] = useState(3 * 3600 + 17 * 60 + 42);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const navLinks = [
    { label: "Mercantile", href: "/" },
    { label: "Markets", href: "/markets" },
    { label: "Research", href: "/research" },
    { label: "Submit", href: "/submit" },
    { label: "Leaderboard", href: "/leaderboard" },
  ];

  return (
    <div className="w-full space-y-3 select-none">
      {/* Top Participant Navigation Bar */}
      <div className="w-full rounded-lg bg-[#070B16] border border-white/10 px-4 py-2 flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Links */}
        <nav aria-label="Participant Dashboard Navigation" className="flex flex-wrap items-center gap-1 sm:gap-2">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-3 py-1 rounded text-xs font-medium font-sans transition-all duration-200 cursor-pointer ${
                pathname === item.href
                  ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                  : "text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Live Matching Engine Latency */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#64748B]">
          <span className="flex items-center gap-1.5 text-[#05CD99]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#05CD99] animate-pulse" />
            DMX-35 Live
          </span>
          <span>•</span>
          <span className="text-[#CBD5E1] tabular-nums">1.18ms</span>
          <span>•</span>
          <span className="text-[#D4AF37] tabular-nums">GST 23:35</span>
        </div>
      </div>

      {/* Top Status Header Banner */}
      <div className="w-full rounded-xl bg-gradient-to-r from-[#0C1222] via-[#090E1A] to-[#0D1528] border border-[#D4AF37]/30 p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Tactical Corner Marks */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#D4AF37]" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4AF37]" />

        {/* Left: Current Tournament Round Identification */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)] shrink-0">
            <Flame size={24} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono font-medium border border-[#D4AF37]/30">
                ROUND 02
              </span>
              <span className="text-xs text-[#05CD99] font-medium font-sans flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#05CD99] animate-ping" />
                Active trading session
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white font-sans">
              The Arbitrage
            </h1>
            <p className="text-xs text-[#94A3B8] font-sans mt-0.5">
              Cross-market synthetic spread discovery & cryogenic liquidity arbitrage.
            </p>
          </div>
        </div>

        {/* Right: Time Remaining Countdown & Participant Badge */}
        <div className="flex flex-wrap items-center gap-4 md:text-right">
          {/* Participant Credentials */}
          <div className="hidden sm:block border-r border-white/10 pr-4">
            <div className="text-[10px] text-[#64748B] font-mono">PARTICIPANT ID</div>
            <div className="text-sm font-semibold text-white font-sans">
              Falcon Arbitrage
            </div>
            <div className="text-[11px] text-[#00F0FF] font-sans">DIFC Co-Location Hub</div>
          </div>

          {/* Time Remaining Counter Box */}
          <div className="px-4 py-2 rounded-lg bg-black/60 border border-white/10 flex flex-col items-center md:items-end justify-center min-w-[140px]">
            <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] font-sans font-medium uppercase tracking-wider mb-0.5">
              <Clock size={11} className="text-[#D4AF37]" /> Time Remaining
            </div>
            <div className="text-2xl font-semibold text-[#05CD99] font-mono tabular-nums">
              {formatCountdown(secondsRemaining)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
