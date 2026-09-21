"use client";

import React from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import {
  Trophy,
  Users,
  Send,
  PlaySquare,
  Activity,
  CheckCircle2,
  Clock,
  PauseCircle,
  StopCircle,
} from "lucide-react";
import { clsx } from "clsx";

export interface LiveMetrics {
  teamsCount: number;
  submissionsCount: number;
  runningBacktests: number;
  completedBacktests: number;
  competitionStatus: "REGISTRATION_OPEN" | "ACTIVE" | "PAUSED" | "COMPLETED";
}

interface AdminOverviewGridProps {
  metrics: LiveMetrics;
}

export const AdminOverviewGrid: React.FC<AdminOverviewGridProps> = ({ metrics }) => {
  const statusConfig = {
    REGISTRATION_OPEN: {
      label: "REGISTRATION OPEN",
      bg: "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40",
      dot: "bg-[#00F0FF]",
      icon: Clock,
    },
    ACTIVE: {
      label: "ACTIVE",
      bg: "bg-[#05CD99]/15 text-[#05CD99] border-[#05CD99]/40",
      dot: "bg-[#05CD99] animate-pulse",
      icon: CheckCircle2,
    },
    PAUSED: {
      label: "PAUSED",
      bg: "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40",
      dot: "bg-[#D4AF37] animate-ping",
      icon: PauseCircle,
    },
    COMPLETED: {
      label: "COMPLETED",
      bg: "bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/40",
      dot: "bg-[#A855F7]",
      icon: StopCircle,
    },
  }[metrics.competitionStatus] || {
    label: "UNKNOWN",
    bg: "bg-gray-500/15 text-gray-500 border-gray-500/40",
    dot: "bg-gray-500",
    icon: Clock,
  };

  const StatusIcon = statusConfig.icon;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {/* 1. ACTIVE COMPETITION */}
      <GlassPanel hudCorners className="p-4 flex flex-col justify-between space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono-tech uppercase font-bold text-[#64748B] tracking-wider">
            ACTIVE COMPETITION
          </span>
          <Trophy size={14} className="text-[#D4AF37]" />
        </div>
        <div>
          <div className="text-sm font-bold text-white font-sans truncate" title="DUBAI 2035 — The Mercantile">
            DUBAI 2035 — The Mercantile
          </div>
          <div className="text-[11px] text-[#94A3B8] font-mono-tech truncate mt-0.5">
            SEASON IV
          </div>
        </div>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-[#05CD99]">
          <span>DIFC ALGO LEAGUE</span>
          <span className="text-[#94A3B8]">EDITION 2035</span>
        </div>
      </GlassPanel>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono-tech uppercase font-bold text-[#64748B] tracking-wider">
            COMPETITION STATE
          </span>
          <div className={clsx("px-2 py-0.5 rounded text-[9px] font-mono-tech font-bold border flex items-center gap-1", statusConfig.bg)}>
            <span className={clsx("w-1.5 h-1.5 rounded-full", statusConfig.dot)} />
            {statusConfig.label}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-[#D4AF37] font-sans truncate" title={metrics.competitionStatus}>
            {metrics.competitionStatus.replace("_", " ")}
          </div>
        </div>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-[#94A3B8]">
          <span>LIFECYCLE</span>
          <span className="text-[#D4AF37]">CONTROLLER ACTIVE</span>
        </div>
      </GlassPanel>

      {/* 3. TEAMS */}
      <GlassPanel hudCorners className="p-4 flex flex-col justify-between space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono-tech uppercase font-bold text-[#64748B] tracking-wider">
            TEAMS
          </span>
          <Users size={14} className="text-[#00F0FF]" />
        </div>
        <div>
          <div className="text-xl font-bold text-white font-mono-tech">
            {metrics.teamsCount}
            <span className="text-xs text-[#64748B] font-normal ml-1">REGISTERED</span>
          </div>
          <div className="text-[11px] text-[#05CD99] font-mono-tech flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#05CD99]" />
            <span>ALL BOTS STANDBY</span>
          </div>
        </div>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-[#94A3B8]">
          <span>LIVE TRACKING</span>
          <span className="text-[#00F0FF]">CONNECTED</span>
        </div>
      </GlassPanel>

      {/* 4. SUBMISSIONS */}
      <GlassPanel hudCorners className="p-4 flex flex-col justify-between space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono-tech uppercase font-bold text-[#64748B] tracking-wider">
            SUBMISSIONS
          </span>
          <Send size={14} className="text-[#F59E0B]" />
        </div>
        <div>
          <div className="text-xl font-bold text-white font-mono-tech">
            {metrics.submissionsCount}
            <span className="text-xs text-[#64748B] font-normal ml-1">VERSIONS</span>
          </div>
          <div className="text-[11px] text-[#D4AF37] font-mono-tech flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>IN REPOSITORY</span>
          </div>
        </div>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-[#94A3B8]">
          <span>ACCEPTED</span>
          <span className="text-[#05CD99]">ALL CLEAR</span>
        </div>
      </GlassPanel>

      {/* 5. RUNNING BACKTESTS */}
      <GlassPanel hudCorners className="p-4 flex flex-col justify-between space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono-tech uppercase font-bold text-[#64748B] tracking-wider">
            RUNNING BACKTESTS
          </span>
          <PlaySquare size={14} className="text-[#A855F7]" />
        </div>
        <div>
          <div className="text-xl font-bold text-white font-mono-tech">
            {metrics.runningBacktests}
            <span className="text-xs text-[#64748B] font-normal ml-1">ACTIVE</span>
          </div>
          <div className="text-[11px] text-[#A855F7] font-mono-tech truncate mt-0.5">
            {metrics.completedBacktests} COMPLETED
          </div>
        </div>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-[#94A3B8]">
          <span>CLUSTER ONLINE</span>
          <span className="text-[#A855F7]">WORKERS STANDBY</span>
        </div>
      </GlassPanel>

      {/* 6. SYSTEM STATUS */}
      <GlassPanel hudCorners className="p-4 flex flex-col justify-between space-y-2.5 border-[#05CD99]/30">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono-tech uppercase font-bold text-[#64748B] tracking-wider">
            SYSTEM STATUS
          </span>
          <Activity size={14} className="text-[#05CD99]" />
        </div>
        <div>
          <div className="text-xl font-bold text-[#05CD99] font-mono-tech flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#05CD99] animate-pulse" />
            OPTIMAL
          </div>
          <div className="text-[11px] text-[#94A3B8] font-mono-tech mt-0.5">
            ALL SYSTEMS NOMINAL
          </div>
        </div>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-[#05CD99]">
          <span>TELEMETRY LIVE</span>
          <span className="text-white">DIFC CORE</span>
        </div>
      </GlassPanel>
    </div>
  );
};
