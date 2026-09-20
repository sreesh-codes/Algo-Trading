export interface ProfileEquityPoint {
  date: string;
  step: number;
  equity: number;
  benchmark: number;
  drawdown: number;
  dailyPnl: number;
}

export interface RoundPerformanceItem {
  roundId: string;
  title: string;
  subtitle: string;
  status: "COMPLETED" | "ACTIVE" | "UPCOMING" | "CHAMPIONSHIP";
  pnlBlitz: number;
  pnlPercent: number;
  score: number;
  rank: string;
  sharpe: number;
  tradesCount: number;
}

export interface ProfileSubmissionItem {
  version: string;
  filename: string;
  status: "ACTIVE" | "SUPERSEDED" | "BENCHMARKED";
  submittedAt: string;
  relativeTime: string;
  backtestPnl: number;
  sharpe: number;
  commitHash: string;
  latencyMs: number;
}

export interface QuantAchievement {
  id: string;
  title: string;
  category: string;
  description: string;
  criteria: string;
  unlockedDate: string;
  verificationHash: string;
  tier: "GOLD" | "PLATINUM" | "CYAN" | "EMERALD";
}

export interface TeamProfileData {
  teamName: string;
  teamId: string;
  rank: string;
  score: string;
  numericalScore: number;
  institution: string;
  division: string;
  registrationDate: string;
  containerId: string;
  language: string;
  metrics: {
    totalPnlBlitz: number;
    returnPercent: number;
    sharpe: number;
    maxDrawdownPercent: number;
    winRatePercent: number;
    turnoverRate: string;
  };
  roundPerformance: RoundPerformanceItem[];
  submissions: ProfileSubmissionItem[];
  achievements: QuantAchievement[];
  equityCurve: ProfileEquityPoint[];
}

// Generate 36 realistic equity curve points from 1,000,000 Blitz to 2,428,950 Blitz
function generateProfileEquityCurve(): ProfileEquityPoint[] {
  const points: ProfileEquityPoint[] = [];
  const startCapital = 1000000;
  const targetEnd = 2428950;
  const steps = 36;
  let currentEquity = startCapital;
  let peak = startCapital;

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    // Market trajectory + realistic volatility wave
    const baseline = startCapital + (targetEnd - startCapital) * Math.pow(progress, 0.9);
    const noise = Math.sin(i * 0.8) * 35000 + Math.cos(i * 1.6) * 18000;
    currentEquity = i === 0 ? startCapital : Math.round(baseline + noise);
    if (i === steps) currentEquity = targetEnd;

    peak = Math.max(peak, currentEquity);
    const dd = peak > 0 ? +(((peak - currentEquity) / peak) * 100).toFixed(2) : 0;
    const dailyDelta = i === 0 ? 0 : currentEquity - (points[i - 1]?.equity || startCapital);

    // Baseline benchmark (DIFC-100 benchmark index up ~12.4%)
    const bench = Math.round(startCapital * (1 + 0.124 * progress + Math.sin(i * 0.4) * 0.02));

    const day = Math.min(30, Math.floor(i * 0.85) + 1);
    const dateStr = `2035.04.${String(day).padStart(2, "0")}`;

    points.push({
      date: dateStr,
      step: i,
      equity: currentEquity,
      benchmark: bench,
      drawdown: -dd,
      dailyPnl: Math.round(dailyDelta),
    });
  }

  return points;
}

export const MOCK_PROFILE_DATA: TeamProfileData = {
  teamName: "QUANTUM DESERT",
  teamId: "DMX-QD-07",
  rank: "#07",
  score: "18,421",
  numericalScore: 18421,
  institution: "DIFC Academy of Algorithmic Finance",
  division: "Tier-1 Quantitative Institutional Arena",
  registrationDate: "2035.01.12",
  containerId: "DMX-DOCKER-NODE-07A",
  language: "Python 3.12 / C++ C-API",
  metrics: {
    totalPnlBlitz: 1428950,
    returnPercent: 28.58,
    sharpe: 2.84,
    maxDrawdownPercent: 4.12,
    winRatePercent: 64.2,
    turnoverRate: "4.8x / session",
  },
  roundPerformance: [],
  submissions: [],
  achievements: [],
  equityCurve: generateProfileEquityCurve(),
};
