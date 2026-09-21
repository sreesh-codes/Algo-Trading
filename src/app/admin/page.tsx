"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOverviewGrid } from "@/components/admin/AdminOverviewGrid";
import { SystemMonitorCard } from "@/components/admin/SystemMonitorCard";
import {
  INITIAL_ADMIN_METRICS,
  INITIAL_SYSTEM_MONITOR,
  AdminOverviewMetrics,
} from "@/data/mock/admin";
import { useToast } from "@/components/ui/Toast";

export default function AdminPage() {
  const { showToast } = useToast();
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<AdminOverviewMetrics>(INITIAL_ADMIN_METRICS);



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



      {/* 6. System Monitor (Workers, Queues, Backtests, Users, Error Rate) */}
      <SystemMonitorCard initialData={INITIAL_SYSTEM_MONITOR} />
    </div>
  );
}
