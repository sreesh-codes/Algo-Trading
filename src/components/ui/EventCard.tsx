import React from "react";
import { MarketEvent } from "@/data/mock/events";
import { GlassPanel } from "./GlassPanel";
import { TechnicalLabel } from "./TechnicalLabel";
import { AlertTriangle, CloudSun, Zap, Cpu, Ship, Shield } from "lucide-react";
import { clsx } from "clsx";

interface EventCardProps {
  event: MarketEvent;
  onInspect?: (event: MarketEvent) => void;
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onInspect,
  className,
}) => {
  const getCategoryIcon = (category: MarketEvent["category"]) => {
    switch (category) {
      case "WEATHER":
        return <CloudSun size={15} className="text-[#00F0FF]" />;
      case "ENERGY":
        return <Zap size={15} className="text-[#D4AF37]" />;
      case "QUANTUM":
        return <Cpu size={15} className="text-[#A855F7]" />;
      case "LOGISTICS":
        return <Ship size={15} className="text-[#38BDF8]" />;
      case "REGULATORY":
        return <Shield size={15} className="text-[#F59E0B]" />;
      default:
        return <AlertTriangle size={15} className="text-[#94A3B8]" />;
    }
  };

  const sentimentStyle = {
    BULLISH: "text-[#05CD99] border-[#05CD99]/30 bg-[#05CD99]/10",
    BEARISH: "text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/10",
    VOLATILE: "text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10",
  }[event.sentiment];

  return (
    <GlassPanel
      hudCorners
      className={clsx(
        "p-4 hover:border-white/20 transition-all duration-200 cursor-pointer flex flex-col justify-between group",
        event.urgency === "CRITICAL" && "border-[#EF4444]/40 bg-[#120D15]/80",
        className
      )}
      onClick={() => onInspect?.(event)}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {getCategoryIcon(event.category)}
            <span className="font-mono-tech text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
              {event.category} • {event.timestamp}
            </span>
          </div>

          <span
            className={clsx(
              "font-mono-tech text-[10px] px-2 py-0.5 rounded border uppercase font-semibold",
              sentimentStyle
            )}
          >
            {event.sentiment}
          </span>
        </div>

        <h4 className="text-sm font-semibold text-white tracking-wide mb-2 group-hover:text-[#D4AF37] transition-colors leading-snug">
          {event.headline}
        </h4>

        <p className="text-xs text-[#94A3B8] font-sans leading-relaxed mb-3 line-clamp-2">
          {event.summary}
        </p>
      </div>

      <div className="pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech">
        <div className="flex items-center gap-1.5">
          {event.affectedTickers.map((t) => (
            <TechnicalLabel key={t} variant="gold">
              {t}
            </TechnicalLabel>
          ))}
        </div>
        <span className="text-[10px] text-[#64748B] truncate max-w-[200px]">
          SRC: {event.verifiedSource}
        </span>
      </div>
    </GlassPanel>
  );
};
