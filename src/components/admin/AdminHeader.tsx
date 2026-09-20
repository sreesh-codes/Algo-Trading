"use client";

import React from "react";
import { ShieldAlert, Lock, UserCheck, Eye, Terminal, Radio } from "lucide-react";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { clsx } from "clsx";

interface AdminHeaderProps {
  isReadOnly: boolean;
  onToggleReadOnly: (readOnly: boolean) => void;
  systemStatus: "OPTIMAL" | "DEGRADED" | "CRITICAL" | "MAINTENANCE";
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  isReadOnly,
  onToggleReadOnly,
  systemStatus,
}) => {
  return (
    <div className="space-y-4 border-b border-white/10 pb-5">
      {/* Mock Security Banner */}
      <div className="rounded-lg border border-[#D4AF37]/30 bg-[#161208]/90 p-3.5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono-tech">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]">
            <ShieldAlert size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider">
                MOCK ADMIN SESSION
              </span>
              <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] text-[#CBD5E1]">
                STUB ENFORCEMENT
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] font-sans mt-0.5">
              Frontend sandbox mode — authentication and permission verification are deferred to backend endpoints.
            </p>
          </div>
        </div>

        {/* Mock Role Switcher */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <span className="text-[11px] text-[#64748B] uppercase">Mock Role:</span>
          <div className="inline-flex p-0.5 rounded bg-black/60 border border-white/10">
            <button
              onClick={() => onToggleReadOnly(false)}
              className={clsx(
                "px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                !isReadOnly
                  ? "bg-[#D4AF37] text-black shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              )}
            >
              <UserCheck size={12} />
              <span>SUPERUSER</span>
            </button>
            <button
              onClick={() => onToggleReadOnly(true)}
              className={clsx(
                "px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                isReadOnly
                  ? "bg-[#00F0FF] text-black shadow-sm"
                  : "text-[#94A3B8] hover:text-white"
              )}
            >
              <Eye size={12} />
              <span>READ-ONLY</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TechnicalLabel variant="red">SUPERUSER CONSOLE</TechnicalLabel>
            <span className="text-xs font-mono-tech text-[#00F0FF] flex items-center gap-1.5">
              <Radio size={12} className="animate-pulse" />
              DIFC CRYOGENIC NEXUS // PARTITION 01
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase font-sans">
            EXCHANGE CONTROL & ORCHESTRATION
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono-tech mt-1">
            Autonomous competition orchestration, round lifecycle transitions, stochastic shock injection, and cluster surveillance.
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg border border-white/10 bg-[#0B101C] flex items-center gap-3 font-mono-tech text-xs">
            <div>
              <div className="text-[10px] text-[#64748B]">OPERATIONAL STATUS</div>
              <div className="font-bold text-[#05CD99] flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#05CD99] animate-pulse" />
                {systemStatus}
              </div>
            </div>
            <div className="w-px h-7 bg-white/10" />
            <div>
              <div className="text-[10px] text-[#64748B]">OPERATOR ID</div>
              <div className="font-bold text-white font-mono mt-0.5">
                root@dxb-dmx
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
