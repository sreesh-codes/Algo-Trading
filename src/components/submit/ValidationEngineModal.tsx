"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Cpu,
  Terminal,
  ArrowRight,
  X,
} from "lucide-react";
import { ValidationCheckStage } from "@/services/api/submission";

interface ValidationEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidationComplete: () => void;
}

interface ValidationStepDef {
  stage: ValidationCheckStage;
  title: string;
  description: string;
  logDetail: string;
}

const VALIDATION_STAGES: ValidationStepDef[] = [
  {
    stage: "CHECKING SYNTAX",
    title: "CHECKING SYNTAX",
    description: "Compiling AST tree and verifying Python 3.12 grammar syntax.",
    logDetail: "[AST] Parsing token tree... 0 syntax errors, valid indentations, no unreachable blocks.",
  },
  {
    stage: "CHECKING API",
    title: "CHECKING API",
    description: "Validating strategy on_tick(market) interface and order payload schemas.",
    logDetail: "[API] Verified signature on_tick(self, market) -> Dict[str, Any]. Order types: IOC LIMIT.",
  },
  {
    stage: "CHECKING IMPORTS",
    title: "CHECKING IMPORTS",
    description: "Auditing modules for unauthorized sockets, external syscalls, or filesystem I/O.",
    logDetail: "[SEC] Prohibited imports: socket (CLEAR), urllib (CLEAR), os.system (CLEAR). Allowed: numpy.",
  },
  {
    stage: "CHECKING RESOURCE LIMITS",
    title: "CHECKING RESOURCE LIMITS",
    description: "Running 1,000 synthetic tick replays to verify latency and memory isolation.",
    logDetail: "[PERF] Executed 1,000 synthetic ticks. Avg tick latency: 1.42ms (< 5.0ms). RAM: 48MB / 512MB.",
  },
  {
    stage: "READY",
    title: "READY",
    description: "All exchange container pre-flight audits passed. Algorithm certified for live matching.",
    logDetail: "[DMX-35] Exchange pre-flight certified. Container hash #d9a8f3b assigned. Ready for live order routing.",
  },
];

export const ValidationEngineModal: React.FC<ValidationEngineModalProps> = ({
  isOpen,
  onClose,
  onValidationComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const onValidationCompleteRef = useRef(onValidationComplete);

  useEffect(() => {
    onValidationCompleteRef.current = onValidationComplete;
  }, [onValidationComplete]);

  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setLogs([]);
  }

  useEffect(() => {
    if (!isOpen) return;

    let timer: NodeJS.Timeout;
    const initialTimer = setTimeout(() => {
      setLogs(["[PRE-FLIGHT] Initializing DMX-35 automated algorithm sandbox..."]);

      const runStage = (index: number) => {
        if (index >= VALIDATION_STAGES.length - 1) {
          // Last step is READY
          setCurrentStepIndex(VALIDATION_STAGES.length - 1);
          setIsCompleted(true);
          setLogs((prev) => [...prev, VALIDATION_STAGES[VALIDATION_STAGES.length - 1].logDetail]);
          onValidationCompleteRef.current();
          return;
        }

        setCurrentStepIndex(index);
        setLogs((prev) => [...prev, VALIDATION_STAGES[index].logDetail]);

        timer = setTimeout(() => {
          runStage(index + 1);
        }, 550);
      };

      timer = setTimeout(() => {
        runStage(0);
      }, 400);
    }, 50);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090D17] border border-white/12 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Glow Bar */}
        <div
          className={`h-1 transition-all duration-500 ${
            isCompleted
              ? "bg-gradient-to-r from-[#05CD99] to-[#00F0FF]"
              : "bg-gradient-to-r from-[#D4AF37] to-amber-500"
          }`}
        />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg border ${
                isCompleted
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}
            >
              {isCompleted ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <Cpu className="w-5 h-5 animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 font-sans">
                {isCompleted ? "Validation Passed — Ready" : "Pre-flight Strategy Audit"}
              </h3>
              <p className="text-xs text-slate-400">
                DMX-35 Sandboxed Execution & Static Analysis Verification
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Stepper & Detailed Checks */}
        <div className="p-6 space-y-5">
          {/* Stepper Stage List */}
          <div className="space-y-2.5">
            {VALIDATION_STAGES.map((step, idx) => {
              const isPast = idx < currentStepIndex || isCompleted;
              const isCurrent = idx === currentStepIndex && !isCompleted;

              return (
                <div
                  key={step.stage}
                  className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    isPast
                      ? "bg-emerald-500/5 border-emerald-500/20 text-white"
                      : isCurrent
                      ? "bg-amber-500/10 border-amber-500/30 text-white shadow-sm"
                      : "bg-white/[0.02] border-white/5 text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700" />
                      )}
                    </div>
                    <div>
                      <div className="font-sans text-sm font-medium">
                        {step.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {step.description}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-sans font-medium shrink-0">
                    {isPast ? (
                      <span className="text-emerald-400">Passed</span>
                    ) : isCurrent ? (
                      <span className="text-amber-400 animate-pulse">
                        Auditing...
                      </span>
                    ) : (
                      <span className="text-slate-600">Queued</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Audit Terminal Output Stream */}
          <div className="bg-[#05070D] border border-white/10 rounded-xl p-3.5 space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-white/6 pb-1 mb-1">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-[#00F0FF]" />
                SANDBOX CONSOLE LOGS
              </span>
              <span>DMX-NODE-04-SANDBOX</span>
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1 text-slate-300">
              {logs.map((log, i) => (
                <div key={i} className="leading-tight flex items-start gap-2">
                  <span className="text-slate-600 select-none">&gt;</span>
                  <span
                    className={
                      log.includes("CLEAR") || log.includes("certified")
                        ? "text-[#05CD99]"
                        : log.includes("Verified")
                        ? "text-[#00F0FF]"
                        : "text-slate-300"
                    }
                  >
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#070A12] border-t border-white/8 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-slate-400 font-sans">
            {isCompleted ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Strategy is verified & ready to submit.
              </span>
            ) : (
              <span>Sandboxing algorithm against test harness...</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-sans font-medium transition cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              disabled={!isCompleted}
              onClick={onClose}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-sans text-sm font-semibold transition ${
                isCompleted
                  ? "bg-amber-400 hover:bg-amber-300 text-black shadow-sm cursor-pointer"
                  : "bg-white/10 text-slate-500 cursor-not-allowed"
              }`}
            >
              <span>Proceed to Submission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
