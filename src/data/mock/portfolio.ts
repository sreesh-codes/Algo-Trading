export interface Position {
  ticker: string;
  name: string;
  side: "LONG" | "SHORT";
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  marketValueBlitz: number;
  unrealizedPnLBlitz: number;
  unrealizedPnLPercent: number;
  marginUsedBlitz: number;
  liquidationPrice: number;
}

export interface EquityCurvePoint {
  date: string;
  equity: number;
  benchmark: number; // Dubai 2035 Index baseline
}

export interface UserPortfolio {
  teamName: string;
  rank: number;
  totalEquityBlitz: number;
  cashBalanceBlitz: number;
  marginUsedBlitz: number;
  marginAvailableBlitz: number;
  marginUtilizationPercent: number;
  realizedPnLBlitz: number;
  unrealizedPnLBlitz: number;
  dailyPnLBlitz: number;
  dailyPnLPercent: number;
  cumulativePnLBlitz: number;
  cumulativePnLPercent: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdownPercent: number;
  winRatePercent: number;
  totalTradesExecuted: number;
  positions: Position[];
  equityCurve: EquityCurvePoint[];
}

export const MOCK_USER_PORTFOLIO: UserPortfolio = {
  teamName: "Falcon Arbitrage DIFC",
  rank: 7,
  totalEquityBlitz: 6428950.50,
  cashBalanceBlitz: 4850200.00,
  marginUsedBlitz: 645120.00,
  marginAvailableBlitz: 4205080.00,
  marginUtilizationPercent: 13.3,
  realizedPnLBlitz: 1342600.50,
  unrealizedPnLBlitz: 86350.00,
  dailyPnLBlitz: 142390.00,
  dailyPnLPercent: 2.26,
  cumulativePnLBlitz: 1428950.50,
  cumulativePnLPercent: 28.58,
  sharpeRatio: 2.84,
  sortinoRatio: 3.45,
  maxDrawdownPercent: 4.12,
  winRatePercent: 58.6,
  totalTradesExecuted: 4280,
  positions: [
    {
      ticker: "SOL-MWH",
      name: "MBR Solar Megawatt-Hour Futures",
      side: "LONG",
      quantity: 1200,
      entryPrice: 371.20,
      currentPrice: 384.50,
      marketValueBlitz: 461400.00,
      unrealizedPnLBlitz: 15960.00,
      unrealizedPnLPercent: 3.58,
      marginUsedBlitz: 36912.00,
      liquidationPrice: 322.50
    },
    {
      ticker: "Q-FLOP",
      name: "DIFC Quantum Core Compute Credits",
      side: "SHORT",
      quantity: 350,
      entryPrice: 1445.00,
      currentPrice: 1420.00,
      marketValueBlitz: 497000.00,
      unrealizedPnLBlitz: 8750.00,
      unrealizedPnLPercent: 1.73,
      marginUsedBlitz: 59640.00,
      liquidationPrice: 1610.00
    },
    {
      ticker: "HYPER-DXB-AUH",
      name: "Dubai-Abu Dhabi Hyperloop Freight Slot",
      side: "LONG",
      quantity: 800,
      entryPrice: 813.20,
      currentPrice: 890.25,
      marketValueBlitz: 712200.00,
      unrealizedPnLBlitz: 61640.00,
      unrealizedPnLPercent: 9.47,
      marginUsedBlitz: 106830.00,
      liquidationPrice: 692.00
    }
  ],
  equityCurve: [
    { date: "Oct 01", equity: 5000000, benchmark: 5000000 },
    { date: "Oct 02", equity: 5082000, benchmark: 5020000 },
    { date: "Oct 03", equity: 5190000, benchmark: 5045000 },
    { date: "Oct 04", equity: 5165000, benchmark: 5060000 },
    { date: "Oct 05", equity: 5280000, benchmark: 5090000 },
    { date: "Oct 06", equity: 5395000, benchmark: 5120000 },
    { date: "Oct 07", equity: 5510000, benchmark: 5140000 },
    { date: "Oct 08", equity: 5470000, benchmark: 5165000 },
    { date: "Oct 09", equity: 5680000, benchmark: 5190000 },
    { date: "Oct 10", equity: 5820000, benchmark: 5210000 },
    { date: "Oct 11", equity: 5990000, benchmark: 5240000 },
    { date: "Oct 12", equity: 6120000, benchmark: 5280000 },
    { date: "Oct 13", equity: 6286000, benchmark: 5310000 },
    { date: "Oct 14", equity: 6428950, benchmark: 5340000 },
  ]
};
