import React from "react";
import { TechnicalLabel } from "./TechnicalLabel";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  tag?: string;
  tagVariant?: "gold" | "cyan" | "silver" | "amber" | "green" | "red";
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  tag,
  tagVariant = "gold",
  action,
  className,
}) => {
  return (
    <div className={twMerge(clsx("flex items-end justify-between border-b border-white/8 pb-3 mb-4", className))}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {tag && <TechnicalLabel variant={tagVariant}>{tag}</TechnicalLabel>}
          <h2 className="text-lg md:text-xl font-semibold tracking-tight text-white flex items-center gap-2 font-sans">
            <span className="w-1.5 h-3.5 bg-[#D4AF37] rounded-xs inline-block" />
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-sm text-[#94A3B8] font-sans tracking-normal">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
};
