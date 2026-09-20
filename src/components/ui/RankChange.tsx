import React from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface RankChangeProps {
  delta: number;
  className?: string;
}

export const RankChange: React.FC<RankChangeProps> = ({ delta, className }) => {
  if (delta === 0) {
    return (
      <span className={twMerge(clsx("inline-flex items-center text-xs font-mono-tech text-[#64748B]", className))}>
        <Minus size={13} className="mr-0.5" /> 0
      </span>
    );
  }

  const isUp = delta > 0;

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center text-xs font-mono-tech font-semibold",
          isUp ? "text-[#05CD99]" : "text-[#EF4444]",
          className
        )
      )}
    >
      {isUp ? <ArrowUp size={13} className="mr-0.5" /> : <ArrowDown size={13} className="mr-0.5" />}
      {Math.abs(delta)}
    </span>
  );
};
