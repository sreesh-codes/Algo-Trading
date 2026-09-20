"use client";

import React, { useEffect, useState } from "react";
import { MercantileApi } from "@/services/api";
import { AssetContract } from "@/data/mock/assets";
import { MarketHeader } from "@/components/markets/MarketHeader";
import { AssetShowcaseCard } from "@/components/markets/AssetShowcaseCard";

export default function MarketsPage() {
  const [assets, setAssets] = useState<AssetContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await MercantileApi.getAssets();
      setAssets(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#050811] text-[#F8FAFC] pb-24 relative overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. CLEAN ATMOSPHERIC BACKGROUND (NO DOTS / NO DOTTED LINES)               */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#070C18] via-[#05070B] to-[#030508] z-0" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(212,175,55,0.06),transparent_75%)] z-0" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* ========================================================================= */}
        {/* 2. HEADER WITH TITLE "ASSETS"                                             */}
        {/* ========================================================================= */}
        <MarketHeader />

        {/* ========================================================================= */}
        {/* 3. STACKED ASSETS LAYOUT (ALL 5 ASSETS ON TOP OF EACH OTHER)              */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {assets.slice(0, 5).map((asset, index) => (
            <AssetShowcaseCard key={asset.ticker} asset={asset} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
