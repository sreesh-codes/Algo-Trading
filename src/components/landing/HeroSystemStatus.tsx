"use client";

import React, { useState, useEffect } from "react";
import { Activity, ShieldCheck, Cpu, Zap, Wifi } from "lucide-react";

interface StatusNode {
  id: string;
  name: string;
  state: "ONLINE" | "CONNECTED" | "STABLE";
  color: string;
  metric: string;
  detail: string;
  icon: React.ElementType;
}

export const HeroSystemStatus: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [timestamp, setTimestamp] = useState<string>("00:00:00 GST");
  const [randomSeed, setRandomSeed] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const dxb = new Date(utc + 4 * 3600000);
      const h = String(dxb.getHours()).padStart(2, "0");
      const m = String(dxb.getMinutes()).padStart(2, "0");
      const s = String(dxb.getSeconds()).padStart(2, "0");
      setTimestamp(`${h}:${m}:${s} GST`);
      setRandomSeed(Math.floor(Math.random() * 900) + 100);
    };
    updateTime();
    const interval = setInterval(updateTime, 2000);
    return () => clearInterval(interval);
  }, []);

  const nodes: StatusNode[] = [
    {
      id: "net",
      name: "Market network",
      state: "ONLINE",
      color: "#05CD99",
      metric: "DMX-35 Core",
      detail: "0.38ms match",
      icon: Activity,
    },
    {
      id: "difc",
      name: "DIFC Gateway",
      state: "CONNECTED",
      color: "#00F0FF",
      metric: "0.84ms",
      detail: "Cryogenic link",
      icon: ShieldCheck,
    },
    {
      id: "jebel",
      name: "Jebel Ali Transit",
      state: "CONNECTED",
      color: "#00F0FF",
      metric: "1.12ms",
      detail: "Hyperloop corridor",
      icon: Wifi,
    },
    {
      id: "grid",
      name: "Energy Grid",
      state: "STABLE",
      color: "#D4AF37",
      metric: "5,120 MW",
      detail: "Solar basin",
      icon: Zap,
    },
    {
      id: "ai",
      name: "AI Cluster",
      state: "ONLINE",
      color: "#05CD99",
      metric: "99.98%",
      detail: "Neural mesh",
      icon: Cpu,
    },
  ];

  return (
    <div
      className={`relative z-20 font-mono-tech select-none backdrop-blur-xl bg-[#070B16]/85 border border-white/10 rounded-lg p-3.5 shadow-2xl transition-all duration-300 hover:border-[#D4AF37]/40 max-w-xs w-full ${className}`}
    >
      {/* Tactical HUD Corner Accents */}
      <div className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 border-[#00F0FF]" />
      <div className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 border-[#00F0FF]" />
      <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4AF37]" />

      {/* Header telemetry stamp */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5 text-[10px] text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#05CD99] animate-pulse" />
          <span className="text-[#CBD5E1] font-semibold tracking-wider">SOVEREIGN INFRASTRUCTURE</span>
        </div>
        <span className="text-[#D4AF37] font-bold tracking-widest">{timestamp}</span>
      </div>

      {/* Node status list */}
      <div className="space-y-1.5">
        {nodes.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-white/5 hover:border-white/15 transition-all text-xs group"
            >
              <div className="flex items-center gap-2">
                <Icon size={12} className="text-[#94A3B8] group-hover:text-white transition-colors" />
                <div>
                  <div className="font-semibold text-white tracking-wide text-[11px] leading-tight">
                    {n.name}
                  </div>
                  <div className="text-[9px] text-[#64748B] leading-none">{n.detail}</div>
                </div>
              </div>

              <div className="text-right flex items-center gap-2">
                <span className="text-[10px] text-[#94A3B8] group-hover:text-[#CBD5E1] transition-colors">
                  {n.metric}
                </span>
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest border"
                  style={{
                    color: n.color,
                    borderColor: `${n.color}40`,
                    backgroundColor: `${n.color}15`,
                  }}
                >
                  {n.state}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cryptographic Node Signature */}
      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-[#64748B]">
        <span>NODE: DXB-SOV-00{randomSeed}</span>
        <span className="text-[#05CD99]">ENCRYPT: QUANTUM-256</span>
      </div>
    </div>
  );
};
