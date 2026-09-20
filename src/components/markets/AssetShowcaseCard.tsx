"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { AssetContract } from "@/data/mock/assets";

interface AssetShowcaseCardProps {
  asset: AssetContract;
  index: number;
}

export function AssetShowcaseCard({ asset, index }: AssetShowcaseCardProps) {
  const sectorAccent = {
    Energy: "text-amber-400",
    Compute: "text-cyan-400",
    Logistics: "text-blue-400",
    Indices: "text-[#D4AF37]",
    Commodities: "text-emerald-400",
    "Real Estate": "text-purple-400",
    Environmental: "text-teal-400",
  }[asset.category] || "text-slate-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl border transition-all duration-300 bg-[#080D1A]/95 hover:bg-[#0B1224] p-6 sm:p-7 backdrop-blur-md shadow-2xl overflow-hidden border-white/[0.08] hover:border-[#D4AF37]/40 hover:shadow-[0_12px_45px_rgba(0,0,0,0.7),0_0_25px_rgba(212,175,55,0.1)]"
    >
      {/* Top subtle highlight line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent pointer-events-none group-hover:via-[#D4AF37]/40 transition-all" />

      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-6 sm:gap-8">
        {/* ========================================================================= */}
        {/* 1. ASSET 3D VISUAL PICTURE                                                */}
        {/* ========================================================================= */}
        <div className="relative w-56 sm:w-64 md:w-72 h-56 sm:h-64 md:h-72 shrink-0 rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl group-hover:border-white/30 transition-all">
          <img
            src={asset.image}
            alt={asset.name}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Ticker badge on image */}
          <div className="absolute top-3 left-3 z-10">
            <span className="font-mono text-xs font-bold tracking-wider px-2.5 py-1 rounded-lg bg-black/85 border border-white/20 text-[#D4AF37] backdrop-blur-md shadow-lg">
              {asset.ticker}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ASSET DETAILS & DOWNLOAD DATA LINK                                     */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col justify-between w-full py-2">
          {/* Top Row: Name and Sector */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans leading-none">
                {asset.name}
              </span>
              <span className={`text-base font-semibold font-sans tracking-wide uppercase ${sectorAccent}`}>
                {asset.sector}
              </span>
            </div>

            {/* Asset Description - Increased font size further to fit placeholder */}
            <p className="text-lg sm:text-xl text-slate-300 font-sans leading-relaxed max-w-4xl py-2">
              {asset.description}
            </p>
          </div>

          {/* Bottom Bar: Action, Volume & Download Link */}
          <div className="pt-6 mt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-slate-300 font-sans font-medium text-sm tracking-wide">
              <span className="inline-flex items-center gap-2">
                Download Raw Data: 
                <button className="text-[#D4AF37] hover:text-white transition-colors inline-flex items-center gap-1.5 font-bold group/dl ml-1">
                  <Download className="w-4 h-4 group-hover/dl:-translate-y-0.5 transition-transform" />
                  CSV Data
                </button>
              </span>
              <span className="text-slate-500">•</span>
              <span>
                Unit: <strong className="text-white ml-1 font-semibold">{asset.contractSize}</strong>
              </span>
              <span className="text-slate-500">•</span>
              <span>
                Margin: <strong className="text-white ml-1 font-semibold">{asset.marginRequirement}%</strong>
              </span>
            </div>

            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs transition-all duration-200 border border-white/15 hover:border-[#D4AF37] group/btn shadow-md whitespace-nowrap"
            >
              <span>Explore in Research</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
