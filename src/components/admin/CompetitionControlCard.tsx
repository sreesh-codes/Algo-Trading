"use client";

import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import {
  Play,
  Pause,
  StopCircle,
  AlertOctagon,
  ShieldAlert,
} from "lucide-react";
import { AdminConfirmModal, ActionSeverity } from "./AdminConfirmModal";
import { clsx } from "clsx";
import { useToast } from "@/components/ui/Toast";

interface CompetitionControlCardProps {
  competitionStatus: "REGISTRATION_OPEN" | "ACTIVE" | "PAUSED" | "COMPLETED";
  onStatusChange: () => void; // Trigger a refresh in parent
}

type CompetitionActionType = "START" | "PAUSE" | "END";

export const CompetitionControlCard: React.FC<CompetitionControlCardProps> = ({
  competitionStatus,
  onStatusChange,
}) => {
  const { showToast } = useToast();
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    action: CompetitionActionType | null;
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

  const openActionModal = (action: CompetitionActionType) => {
    switch (action) {
      case "START":
        setModalConfig({
          isOpen: true,
          action: "START",
          title: "START COMPETITION",
          actionLabel: "CONFIRM & START",
          severity: "success",
          description: "You are about to initiate the trading competition. Submissions will be evaluated.",
          consequences: [
            "All candidate code submissions will begin to process through backtests.",
            "Registration remains open unless manually disabled.",
            "Leaderboard scoring becomes active."
          ],
          requireAcknowledgmentCheckbox: true,
        });
        break;

      case "PAUSE":
        setModalConfig({
          isOpen: true,
          action: "PAUSE",
          title: "PAUSE COMPETITION",
          actionLabel: "CONFIRM & PAUSE",
          severity: "warning",
          description: "You are about to pause the competition. Ongoing backtests will pause or complete, but new ones won't queue.",
          consequences: [
            "Submissions are temporarily paused from executing.",
            "Leaderboard is frozen."
          ],
          requireAcknowledgmentCheckbox: true,
        });
        break;

      case "END":
        setModalConfig({
          isOpen: true,
          action: "END",
          title: "TERMINATE & END COMPETITION",
          actionLabel: "IRREVOCABLY END",
          severity: "destructive",
          description: "CRITICAL ACTION: You are ending the competition. This will finalize the leaderboard.",
          consequences: [
            "No more submissions will be accepted.",
            "Leaderboard standings are finalized."
          ],
          requireTypingPhrase: "CONFIRM",
          requireAcknowledgmentCheckbox: true,
        });
        break;
    }
  };

  const handleConfirmAction = async () => {
    if (!modalConfig.action) return;
    setIsLoading(true);

    let newStatus = "REGISTRATION_OPEN";
    if (modalConfig.action === "START") newStatus = "ACTIVE";
    if (modalConfig.action === "PAUSE") newStatus = "PAUSED";
    if (modalConfig.action === "END") newStatus = "COMPLETED";

    try {
      const res = await fetch("/api/admin/competition/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      showToast({
        type: "success",
        title: "SUCCESS",
        description: `Competition status successfully updated to ${newStatus}.`,
      });

      onStatusChange(); // Trigger a refresh
    } catch (error) {
      showToast({
        type: "error",
        title: "UPDATE FAILED",
        description: "An error occurred while updating the competition status.",
      });
    } finally {
      setIsLoading(false);
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const isStartDisabled = competitionStatus === "ACTIVE";
  const isPauseDisabled = competitionStatus !== "ACTIVE";
  const isEndDisabled = competitionStatus === "COMPLETED";

  return (
    <GlassPanel hudCorners className="p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <AlertOctagon size={18} className="text-[#D4AF37]" />
          <div>
            <h3 className="font-mono-tech text-sm font-bold text-white uppercase tracking-wider">
              Competition Lifecycle Controller
            </h3>
            <p className="text-xs text-[#94A3B8] font-sans">
              State-changing execution commands require double-verification safeguard confirmation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
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
          START
        </Button>

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
          PAUSE
        </Button>

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
          END
        </Button>
      </div>

      <div className="flex items-center gap-2 p-2.5 rounded bg-black/30 border border-white/5 text-[11px] font-mono-tech text-[#64748B]">
        <ShieldAlert size={13} className="text-[#D4AF37] shrink-0" />
        <span>
          ACCIDENT PREVENTION ACTIVE: Every state transition requires modal confirmation. Ending requires typing verification.
        </span>
      </div>

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
