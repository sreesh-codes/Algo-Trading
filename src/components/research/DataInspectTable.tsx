"use client";

import React, { useState } from "react";
import { Table, Download, ChevronLeft, ChevronRight, X, Copy, Check } from "lucide-react";
import { ResearchTimeseriesPoint } from "@/services/api/research";

interface DataInspectTableProps {
  points: ResearchTimeseriesPoint[];
  assetTicker: string;
  onClose: () => void;
  onExportCsv: () => void;
}

export function DataInspectTable({
  points,
  assetTicker,
  onClose,
  onExportCsv,
}: DataInspectTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const pageSize = 15;
  const totalPages = Math.ceil(points.length / pageSize);

  const paginatedPoints = points.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCopyHead = () => {
    const headRows = points
      .slice(0, 5)
      .map(
        (p) =>
          `${p.timestamp},${p.close},${p.volume},${p.returnPct},${p.spreadBlitz},${p.orderImbalance}`
      )
      .join("\n");
    navigator.clipboard.writeText(`timestamp,close,volume,return_pct,spread_blitz,order_imbalance\n${headRows}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0b101d]/95 border border-cyan-500/30 rounded-xl p-4 sm:p-5 backdrop-blur-md select-none space-y-3 shadow-2xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-cyan-400" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-sans">
              Raw Continuous Observation Inspector — {assetTicker}
            </h3>
            <span className="text-[11px] text-gray-400 font-sans">
              Showing {paginatedPoints.length} of {points.length} sampled frames (Page {currentPage} of {totalPages})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyHead}
            className="text-[11px] px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white transition-colors font-mono flex items-center gap-1"
            title="Copy first 5 rows to clipboard as CSV"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy Head (5 rows)"}</span>
          </button>

          <button
            onClick={onExportCsv}
            className="text-[11px] px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition-colors font-mono flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse font-mono">
          <thead>
            <tr className="text-[10px] text-gray-400 border-b border-white/10 uppercase tracking-wider font-sans">
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2">Timestamp (GST)</th>
              <th className="py-2 px-2 text-right">Close (Blitz)</th>
              <th className="py-2 px-2 text-right">High</th>
              <th className="py-2 px-2 text-right">Low</th>
              <th className="py-2 px-2 text-right">Return (%)</th>
              <th className="py-2 px-2 text-right">Volume</th>
              <th className="py-2 px-2 text-right">Spread (Blitz)</th>
              <th className="py-2 px-2 text-right">Spread (bps)</th>
              <th className="py-2 px-2 text-right">Imbalance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[11px] tabular-nums">
            {paginatedPoints.map((p) => {
              const isPositive = p.returnPct >= 0;
              return (
                <tr key={p.index} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 px-2 text-gray-500">{p.index + 1}</td>
                  <td className="py-2 px-2 text-gray-300">
                    {p.dateStr} {p.timeStr}
                  </td>
                  <td className="py-2 px-2 text-right font-semibold text-white">
                    {p.close.toFixed(2)}
                  </td>
                  <td className="py-2 px-2 text-right text-gray-400">{p.high.toFixed(2)}</td>
                  <td className="py-2 px-2 text-right text-gray-400">{p.low.toFixed(2)}</td>
                  <td
                    className={`py-2 px-2 text-right font-semibold ${
                      isPositive ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {p.returnPct.toFixed(3)}%
                  </td>
                  <td className="py-2 px-2 text-right text-gray-300">
                    {p.volume.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-right text-cyan-300">
                    {p.spreadBlitz.toFixed(2)}
                  </td>
                  <td className="py-2 px-2 text-right text-gray-400">
                    {p.spreadBps.toFixed(1)}
                  </td>
                  <td
                    className={`py-2 px-2 text-right font-medium ${
                      p.orderImbalance >= 0 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {p.orderImbalance >= 0 ? "+" : ""}
                    {p.orderImbalance.toFixed(3)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-gray-400 font-sans">
        <div>
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, points.length)} of {points.length} frames
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 rounded bg-white/5 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-white">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 rounded bg-white/5 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
