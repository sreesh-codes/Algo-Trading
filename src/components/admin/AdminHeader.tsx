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
      {/* Main Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400 font-[family-name:var(--font-chakra-petch)] uppercase tracking-tight">
            ADMIN
          </h1>
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
