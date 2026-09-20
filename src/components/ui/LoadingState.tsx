import React from "react";
import { Cpu } from "lucide-react";
import { clsx } from "clsx";

interface LoadingStateProps {
  label?: string;
  sublabel?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = "Decrypting Orbital Telemetry Stream...",
  sublabel = "Establishing low-latency tunnel to DMX-35 Cryogenic Engine",
  className,
}) => {
  return (
    <div
      className={clsx(
        "w-full py-16 px-4 flex flex-col items-center justify-center text-center",
        className
      )}
    >
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-full border border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-[#00F0FF]">
          <Cpu size={22} className="animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-semibold text-white font-mono-tech tracking-wider uppercase mb-1">
        {label}
      </p>
      <p className="text-xs text-[#94A3B8] font-mono-tech tracking-wide">
        {sublabel}
      </p>
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={clsx(
        "animate-pulse rounded bg-white/[0.06] border border-white/5",
        className
      )}
    />
  );
};
