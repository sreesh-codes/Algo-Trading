export interface EquityPoint {
  step: number;
  equity: number;
}

export interface LeaderboardEntry {
  rank: number;
  prevRank: number;
  rankDelta: number;
  teamName: string;
  institution: string;
  country: string;
  countryCode: string;
  score: number;
  cumulativePnLBlitz: number;
  cumulativePnLPercent: number;
  sharpeRatio: number;
  maxDrawdownPercent: number;
  sortinoRatio: number;
  calmarRatio: number;
  winRate: number;
  dailyVolatility: number;
  language: "Python" | "C++" | "Rust";
  roundScores: {
    r1: number;
    r2: number;
    r3: number;
    finalProjected: number;
  };
  trend: number[]; // 8-10 points for sparkline
  equityCurve: EquityPoint[];
  status: "QUALIFIED" | "WARNING" | "ELIMINATED";
  isCurrentUser: boolean;
  strategyStyle: string;
  lastOrderTime: string;
}

// Generate realistic pseudo equity curve
function generateEquityCurve(startCapital: number, finalCapital: number, volatility: number, steps = 18): EquityPoint[] {
  const curve: EquityPoint[] = [{ step: 0, equity: startCapital }];
  const totalGrowth = finalCapital - startCapital;
  
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    // Base trajectory + sinusoidal noise
    const noise = Math.sin(i * 1.7) * volatility * startCapital * 0.08;
    const current = Math.round(startCapital + totalGrowth * Math.pow(progress, 0.95) + noise);
    curve.push({ step: i, equity: Math.max(startCapital * 0.9, current) });
  }
  curve[curve.length - 1].equity = finalCapital;
  return curve;
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [];
