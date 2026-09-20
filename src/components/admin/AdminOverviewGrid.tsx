"use client";

import React from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import {
  Trophy,
  Compass,
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
import { AdminOverviewMetrics } from "@/data/mock/admin";

interface AdminOverviewGridProps {
  metrics: AdminOverviewMetrics;
}

export const AdminOverviewGrid: React.FC<AdminOverviewGridProps> = ({ metrics }) => {
  const roundStatusConfig = {
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
      bg: "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40",
      dot: "bg-[#00F0FF]",
      icon: StopCircle,
    },
    SCHEDULED: {
      label: "SCHEDULED",
      bg: "bg-[#94A3B8]/15 text-[#94A3B8] border-white/20",
      dot: "bg-[#94A3B8]",
      icon: Clock,
    },
  }[metrics.roundStatus];

  const StatusIcon = roundStatusConfig.icon;

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
          <div className="text-sm font-bold text-white font-sans truncate" title={metrics.activeCompetition}>
            {metrics.activeCompetition}
          </div>
          <div className="text-[11px] text-[#94A3B8] font-mono-tech truncate mt-0.5">
            {metrics.seasonEdition}
          </div>
        </div>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-[#05CD99]">
          <span>1,500,000 Blitz POOL</span>
          <span className="text-[#94A3B8]">SEASON IV</span>
        </div>
      </GlassPanel>

      {/* 2. CURRENT ROUND */}
      <GlassPanel hudCorners className="p-4 flex flex-col justify-between space-y-2.5 border-[#D4AF37]/30">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono-tech uppercase font-bold text-[#64748B] tracking-wider">
            CURRENT ROUND
          </span>
          <div className={clsx("px-2 py-0.5 rounded text-[9px] font-mono-tech font-bold border flex items-center gap-1", roundStatusConfig.bg)}>
            <span className={clsx("w-1.5 h-1.5 rounded-full", roundStatusConfig.dot)} />
            {roundStatusConfig.label}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-[#D4AF37] font-sans truncate" title={metrics.currentRound}>
            {metrics.currentRound}
          </div>
          <div className="text-[11px] text-[#CBD5E1] font-mono-tech flex items-center gap-1 mt-0.5">
            <Clock size={11} className="text-[#64748B]" />
            <span>{metrics.roundStatus === "PAUSED" ? "CLOCK HALTED" : `${metrics.timeRemaining} REMAINING`}</span>
          </div>
        </div>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-[#94A3B8]">
          <span>STAGE 02 / 05</span>
          <span className="text-[#D4AF37]">THE ARBITRAGE</span>
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
            <span>{metrics.teamsActiveBots} BOTS CONNECTED</span>
          </div>
        </div>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-[#94A3B8]">
          <span>TOP TIER: 10 DESKS</span>
          <span className="text-[#00F0FF]">100% ONLINE</span>
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
            <span>{metrics.submissionsEvaluating} IN EVALUATION</span>
          </div>
        </div>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-[#94A3B8]">
          <span>ACTIVE DEPLOYED: 24</span>
          <span className="text-[#05CD99]">118 PASS</span>
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
            {metrics.backtestThroughput}
          </div>
        </div>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-[#94A3B8]">
          <span>AVG TIME: 8.4s</span>
          <span className="text-[#A855F7]">16 NODES</span>
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
            {metrics.systemStatus}
          </div>
          <div className="text-[11px] text-[#94A3B8] font-mono-tech mt-0.5">
            UPTIME {metrics.uptime}
          </div>
        </div>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-tech text-[#05CD99]">
          <span>LATENCY: {metrics.latencyMs}ms</span>
          <span className="text-white">DIFC CORE</span>
        </div>
      </GlassPanel>
    </div>
  );
};
