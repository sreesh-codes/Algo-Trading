"use client";

import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import {
  Play,
  Pause,
  PlayCircle,
  StopCircle,
  AlertOctagon,
  Clock,
  ShieldAlert,
  Lock,
} from "lucide-react";
import { AdminConfirmModal, ActionSeverity } from "./AdminConfirmModal";
import { clsx } from "clsx";

interface RoundControlCardProps {
  currentRound: string;
  roundNumber: number;
  roundStatus: "ACTIVE" | "PAUSED" | "COMPLETED" | "SCHEDULED";
  timeRemaining: string;
  isReadOnly: boolean;
  onUpdateRoundStatus: (newStatus: "ACTIVE" | "PAUSED" | "COMPLETED" | "SCHEDULED") => void;
}

type RoundActionType = "START" | "PAUSE" | "RESUME" | "END";

export const RoundControlCard: React.FC<RoundControlCardProps> = ({
  currentRound,
  roundNumber,
  roundStatus,
  timeRemaining,
  isReadOnly,
  onUpdateRoundStatus,
}) => {
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    action: RoundActionType | null;
    title: string;
    actionLabel: string;
    severity: ActionSeverity;
    description: string;
    consequences: string[];
    requireTypingPhrase?: string;
    requireAcknowledgmentCheckbox?: boolean;
  }>({
    isOpen: false,
    action: null,
    title: "",
    actionLabel: "",
    severity: "warning",
    description: "",
    consequences: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const openActionModal = (action: RoundActionType) => {
    if (isReadOnly) return;

    switch (action) {
      case "START":
        setModalConfig({
          isOpen: true,
          action: "START",
          title: `START ${currentRound}`,
          actionLabel: "CONFIRM & START ROUND",
          severity: "success",
          description: `You are about to initiate ${currentRound}. The matching engine will transition into live trading mode.`,
          consequences: [
            "All 24 participant bot execution pipelines will receive the ORDER_BOOK_OPEN event.",
            "Live limit order matching commences at 14,280 Hz on cryogenic partition #1.",
            "Round countdown timer begins immediately.",
          ],
          requireAcknowledgmentCheckbox: true,
        });
        break;

      case "PAUSE":
        setModalConfig({
          isOpen: true,
          action: "PAUSE",
          title: `PAUSE ${currentRound}`,
          actionLabel: "CONFIRM & PAUSE ROUND",
          severity: "warning",
          description: `You are about to pause ${currentRound}. This will suspend continuous order matching across all instruments.`,
          consequences: [
            "Continuous double auction matching engine halts immediately.",
            "Pending orders remain queued but unexecuted; cancellation requests will be rejected.",
            "The official countdown clock will freeze until manually resumed.",
            "Participant bot heartbeat ping frequency will be throttled.",
          ],
          requireAcknowledgmentCheckbox: true,
        });
        break;

      case "RESUME":
        setModalConfig({
          isOpen: true,
          action: "RESUME",
          title: `RESUME ${currentRound}`,
          actionLabel: "CONFIRM & RESUME ROUND",
          severity: "info",
          description: `You are about to resume ${currentRound} from paused status. Limit order matching will restart immediately.`,
          consequences: [
            "Order book matching engine unfreezes across all 5 asset markets.",
            "Queued limit orders will be processed sequentially based on price-time priority.",
            "Countdown clock unfreezes and resumes decrementing.",
          ],
          requireAcknowledgmentCheckbox: true,
        });
        break;

      case "END":
        setModalConfig({
          isOpen: true,
          action: "END",
          title: `TERMINATE & END ${currentRound}`,
          actionLabel: "IRREVOCABLY END ROUND",
          severity: "destructive",
          description: `CRITICAL ACTION: You are terminating ${currentRound}. This action will calculate final benchmark metrics and lock leaderboard standings.`,
          consequences: [
            "All active trading bot websocket connections will be immediately terminated.",
            "Open contracts will be marked-to-market at the final official index price.",
            "Official Sharpe ratios, maximum drawdowns, and net PnLs will be locked into immutable storage.",
            "Round results will be published to the public leaderboard and verified by the exchange auditor.",
          ],
          requireTypingPhrase: "CONFIRM",
          requireAcknowledgmentCheckbox: true,
        });
        break;
    }
  };

  const handleConfirmAction = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (modalConfig.action === "START" || modalConfig.action === "RESUME") {
        onUpdateRoundStatus("ACTIVE");
      } else if (modalConfig.action === "PAUSE") {
        onUpdateRoundStatus("PAUSED");
      } else if (modalConfig.action === "END") {
        onUpdateRoundStatus("COMPLETED");
      }
      setIsLoading(false);
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    }, 600);
  };

  // Determine button enabled/disabled states based on roundStatus
  const isStartDisabled = isReadOnly || roundStatus === "ACTIVE" || roundStatus === "PAUSED";
  const isPauseDisabled = isReadOnly || roundStatus !== "ACTIVE";
  const isResumeDisabled = isReadOnly || roundStatus !== "PAUSED";
  const isEndDisabled = isReadOnly || roundStatus === "COMPLETED";

  return (
    <GlassPanel hudCorners className="p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <AlertOctagon size={18} className="text-[#D4AF37]" />
          <div>
            <h3 className="font-mono-tech text-sm font-bold text-white uppercase tracking-wider">
              Round Lifecycle Controller
            </h3>
            <p className="text-xs text-[#94A3B8] font-sans">
              State-changing execution commands require double-verification safeguard confirmation.
            </p>
          </div>
        </div>

        {isReadOnly && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono-tech">
            <Lock size={12} />
            <span>READ-ONLY MODE ACTIVE</span>
          </div>
        )}
      </div>

      {/* Current Round Banner State */}
      <div className="p-4 rounded-lg bg-black/40 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono-tech text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[#64748B] uppercase">TARGET ROUND:</span>
            <span className="font-bold text-white uppercase text-sm">
              {currentRound}
            </span>
          </div>
          <p className="text-[11px] text-[#CBD5E1] font-sans">
            {roundStatus === "ACTIVE" &&
              "Continuous double auction matching is actively running. 24 algorithmic bots are streaming orders."}
            {roundStatus === "PAUSED" &&
              "Exchange state is PAUSED. Matching queue is frozen; clock halted. Zero order execution."}
            {roundStatus === "COMPLETED" &&
              "Round 02 has officially concluded. Leaderboard standings are finalized."}
            {roundStatus === "SCHEDULED" &&
              "Round is scheduled. Awaiting start command from exchange root operator."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <div className="px-3 py-1.5 rounded bg-black/60 border border-white/10 flex items-center gap-2">
            <Clock size={13} className="text-[#D4AF37]" />
            <span className="text-[#94A3B8] text-[10px]">TIME LEFT:</span>
            <span className="font-bold text-white tabular-nums">
              {roundStatus === "PAUSED" ? "03:17:42 (PAUSED)" : timeRemaining}
            </span>
          </div>
        </div>
      </div>

      {/* Four Control Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* START ROUND */}
        <Button
          variant="success"
          disabled={isStartDisabled}
          onClick={() => openActionModal("START")}
          icon={<Play size={14} />}
          className={clsx(
            "font-mono-tech uppercase text-xs py-3 justify-center",
            isStartDisabled ? "opacity-35 cursor-not-allowed" : "hover:shadow-[0_0_15px_rgba(5,205,153,0.3)]"
          )}
        >
          START ROUND
        </Button>

        {/* PAUSE ROUND */}
        <Button
          variant="primary"
          disabled={isPauseDisabled}
          onClick={() => openActionModal("PAUSE")}
          icon={<Pause size={14} />}
          className={clsx(
            "font-mono-tech uppercase text-xs py-3 justify-center bg-[#D4AF37]/15 border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37]/25",
            isPauseDisabled ? "opacity-35 cursor-not-allowed" : "hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          )}
        >
          PAUSE ROUND
        </Button>

        {/* RESUME ROUND */}
        <Button
          variant="secondary"
          disabled={isResumeDisabled}
          onClick={() => openActionModal("RESUME")}
          icon={<PlayCircle size={14} />}
          className={clsx(
            "font-mono-tech uppercase text-xs py-3 justify-center border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF]/15",
            isResumeDisabled ? "opacity-35 cursor-not-allowed" : "hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          )}
        >
          RESUME ROUND
        </Button>

        {/* END ROUND */}
        <Button
          variant="danger"
          disabled={isEndDisabled}
          onClick={() => openActionModal("END")}
          icon={<StopCircle size={14} />}
          className={clsx(
            "font-mono-tech uppercase text-xs py-3 justify-center",
            isEndDisabled ? "opacity-35 cursor-not-allowed" : "hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          )}
        >
          END ROUND
        </Button>
      </div>

      {/* Safeguard Alert Notice */}
      <div className="flex items-center gap-2 p-2.5 rounded bg-black/30 border border-white/5 text-[11px] font-mono-tech text-[#64748B]">
        <ShieldAlert size={13} className="text-[#D4AF37] shrink-0" />
        <span>
          ACCIDENT PREVENTION ACTIVE: Every round transition requires modal confirmation. Ending a round requires typing verification.
        </span>
      </div>

      {/* Confirmation Modal */}
      <AdminConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        actionLabel={modalConfig.actionLabel}
        severity={modalConfig.severity}
        description={modalConfig.description}
        consequences={modalConfig.consequences}
        requireTypingPhrase={modalConfig.requireTypingPhrase}
        requireAcknowledgmentCheckbox={modalConfig.requireAcknowledgmentCheckbox}
        isLoading={isLoading}
      />
    </GlassPanel>
  );
};
