"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { MercantileApi } from "@/services/api";
import {
  SubmissionVersionRecord,
  RoundOption,
  ACTIVE_ROUNDS,
  DEFAULT_PYTHON_STRATEGY,
} from "@/services/api/submission";

import { StrategyCodeEditor } from "@/components/submit/StrategyCodeEditor";
import { ValidationEngineModal } from "@/components/submit/ValidationEngineModal";
import { DeploymentConfirmationModal } from "@/components/submit/DeploymentConfirmationModal";
import { SubmissionHistoryTable } from "@/components/submit/SubmissionHistoryTable";
import { SubmissionPnlChart } from "@/components/submit/SubmissionPnlChart";
import {
  ShieldCheck,
  Cpu,
  Send,
  CheckCircle2,
  TrendingUp,
  Activity,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Terminal,
} from "lucide-react";

export default function SubmitPage() {
  const [currentStep, setCurrentStep] = useState<number>(2);
  const [selectedRound, setSelectedRound] = useState<RoundOption>(ACTIVE_ROUNDS[0]); // Round 02 default
  const [code, setCode] = useState<string>(DEFAULT_PYTHON_STRATEGY);
  const [filename, setFilename] = useState<string>("my_strategy.py");
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<SubmissionVersionRecord[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [latestSubmission, setLatestSubmission] =
    useState<SubmissionVersionRecord | null>(null);

  // Load history on mount
  useEffect(() => {
    async function loadData() {
      const hist = await MercantileApi.submission.getHistory();
      setHistory(hist);
      
      // Restore active submission state so the graph persists across tab navigations
      const activeItem = hist.find((h) => h.status === "ACTIVE");
      if (activeItem) {
        setLatestSubmission(activeItem);
        setIsSubmitted(true);
      }
    }
    loadData();
  }, []);

  // Compute next version string
  const nextVersion = useMemo(() => {
    if (!history.length) return "v12";
    // Look at current active or highest version
    const activeItem = history.find((h) => h.status === "ACTIVE");
    if (activeItem) return activeItem.version;
    const highest = history.reduce((max, item) => {
      const num = parseInt(item.version.replace("v", ""), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 12);
    return `v${highest}`;
  }, [history]);

  const handleStartValidation = () => {
    setIsValidationModalOpen(true);
  };

  const handleValidationComplete = () => {
    setIsValidated(true);
    setCurrentStep(4); // Advance to submit step
  };

  const handleOpenSubmissionModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleExecuteDeployment = async (): Promise<SubmissionVersionRecord> => {
    // Generate next deployment version
    const highestNum = history.reduce((max, item) => {
      const num = parseInt(item.version.replace("v", ""), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 12);
    const newVersionTag = `v${highestNum + 1}`;

    const newRecord = await MercantileApi.submission.executeSubmission({
      version: newVersionTag,
      roundNumber: selectedRound.roundNumber,
      roundName: selectedRound.title,
      filename,
      code,
    });

    return newRecord;
  };

  const handleSuccessComplete = (record: SubmissionVersionRecord) => {
    setLatestSubmission(record);
    setIsSubmitted(true);
    setCurrentStep(5); // Advance to evaluate step

    // Update history table: mark previous as superseded and add new record at the top
    setHistory((prev) => [
      record,
      ...prev.map((item) =>
        item.status === "ACTIVE"
          ? { ...item, status: "SUPERSEDED" as const }
          : item
      ),
    ]);
  };

  return (
    <div className="w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="w-full pt-6 pb-8 mb-6 border-b border-white/8 select-none relative">
        <div className="absolute top-4 left-0 w-64 h-32 bg-amber-500/10 blur-[80px] pointer-events-none" />
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-amber-400 drop-shadow-[0_2px_24px_rgba(251,191,36,0.3)] font-sans relative z-10">
          Submission
        </h1>
        <p className="text-xl sm:text-2xl lg:text-3xl text-slate-200 font-normal leading-relaxed mt-3 max-w-4xl relative z-10">
          Compile, sandbox, and deploy your Python algorithmic trading models directly to the continuous auction matching arena.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Left Column: Editor, Actions, Evaluation */}
        <div className="space-y-6">

        {/* Step 2: Code Editor */}
        <StrategyCodeEditor
          code={code}
          onChangeCode={setCode}
          filename={filename}
          onChangeFilename={setFilename}
          isValidated={isValidated}
          onResetValidation={() => setIsValidated(false)}
        />

        {/* Action Bar (Validate & Submit) */}
        <div className="bg-gradient-to-r from-slate-900/80 via-[#0A0D14]/80 to-slate-900/80 border border-white/10 rounded-xl p-4 flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            {/* VALIDATE Button */}
            <button
              type="button"
              onClick={handleStartValidation}
              className={`relative flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-sans text-sm font-semibold transition-all duration-300 cursor-pointer overflow-hidden ${
                isValidated
                  ? "bg-[#1A1F2C] hover:bg-[#222836] text-slate-300 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  : "bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 shadow-[0_0_20px_rgba(251,191,36,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-amber-300/50"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>{isValidated ? "Re-validate Code" : "Validate Strategy"}</span>
            </button>

            {/* SUBMIT STRATEGY Button */}
            <button
              type="button"
              disabled={!isValidated}
              onClick={handleOpenSubmissionModal}
              className={`relative flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-sans text-sm font-semibold transition-all duration-300 ${
                isValidated
                  ? "bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-emerald-300/50 cursor-pointer"
                  : "bg-[#0A0D14] border border-white/5 text-slate-600 cursor-not-allowed shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Submit Strategy</span>
            </button>
          </div>

        {/* Post-Deployment Evaluation Panel (Shown when submitted) */}
        {isSubmitted && latestSubmission && (
          <div className="bg-gradient-to-br from-[#0A101D] to-[#06080F] border border-emerald-500/20 rounded-xl p-6 space-y-5 shadow-[0_0_40px_rgba(16,185,129,0.05)] relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm font-semibold text-emerald-400">
                      Active in Exchange Arena
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-sans font-semibold">
                      Live
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white font-sans mt-0.5">
                    Version {latestSubmission.version} ({latestSubmission.filename}) is executing orders
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/competition"
                  className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-sans text-sm font-semibold transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>View Live Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-sans">
              <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-slate-400 text-xs font-medium block mb-0.5">
                  Submission ID
                </span>
                <span className="text-white font-semibold">{latestSubmission.submissionId}</span>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-slate-400 text-xs font-medium block mb-0.5">
                  Initial Benchmark
                </span>
                <span className="text-emerald-400 font-semibold">
                  {latestSubmission.competitionScore} / 100
                </span>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-slate-400 text-xs font-medium block mb-0.5">
                  Backtest PnL
                </span>
                <span className="text-emerald-400 font-semibold">
                  +{latestSubmission.backtestPnl.toLocaleString()} Blitz
                </span>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-slate-400 text-xs font-medium block mb-0.5">
                  Execution Latency
                </span>
                <span className="text-cyan-400 font-semibold">
                  {latestSubmission.executionLatencyMs} ms / tick
                </span>
              </div>
            </div>
            
            {/* Embedded Backtest PnL Chart */}
            <SubmissionPnlChart submission={latestSubmission} />
          </div>
        )}
        </div>

        {/* Right Column: History Table */}
        <div className="w-full h-full flex flex-col">
          <SubmissionHistoryTable history={history} />
        </div>
      </div>

      {/* Validation Stepper Modal (Simulates: CHECKING SYNTAX, API, IMPORTS, RESOURCE LIMITS, READY) */}
      <ValidationEngineModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        onValidationComplete={handleValidationComplete}
      />

      {/* Deployment Confirmation Modal & Receipt */}
      <DeploymentConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        roundNumber={selectedRound.roundNumber}
        roundName={selectedRound.code}
        roundTitle={selectedRound.title}
        version={nextVersion}
        filename={filename}
        onConfirmDeployment={handleExecuteDeployment}
        onSuccessComplete={handleSuccessComplete}
      />
    </div>
  );
}
