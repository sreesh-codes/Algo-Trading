"use client";

import React, { useEffect, useState, useRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  flashOnChange?: boolean;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 2,
  prefix = "",
  suffix = "",
  durationMs = 600,
  flashOnChange = false,
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [flashClass, setFlashClass] = useState<string>("");
  const prevValueRef = useRef<number>(value);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      prevValueRef.current = value;
      return;
    }

    const startValue = prevValueRef.current;
    const diff = value - startValue;

    if (Math.abs(diff) < 0.0001) {
      return;
    }

    prevValueRef.current = value;

    // Trigger flash if requested
    let flashTimer: NodeJS.Timeout | null = null;
    if (flashOnChange) {
      const isGain = diff > 0;
      setFlashClass(isGain ? "num-flash-gain" : "num-flash-loss");
      flashTimer = setTimeout(() => {
        setFlashClass("");
      }, 700);
    }

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + diff * easeOut;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(animId);
      if (flashTimer) clearTimeout(flashTimer);
    };
  }, [value, durationMs, flashOnChange]);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const numberToRender = prefersReducedMotion ? value : displayValue;

  const formatted = numberToRender.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span
      className={twMerge(
        clsx("font-mono-tech tabular-nums transition-colors duration-200", flashClass, className)
      )}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
