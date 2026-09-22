"use client";

import React, { useMemo } from "react";
import { SubmissionVersionRecord } from "@/services/api/submission";

interface SubmissionPnlChartProps {
  submission?: SubmissionVersionRecord & { rawResult?: any };
}

export function SubmissionPnlChart({ submission }: SubmissionPnlChartProps) {
  const data = useMemo(() => {
    if (submission?.rawResult?.equityCurve && Array.isArray(submission.rawResult.equityCurve) && submission.rawResult.equityCurve.length > 0) {
      return submission.rawResult.equityCurve.map((val: any) => Number(val.pnl ?? val.equity ?? 0));
    }
    // Fallback if no real data
    let pnl = 0;
    const curve = [pnl];
    for (let i = 0; i < 40; i++) {
      pnl += Math.random() * 6000 + 1500;
      curve.push(pnl);
    }
    return curve;
  }, [submission]);

  const width = 600;
  const height = 120;
  const max = Math.max(...data);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data
    .map((val: number, i: number) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height * 0.9); // 10% padding top
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPoints = `${points} ${width},${height} 0,${height}`;

  return (
    <div className="w-full mt-5 bg-black/40 border border-white/10 rounded-xl p-4 sm:p-5 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] sm:text-xs text-slate-400 font-mono uppercase tracking-wider">
          Simulated Backtest PnL Projection
        </span>
        <span className="text-xs font-mono font-bold text-[#05CD99]">
          +{(max / 1000).toFixed(1)}k Blitz Peak
        </span>
      </div>
      <div className="flex">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between items-end pr-3 pb-6 pt-2 text-[10px] text-slate-500 font-sans font-medium w-16 shrink-0">
          <span>{max > 1000 ? `${(max / 1000).toFixed(1)}k` : max.toFixed(0)}</span>
          <span>{((max + min) / 2 > 1000) ? `${(((max + min) / 2) / 1000).toFixed(1)}k` : ((max + min) / 2).toFixed(0)}</span>
          <span>0</span>
        </div>

        {/* Chart Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* The SVG Graph */}
          <div className="h-[100px] sm:h-[140px] w-full relative border-l border-b border-slate-700">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34D399" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#34D399" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Horizontal Grid Lines */}
              <line x1="0" y1={height * 0.1} x2={width} y2={height * 0.1} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1={height * 0.55} x2={width} y2={height * 0.55} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1={height} x2={width} y2={height} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

              <polygon points={areaPoints} fill="url(#pnlGrad)" />
              <polyline
                fill="none"
                stroke="#34D399"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                className="animate-draw-line"
              />
            </svg>
          </div>
          
          {/* X-Axis Labels */}
          <div className="flex justify-between items-center pt-2 text-[10px] text-slate-500 font-sans font-medium">
            <span>Tick 0</span>
            <span>Tick 20</span>
            <span>Tick 40</span>
          </div>
        </div>
      </div>
    </div>
  );
}
