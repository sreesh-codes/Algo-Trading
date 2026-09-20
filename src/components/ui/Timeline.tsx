import React from "react";
import { RoundInfo } from "@/data/mock/competition";
import { CheckCircle2, CircleDot, Lock, Clock } from "lucide-react";
import { clsx } from "clsx";
import { TechnicalLabel } from "./TechnicalLabel";

interface TimelineProps {
  rounds: RoundInfo[];
  activeRoundNumber: number;
  onRoundSelect?: (roundNumber: number) => void;
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  rounds,
  activeRoundNumber,
  onRoundSelect,
  className,
}) => {
  return (
    <div className={clsx("w-full py-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {rounds.map((round) => {
          const isCompleted = round.status === "COMPLETED";
          const isActive =
            activeRoundNumber !== undefined
              ? round.roundNumber === activeRoundNumber
              : round.status === "ACTIVE";
          const isUpcoming = round.status === "UPCOMING";
          const isLocked = round.status === "LOCKED";

          const borderColors = isActive
            ? "border-[#D4AF37] bg-[#0E1524] shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/50"
            : isCompleted
            ? "border-[#05CD99]/30 bg-[#090E18]"
            : "border-white/8 bg-[#070A12] opacity-75";

          return (
            <div
              key={round.roundNumber}
              onClick={() => onRoundSelect?.(round.roundNumber)}
              className={clsx(
                "p-3.5 rounded border transition-all duration-200 relative overflow-hidden flex flex-col justify-between group",
                borderColors,
                onRoundSelect && "cursor-pointer hover:border-white/20"
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-pulse" />
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 font-mono-tech text-xs font-bold">
                    {isCompleted && <CheckCircle2 size={14} className="text-[#05CD99]" />}
                    {isActive && <CircleDot size={14} className="text-[#D4AF37] animate-pulse" />}
                    {isUpcoming && <Clock size={14} className="text-[#00F0FF]" />}
                    {isLocked && <Lock size={13} className="text-[#64748B]" />}
                    <span className={isActive ? "text-[#D4AF37]" : "text-[#CBD5E1]"}>
                      ROUND {round.roundNumber}
                    </span>
                  </div>

                  <TechnicalLabel
                    variant={
                      isActive ? "gold" : isCompleted ? "green" : isUpcoming ? "cyan" : "silver"
                    }
                  >
                    {round.status}
                  </TechnicalLabel>
                </div>

                <h3 className="text-sm font-semibold text-white tracking-wide mb-1 group-hover:text-[#D4AF37] transition-colors">
                  {round.title}
                </h3>
                <p className="text-[11px] text-[#94A3B8] font-mono-tech line-clamp-2">
                  {round.theme}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-[#64748B]">
                <span>LEVERAGE: {round.maxLeverage}</span>
                <span className="text-[#94A3B8]">{round.eligibleAssets.length} ASSETS</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
