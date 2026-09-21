export interface AdminOverviewMetrics {
  activeCompetition: string;
  seasonEdition: string;
  currentRound: string;
  roundNumber: number;
  roundStatus: "ACTIVE" | "PAUSED" | "COMPLETED" | "SCHEDULED";
  timeRemaining: string;
  teamsCount: number;
  teamsActiveBots: number;
  submissionsCount: number;
  submissionsEvaluating: number;
  runningBacktests: number;
  backtestThroughput: string;
  systemStatus: "OPTIMAL" | "DEGRADED" | "CRITICAL" | "MAINTENANCE";
  uptime: string;
  latencyMs: number;
}

export interface MarketShockTemplate {
  id: string;
  name: string;
  code: "VOLATILITY_SHOCK" | "LIQUIDITY_DROP" | "PRICE_SHOCK" | "CORRELATION_SHIFT" | "REGIME_CHANGE";
  category: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE";
  affectedAssets: string[];
  description: string;
  impactFormula: string;
  defaultDurationSec: number;
  intensityLabel: string;
}

export interface ActiveMarketShock {
  instanceId: string;
  templateId: string;
  name: string;
  code: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE";
  triggeredAt: string;
  remainingSec: number;
  totalDurationSec: number;
  intensityPercent: number;
  affectedAssets: string[];
  statusMessage: string;
}

export interface AdminSubmission {
  id: string;
  team: string;
  teamRank: number;
  version: string;
  timestamp: string;
  status: "DEPLOYED" | "EVALUATING" | "ACCEPTED" | "REJECTED" | "RUNTIME_ERROR";
  evaluation: string;
  sharpe: number | null;
  pnlBlitz: number | null;
  drawdownPercent: number | null;
  executionLatencyMs: number;
  commitHash: string;
  logDetails: string;
}

export interface SystemMonitorData {
  workers: {
    total: number;
    active: number;
    idle: number;
    cpuPercent: number;
    ramGb: number;
    maxRamGb: number;
    tempMilliKelvin: number;
  };
  queues: {
    name: string;
    topic: string;
    pendingCount: number;
    avgLatencyMs: number;
    status: "NOMINAL" | "ELEVATED" | "CONGESTED";
  }[];
  backtests: {
    runningJobs: number;
    queuedJobs: number;
    completedToday: number;
    avgDurationSec: number;
    peakThroughputPerMin: number;
  };
  activeUsers: {
    totalSessions: number;
    algorithmicBots: number;
    spectatorTerminals: number;
    activeAdminConsoles: number;
  };
  errorRate: {
    ratePercent: number;
    errorsLastHour: number;
    packetLossRate: number;
    recentIncidents: string[];
  };
}

export const INITIAL_ADMIN_METRICS: AdminOverviewMetrics = {
  activeCompetition: "DUBAI 2035 — THE MERCANTILE",
  seasonEdition: "Season IV Championship",
  currentRound: "ROUND 02: THE ARBITRAGE",
  roundNumber: 2,
  roundStatus: "ACTIVE",
  timeRemaining: "03:17:42",
  teamsCount: 24,
  teamsActiveBots: 24,
  submissionsCount: 142,
  submissionsEvaluating: 18,
  runningBacktests: 37,
  backtestThroughput: "148 jobs / min",
  systemStatus: "OPTIMAL",
  uptime: "99.994%",
  latencyMs: 0.38,
};

export const MARKET_SHOCK_TEMPLATES: MarketShockTemplate[] = [
  {
    id: "shock-volatility",
    name: "VOLATILITY SHOCK",
    code: "VOLATILITY_SHOCK",
    category: "DIFFUSION DYNAMICS",
    severity: "CRITICAL",
    affectedAssets: ["DUNE ENERGY", "NEXUS AI", "DIFC-100"],
    description: "Multiplies stochastic jump intensity (sigma * 3.5). Spreads widen 4x across continuous limit order books.",
    impactFormula: "σ_t = σ_0 × 3.5 + Poisson(λ=8.2)",
    defaultDurationSec: 60,
    intensityLabel: "+250% Jump Diffusion",
  },
  {
    id: "shock-liquidity",
    name: "LIQUIDITY DROP",
    code: "LIQUIDITY_DROP",
    category: "ORDER BOOK DEPTH",
    severity: "HIGH",
    affectedAssets: ["DUNE ENERGY", "DESERT HYDROGEN"],
    description: "Simulates sudden institutional market maker withdrawal. Flashes 60% of top-of-book depth away.",
    impactFormula: "Depth(Bid, Ask) × 0.40; Slippage +34 bps",
    defaultDurationSec: 45,
    intensityLabel: "-60% Top-of-Book Depth",
  },
  {
    id: "shock-price",
    name: "PRICE SHOCK",
    code: "PRICE_SHOCK",
    category: "EXOGENOUS DISPLACEMENT",
    severity: "CRITICAL",
    affectedAssets: ["DESERT HYDROGEN", "ORBIT LOGISTICS"],
    description: "Injects an instantaneous -8.4% price dislocation to evaluate strategy stop-loss and circuit execution.",
    impactFormula: "P_t = P_0 × 0.916 instantaneously",
    defaultDurationSec: 30,
    intensityLabel: "-8.4% Flash Gap",
  },
  {
    id: "shock-correlation",
    name: "CORRELATION SHIFT",
    code: "CORRELATION_SHIFT",
    category: "COVARIANCE MATRIX",
    severity: "HIGH",
    affectedAssets: ["DUNE ENERGY", "DESERT HYDROGEN", "NEXUS AI"],
    description: "Inverts the historical covariance matrix (ρ drops from +0.88 to -0.42), breaking statistical arbitrage hedges.",
    impactFormula: "Cov(Asset_A, Asset_B) × -0.50",
    defaultDurationSec: 90,
    intensityLabel: "Covariance Inversion (ρ: -0.42)",
  },
  {
    id: "shock-regime",
    name: "REGIME CHANGE",
    code: "REGIME_CHANGE",
    category: "MACRO REGIME",
    severity: "MODERATE",
    affectedAssets: ["DIFC-100", "NEXUS AI", "ORBIT LOGISTICS"],
    description: "Switches microstructure from Ornstein-Uhlenbeck mean-reverting drift to strong directional momentum trend.",
    impactFormula: "Ornstein-Uhlenbeck (θ=0.15) → Brownian Drift (μ=1.82)",
    defaultDurationSec: 120,
    intensityLabel: "Mean-Reverting → Directional Trend",
  },
];

export const INITIAL_SUBMISSIONS: AdminSubmission[] = [
  {
    id: "sub-142",
    team: "Quantum Desert",
    teamRank: 7,
    version: "v12.4",
    timestamp: "14:31:02 GST",
    status: "DEPLOYED",
    evaluation: "Sharpe 2.84 • PnL +1.42M Blitz • Certified",
    sharpe: 2.84,
    pnlBlitz: 1428950,
    drawdownPercent: 4.1,
    executionLatencyMs: 0.42,
    commitHash: "7a89f3c1",
    logDetails: "Docker container dmx-runner-qdesert:v12 initialized. Passed memory barrier check (64MB / 512MB limit). Latency nominal.",
  },
  {
    id: "sub-141",
    team: "Falcon Arbitrage",
    teamRank: 1,
    version: "v18.1",
    timestamp: "14:28:44 GST",
    status: "DEPLOYED",
    evaluation: "Sharpe 3.42 • PnL +2.84M Blitz • Certified",
    sharpe: 3.42,
    pnlBlitz: 2841200,
    drawdownPercent: 2.8,
    executionLatencyMs: 0.35,
    commitHash: "90fe21b8",
    logDetails: "Compiled Cython hot loop. Avellaneda-Stoikov inventory skew parameters validated. Zero rejected limit packets.",
  },
  {
    id: "sub-140",
    team: "Apex Alpha",
    teamRank: 2,
    version: "v14.0",
    timestamp: "14:25:19 GST",
    status: "EVALUATING",
    evaluation: "AST Analysis Passed • Simulating in Sandbox Pool",
    sharpe: null,
    pnlBlitz: null,
    drawdownPercent: null,
    executionLatencyMs: 0.38,
    commitHash: "c18a9942",
    logDetails: "AST Parser: 0 banned syscalls. Python 3.12 sandbox executing tick 48,200 / 100,000. Current mock Sharpe: 3.10.",
  },
  {
    id: "sub-139",
    team: "Emirates Quant Lab",
    teamRank: 3,
    version: "v09.3",
    timestamp: "14:19:50 GST",
    status: "ACCEPTED",
    evaluation: "Sharpe 3.08 • PnL +2.11M Blitz • Ready for Deployment",
    sharpe: 3.08,
    pnlBlitz: 2110500,
    drawdownPercent: 3.4,
    executionLatencyMs: 0.44,
    commitHash: "ee410da7",
    logDetails: "In-sample backtest verified against DMX benchmark. Circuit breaker trigger compliance confirmed at 8.0% threshold.",
  },
  {
    id: "sub-138",
    team: "Oasis Capital",
    teamRank: 4,
    version: "v11.2",
    timestamp: "14:12:08 GST",
    status: "DEPLOYED",
    evaluation: "Sharpe 2.91 • PnL +1.89M Blitz • Certified",
    sharpe: 2.91,
    pnlBlitz: 1894000,
    drawdownPercent: 3.9,
    executionLatencyMs: 0.49,
    commitHash: "23fa488b",
    logDetails: "Dual-leg statistical arbitrage model active across DUNE/HYDROGEN spread. Realized volatility tracking 11.2%.",
  },
  {
    id: "sub-137",
    team: "Hyperion Dynamics",
    teamRank: 12,
    version: "v07.1",
    timestamp: "14:04:33 GST",
    status: "REJECTED",
    evaluation: "Drawdown -12.4% exceeded max ceiling (10.0%)",
    sharpe: 1.12,
    pnlBlitz: -340200,
    drawdownPercent: 12.4,
    executionLatencyMs: 0.61,
    commitHash: "56d1089a",
    logDetails: "Risk Filter Exception: Maximum portfolio drawdown reached -12.4% at tick 82,104 during synthetic volatility test. Auto-liquidated.",
  },
  {
    id: "sub-136",
    team: "Vertex Algorithmic",
    teamRank: 8,
    version: "v08.0",
    timestamp: "13:58:12 GST",
    status: "ACCEPTED",
    evaluation: "Sharpe 2.65 • PnL +1.18M Blitz • Standby Queue",
    sharpe: 2.65,
    pnlBlitz: 1184900,
    drawdownPercent: 4.5,
    executionLatencyMs: 0.52,
    commitHash: "44ab2109",
    logDetails: "Strategy verified. Awaiting deployment slot in DMX cryogenic partition #4.",
  },
  {
    id: "sub-135",
    team: "Sovereign Quants",
    teamRank: 15,
    version: "v04.2",
    timestamp: "13:45:00 GST",
    status: "RUNTIME_ERROR",
    evaluation: "Timeout: on_tick() latency 4.82ms > 2.00ms limit",
    sharpe: null,
    pnlBlitz: null,
    drawdownPercent: null,
    executionLatencyMs: 4.82,
    commitHash: "bb891230",
    logDetails: "Execution Watchdog Exception: on_tick() computation exceeded 2.00ms SLA threshold (timed at 4.82ms on tick 1,248). O(n^2) nested loop detected.",
  },
  {
    id: "sub-134",
    team: "Gulf Stream Analytics",
    teamRank: 6,
    version: "v10.1",
    timestamp: "13:32:15 GST",
    status: "DEPLOYED",
    evaluation: "Sharpe 2.78 • PnL +1.34M Blitz • Certified",
    sharpe: 2.78,
    pnlBlitz: 1342000,
    drawdownPercent: 4.2,
    executionLatencyMs: 0.40,
    commitHash: "19fe45cc",
    logDetails: "High-frequency micro-spread taker bot operating within compliance thresholds.",
  },
  {
    id: "sub-133",
    team: "Desert Wind Trading",
    teamRank: 19,
    version: "v03.4",
    timestamp: "13:18:40 GST",
    status: "EVALUATING",
    evaluation: "Security sandbox scan in progress • Memory profile nominal",
    sharpe: null,
    pnlBlitz: null,
    drawdownPercent: null,
    executionLatencyMs: 0.65,
    commitHash: "9218ddef",
    logDetails: "Static Bytecode Scanner: 0 network socket requests. 0 filesystem writes. Replaying historical order book ticks 1-25,000.",
  },
];

export const INITIAL_SYSTEM_MONITOR: SystemMonitorData = {
  workers: {
    total: 0,
    active: 0,
    idle: 0,
    cpuPercent: 0,
    ramGb: 0,
    maxRamGb: 64.0,
    tempMilliKelvin: 0,
  },
  queues: [
    {
      name: "Order Matching Ingestion",
      topic: "dmx.orders.matching.live",
      pendingCount: 0,
      avgLatencyMs: 0,
      status: "NOMINAL",
    },
    {
      name: "Strategy Verification Pool",
      topic: "dmx.eval.strategies.sandbox",
      pendingCount: 0,
      avgLatencyMs: 0,
      status: "NOMINAL",
    },
    {
      name: "Backtesting Distributed Cluster",
      topic: "dmx.backtest.batch.compute",
      pendingCount: 0,
      avgLatencyMs: 0,
      status: "NOMINAL",
    },
  ],
  backtests: {
    runningJobs: 0,
    queuedJobs: 0,
    completedToday: 0,
    avgDurationSec: 0,
    peakThroughputPerMin: 0,
  },
  activeUsers: {
    totalSessions: 0,
    algorithmicBots: 0,
    spectatorTerminals: 0,
    activeAdminConsoles: 1,
  },
  errorRate: {
    ratePercent: 0,
    errorsLastHour: 0,
    packetLossRate: 0,
    recentIncidents: [
      "Systems initialized. Zero errors.",
    ],
  },
};
