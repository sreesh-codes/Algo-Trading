"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Activity } from "lucide-react";

export const LandingFooter: React.FC = () => {
  const navLinks = [
    { label: "Mercantile", href: "#city" },
    { label: "Markets", href: "/markets" },
    { label: "Research", href: "/research" },
    { label: "Backtest", href: "/backtest" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Rules", href: "/competition" },
    { label: "Academy", href: "/learn" },
  ];

  return (
    <footer className="w-full border-t border-white/10 bg-[#04060A] text-[#94A3B8] font-sans select-none">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Top bar: Brand & Fictional Authority */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#D4AF37] inline-block shadow-[0_0_8px_#D4AF37]" />
              <span className="font-sans text-base tracking-tight">Dubai 2035 — The Mercantile</span>
            </div>
            <div className="text-xs text-[#64748B] font-sans">
              Autonomous Sovereign Order Matching & Quantitative Clearing House
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#64748B]">
            <span className="flex items-center gap-1.5 text-[#05CD99]">
              <ShieldCheck size={13} /> DIFC CRYOGENIC CORE
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-[#D4AF37]">
              <Activity size={13} /> 0.38ms LATENCY
            </span>
          </div>
        </div>

        {/* Core Navigation Links as required */}
        <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-6 text-sm">
          <div className="flex flex-wrap items-center gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[#94A3B8] hover:text-[#D4AF37] font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="text-[11px] text-[#64748B]">
            GST 23:35 • UTC+4 • DXB SOVEREIGN CONSENSUS
          </div>
        </div>

        {/* Bottom fine print */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-[#64748B] pt-4 border-t border-white/5">
          <div>
            © 2035 THE MERCANTILE • DUBAI INTERNATIONAL FINANCIAL CENTRE • ALL TRADING IS SYNTHETIC
          </div>
          <div>
            SECURED BY QUANTUM COHERENT PROTOCOL 256
          </div>
        </div>
      </div>
    </footer>
  );
};
