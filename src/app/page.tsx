"use client";

import React from "react";
import { CinematicSequenceHero } from "@/components/landing/CinematicSequenceHero";
import { LandingBelowContent } from "@/components/landing/LandingBelowContent";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen text-[#F8FAFC] selection:bg-[#D4AF37]/30 selection:text-[#FFF] overflow-x-hidden">
      {/* Full-Screen Scroll-Scrubbed 30-fps Dubai 2035 Cinematic Sequence */}
      <CinematicSequenceHero />

      {/* Floating Translucent Institutional Content & Institutional Footer */}
      <LandingBelowContent />
    </div>
  );
}
