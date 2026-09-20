import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface TechnicalLabelProps {
  children: React.ReactNode;
  variant?: "gold" | "cyan" | "silver" | "amber" | "green" | "red";
  prefix?: string;
  className?: string;
}

export const TechnicalLabel: React.FC<TechnicalLabelProps> = ({
  children,
  variant = "silver",
  prefix,
  className,
}) => {
  const colorMap = {
    gold: "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/5",
    cyan: "text-[#00F0FF] border-[#00F0FF]/30 bg-[#00F0FF]/5",
    silver: "text-[#94A3B8] border-white/10 bg-white/5",
    amber: "text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/5",
    green: "text-[#05CD99] border-[#05CD99]/30 bg-[#05CD99]/5",
    red: "text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/5",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded border select-none",
          colorMap[variant],
          className
        )
      )}
    >
      {prefix && <span className="opacity-50">[{prefix}]</span>}
      <span>{children}</span>
    </span>
  );
};
