"use client";

import React, { useState } from "react";
import { SubmissionVersionRecord } from "@/services/api/submission";
import {
  History,
  ChevronDown,
  ChevronUp,
  Search,
  Code2,
} from "lucide-react";

interface SubmissionHistoryTableProps {
  history: SubmissionVersionRecord[];
  onSelectVersionToLoad?: (record: SubmissionVersionRecord) => void;
}

export const SubmissionHistoryTable: React.FC<SubmissionHistoryTableProps> = ({
  history,
  onSelectVersionToLoad,
}) => {
  const [filterRound, setFilterRound] = useState<number | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    if (filterRound !== "ALL" && item.roundNumber !== filterRound) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.version.toLowerCase().includes(q) ||
        item.submissionId.toLowerCase().includes(q) ||
        item.filename.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-[#0A0E1A] to-[#05080F] border border-white/10 rounded-xl overflow-hidden space-y-0 shadow-2xl relative">
      <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Table Header / Filters */}
      <div className="p-4 md:p-5 border-b border-white/8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100 font-sans">
              Submission History
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Audit log of deployed algorithm versions and simulation scoring.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Round filter */}
          <div className="flex items-center gap-1 bg-[#050811] p-1 rounded-lg border border-white/8 text-xs font-mono">
            <button
              type="button"
              onClick={() => setFilterRound("ALL")}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                filterRound === "ALL"
                  ? "bg-white/10 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ALL
            </button>
            <button
              type="button"
              onClick={() => setFilterRound(2)}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                filterRound === 2
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ROUND 02
            </button>
            <button
              type="button"
              onClick={() => setFilterRound(1)}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                filterRound === 1
                  ? "bg-white/10 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ROUND 01
            </button>
          </div>

          {/* Quick search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter version / ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#050811] border border-white/8 text-white text-xs font-mono focus:border-[#D4AF37] outline-none w-36 sm:w-44"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left border-collapse font-sans text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/[0.02] text-slate-400 font-medium">
              <th className="py-3 px-4">Version</th>
              <th className="py-3 px-4">Submitted</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Backtest PnL</th>
              <th className="py-3 px-4 text-right">Competition Score</th>
              <th className="py-3 px-4 text-center w-12">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredHistory.map((row) => {
              const isActive = row.status === "ACTIVE";
              const isBenchmarked = row.status === "BENCHMARKED";
              const isExpanded = expandedId === row.submissionId;

              return (
                <React.Fragment key={row.submissionId}>
                  <tr
                    className={`hover:bg-gradient-to-r hover:from-white/[0.03] hover:to-transparent group transition-all duration-300 ${
                      isActive ? "bg-gradient-to-r from-[#05CD99]/[0.05] to-transparent shadow-[inset_2px_0_0_#05CD99]" : ""
                    }`}
                  >
                    {/* VERSION */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm tracking-wider ${
                            isActive
                              ? "text-[#05CD99]"
                              : isBenchmarked
                              ? "text-[#D4AF37]"
                              : "text-white"
                          }`}
                        >
                          {row.version}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({row.filename})
                        </span>
                      </div>
                    </td>

                    {/* SUBMITTED */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{row.relativeTime}</div>
                      <div className="text-[10px] text-slate-500">{row.submittedAt}</div>
                    </td>

                    {/* STATUS */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : isBenchmarked
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-slate-800/80 text-slate-400 border border-slate-700/50"
                        }`}
                      >
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        )}
                        {row.status}
                      </span>
                    </td>

                    {/* BACKTEST PNL */}
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`font-semibold tabular-nums text-xs ${
                          row.backtestPnl >= 0 ? "text-[#05CD99]" : "text-rose-400"
                        }`}
                      >
                        {row.backtestPnl >= 0 ? "+" : ""}
                        {row.backtestPnl.toLocaleString()} Blitz
                      </span>
                    </td>

                    {/* COMPETITION SCORE */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${
                              row.competitionScore >= 90
                                ? "bg-[#05CD99]"
                                : row.competitionScore >= 80
                                ? "bg-[#D4AF37]"
                                : "bg-blue-400"
                            }`}
                            style={{ width: `${row.competitionScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-white tabular-nums">
                          {row.competitionScore.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-500">/100</span>
                      </div>
                    </td>

                    {/* EXPAND TOGGLE */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleExpand(row.submissionId)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                        title="View audit logs and parameters"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Audit Log Drawer */}
                  {isExpanded && (
                    <tr className="bg-[#05070E]/80 border-y border-white/5">
                      <td colSpan={6} className="py-3.5 px-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                          <div>
                            <span className="text-slate-500 text-[10px] block uppercase">
                              SUBMISSION ID
                            </span>
                            <span className="text-white font-semibold">
                              {row.submissionId}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block uppercase">
                              SHARPE / DRAWDOWN
                            </span>
                            <span className="text-slate-200">
                              SR: <strong className="text-[#05CD99]">{row.sharpeRatio}</strong> | Max DD: {row.maxDrawdown}%
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block uppercase">
                              TICK LATENCY
                            </span>
                            <span className="text-[#00F0FF]">{row.executionLatencyMs} ms</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block uppercase">
                              COMMIT DIGEST
                            </span>
                            <span className="text-slate-300">#{row.commitHash}</span>
                          </div>

                          <div className="md:col-span-4 bg-black/40 p-2.5 rounded border border-white/5 text-[11px] text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div>
                              <strong className="text-slate-400 uppercase text-[10px] block mb-1">
                                Container Audit Summary
                              </strong>
                              {row.auditSummary}
                            </div>
                            {onSelectVersionToLoad && (
                              <button
                                type="button"
                                onClick={() => onSelectVersionToLoad(row)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] text-xs font-mono font-semibold rounded border border-[#D4AF37]/30 transition-colors whitespace-nowrap self-start md:self-auto"
                              >
                                <Code2 className="w-3.5 h-3.5" />
                                LOAD TO EDITOR
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Telemetry */}
      <div className="p-3 bg-[#060811] border-t border-white/6 flex items-center justify-between text-[11px] font-mono text-slate-400 px-4">
        <span>
          Showing <strong className="text-white">{filteredHistory.length}</strong> deployment records
        </span>
        <span className="text-[#D4AF37]">
          Active Version: {history[0]?.version || "None"}
        </span>
      </div>
    </div>
  );
};
