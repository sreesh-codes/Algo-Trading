"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  FileCode,
  Clock,
  Hash,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { SubmissionVersionRecord } from "@/services/api/submission";

interface DeploymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  roundNumber: number;
  roundName: string;
  roundTitle: string;
  version: string;
  filename: string;
  onConfirmDeployment: () => Promise<SubmissionVersionRecord>;
  onSuccessComplete: (newRecord: SubmissionVersionRecord) => void;
}

export const DeploymentConfirmationModal: React.FC<
  DeploymentConfirmationModalProps
> = ({
  isOpen,
  onClose,
  roundNumber,
  roundName,
  roundTitle,
  version,
  filename,
  onConfirmDeployment,
  onSuccessComplete,
}) => {
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] =
    useState<SubmissionVersionRecord | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeploying(true);
    try {
      setErrorMsg(null);
      const record = await onConfirmDeployment();
      setSubmittedRecord(record);

      // Trigger celebratory confetti
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#05CD99", "#00F0FF"],
      });

      onSuccessComplete(record);
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to execute strategy");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleClose = () => {
    setSubmittedRecord(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#090D18] border border-white/12 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Accent Strip */}
        <div className="h-1 bg-gradient-to-r from-[#D4AF37] via-[#00F0FF] to-[#05CD99]" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-sans font-semibold text-slate-200">
              {submittedRecord
                ? "Exchange Receipt Generated"
                : "Confirm Exchange Deployment"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        {!submittedRecord ? (
          /* State 1: Confirmation Prompt */
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="text-xs font-sans font-medium text-amber-400">
                Target Arena
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight font-sans">
                {roundName}
              </h3>
              <div className="text-sm font-medium text-cyan-400 font-sans">
                {roundTitle}
              </div>
            </div>

            {/* Submission Parameter Matrix */}
            <div className="bg-[#050811] border border-white/8 rounded-xl p-4 space-y-3 font-sans text-sm">
              <div className="flex items-center justify-between border-b border-white/6 pb-2.5">
                <span className="text-slate-400">Submission:</span>
                <span className="text-base font-semibold text-amber-400">
                  {version}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/6 pb-2.5">
                <span className="text-slate-400">Entry Script:</span>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  {filename}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/6 pb-2.5">
                <span className="text-slate-400">Matching Cluster:</span>
                <span className="text-slate-300">DIFC-DMX-PROD-04</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pre-flight Status:</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Certified (5/5 Checks)
                </span>
              </div>
            </div>

            {/* Disclaimer Notice */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-200/90 leading-relaxed font-sans">
              <strong className="text-amber-400 font-semibold">Live Deployment Notice:</strong> Deploying will register <code className="font-mono text-amber-400 font-semibold px-1">{version}</code> as your active trading bot on the continuous order book. Existing open orders will be re-hedged.
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-400 leading-relaxed font-sans flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-sans font-medium transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeploying}
                onClick={handleConfirm}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-sans text-sm font-semibold transition shadow-sm cursor-pointer"
              >
                {isDeploying ? (
                  <span>Registering to Engine...</span>
                ) : (
                  <>
                    <span>Confirm & Deploy {version}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* State 2: SUBMISSION RECEIVED Receipt */
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-sans text-xs font-semibold">
                Submission Received
              </div>
              <h3 className="text-xl font-bold text-white font-sans">
                Algorithm Deployed to Live Arena
              </h3>
              <p className="text-xs text-slate-400">
                Your strategy is now queued in the continuous auction order stream.
              </p>
            </div>

            {/* Detailed Electronic Receipt */}
            <div className="bg-[#050811] border border-emerald-500/30 rounded-xl p-4 space-y-2.5 font-sans text-sm shadow-sm">
              <div className="flex items-center justify-between border-b border-white/6 pb-2">
                <span className="text-slate-400">Submission ID:</span>
                <span className="text-white font-medium">
                  {submittedRecord.submissionId}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/6 pb-2">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-amber-400 font-medium">
                  {submittedRecord.submittedAt}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/6 pb-2">
                <span className="text-slate-400">Deployed Version:</span>
                <span className="text-white font-semibold">{submittedRecord.version}</span>
              </div>

              <div className="flex items-center justify-between border-b border-white/6 pb-2">
                <span className="text-slate-400">Competition Round:</span>
                <span className="text-white">
                  Round 0{submittedRecord.roundNumber} ({submittedRecord.roundName})
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/6 pb-2">
                <span className="text-slate-400">Commit Hash:</span>
                <span className="text-slate-300 font-mono text-xs">
                  #{submittedRecord.commitHash}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Est. Benchmark Score:</span>
                <span className="text-emerald-400 font-semibold text-base">
                  {submittedRecord.competitionScore} / 100
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-sans text-sm font-semibold transition cursor-pointer text-center"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
