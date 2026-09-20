"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";

export type StepId = 1 | 2 | 3 | 4 | 5;

interface StepItem {
  id: StepId;
  label: string;
  sublabel: string;
}

const STEPS: StepItem[] = [
  { id: 1, label: "SELECT ROUND", sublabel: "Target Arena" },
  { id: 2, label: "UPLOAD STRATEGY", sublabel: "Python Algorithm" },
  { id: 3, label: "VALIDATE", sublabel: "Pre-Flight Sandbox" },
  { id: 4, label: "SUBMIT", sublabel: "Deploy to Exchange" },
  { id: 5, label: "EVALUATE", sublabel: "Continuous Auction" },
];

interface SubmissionProgressStepperProps {
  currentStep: StepId;
  isValidated: boolean;
  isSubmitted: boolean;
  onSelectStep: (step: StepId) => void;
}

export const SubmissionProgressStepper: React.FC<SubmissionProgressStepperProps> = ({
  currentStep,
  isValidated,
  isSubmitted,
  onSelectStep,
}) => {
  return (
    <div className="w-full bg-[#080B12] border border-white/8 rounded-xl p-4 md:p-5 relative overflow-hidden">
      {/* Subtle top indicator beam */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
        {STEPS.map((step, idx) => {
          const isCompleted =
            step.id < currentStep ||
            (step.id === 3 && isValidated && currentStep > 3) ||
            (step.id === 4 && isSubmitted);
          const isCurrent = step.id === currentStep;
          const isLocked =
            (step.id === 3 && currentStep < 2) ||
            (step.id === 4 && !isValidated) ||
            (step.id === 5 && !isSubmitted);

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => {
                  if (!isLocked) onSelectStep(step.id);
                }}
                disabled={isLocked}
                className={`flex-1 w-full md:w-auto flex items-center gap-3 p-2.5 md:p-2 rounded-lg text-left transition-all ${
                  isCurrent
                    ? "bg-white/[0.05] border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                    : isCompleted
                    ? "bg-transparent hover:bg-white/[0.02] border border-white/5 cursor-pointer"
                    : isLocked
                    ? "opacity-40 cursor-not-allowed border border-transparent"
                    : "hover:bg-white/[0.02] border border-transparent cursor-pointer"
                }`}
              >
                {/* Step indicator circle / badge */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-semibold transition-all ${
                    isCurrent
                      ? "bg-[#D4AF37] text-black ring-4 ring-[#D4AF37]/20 font-bold"
                      : isCompleted
                      ? "bg-[#05CD99]/20 text-[#05CD99] border border-[#05CD99]/40"
                      : "bg-white/5 text-slate-400 border border-white/10"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <span>0{step.id}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-medium tracking-wide uppercase truncate ${
                        isCurrent
                          ? "text-white font-semibold"
                          : isCompleted
                          ? "text-slate-200"
                          : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono tracking-tight truncate">
                    {step.sublabel}
                  </div>
                </div>
              </button>

              {/* Step Connector arrow for md+ screens */}
              {idx < STEPS.length - 1 && (
                <div className="hidden md:flex items-center text-slate-600 px-1 shrink-0">
                  <div
                    className={`h-[1px] w-4 lg:w-8 transition-colors ${
                      isCompleted ? "bg-[#05CD99]/50" : "bg-white/10"
                    }`}
                  />
                  <ArrowRight className="w-3 h-3 -ml-1 text-slate-600" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
