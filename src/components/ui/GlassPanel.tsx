import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "gold" | "cyan" | "solid";
  hudCorners?: boolean;
  scanlines?: boolean;
  interactive?: boolean;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  variant = "default",
  hudCorners = false,
  scanlines = false,
  interactive = false,
  className,
  ...props
}) => {
  const variantStyles = {
    default: "bg-[#0B0F19]/75 backdrop-blur-md border border-white/8 shadow-2xl",
    gold: "bg-[#0F1420]/85 backdrop-blur-md border border-[#D4AF37]/30 shadow-[0_0_24px_rgba(212,175,55,0.08)]",
    cyan: "bg-[#0A1220]/85 backdrop-blur-md border border-[#00F0FF]/30 shadow-[0_0_24px_rgba(0,240,255,0.08)]",
    solid: "bg-[#0D1322] border border-white/10 shadow-lg",
  };

  return (
    <div
      className={twMerge(
        clsx(
          "rounded-lg relative overflow-hidden transition-all duration-300",
          variantStyles[variant],
          hudCorners && "hud-corners",
          interactive && "card-interactive cursor-pointer",
          className
        )
      )}
      {...props}
    >
      {scanlines && (
        <div className="absolute inset-0 pointer-events-none opacity-20 scanlines z-0" />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
