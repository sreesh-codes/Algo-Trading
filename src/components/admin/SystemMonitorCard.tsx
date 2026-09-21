"use client";

import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Button } from "@/components/ui/Button";
import {
  Cpu,
  Layers,
  PlaySquare,
  Users,
  ShieldCheck,
  RefreshCw,
  Server,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { SystemMonitorData } from "@/data/mock/admin";
import { clsx } from "clsx";

interface SystemMonitorCardProps {
  initialData: SystemMonitorData;
}

export const SystemMonitorCard: React.FC<SystemMonitorCardProps> = ({
  initialData,
}) => {
  const [data, setData] = useState<SystemMonitorData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData((prev) => ({
        ...prev,
        workers: {
          ...prev.workers,
          active: 0,
          total: 0,
          cpuPercent: 0,
          ramGb: 0,
          maxRamGb: 64,
          tempMilliKelvin: 0,
        },
        queues: prev.queues.map(q => ({ ...q, pendingCount: 0, avgLatencyMs: 0 })),
        backtests: {
          ...prev.backtests,
          runningJobs: 0,
          queuedJobs: 0,
          completedToday: 0,
          peakThroughputPerMin: 0,
          avgDurationSec: 0,
        },
        activeUsers: {
          ...prev.activeUsers,
          totalSessions: 0,
          algorithmicBots: 0,
          spectatorTerminals: 0,
          activeAdminConsoles: 1,
        },
        errorRate: {
          ...prev.errorRate,
          ratePercent: 0,
          errorsLastHour: 0,
          packetLossRate: 0,
          recentIncidents: ["Systems initialized. Zero errors."],
        }
      }));
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <GlassPanel hudCorners className="p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Server size={18} className="text-[#05CD99]" />
          <div>
            <h3 className="font-mono-tech text-sm font-bold text-white uppercase tracking-wider">
              Infrastructure & System Monitor
            </h3>
            <p className="text-xs text-[#94A3B8] font-sans">
              Distributed worker nodes, Kafka execution queues, concurrent backtest runners, and connection telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleRefresh}
            disabled={isRefreshing}
            icon={<RefreshCw size={12} className={clsx(isRefreshing && "animate-spin")} />}
            className="text-xs uppercase font-mono-tech border border-white/10"
          >
            Poll Nodes
          </Button>
          <TechnicalLabel variant="green">ALL CLUSTERS ONLINE</TechnicalLabel>
        </div>
      </div>

      {/* 5 Core Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3.5">
        {/* 1. WORKERS */}
        <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between space-y-3 font-mono-tech text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64748B] uppercase font-bold">
              1. WORKERS
            </span>
            <Cpu size={14} className="text-[#00F0FF]" />
          </div>

          <div>
            <div className="text-xl font-bold text-white">
              {data.workers.active} / {data.workers.total}
              <span className="text-xs text-[#05CD99] font-normal ml-1">ACTIVE</span>
            </div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">
              Cryogenic Celery/Ray Nodes
            </div>
          </div>

          {/* CPU & Memory bars */}
          <div className="space-y-1.5 pt-2 border-t border-white/5 text-[10px]">
            <div className="flex justify-between">
              <span className="text-[#64748B]">CPU LOAD:</span>
              <span className="text-white font-bold">{data.workers.cpuPercent}%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00F0FF] transition-all duration-500"
                style={{ width: `${data.workers.cpuPercent}%` }}
              />
            </div>

            <div className="flex justify-between pt-1">
              <span className="text-[#64748B]">MEMORY:</span>
              <span className="text-white font-bold">
                {data.workers.ramGb} / {data.workers.maxRamGb} GB
              </span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D4AF37] transition-all duration-500"
                style={{
                  width: `${(data.workers.ramGb / data.workers.maxRamGb) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="text-[10px] text-[#05CD99] pt-1">
            CORE TEMP: {data.workers.tempMilliKelvin} mK (SUPERCONDUCTING)
          </div>
        </div>

        {/* 2. QUEUES */}
        <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between space-y-3 font-mono-tech text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64748B] uppercase font-bold">
              2. QUEUES
            </span>
            <Layers size={14} className="text-[#D4AF37]" />
          </div>

          <div>
            <div className="text-xl font-bold text-[#D4AF37]">
              {data.queues.reduce((acc, q) => acc + q.pendingCount, 0)}
              <span className="text-xs text-[#94A3B8] font-normal ml-1">PENDING</span>
            </div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">
              Across 3 Ingestion Topics
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/5 text-[10px]">
            {data.queues.map((q) => (
              <div
                key={q.topic}
                className="p-1.5 rounded bg-black/50 border border-white/5 space-y-0.5"
              >
                <div className="flex justify-between font-medium">
                  <span className="text-[#CBD5E1] truncate max-w-[110px]" title={q.name}>
                    {q.name}
                  </span>
                  <span className={q.pendingCount > 0 ? "text-[#D4AF37]" : "text-[#05CD99]"}>
                    {q.pendingCount}
                  </span>
                </div>
                <div className="flex justify-between text-[9px] text-[#64748B]">
                  <span>LATENCY</span>
                  <span className="font-mono">{q.avgLatencyMs}ms</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-[#05CD99] pt-1">
            KAFKA INGESTION: ZERO BACKPRESSURE
          </div>
        </div>

        {/* 3. BACKTESTS */}
        <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between space-y-3 font-mono-tech text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64748B] uppercase font-bold">
              3. BACKTESTS
            </span>
            <PlaySquare size={14} className="text-[#A855F7]" />
          </div>

          <div>
            <div className="text-xl font-bold text-white">
              {data.backtests.runningJobs}
              <span className="text-xs text-[#A855F7] font-normal ml-1">RUNNING</span>
            </div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">
              +{data.backtests.queuedJobs} queued for compute
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/5 text-[10px]">
            <div className="flex justify-between">
              <span className="text-[#64748B]">COMPLETED TODAY:</span>
              <span className="text-white font-bold">{data.backtests.completedToday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">PEAK THROUGHPUT:</span>
              <span className="text-[#A855F7] font-bold">
                {data.backtests.peakThroughputPerMin} / min
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">AVG DURATION:</span>
              <span className="text-white">{data.backtests.avgDurationSec}s</span>
            </div>
          </div>

          <div className="text-[10px] text-[#A855F7] pt-1">
            CONCURRENT POOL: 64 SLOTS
          </div>
        </div>

        {/* 4. ACTIVE USERS */}
        <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between space-y-3 font-mono-tech text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64748B] uppercase font-bold">
              4. ACTIVE USERS
            </span>
            <Users size={14} className="text-[#00F0FF]" />
          </div>

          <div>
            <div className="text-xl font-bold text-white">
              {data.activeUsers.totalSessions}
              <span className="text-xs text-[#05CD99] font-normal ml-1">SESSIONS</span>
            </div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">
              Live WebSocket Connections
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/5 text-[10px]">
            <div className="flex justify-between">
              <span className="text-[#64748B]">TRADING BOTS:</span>
              <span className="text-[#05CD99] font-bold">
                {data.activeUsers.algorithmicBots} (100% Quorum)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">SPECTATOR HUDS:</span>
              <span className="text-white font-bold">
                {data.activeUsers.spectatorTerminals}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">ADMIN CONSOLES:</span>
              <span className="text-[#D4AF37] font-bold">
                {data.activeUsers.activeAdminConsoles}
              </span>
            </div>
          </div>

          <div className="text-[10px] text-[#00F0FF] pt-1">
            GATEWAY PROTOCOL: WSS / TLS 1.3
          </div>
        </div>

        {/* 5. ERROR RATE */}
        <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between space-y-3 font-mono-tech text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64748B] uppercase font-bold">
              5. ERROR RATE
            </span>
            <ShieldCheck size={14} className="text-[#05CD99]" />
          </div>

          <div>
            <div className="text-xl font-bold text-[#05CD99]">
              {data.errorRate.ratePercent}%
              <span className="text-xs text-[#94A3B8] font-normal ml-1">NOMINAL</span>
            </div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">
              3 non-fatal frames in 1h
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/5 text-[10px]">
            <div className="flex justify-between">
              <span className="text-[#64748B]">ERRORS / 1H:</span>
              <span className="text-white font-bold">{data.errorRate.errorsLastHour}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">PACKET LOSS:</span>
              <span className="text-[#05CD99] font-bold">
                {data.errorRate.packetLossRate * 100}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">CIRCUIT TRIPS:</span>
              <span className="text-white font-bold">0</span>
            </div>
          </div>

          <div className="text-[10px] text-[#05CD99] pt-1">
            HEALTH RATING: FIVE NINES (99.994%)
          </div>
        </div>
      </div>

      {/* Incident Log Footer */}
      <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1 font-mono-tech text-xs">
        <span className="text-[10px] text-[#64748B] uppercase font-bold">
          Recent Network Diagnostics:
        </span>
        <div className="space-y-1">
          {data.errorRate.recentIncidents.map((inc, i) => (
            <div key={i} className="text-[11px] text-[#94A3B8] flex items-center gap-2">
              <span className="text-[#D4AF37]">▪</span>
              <span>{inc}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
};
