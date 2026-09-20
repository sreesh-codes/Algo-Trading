import React from "react";
import { Radar } from "lucide-react";
import { clsx } from "clsx";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Telemetry Data Detected",
  description = "No active algorithmic records match the selected filter criteria.",
  action,
  icon,
  className,
}) => {
  return (
    <div
      className={clsx(
        "w-full py-16 px-4 flex flex-col items-center justify-center text-center rounded border border-white/5 bg-[#090D17]/50",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full border border-white/10 bg-[#0E1524] flex items-center justify-center text-[#D4AF37] mb-3 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
        {icon || <Radar size={24} className="animate-spin-slow opacity-80" />}
      </div>
      <h4 className="text-base font-semibold text-white tracking-wide mb-1 font-mono-tech uppercase">
        {title}
      </h4>
      <p className="text-xs text-[#94A3B8] font-sans max-w-md mb-4 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
