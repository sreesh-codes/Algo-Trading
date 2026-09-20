"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOverviewGrid } from "@/components/admin/AdminOverviewGrid";
import { RoundControlCard } from "@/components/admin/RoundControlCard";
import { MarketEventsCard } from "@/components/admin/MarketEventsCard";
import { CandidatesTableCard } from "@/components/admin/CandidatesTableCard";
import { SubmissionsTableCard } from "@/components/admin/SubmissionsTableCard";
import { SystemMonitorCard } from "@/components/admin/SystemMonitorCard";
import {
  INITIAL_ADMIN_METRICS,
  INITIAL_SUBMISSIONS,
  INITIAL_SYSTEM_MONITOR,
  ActiveMarketShock,
  AdminOverviewMetrics,
  AdminSubmission,
} from "@/data/mock/admin";
import { useToast } from "@/components/ui/Toast";

export default function AdminPage() {
  const { showToast } = useToast();
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<AdminOverviewMetrics>(INITIAL_ADMIN_METRICS);
  const [activeShocks, setActiveShocks] = useState<ActiveMarketShock[]>([]);
  const [submissions, setSubmissions] = useState<AdminSubmission[]>(INITIAL_SUBMISSIONS);
  const [auditLogs, setAuditLogs] = useState<string[]>([
    "14:31:02 GST — Submission v12.4 by Quantum Desert deployed to partition #1.",
    "14:28:44 GST — Falcon Arbitrage bot heartbeat verified (latency: 0.35ms).",
    "14:15:00 GST — Round 02 liquidity pool balance check completed: zero deficit.",
    "14:00:00 GST — Official exchange timestamp sync executed across 16 Ray cluster nodes.",
  ]);

  // Dynamic countdown for active market shocks
  useEffect(() => {
    if (activeShocks.length === 0) return;

    const interval = setInterval(() => {
      setActiveShocks((prevShocks) => {
        const updated = prevShocks
          .map((shock) => ({
            ...shock,
            remainingSec: shock.remainingSec - 1,
          }))
          .filter((shock) => shock.remainingSec > 0);

        // If any shock just expired, log it
        if (updated.length < prevShocks.length) {
          const expiredCount = prevShocks.length - updated.length;
          const timestamp = new Date().toLocaleTimeString();
          setAuditLogs((prev) => [
            `${timestamp} GST — Market shock naturally subsided and decayed to equilibrium.`,
            ...prev,
          ]);
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeShocks.length]);

  // Handle Round Lifecycle state updates
  const handleUpdateRoundStatus = (
    newStatus: "ACTIVE" | "PAUSED" | "COMPLETED" | "SCHEDULED"
  ) => {
    setMetrics((prev) => ({
      ...prev,
      roundStatus: newStatus,
    }));

    const timestamp = new Date().toLocaleTimeString();
    const log = `${timestamp} GST — [ROUND LIFECYCLE]: Transitioned ${metrics.currentRound} to ${newStatus}`;
    setAuditLogs((prev) => [log, ...prev]);

    showToast({
      type: newStatus === "ACTIVE" ? "success" : newStatus === "PAUSED" ? "warning" : "info",
      title: `ROUND STATUS: ${newStatus}`,
      description: `The exchange engine has applied the state transition to ${metrics.currentRound}.`,
    });
  };

  // Handle Market Shock Injections
  const handleTriggerShock = (shock: ActiveMarketShock) => {
    setActiveShocks((prev) => [shock, ...prev]);

    const timestamp = new Date().toLocaleTimeString();
    const log = `${timestamp} GST — [EXOGENOUS SHOCK]: ${shock.name} injected across ${shock.affectedAssets.join(", ")} (${shock.totalDurationSec}s duration)`;
    setAuditLogs((prev) => [log, ...prev]);

    showToast({
      type: "warning",
      title: `MARKET SHOCK: ${shock.name}`,
      description: `Injected into order books for ${shock.totalDurationSec}s. Testing participant bot resilience.`,
    });
  };

  // Handle Manual Shock Dampening / Clearing
  const handleClearShock = (instanceId: string) => {
    const shockToClear = activeShocks.find((s) => s.instanceId === instanceId);
    setActiveShocks((prev) => prev.filter((s) => s.instanceId !== instanceId));

    if (shockToClear) {
      const timestamp = new Date().toLocaleTimeString();
      const log = `${timestamp} GST — [SHOCK CANCELLED]: Operator manually dampened ${shockToClear.name}`;
      setAuditLogs((prev) => [log, ...prev]);

      showToast({
        type: "info",
        title: `SHOCK DAMPENED: ${shockToClear.name}`,
        description: "Order book volatility and spread constraints restored to baseline.",
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6 animate-fade-in">
      {/* 1. Header with Mock Security Posture */}
      <AdminHeader
        isReadOnly={isReadOnly}
        onToggleReadOnly={(ro) => {
          setIsReadOnly(ro);
          showToast({
            type: "info",
            title: ro ? "READ-ONLY MODE" : "SUPERUSER PRIVILEGES",
            description: ro
              ? "All state-changing controls are now locked in auditor mode."
              : "Full exchange orchestration and control commands unlocked.",
          });
        }}
        systemStatus={metrics.systemStatus}
      />

      {/* 2. Overview Grid (6 Core Dashboard Cards) */}
      <AdminOverviewGrid metrics={metrics} />

      {/* 3. Round Control Console (Confirmation Modals) */}
      <RoundControlCard
        currentRound={metrics.currentRound}
        roundNumber={metrics.roundNumber}
        roundStatus={metrics.roundStatus}
        timeRemaining={metrics.timeRemaining}
        isReadOnly={isReadOnly}
        onUpdateRoundStatus={handleUpdateRoundStatus}
      />

      {/* 4. Market Events Shock Injector */}
      <MarketEventsCard
        isReadOnly={isReadOnly}
        activeShocks={activeShocks}
        onTriggerShock={handleTriggerShock}
        onClearShock={handleClearShock}
        auditLogs={auditLogs}
      />

      {/* Candidates Management */}
      <CandidatesTableCard />

      {/* 5. Submissions Table & Trace Inspection */}
      <SubmissionsTableCard submissions={submissions} />

      {/* 6. System Monitor (Workers, Queues, Backtests, Users, Error Rate) */}
      <SystemMonitorCard initialData={INITIAL_SYSTEM_MONITOR} />
    </div>
  );
}
