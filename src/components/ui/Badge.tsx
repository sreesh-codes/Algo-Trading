import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "cyan" | "silver" | "amber" | "green" | "red" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "outline",
  size = "md",
  className,
}) => {
  const variantStyles = {
    gold: "bg-[#D4AF37]/15 text-[#F3DE8A] border-[#D4AF37]/40",
    cyan: "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40",
    silver: "bg-white/10 text-[#F1F5F9] border-white/20",
    amber: "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/40",
    green: "bg-[#05CD99]/15 text-[#05CD99] border-[#05CD99]/40",
    red: "bg-[#EF4444]/15 text-[#FCA5A5] border-[#EF4444]/40",
    outline: "bg-transparent text-[#94A3B8] border-white/10 hover:border-white/20",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 tracking-wider",
    md: "text-xs px-2.5 py-1 tracking-widest",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center font-mono-tech uppercase font-medium rounded border transition-colors",
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
    >
      {children}
    </span>
  );
};
