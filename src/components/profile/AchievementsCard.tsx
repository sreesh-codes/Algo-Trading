"use client";

import React from "react";
import { QuantAchievement } from "@/data/mock/profile";
import { ShieldCheck, Award, Zap, Activity, CheckCircle2, Lock } from "lucide-react";

interface AchievementsCardProps {
  achievements: QuantAchievement[];
}

export const AchievementsCard: React.FC<AchievementsCardProps> = ({ achievements }) => {
  return (
    <div className="w-full bg-[#080B14] border border-white/10 rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/8 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Quantitative Accreditations & Badges
          </h3>
        </div>
        <span className="text-xs font-mono text-[#05CD99] flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> 4 / 4 VERIFIED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {achievements.map((ach) => {
          const isGold = ach.tier === "GOLD";
          const isPlatinum = ach.tier === "PLATINUM";
          const isCyan = ach.tier === "CYAN";
          const isEmerald = ach.tier === "EMERALD";

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition-all space-y-2.5 relative overflow-hidden font-mono text-xs ${
                isGold
                  ? "bg-[#0C0F1A] border-[#D4AF37]/35 shadow-[0_0_15px_rgba(212,175,55,0.08)]"
                  : isPlatinum
                  ? "bg-[#0B0F1B] border-slate-300/30"
                  : isCyan
                  ? "bg-[#09101C] border-[#00F0FF]/30"
                  : "bg-[#081215] border-[#05CD99]/30"
              }`}
            >
              {/* Badge Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  {ach.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${
                    isGold
                      ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]"
                      : isPlatinum
                      ? "bg-slate-200/10 border-slate-300/30 text-slate-200"
                      : isCyan
                      ? "bg-[#00F0FF]/15 border-[#00F0FF]/40 text-[#00F0FF]"
                      : "bg-[#05CD99]/15 border-[#05CD99]/40 text-[#05CD99]"
                  }`}
                >
                  VERIFIED
                </span>
              </div>

              {/* Title */}
              <h4 className="text-sm font-black text-white uppercase tracking-wide font-sans">
                {ach.title}
              </h4>

              {/* Narrative description */}
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {ach.description}
              </p>

              {/* Criteria & Audit Hash */}
              <div className="pt-2 border-t border-white/6 space-y-1 text-[10px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Criteria:</span>
                  <span className="text-slate-300">{ach.criteria}</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span>Audit Digest:</span>
                  <span className="text-slate-400">{ach.verificationHash}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
