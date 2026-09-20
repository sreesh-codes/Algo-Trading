"use client";

import React, { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import {
  Zap,
  Flame,
  Droplet,
  TrendingDown,
  GitCompare,
  Sliders,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
} from "lucide-react";
import {
  MARKET_SHOCK_TEMPLATES,
  MarketShockTemplate,
  ActiveMarketShock,
} from "@/data/mock/admin";
import { AdminConfirmModal } from "./AdminConfirmModal";
import { clsx } from "clsx";

interface MarketEventsCardProps {
  isReadOnly: boolean;
  activeShocks: ActiveMarketShock[];
  onTriggerShock: (shock: ActiveMarketShock) => void;
  onClearShock: (instanceId: string) => void;
  auditLogs: string[];
}

export const MarketEventsCard: React.FC<MarketEventsCardProps> = ({
  isReadOnly,
  activeShocks,
  onTriggerShock,
  onClearShock,
  auditLogs,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<MarketShockTemplate | null>(null);
  const [durationSec, setDurationSec] = useState<number>(60);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isInjecting, setIsInjecting] = useState<boolean>(false);

  const handleOpenConfirm = (template: MarketShockTemplate) => {
    if (isReadOnly) return;
    setSelectedTemplate(template);
    setDurationSec(template.defaultDurationSec);
    setIsModalOpen(true);
  };

  const handleConfirmShock = () => {
    if (!selectedTemplate) return;
    setIsInjecting(true);

    setTimeout(() => {
      const newActiveShock: ActiveMarketShock = {
        instanceId: `shock-inst-${Date.now()}`,
        templateId: selectedTemplate.id,
        name: selectedTemplate.name,
        code: selectedTemplate.code,
        severity: selectedTemplate.severity,
        triggeredAt: new Date().toLocaleTimeString() + " GST",
        remainingSec: durationSec,
        totalDurationSec: durationSec,
        intensityPercent: 100,
        affectedAssets: selectedTemplate.affectedAssets,
        statusMessage: `${selectedTemplate.intensityLabel} active across ${selectedTemplate.affectedAssets.join(", ")}.`,
      };

      onTriggerShock(newActiveShock);
      setIsInjecting(false);
      setIsModalOpen(false);
      setSelectedTemplate(null);
    }, 500);
  };

  const getEventIcon = (code: string) => {
    switch (code) {
      case "VOLATILITY_SHOCK":
        return Flame;
      case "LIQUIDITY_DROP":
        return Droplet;
      case "PRICE_SHOCK":
        return TrendingDown;
      case "CORRELATION_SHIFT":
        return GitCompare;
      case "REGIME_CHANGE":
        return Sliders;
      default:
        return Zap;
    }
  };

  return (
    <GlassPanel hudCorners className="p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-[#00F0FF]" />
          <div>
            <h3 className="font-mono-tech text-sm font-bold text-white uppercase tracking-wider">
              Market Event & Turbulence Injector
            </h3>
            <p className="text-xs text-[#94A3B8] font-sans">
              Inject controlled stochastic shocks to evaluate algorithmic resilience, risk limits, and liquidation safeguards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TechnicalLabel variant={activeShocks.length > 0 ? "red" : "cyan"}>
            {activeShocks.length > 0
              ? `${activeShocks.length} SHOCKS ACTIVE`
              : "ZERO ACTIVE SHOCKS"}
          </TechnicalLabel>
        </div>
      </div>

      {/* Active Shocks Status Monitor Banner */}
      {activeShocks.length > 0 ? (
        <div className="space-y-2">
          <span className="text-[10px] font-mono-tech uppercase font-bold text-[#EF4444] tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
            LIVE MARKET SHOCKS IN EFFECT
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeShocks.map((shock) => {
              const Icon = getEventIcon(shock.code);
              const progressPct = Math.max(
                0,
                Math.round((shock.remainingSec / shock.totalDurationSec) * 100)
              );

              return (
                <div
                  key={shock.instanceId}
                  className="p-3.5 rounded-lg border border-[#EF4444]/60 bg-[#16080A]/85 flex flex-col justify-between space-y-3 font-mono-tech text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-[#EF4444]/20 text-[#EF4444]">
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-white uppercase text-sm">
                          {shock.name}
                        </div>
                        <div className="text-[10px] text-[#EF4444]">
                          TRIGGERED: {shock.triggeredAt}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="danger"
                      onClick={() => onClearShock(shock.instanceId)}
                      disabled={isReadOnly}
                      className="text-[10px] py-1 px-2 uppercase font-mono-tech"
                    >
                      DAMPEN / CLEAR
                    </Button>
                  </div>

                  <p className="text-[11px] text-[#CBD5E1] font-sans">
                    {shock.statusMessage}
                  </p>

                  {/* Countdown Timer and Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#94A3B8] flex items-center gap-1">
                        <Clock size={11} className="text-[#EF4444]" />
                        TIME REMAINING:
                      </span>
                      <span className="text-white font-bold tabular-nums">
                        {shock.remainingSec}s / {shock.totalDurationSec}s
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#EF4444] to-[#F59E0B] transition-all duration-1000"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between text-xs font-mono-tech text-[#64748B]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#05CD99]" />
            <span>Exchange diffusion rates and order books operating at baseline equilibrium.</span>
          </div>
          <span className="text-[10px] text-[#05CD99]">NOMINAL CALM</span>
        </div>
      )}

      {/* Grid of 5 Mock Market Events */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {MARKET_SHOCK_TEMPLATES.map((template) => {
          const Icon = getEventIcon(template.code);
          const isCurrentlyActive = activeShocks.some(
            (s) => s.templateId === template.id
          );

          return (
            <div
              key={template.id}
              className={clsx(
                "p-3.5 rounded-lg border transition-all flex flex-col justify-between space-y-3 font-mono-tech text-xs group",
                isCurrentlyActive
                  ? "border-[#EF4444] bg-[#16080A]/60"
                  : "border-white/10 bg-black/40 hover:border-white/20"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={clsx(
                      "p-1.5 rounded",
                      template.severity === "CRITICAL"
                        ? "bg-[#EF4444]/15 text-[#EF4444]"
                        : template.severity === "HIGH"
                        ? "bg-[#F59E0B]/15 text-[#F59E0B]"
                        : "bg-[#00F0FF]/15 text-[#00F0FF]"
                    )}
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    className={clsx(
                      "text-[9px] px-1.5 py-0.5 rounded font-bold border uppercase",
                      template.severity === "CRITICAL"
                        ? "text-[#EF4444] border-[#EF4444]/40 bg-[#EF4444]/10"
                        : template.severity === "HIGH"
                        ? "text-[#F59E0B] border-[#F59E0B]/40 bg-[#F59E0B]/10"
                        : "text-[#00F0FF] border-[#00F0FF]/40 bg-[#00F0FF]/10"
                    )}
                  >
                    {template.severity}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white uppercase text-xs tracking-tight group-hover:text-[#00F0FF] transition-colors">
                    {template.name}
                  </h4>
                  <div className="text-[10px] text-[#D4AF37] mt-0.5">
                    {template.intensityLabel}
                  </div>
                </div>

                <p className="text-[11px] text-[#94A3B8] font-sans line-clamp-3 leading-snug">
                  {template.description}
                </p>

                <div className="p-2 rounded bg-black/50 border border-white/5 text-[10px] text-[#64748B] font-mono">
                  {template.impactFormula}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                  <span>AFFECTS:</span>
                  <span className="text-white truncate max-w-[110px]" title={template.affectedAssets.join(", ")}>
                    {template.affectedAssets[0]} {template.affectedAssets.length > 1 && `+${template.affectedAssets.length - 1}`}
                  </span>
                </div>

                <Button
                  variant={template.severity === "CRITICAL" ? "danger" : "secondary"}
                  disabled={isReadOnly || isCurrentlyActive}
                  onClick={() => handleOpenConfirm(template)}
                  className={clsx(
                    "w-full text-xs uppercase py-2 justify-center font-mono-tech",
                    isCurrentlyActive
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:shadow-md"
                  )}
                >
                  {isCurrentlyActive ? "ACTIVE NOW" : "TRIGGER SHOCK"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Event Audit Stream */}
      <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 space-y-2 font-mono-tech text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-[#D4AF37]" />
            <span className="font-bold text-white uppercase">
              Event Ingestion Log Stream
            </span>
          </div>
          <span className="text-[10px] text-[#64748B]">LIVE AUDIT</span>
        </div>
        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
          {auditLogs.map((log, i) => (
            <div
              key={i}
              className="p-1.5 rounded bg-black/50 border border-white/5 text-[11px] text-[#CBD5E1] flex items-start gap-2"
            >
              <span className="text-[#00F0FF] shrink-0">›</span>
              <span className="leading-snug">{log}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal for Shock Trigger */}
      {selectedTemplate && (
        <AdminConfirmModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTemplate(null);
          }}
          onConfirm={handleConfirmShock}
          title={`TRIGGER ${selectedTemplate.name}`}
          actionLabel={`CONFIRM & INJECT ${selectedTemplate.name}`}
          severity={selectedTemplate.severity === "CRITICAL" ? "destructive" : "warning"}
          description={`You are about to inject a simulated ${selectedTemplate.name} into the active order books. This will directly test how all 24 participant bot algorithms handle high-entropy market stress.`}
          consequences={[
            `Microstructure Impact: ${selectedTemplate.impactFormula}`,
            `Affected Instruments: ${selectedTemplate.affectedAssets.join(", ")}`,
            `Shock duration will automatically decay after ${durationSec} seconds.`,
            "Participant bot risk modules will be benchmarked on drawdown mitigation.",
          ]}
          requireAcknowledgmentCheckbox={true}
          isLoading={isInjecting}
        />
      )}
    </GlassPanel>
  );
};
