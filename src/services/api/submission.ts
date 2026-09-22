export interface SubmissionVersionRecord {
  version: string; // e.g. "v12", "v11"
  submissionId: string; // e.g. "DMX-SUB-2035-R02-8492"
  submittedAt: string; // e.g. "2035-04-17 14:18:22 GST"
  relativeTime: string; // e.g. "14 mins ago"
  roundNumber: number; // e.g. 2
  roundName: string; // e.g. "Round 02 — The Arbitrage"
  filename: string; // e.g. "falcon_arbitrage_v12.py"
  status: "ACTIVE" | "BENCHMARKED" | "SUPERSEDED" | "EVALUATING" | "FAILED";
  backtestPnl: number; // e.g. +248500
  competitionScore: number; // e.g. 94.2
  sharpeRatio: number; // e.g. 3.42
  maxDrawdown: number; // e.g. 4.12%
  executionLatencyMs: number; // e.g. 1.8 ms
  commitHash: string; // e.g. "9a7f31c"
  auditSummary: string;
}

export type ValidationCheckStage =
  | "IDLE"
  | "CHECKING SYNTAX"
  | "CHECKING API"
  | "CHECKING IMPORTS"
  | "CHECKING RESOURCE LIMITS"
  | "READY"
  | "ERROR";

export interface ValidationDetail {
  stage: ValidationCheckStage;
  label: string;
  detail: string;
  status: "pending" | "running" | "passed" | "failed";
}

export interface RoundOption {
  roundNumber: number;
  code: string;
  title: string;
  theme: string;
  status: "ACTIVE" | "COMPLETED" | "UPCOMING";
  remainingTime: string;
  contractPairs: string[];
  maxLeverage: number;
  orderLimitPerSec: number;
  circuitBreakerPct: number;
}

export const ACTIVE_ROUNDS: RoundOption[] = [
  {
    roundNumber: 2,
    code: "ROUND 02",
    title: "THE ARBITRAGE",
    theme: "DUNE / DIFC-100 High-Frequency Synthetic Parity",
    status: "ACTIVE",
    remainingTime: "03:17:42",
    contractPairs: ["DUNE-ENERGY", "DIFC-100", "NEXUS-AI"],
    maxLeverage: 10,
    orderLimitPerSec: 250,
    circuitBreakerPct: 8.0,
  },
  {
    roundNumber: 1,
    code: "ROUND 01",
    title: "THE SYNTHETIC DAWN",
    theme: "Baseload Spot & Power Grid Mean Reversion",
    status: "COMPLETED",
    remainingTime: "Concluded",
    contractPairs: ["SOL-MWH", "HYD-KG"],
    maxLeverage: 5,
    orderLimitPerSec: 100,
    circuitBreakerPct: 12.0,
  },
  {
    roundNumber: 3,
    code: "ROUND 03",
    title: "QUANTUM LIQUIDITY MATRIX",
    theme: "Cross-District High Velocity Automated Market Making",
    status: "UPCOMING",
    remainingTime: "Opens in 18h",
    contractPairs: ["ORBIT-LOG", "Q-FLOP", "DUNE-ENERGY"],
    maxLeverage: 15,
    orderLimitPerSec: 500,
    circuitBreakerPct: 6.0,
  },
];

export const INITIAL_SUBMISSION_HISTORY: SubmissionVersionRecord[] = [];

export const DEFAULT_PYTHON_STRATEGY = `"""
DUBAI 2035 — THE MERCANTILE
Round 02: The Arbitrage
Strategy: Statistical Multi-Asset Pair Arbitrage
DMX Engine Interface Version: 3.5.2-GA
"""

import numpy as np
from typing import Dict, Any, Optional
from mercantile_sdk.strategy import Strategy

class MyStrategy(Strategy):
    """
    Continuous Auction Arbitrage Strategy
    Monitors high-frequency order book imbalances across DUNE ENERGY and DIFC-100.
    """

    def __init__(self):
        # Risk & Allocation Limits
        self.target_spread: float = 0.45          # Blitz minimum threshold
        self.position_limit: int = 100            # Max allowable net contracts
        self.z_score_threshold: float = 2.15       # Entry trigger
        self.stop_loss_pct: float = 0.015         # 1.5% circuit protection
        
        # State tracking
        self.current_position: int = 0
        self.recent_spreads: list = []
        self.lookback_window: int = 40
        self.total_fills: int = 0

    def on_tick(self, market: Any) -> Optional[Dict[str, Any]]:
        """
        Executed on every incoming market tick from the DMX matching engine.
        Latency SLA: Execution must complete within <= 5.0 milliseconds.
        """
        # 1. Extract continuous order book quotes
        bids = market.bids  # [[price, size], ...]
        asks = market.asks  # [[price, size], ...]

        if not bids or not asks:
            return None

        best_bid = bids[0][0]
        best_ask = asks[0][0]
        mid_price = (best_bid + best_ask) / 2.0
        current_spread = best_ask - best_bid

        # 2. Update rolling statistics
        self.recent_spreads.append(current_spread)
        if len(self.recent_spreads) > self.lookback_window:
            self.recent_spreads.pop(0)

        mean_spread = float(np.mean(self.recent_spreads))
        std_spread = float(np.std(self.recent_spreads)) or 1e-4

        z_score = (current_spread - mean_spread) / std_spread

        # 3. Decision Logic & Signal Generation
        # Detect artificial spread expansion indicating temporary liquidity vacuum
        if z_score > self.z_score_threshold and self.current_position < self.position_limit:
            order_size = min(10, self.position_limit - self.current_position)
            self.current_position += order_size
            self.total_fills += 1
            return {
                "action": "ORDER_SUBMIT",
                "symbol": "DUNE-ENERGY",
                "side": "BUY",
                "order_type": "LIMIT",
                "price": round(best_bid + 0.02, 2),
                "quantity": order_size,
                "urgency": "IOC"  # Immediate-or-Cancel
            }

        elif z_score < -self.z_score_threshold and self.current_position > -self.position_limit:
            order_size = min(10, self.position_limit + self.current_position)
            self.current_position -= order_size
            self.total_fills += 1
            return {
                "action": "ORDER_SUBMIT",
                "symbol": "DUNE-ENERGY",
                "side": "SELL",
                "order_type": "LIMIT",
                "price": round(best_ask - 0.02, 2),
                "quantity": order_size,
                "urgency": "IOC"
            }

        return None
`;

const delay = <T>(data: T, ms = 60): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const SubmissionApi = {
  async getRounds(): Promise<RoundOption[]> {
    return delay(ACTIVE_ROUNDS);
  },

  async getHistory(): Promise<SubmissionVersionRecord[]> {
    try {
      const res = await fetch('/api/submissions');
      if (!res.ok) {
        console.error("Failed to fetch history");
        return [];
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching history:", error);
      return [];
    }
  },

  async getNextVersionNumber(history: SubmissionVersionRecord[]): Promise<string> {
    const highestNum = history.reduce((max, item) => {
      const num = parseInt(item.version.replace("v", ""), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 12);
    return `v${highestNum + 1}`;
  },

  async executeSubmission(params: {
    version: string;
    roundNumber: number;
    roundName: string;
    filename: string;
    code: string;
  }): Promise<SubmissionVersionRecord> {
    
    // 1. Submit the code
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceCode: params.code,
        dataset: "NEXUS_AI",
        symbol: "NEXUS_AI"
      })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to submit strategy");
    }
    
    const data = await res.json();
    const jobId = data.jobId;
    
    // 2. Poll for results
    while (true) {
      await delay(null, 1500);
      const pollRes = await fetch(`/api/backtests/${jobId}`);
      if (!pollRes.ok) throw new Error("Failed to poll backtest status");
      
      const pollData = await pollRes.json();
      
      if (pollData.status === 'COMPLETED' && pollData.result) {
        const result = pollData.result;
        
        const now = new Date();
        const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(
          now.getDate()
        ).padStart(2, "0")} — ${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")} GST`;

        return {
          version: params.version,
          submissionId: pollData.id,
          submittedAt: formattedDate,
          relativeTime: "Just now",
          roundNumber: params.roundNumber,
          roundName: params.roundName,
          filename: params.filename,
          status: "ACTIVE",
          backtestPnl: result.realizedPnl + result.unrealizedPnl,
          competitionScore: Math.max(0, 100 - (result.maxDrawdown / 100)), // Dummy score for now
          sharpeRatio: 0, // Placeholder
          maxDrawdown: result.maxDrawdown,
          executionLatencyMs: result.runtime, // using total runtime as proxy
          commitHash: pollData.id.substring(pollData.id.length - 7),
          auditSummary: `Exchange container executed successfully. Generated ${result.tradeCount} trades.`,
          // We attach the raw results payload so the UI can graph it
          rawResult: result
        } as SubmissionVersionRecord & { rawResult: any };
      } else if (pollData.status === 'FAILED') {
        throw new Error(`Strategy Execution Failed: ${pollData.error}`);
      }
    }
  },
};
