"use client";

import React, { useState, useMemo } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import {
  Send,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Terminal,
  Filter,
  FileCode2,
  ExternalLink,
} from "lucide-react";
import { AdminSubmission } from "@/data/mock/admin";
import { Modal } from "@/components/ui/Modal";
import { clsx } from "clsx";

interface SubmissionsTableCardProps {
  submissions: AdminSubmission[];
}

export const SubmissionsTableCard: React.FC<SubmissionsTableCardProps> = ({
  submissions,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [inspectSubmission, setInspectSubmission] = useState<AdminSubmission | null>(null);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesSearch =
        sub.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.commitHash.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : sub.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchQuery, statusFilter]);

  const getStatusBadge = (status: AdminSubmission["status"]) => {
    switch (status) {
      case "DEPLOYED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold border border-[#05CD99]/40 bg-[#05CD99]/15 text-[#05CD99]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#05CD99] animate-pulse" />
            DEPLOYED
          </span>
        );
      case "EVALUATING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#D4AF37]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
            EVALUATING
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold border border-[#00F0FF]/40 bg-[#00F0FF]/15 text-[#00F0FF]">
            <CheckCircle2 size={11} />
            ACCEPTED
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold border border-[#EF4444]/40 bg-[#EF4444]/15 text-[#EF4444]">
            <XCircle size={11} />
            REJECTED
          </span>
        );
      case "RUNTIME_ERROR":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold border border-[#A855F7]/40 bg-[#A855F7]/15 text-[#A855F7]">
            <AlertCircle size={11} />
            RUNTIME ERROR
          </span>
        );
    }
  };

  return (
    <GlassPanel hudCorners className="p-5 space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Send size={18} className="text-[#D4AF37]" />
          <div>
            <h3 className="font-mono-tech text-sm font-bold text-white uppercase tracking-wider">
              Strategy Submissions & Evaluation Pipeline
            </h3>
            <p className="text-xs text-[#94A3B8] font-sans">
              Real-time audit log of team algorithm builds, AST analysis, risk verification, and containerized deployment.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748B]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team, version, commit..."
              className="pl-8 pr-3 py-1.5 rounded bg-black/50 border border-white/10 text-white font-mono-tech text-xs placeholder:text-[#64748B] focus:outline-none focus:border-[#D4AF37] w-52 transition-all"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="inline-flex p-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-mono-tech">
            {["ALL", "DEPLOYED", "EVALUATING", "ACCEPTED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={clsx(
                  "px-2 py-1 rounded transition-colors cursor-pointer",
                  statusFilter === status
                    ? "bg-[#D4AF37] text-black font-bold"
                    : "text-[#94A3B8] hover:text-white"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono-tech text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[#64748B] uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">TEAM</th>
              <th className="py-2.5 px-3">VERSION</th>
              <th className="py-2.5 px-3">TIMESTAMP</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3">EVALUATION</th>
              <th className="py-2.5 px-3 text-right">AUDIT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Team */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-[10px] text-[#94A3B8] font-mono">
                        #{String(sub.teamRank).padStart(2, "0")}
                      </span>
                      <span className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        {sub.team}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#64748B] flex items-center gap-1 mt-0.5 font-mono">
                      <span>git:</span>
                      <span className="text-[#94A3B8]">{sub.commitHash}</span>
                    </div>
                  </td>

                  {/* Version */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-black/50 border border-white/10 text-white font-mono font-semibold">
                      {sub.version}
                    </span>
                  </td>

                  {/* Timestamp */}
                  <td className="py-3 px-3 text-[#CBD5E1] tabular-nums">
                    {sub.timestamp}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">{getStatusBadge(sub.status)}</td>

                  {/* Evaluation */}
                  <td className="py-3 px-3">
                    <div className="text-xs text-[#CBD5E1] max-w-md truncate" title={sub.evaluation}>
                      {sub.evaluation}
                    </div>
                    <div className="text-[10px] text-[#64748B] flex items-center gap-2 mt-0.5">
                      {sub.sharpe && <span>Sharpe: <strong className="text-white">{sub.sharpe.toFixed(2)}</strong></span>}
                      {sub.drawdownPercent && <span>MaxDD: <strong className="text-[#EF4444]">-{sub.drawdownPercent.toFixed(1)}%</strong></span>}
                      <span>Latency: <strong className="text-[#00F0FF]">{sub.executionLatencyMs}ms</strong></span>
                    </div>
                  </td>

                  {/* Action / Inspect */}
                  <td className="py-3 px-3 text-right">
                    <Button
                      variant="ghost"
                      onClick={() => setInspectSubmission(sub)}
                      icon={<Terminal size={12} />}
                      className="text-[10px] py-1 px-2.5 uppercase font-mono-tech border border-white/10 hover:border-[#00F0FF]"
                    >
                      Trace
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#64748B]">
                  No strategy submissions match the search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono-tech text-[#64748B]">
        <span>
          SHOWING {filteredSubmissions.length} OF {submissions.length} PIPELINE SUBMISSIONS
        </span>
        <span className="text-[#05CD99]">DMX AST ENGINE: PYTHON 3.12 COMPLIANT</span>
      </div>

      {/* Inspect Sandbox Trace Modal */}
      {inspectSubmission && (
        <Modal
          isOpen={true}
          onClose={() => setInspectSubmission(null)}
          title={`STRATEGY AUDIT: ${inspectSubmission.team} (${inspectSubmission.version})`}
          subtitle={`Commit Hash: ${inspectSubmission.commitHash} • Submitted: ${inspectSubmission.timestamp}`}
          maxWidth="xl"
        >
          <div className="space-y-4 font-mono-tech text-xs">
            {/* Status overview */}
            <div className="p-3.5 rounded-lg bg-black/60 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#64748B]">VALIDATION OUTCOME</div>
                <div className="font-bold text-white mt-0.5">
                  {inspectSubmission.evaluation}
                </div>
              </div>
              <div>{getStatusBadge(inspectSubmission.status)}</div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded bg-black/40 border border-white/5">
                <span className="text-[10px] text-[#64748B]">SHARPE RATIO</span>
                <div className="text-sm font-bold text-[#D4AF37] mt-0.5">
                  {inspectSubmission.sharpe ? inspectSubmission.sharpe.toFixed(2) : "N/A"}
                </div>
              </div>
              <div className="p-2.5 rounded bg-black/40 border border-white/5">
                <span className="text-[10px] text-[#64748B]">SIMULATED P&L</span>
                <div className="text-sm font-bold text-[#05CD99] mt-0.5">
                  {inspectSubmission.pnlBlitz ? `+${inspectSubmission.pnlBlitz.toLocaleString()} Blitz` : "PENDING"}
                </div>
              </div>
              <div className="p-2.5 rounded bg-black/40 border border-white/5">
                <span className="text-[10px] text-[#64748B]">LOOP LATENCY</span>
                <div className="text-sm font-bold text-[#00F0FF] mt-0.5">
                  {inspectSubmission.executionLatencyMs} ms
                </div>
              </div>
            </div>

            {/* Sandbox Log Output */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase">
                Container Sandbox Log Output:
              </span>
              <div className="p-3 rounded-lg bg-black/80 border border-white/10 font-mono text-[11px] text-[#CBD5E1] leading-relaxed">
                {inspectSubmission.logDetails}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="secondary"
                onClick={() => setInspectSubmission(null)}
                className="text-xs uppercase font-mono-tech"
              >
                Close Audit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </GlassPanel>
  );
};
