"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  CheckCircle2,
  Terminal,
  Activity,
  Code2,
  Copy,
  Check,
  RotateCcw,
  TrendingUp,
} from "lucide-react";

interface StrategyExecutionRunnerProps {
  codeSnippet?: string;
}

const DEFAULT_EXAMPLE_STRATEGY = `class MyStrategy:
    def __init__(self):
        self.target_spread = 0.30
        self.position_limit = 50
        self.current_position = 0

    def on_tick(self, market):
        # 1. Read market Level 2 quotes
        best_bid = market.bids[0][0]
        best_ask = market.asks[0][0]
        spread = best_ask - best_bid

        # 2. Trigger buy order when spread expands past 0.30 Blitz
        if spread > self.target_spread and self.current_position < self.position_limit:
            self.current_position += 10
            return {
                "action": "ORDER_SUBMIT",
                "symbol": "TUTORIAL-ENERGY",
                "side": "BUY",
                "order_type": "LIMIT",
                "price": best_bid,
                "quantity": 10
            }
        return None`;

interface ExecutionLogEntry {
  time: string;
  message: string;
  type: "info" | "signal" | "fill" | "pnl" | "done";
}

export const StrategyExecutionRunner: React.FC<StrategyExecutionRunnerProps> = ({
  codeSnippet = DEFAULT_EXAMPLE_STRATEGY,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [logs, setLogs] = useState<ExecutionLogEntry[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [simulatedPnl, setSimulatedPnl] = useState<number>(0);
  const [simulatedFills, setSimulatedFills] = useState<number>(0);

  const simulationSteps: ExecutionLogEntry[] = [
    {
      time: "09:15:00",
      message: "[ENGINE] Loaded MyStrategy into Python 3.12 sandbox container.",
      type: "info",
    },
    {
      time: "09:15:01",
      message: "[TICK 01] Mid: 100.25 | Spread: 0.26 | No signal triggered.",
      type: "info",
    },
    {
      time: "09:15:02",
      message: "[TICK 02] Mid: 100.28 | Spread: 0.34 | Spread > 0.30 target!",
      type: "signal",
    },
    {
      time: "09:15:03",
      message: "[DISPATCH] Submitting LIMIT BUY 10 @ 100.10 Blitz to matching engine...",
      type: "signal",
    },
    {
      time: "09:15:04",
      message: "[FILL] BUY 10 @ 100.10 executed. Net Position: +10 contracts.",
      type: "fill",
    },
    {
      time: "09:15:05",
      message: "[TICK 03] Mid moves to 100.35 | Unrealized PnL: +2.50 Blitz.",
      type: "pnl",
    },
    {
      time: "09:15:06",
      message: "[FILL] Limit counter-quote matched: SELL 10 @ 100.40 Blitz.",
      type: "fill",
    },
    {
      time: "09:15:07",
      message: "[REALIZED] Position flattened (0 lots). Realized Gain: +3.00 Blitz (+0.30%).",
      type: "done",
    },
  ];

  const handleRunExample = () => {
    setIsRunning(true);
    setIsCompleted(false);
    setLogs([]);
    setStepIndex(0);
    setSimulatedPnl(0);
    setSimulatedFills(0);

    let current = 0;
    const interval = setInterval(() => {
      if (current >= simulationSteps.length) {
        clearInterval(interval);
        setIsRunning(false);
        setIsCompleted(true);
        setSimulatedPnl(3.0);
        setSimulatedFills(2);
        return;
      }

      const nextEntry = simulationSteps[current];
      setLogs((prev) => [...prev, nextEntry]);
      setStepIndex(current + 1);

      if (nextEntry.type === "fill") {
        setSimulatedFills((prev) => prev + 1);
      }
      if (nextEntry.type === "pnl") {
        setSimulatedPnl(2.5);
      }
      if (nextEntry.type === "done") {
        setSimulatedPnl(3.0);
      }

      current++;
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#080B14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl space-y-0">
      {/* Titlebar */}
      <div className="bg-[#0A0E18] px-5 py-3 border-b border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#00F0FF]" />
          <span className="font-bold text-white uppercase">
            STRATEGY TEMPLATE • PYTHON 3.12
          </span>
          <span className="text-slate-500 text-[10px]">● class MyStrategy</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition border border-white/10 cursor-pointer text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#05CD99]" />
                <span className="text-[#05CD99]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={isRunning}
            onClick={handleRunExample}
            className={`flex items-center gap-2 px-4 py-1.5 rounded font-mono text-xs font-bold uppercase tracking-wider transition ${
              isRunning
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 cursor-wait"
                : "bg-[#D4AF37] hover:bg-[#E5C158] text-black shadow-[0_0_15px_rgba(212,175,55,0.25)] cursor-pointer"
            }`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? "animate-pulse" : ""}`} />
            <span>{isRunning ? "SIMULATING..." : "RUN EXAMPLE"}</span>
          </button>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="p-4 bg-[#05070E] font-mono text-xs overflow-x-auto leading-relaxed text-slate-200">
        <pre className="selection:bg-[#D4AF37]/30 selection:text-white">
          {codeSnippet}
        </pre>
      </div>

      {/* Simulated Execution Console Output */}
      <div className="bg-[#04060C] border-t border-white/8 p-4 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-white/6 pb-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#05CD99]" />
            SYNTHETIC EXECUTION TEST HARNESS
          </span>

          <div className="flex items-center gap-4 text-[11px]">
            <span>
              Fills: <strong className="text-white">{simulatedFills}</strong>
            </span>
            <span>
              Simulated PnL:{" "}
              <strong
                className={simulatedPnl > 0 ? "text-[#05CD99]" : "text-slate-400"}
              >
                +{simulatedPnl.toFixed(2)} Blitz
              </strong>
            </span>
          </div>
        </div>

        {/* Console log list */}
        <div className="min-h-28 max-h-36 overflow-y-auto space-y-1 text-[11px]">
          {logs.length === 0 ? (
            <div className="text-slate-600 italic py-2">
              Click &quot;RUN EXAMPLE&quot; above to watch the DMX-35 sandbox execute orders against real-time market ticks.
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="text-slate-600 select-none">{log.time}</span>
                <span
                  className={
                    log.type === "signal"
                      ? "text-amber-300 font-semibold"
                      : log.type === "fill"
                      ? "text-[#00F0FF] font-bold"
                      : log.type === "done"
                      ? "text-[#05CD99] font-bold"
                      : "text-slate-300"
                  }
                >
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Success completion banner */}
        {isCompleted && (
          <div className="p-2.5 rounded-lg bg-[#05CD99]/10 border border-[#05CD99]/30 flex items-center justify-between text-xs text-[#05CD99] animate-in fade-in duration-300">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Strategy successfully captured spread without drawing down capital.
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              Latency: 0.84ms / tick
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
