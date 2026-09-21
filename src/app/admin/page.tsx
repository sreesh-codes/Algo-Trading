"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOverviewGrid, LiveMetrics } from "@/components/admin/AdminOverviewGrid";
import { SystemMonitorCard } from "@/components/admin/SystemMonitorCard";
import { CompetitionControlCard } from "@/components/admin/CompetitionControlCard";
import {
  INITIAL_SYSTEM_MONITOR,
} from "@/data/mock/admin";
import { useToast } from "@/components/ui/Toast";

const INITIAL_LIVE_METRICS: LiveMetrics = {
  teamsCount: 0,
  submissionsCount: 0,
  runningBacktests: 0,
  completedBacktests: 0,
  competitionStatus: "REGISTRATION_OPEN"
};

export default function AdminPage() {
  const { showToast } = useToast();
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<LiveMetrics>(INITIAL_LIVE_METRICS);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/metrics");
      if (res.ok) {
        const data = await res.json();
        setMetrics({
          teamsCount: data.teamsCount,
          submissionsCount: data.submissionsCount,
          runningBacktests: data.runningBacktests,
          completedBacktests: data.completedBacktests,
          competitionStatus: data.competitionStatus,
        });
      }
    } catch (error) {
      console.error("Failed to fetch admin metrics", error);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 5000); // poll every 5s
    return () => clearInterval(intervalId);
  }, [fetchMetrics]);


  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6 animate-fade-in">
      {/* 1. Header */}
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
        systemStatus="OPTIMAL"
      />

      {/* 2. Overview Grid (6 Core Dashboard Cards) */}
      <AdminOverviewGrid metrics={metrics} />

      {/* 3. Competition Controller */}
      {!isReadOnly && (
        <CompetitionControlCard 
          competitionStatus={metrics.competitionStatus} 
          onStatusChange={fetchMetrics} 
        />
      )}

      {/* 4. System Monitor */}
      <SystemMonitorCard initialData={INITIAL_SYSTEM_MONITOR} />
    </div>
  );
}
