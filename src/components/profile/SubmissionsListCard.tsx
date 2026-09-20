"use client";

import React from "react";
import { ProfileSubmissionItem } from "@/data/mock/profile";
import { FileCode2, History, CheckCircle2, Clock, GitCommit } from "lucide-react";

interface SubmissionsListCardProps {
  submissions: ProfileSubmissionItem[];
}

export const SubmissionsListCard: React.FC<SubmissionsListCardProps> = ({ submissions }) => {
  return (
    <div className="w-full bg-[#080B14] border border-white/10 rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/8 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Strategy Submissions Archive
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {submissions.length} VERSIONS LOGGED
        </span>
      </div>

      <div className="space-y-2.5 font-mono text-xs">
        {submissions.map((sub) => {
          const isActive = sub.status === "ACTIVE";

          return (
            <div
              key={sub.version}
              className={`p-3.5 rounded-xl border transition-all ${
                isActive
                  ? "bg-[#05CD99]/[0.04] border-[#05CD99]/35 shadow-[0_0_15px_rgba(5,205,153,0.08)]"
                  : "bg-[#05070E] border-white/6 hover:border-white/15"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`font-black text-sm tracking-wider ${
                      isActive ? "text-[#05CD99]" : "text-white"
                    }`}
                  >
                    {sub.version}
                  </span>

                  <span className="text-slate-300 flex items-center gap-1.5 text-xs font-medium">
                    <FileCode2 className="w-3.5 h-3.5 text-slate-500" />
                    {sub.filename}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                      isActive
                        ? "bg-[#05CD99]/15 border-[#05CD99]/30 text-[#05CD99]"
                        : "bg-white/5 border-white/10 text-slate-500"
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span>
                    PnL:{" "}
                    <strong className="text-[#05CD99] tabular-nums">
                      +{sub.backtestPnl.toLocaleString()} Blitz
                    </strong>
                  </span>
                  <span>
                    SR: <strong className="text-white">{sub.sharpe.toFixed(2)}</strong>
                  </span>
                  <span className="hidden md:inline">
                    Latency: <strong className="text-[#00F0FF]">{sub.latencyMs}ms</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 mt-2 border-t border-white/5">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {sub.submittedAt} ({sub.relativeTime})
                </span>
                <span className="flex items-center gap-1 font-mono text-slate-500">
                  <GitCommit className="w-3 h-3" />
                  #{sub.commitHash}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
