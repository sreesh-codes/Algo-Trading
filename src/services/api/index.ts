import { MOCK_COMPETITION, CompetitionData, RoundInfo } from "@/data/mock/competition";
import { MOCK_ASSETS, AssetContract } from "@/data/mock/assets";
import { MOCK_SYSTEM_OVERVIEW, MOCK_ORDER_BOOKS, MarketSystemOverview, OrderBook } from "@/data/mock/markets";
import { MOCK_LEADERBOARD, LeaderboardEntry } from "@/data/mock/leaderboard";
import { MOCK_USER_PORTFOLIO, UserPortfolio } from "@/data/mock/portfolio";
import { MOCK_RECENT_TRADES, ExecutedTrade } from "@/data/mock/trades";
import { MOCK_EVENTS, MarketEvent } from "@/data/mock/events";
import { MOCK_RESEARCH_PAPERS, MOCK_DATASETS, MOCK_STARTER_STRATEGIES, ResearchPaper, HistoricalDataset, StarterStrategy } from "@/data/mock/research";
import { MOCK_TEAM_PROFILE, TeamProfile, SubmissionRecord } from "@/data/mock/teams";
import { ResearchApi } from "@/services/api/research";
import { SubmissionApi } from "@/services/api/submission";
import { IntelligenceApi } from "@/services/api/intelligence";

// Configurable delay to simulate realistic micro-latency (can be set to 0 in testing)
const SIMULATED_LATENCY_MS = 60;

const delay = <T>(data: T, ms = SIMULATED_LATENCY_MS): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

/**
 * Institutional Trading API Client
 * Designed to seamlessly switch between local mock data and FastAPI endpoints.
 */
export const MercantileApi = {
  // Competition Details
  async getCompetition(): Promise<CompetitionData> {
    return delay(MOCK_COMPETITION);
  },

  async getRound(roundNumber: number): Promise<RoundInfo | undefined> {
    const round = MOCK_COMPETITION.rounds.find((r) => r.roundNumber === roundNumber);
    return delay(round);
  },

  // Markets & Asset Contracts
  async getMarketOverview(): Promise<MarketSystemOverview> {
    return delay(MOCK_SYSTEM_OVERVIEW);
  },

  async getAssets(): Promise<AssetContract[]> {
    return delay(MOCK_ASSETS);
  },

  async getAssetByTicker(identifier: string): Promise<AssetContract | undefined> {
    const cleanId = identifier.trim().toLowerCase();
    const asset = MOCK_ASSETS.find(
      (a) =>
        a.ticker.toLowerCase() === cleanId ||
        a.slug.toLowerCase() === cleanId ||
        a.name.toLowerCase().replace(/\s+/g, "-") === cleanId ||
        a.name.toLowerCase() === cleanId
    );
    return delay(asset);
  },

  async getOrderBook(identifier: string): Promise<OrderBook | undefined> {
    const cleanId = identifier.trim().toUpperCase();
    // Resolve if slug was passed
    const asset = MOCK_ASSETS.find(
      (a) =>
        a.ticker.toUpperCase() === cleanId ||
        a.slug.toUpperCase() === cleanId ||
        a.name.toUpperCase().replace(/\s+/g, "-") === cleanId
    );
    const ticker = asset ? asset.ticker : cleanId;

    const book = MOCK_ORDER_BOOKS[ticker] || {
      ticker: ticker,
      timestamp: new Date().toISOString(),
      lastPrice: 100,
      bids: [
        { price: 99.8, size: 100, total: 100, depthPercent: 40 },
        { price: 99.6, size: 250, total: 350, depthPercent: 75 },
      ],
      asks: [
        { price: 100.2, size: 110, total: 110, depthPercent: 45 },
        { price: 100.4, size: 230, total: 340, depthPercent: 70 },
      ]
    };
    return delay(book);
  },

  // Global Competition Leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return delay(MOCK_LEADERBOARD);
  },

  // Current Team Portfolio
  async getPortfolio(): Promise<UserPortfolio> {
    return delay(MOCK_USER_PORTFOLIO);
  },

  // Executed Trades Tape
  async getRecentTrades(identifier?: string): Promise<ExecutedTrade[]> {
    if (identifier) {
      const cleanId = identifier.trim().toUpperCase();
      const asset = MOCK_ASSETS.find(
        (a) =>
          a.ticker.toUpperCase() === cleanId ||
          a.slug.toUpperCase() === cleanId ||
          a.name.toUpperCase().replace(/\s+/g, "-") === cleanId
      );
      const ticker = asset ? asset.ticker : cleanId;

      const filtered = MOCK_RECENT_TRADES.filter(
        (t) => t.ticker.toUpperCase() === ticker
      );
      return delay(filtered.length > 0 ? filtered : MOCK_RECENT_TRADES.slice(0, 6));
    }
    return delay(MOCK_RECENT_TRADES);
  },

  // Real-time Breaking Intelligence & Events
  async getEvents(): Promise<MarketEvent[]> {
    return delay(MOCK_EVENTS);
  },

  // Research, Datasets, and Starter Bots
  async getResearchPapers(): Promise<ResearchPaper[]> {
    return delay(MOCK_RESEARCH_PAPERS);
  },

  async getDatasets(): Promise<HistoricalDataset[]> {
    return delay(MOCK_DATASETS);
  },

  async getStarterStrategies(): Promise<StarterStrategy[]> {
    return delay(MOCK_STARTER_STRATEGIES);
  },

  // Team HQ & Submissions
  async getTeamProfile(): Promise<TeamProfile> {
    return delay(MOCK_TEAM_PROFILE);
  },

  async submitAlgorithm(submission: {
    roundNumber: number;
    filename: string;
    code: string;
    language: string;
  }): Promise<{ success: boolean; submissionId: string; benchmarkScore: number }> {
    // Deterministic simulation response
    const newRecord: SubmissionRecord = {
      submissionId: `SUB-R${submission.roundNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
      roundNumber: submission.roundNumber,
      timestamp: "Just now",
      filename: submission.filename,
      language: submission.language,
      status: "ACTIVE",
      benchmarkScore: Math.round((88 + Math.random() * 8) * 10) / 10,
      sharpeRatio: Math.round((2.4 + Math.random() * 0.8) * 100) / 100,
      simulatedPnLBlitz: Math.round(1200000 + Math.random() * 400000),
      commitHash: Math.random().toString(16).substring(2, 9),
      logSummary: "Automated test runner executed 14,000 synthetic ticks. 0 fatal exceptions."
    };
    return delay(
      {
        success: true,
        submissionId: newRecord.submissionId,
        benchmarkScore: newRecord.benchmarkScore,
      },
      250
    );
  },

  // Backtesting Simulation Runner
  async runBacktest(params: {
    strategyId: string;
    ticker: string;
    startDate: string;
    endDate: string;
    initialCapital: number;
    leverage: number;
  }): Promise<{
    strategyName: string;
    sharpeRatio: number;
    sortinoRatio: number;
    totalPnLBlitz: number;
    returnPercent: number;
    maxDrawdownPercent: number;
    winRatePercent: number;
    totalTrades: number;
    profitFactor: number;
    trades: Array<{
      id: string;
      timestamp: string;
      type: "BUY" | "SELL";
      price: number;
      qty: number;
      pnl: number;
    }>;
    equityCurve: Array<{ step: number; equity: number }>;
  }> {
    // Generate deterministic backtest simulation curve
    const steps = 40;
    let currentEquity = params.initialCapital;
    const curve = [{ step: 0, equity: currentEquity }];
    const trades = [];

    for (let i = 1; i <= steps; i++) {
      const delta = (Math.sin(i * 0.4) * 0.02 + 0.008 + (Math.random() * 0.02 - 0.009)) * currentEquity * (params.leverage * 0.5);
      currentEquity += delta;
      curve.push({ step: i, equity: Math.round(currentEquity) });

      if (i % 5 === 0) {
        trades.push({
          id: `BT-TRD-${i}`,
          timestamp: `Step ${i}`,
          type: (delta > 0 ? "BUY" : "SELL") as "BUY" | "SELL",
          price: Math.round(380 + Math.sin(i) * 15),
          qty: 50,
          pnl: Math.round(delta),
        });
      }
    }

    const totalPnL = currentEquity - params.initialCapital;
    const returnPercent = (totalPnL / params.initialCapital) * 100;

    return delay({
      strategyName: params.strategyId,
      sharpeRatio: 2.76,
      sortinoRatio: 3.22,
      totalPnLBlitz: Math.round(totalPnL),
      returnPercent: Math.round(returnPercent * 100) / 100,
      maxDrawdownPercent: 3.84,
      winRatePercent: 64.2,
      totalTrades: 124,
      profitFactor: 2.18,
      trades,
      equityCurve: curve,
    }, 450);
  },

  // Research Quantitative Telemetry & Analytics
  research: ResearchApi,

  // Strategy Submission & Deployment Pipeline
  submission: SubmissionApi,

  // Narrative Intelligence & Shock Telemetry
  intelligence: IntelligenceApi,
};
