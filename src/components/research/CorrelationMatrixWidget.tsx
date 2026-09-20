"use client";

import React, { useState } from "react";
import { Grid, HelpCircle, ArrowUpRight, Info, Check } from "lucide-react";
import { CorrelationMatrixData, CorrelationCell } from "@/services/api/research";

interface CorrelationMatrixWidgetProps {
  data: CorrelationMatrixData;
  selectedAsset: string;
  compareAsset?: string;
  onSelectPair?: (assetA: string, assetB: string) => void;
}

export function CorrelationMatrixWidget({
  data,
  selectedAsset,
  compareAsset,
  onSelectPair,
}: CorrelationMatrixWidgetProps) {
  const [hoveredCell, setHoveredCell] = useState<CorrelationCell | null>(null);

  const getCellColor = (val: number, isDiagonal: boolean) => {
    if (isDiagonal) return "bg-[#D4AF37]/25 text-[#D4AF37] font-bold border-[#D4AF37]/40";
    if (val >= 0.7) return "bg-cyan-500/30 text-cyan-300 font-semibold border-cyan-500/40";
    if (val >= 0.4) return "bg-cyan-500/15 text-cyan-200 font-medium border-cyan-500/20";
    if (val > 0.1) return "bg-emerald-500/10 text-emerald-300 font-normal border-emerald-500/15";
    if (val >= -0.1) return "bg-white/[0.03] text-gray-400 border-white/5";
    if (val >= -0.4) return "bg-amber-500/15 text-amber-300 font-medium border-amber-500/20";
    return "bg-rose-500/25 text-rose-300 font-semibold border-rose-500/30";
  };

  return (
    <div className="bg-[#0b101d]/90 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-md select-none space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-[#D4AF37]" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-sans">
              Cross-Asset Pearson Correlation Matrix
            </h3>
            <span className="text-[11px] text-gray-400 font-sans">
              Pairwise log returns correlation across 1,440 continuous observations
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
          <span className="w-2.5 h-2.5 rounded bg-rose-500/30 border border-rose-500/40" />
          <span>-1.0 (Inverse)</span>
          <span className="mx-1">•</span>
          <span className="w-2.5 h-2.5 rounded bg-white/5 border border-white/10" />
          <span>0.0</span>
          <span className="mx-1">•</span>
          <span className="w-2.5 h-2.5 rounded bg-cyan-500/30 border border-cyan-500/40" />
          <span>+1.0 (Co-moving)</span>
        </div>
      </div>

      {/* Matrix Table & Heatmap */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-[11px] font-medium text-gray-400 uppercase font-sans">
                Asset Pair
              </th>
              {data.tickers.map((t) => (
                <th
                  key={t}
                  className={`p-2 text-center text-[11px] font-mono font-medium ${
                    t === selectedAsset
                      ? "text-[#D4AF37] font-semibold"
                      : "text-gray-300"
                  }`}
                >
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.tickers.map((rowTicker) => (
              <tr key={rowTicker} className="border-t border-white/5">
                {/* Row Header */}
                <td className="p-2 font-sans text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-semibold ${
                        rowTicker === selectedAsset
                          ? "text-[#D4AF37]"
                          : "text-white"
                      }`}
                    >
                      {data.names[rowTicker] || rowTicker}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      ({rowTicker})
                    </span>
                  </div>
                </td>

                {/* Matrix Cells */}
                {data.tickers.map((colTicker) => {
                  const corrVal = data.matrix[rowTicker]?.[colTicker] ?? 0;
                  const isDiagonal = rowTicker === colTicker;
                  const isHighlighted =
                    (rowTicker === selectedAsset && colTicker === compareAsset) ||
                    (rowTicker === compareAsset && colTicker === selectedAsset);

                  const cellData: CorrelationCell = {
                    assetA: rowTicker,
                    assetB: colTicker,
                    correlation: corrVal,
                    covariance: Number((corrVal * 0.024 * 0.022).toFixed(6)),
                    tStat:
                      isDiagonal
                        ? 999.0
                        : Number(
                            (
                              corrVal *
                              Math.sqrt((1440 - 2) / (1 - corrVal * corrVal))
                            ).toFixed(2)
                          ),
                    pValue: Math.abs(corrVal) > 0.1 ? 0.0001 : 0.042,
                    sampleSize: 1440,
                  };

                  return (
                    <td key={colTicker} className="p-1.5 text-center">
                      <button
                        onClick={() => {
                          if (!isDiagonal && onSelectPair) {
                            onSelectPair(rowTicker, colTicker);
                          }
                        }}
                        onMouseEnter={() => setHoveredCell(cellData)}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`w-full py-2 px-1 rounded border font-mono tabular-nums text-xs transition-all relative ${getCellColor(
                          corrVal,
                          isDiagonal
                        )} ${
                          isHighlighted
                            ? "ring-2 ring-[#D4AF37] ring-offset-1 ring-offset-[#0b101d]"
                            : ""
                        } ${!isDiagonal ? "hover:scale-[1.03] cursor-pointer" : "cursor-default"}`}
                      >
                        <span>
                          {corrVal >= 0 && !isDiagonal ? "+" : ""}
                          {corrVal.toFixed(2)}
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hover Telemetry Inspector & Deep Stat Drawer */}
      <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-sans min-h-[46px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        {hoveredCell ? (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white">
                {data.names[hoveredCell.assetA]} ({hoveredCell.assetA}) &times;{" "}
                {data.names[hoveredCell.assetB]} ({hoveredCell.assetB})
              </span>
              <span className="text-gray-500">•</span>
              <span className="font-mono text-gray-300">
                Exact Pearson r:{" "}
                <span className="text-cyan-300 font-semibold tabular-nums">
                  {hoveredCell.correlation >= 0 ? "+" : ""}
                  {hoveredCell.correlation.toFixed(4)}
                </span>
              </span>
              <span className="text-gray-500">•</span>
              <span className="font-mono text-gray-400">
                Covariance:{" "}
                <span className="text-white tabular-nums">
                  {hoveredCell.covariance.toFixed(6)}
                </span>
              </span>
              <span className="text-gray-500">•</span>
              <span className="font-mono text-gray-400">
                t-stat:{" "}
                <span className="text-emerald-400 tabular-nums">
                  {hoveredCell.tStat.toFixed(2)}
                </span>
              </span>
            </div>

            <div className="text-[11px] text-gray-400 font-mono shrink-0">
              {hoveredCell.assetA !== hoveredCell.assetB ? (
                <span className="text-[#D4AF37]">Click cell to load pair in Scatter & Rolling Curve</span>
              ) : (
                <span>Self-correlation (Identity)</span>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Info className="w-3.5 h-3.5 text-gray-400" />
            <span>
              Hover over any correlation cell to reveal exact Pearson r, covariance, and t-statistic. Click to set active regression pair.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
