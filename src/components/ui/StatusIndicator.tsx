import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface StatusIndicatorProps {
  status: "ONLINE" | "SIMULATING" | "HALTED" | "CIRCUIT_BREAKER" | "LOCKED" | "COMPLETED";
  label?: string;
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  pulse = true,
  className,
}) => {
  const statusStyles = {
    ONLINE: {
      dot: "bg-[#05CD99] shadow-[0_0_8px_#05CD99]",
      text: "text-[#05CD99]",
      defaultLabel: "SYSTEM ONLINE",
    },
    SIMULATING: {
      dot: "bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]",
      text: "text-[#00F0FF]",
      defaultLabel: "SIMULATING",
    },
    HALTED: {
      dot: "bg-[#EF4444] shadow-[0_0_8px_#EF4444]",
      text: "text-[#EF4444]",
      defaultLabel: "MARKET HALTED",
    },
    CIRCUIT_BREAKER: {
      dot: "bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]",
      text: "text-[#F59E0B]",
      defaultLabel: "CIRCUIT BREAKER ACTIVE",
    },
    LOCKED: {
      dot: "bg-[#64748B] shadow-none",
      text: "text-[#94A3B8]",
      defaultLabel: "LOCKED",
    },
    COMPLETED: {
      dot: "bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]",
      text: "text-[#D4AF37]",
      defaultLabel: "COMPLETED",
    },
  };

  const current = statusStyles[status];

  return (
    <div className={twMerge(clsx("inline-flex items-center gap-2 font-mono-tech text-xs tracking-wider", current.text, className))}>
      <span className="relative flex h-2 w-2">
        {pulse && status !== "LOCKED" && (
          <span
            className={clsx(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              current.dot
            )}
          />
        )}
        <span className={clsx("relative inline-flex rounded-full h-2 w-2", current.dot)} />
      </span>
      <span className="font-semibold">{label || current.defaultLabel}</span>
    </div>
  );
};
