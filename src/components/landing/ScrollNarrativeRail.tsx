"use client";

import React, { useEffect, useState } from "react";

interface NarrativeChapter {
  id: string;
  num: string;
  label: string;
  sublabel: string;
}

const CHAPTERS: NarrativeChapter[] = [
  { id: "city", num: "01", label: "City", sublabel: "Sovereign Horizon" },
  { id: "markets", num: "02", label: "Markets", sublabel: "Liquid Synthetic Assets" },
  { id: "data", num: "03", label: "Data", sublabel: "Cryogenic Order Flow" },
  { id: "strategies", num: "04", label: "Strategies", sublabel: "Autonomous Quant Labs" },
  { id: "competition", num: "05", label: "Competition", sublabel: "The Market Awakens" },
];

export const ScrollNarrativeRail: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("city");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      CHAPTERS.forEach((ch) => {
        const el = document.getElementById(ch.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.45 && rect.bottom >= windowHeight * 0.2) {
            setActiveSection(ch.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Narrative Progress"
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-5 select-none font-mono-tech"
    >
      <div className="text-[10px] text-[#64748B] tracking-widest uppercase mb-1">
        SIMULATION VECTOR
      </div>

      <div className="relative flex flex-col gap-5">
        {/* Connecting Vertical Track Line */}
        <div className="absolute right-[5px] top-2 bottom-2 w-[1px] bg-white/10" />

        {CHAPTERS.map((ch) => {
          const isActive = activeSection === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => scrollTo(ch.id)}
              className="group flex items-center gap-3 text-right focus:outline-none cursor-pointer"
            >
              {/* Text label revealed on hover or active */}
              <div
                className={`transition-all duration-300 ${
                  isActive
                    ? "opacity-100 translate-x-0"
                    : "opacity-40 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0"
                }`}
              >
                <div
                  className={`text-xs font-bold tracking-wider ${
                    isActive ? "text-[#D4AF37]" : "text-[#94A3B8] group-hover:text-white"
                  }`}
                >
                  <span className="text-[10px] text-[#64748B] mr-1.5">{ch.num}</span>
                  {ch.label}
                </div>
                <div className="text-[9px] text-[#64748B] group-hover:text-[#94A3B8]">
                  {ch.sublabel}
                </div>
              </div>

              {/* Node Pip */}
              <div
                className={`relative z-10 w-3 h-3 rounded-full border transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? "border-[#D4AF37] bg-[#D4AF37] shadow-[0_0_12px_#D4AF37]"
                    : "border-white/30 bg-[#070A12] group-hover:border-[#00F0FF] group-hover:scale-110"
                }`}
              >
                {isActive && <span className="w-1 h-1 rounded-full bg-black" />}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
