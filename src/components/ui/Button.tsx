import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "cyan" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#05070B] font-semibold hover:brightness-110 shadow-[0_0_16px_rgba(212,175,55,0.25)] active:scale-[0.98]",
    cyan:
      "bg-gradient-to-r from-[#00F0FF] to-[#0284C7] text-[#05070B] font-semibold hover:brightness-110 shadow-[0_0_16px_rgba(0,240,255,0.25)] active:scale-[0.98]",
    success:
      "bg-gradient-to-r from-[#05CD99] to-[#047857] text-white font-semibold hover:brightness-110 shadow-[0_0_16px_rgba(5,205,153,0.25)] active:scale-[0.98]",
    secondary:
      "bg-[#141C2E] text-white border border-white/12 hover:border-[#D4AF37]/50 hover:bg-[#1A253D] active:scale-[0.98]",
    ghost:
      "bg-transparent text-[#CBD5E1] hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10",
    danger:
      "bg-gradient-to-r from-[#EF4444] to-[#B91C1C] text-white font-semibold hover:brightness-110 shadow-[0_0_16px_rgba(239,68,68,0.25)]",
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5 font-medium tracking-normal font-sans",
    md: "text-sm px-4 py-2 gap-2 font-medium tracking-normal font-sans",
    lg: "text-base px-6 py-2.5 gap-2.5 font-medium tracking-normal font-sans",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center rounded transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none relative overflow-hidden btn-tactile active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070B]",
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
