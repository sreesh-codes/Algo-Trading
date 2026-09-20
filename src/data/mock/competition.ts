export interface RoundInfo {
  roundNumber: number;
  title: string;
  theme: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  status: "COMPLETED" | "ACTIVE" | "UPCOMING" | "LOCKED";
  eligibleAssets: string[];
  description: string;
  mechanics: string[];
  maxLeverage: string;
  benchmarks: {
    topPnL: string;
    medianSharpe: number;
    activeTeams: number;
  };
}

export interface CompetitionData {
  seasonTitle: string;
  edition: string;
  year: number;
  exchange: string;
  location: string;
  status: "REGISTRATION" | "ACTIVE" | "MAINTENANCE" | "COMPLETED";
  prizePoolBlitz: number;
  prizePoolFormatted: string;
  trophy: string;
  activeRound: number;
  totalRounds: number;
  timeRemainingSeconds: number; // For active round
  totalTeamsRegistered: number;
  totalTradesProcessed: number;
  rounds: RoundInfo[];
  rulesSummary: {
    languageSupport: string[];
    tickRateHz: number;
    maxOrdersPerSecond: number;
    liquidityRequirement: string;
    scoringFormula: string;
  };
}

export const MOCK_COMPETITION: CompetitionData = {
  seasonTitle: "The Solar Equinox",
  edition: "Season IV",
  year: 2035,
  exchange: "The Mercantile Exchange of Dubai (DMX-35)",
  location: "DIFC Hyper-Cryo Nexus, Dubai, UAE",
  status: "ACTIVE",
  prizePoolBlitz: 1500000,
  prizePoolFormatted: "1,500,000 Blitz",
  trophy: "The Sovereign Falcon of The Mercantile (Pure Titanium & 24K Gold)",
  activeRound: 3,
  totalRounds: 5,
  timeRemainingSeconds: 309600, // ~3 days 14 hours
  totalTeamsRegistered: 1840,
  totalTradesProcessed: 14892400,
  rounds: [
    {
      roundNumber: 1,
      title: "Al-Wasl Genesis",
      theme: "Solar Baseload & Desalination Arbitrage",
      subtitle: "Baseline liquidity & market-making algorithms",
      startDate: "2035-10-01T08:00:00Z",
      endDate: "2035-10-05T18:00:00Z",
      status: "COMPLETED",
      eligibleAssets: ["SOL-MWH", "EMIRATES-CARBON-V1"],
      description: "Establish continuous two-sided liquidity on baseload clean power during daylight peak generation cycles without violating exchange margin cushions.",
      mechanics: [
        "Continuous Level-2 limit order submission",
        "Passive bid-ask spread rebates (0.5 bps)",
        "Penalty for holding unhedged positions into night closure"
      ],
      maxLeverage: "5x",
      benchmarks: {
        topPnL: "+482,900 Blitz",
        medianSharpe: 1.82,
        activeTeams: 1840
      }
    },
    {
      roundNumber: 2,
      title: "Hyperloop Logistics",
      theme: "Pneumatic Freight Corridor Pricing",
      subtitle: "Spatial routing & latency cross-arbitrage",
      startDate: "2035-10-06T08:00:00Z",
      endDate: "2035-10-10T18:00:00Z",
      status: "COMPLETED",
      eligibleAssets: ["SOL-MWH", "HYPER-DXB-AUH", "CARGO-DRONE-INDEX"],
      description: "Exploit supply-chain bottlenecks between Jebel Ali container offloading and Abu Dhabi industrial hubs during unexpected atmospheric wind shears.",
      mechanics: [
        "Dynamic multi-leg routing orders",
        "Cross-corridor synthetic spread arbitrage",
        "Slot cancellation fee penalties"
      ],
      maxLeverage: "10x",
      benchmarks: {
        topPnL: "+894,150 Blitz",
        medianSharpe: 2.14,
        activeTeams: 1620
      }
    },
    {
      roundNumber: 3,
      title: "Quantum Grid Arbitrage",
      theme: "Cryogenic Compute Allocation & High-Volatility Hedging",
      subtitle: "Active Round: High-Frequency Qubit Scheduling",
      startDate: "2035-10-11T08:00:00Z",
      endDate: "2035-10-18T18:00:00Z",
      status: "ACTIVE",
      eligibleAssets: ["SOL-MWH", "Q-FLOP", "HYDRO-DXB", "NEO-GRAPHENE", "HYPER-DXB-AUH"],
      description: "DIFC Quantum clusters require massive energy cooling reserves. Compute credit prices fluctuate inversely with solar grid thermal peaks. Trade the energy-to-compute cross.",
      mechanics: [
        "Cross-commodity statistical pairs trading",
        "Dynamic sub-millisecond liquidity shocks",
        "Circuit breakers triggered at 12% intraday swing"
      ],
      maxLeverage: "15x",
      benchmarks: {
        topPnL: "+1,428,950 Blitz",
        medianSharpe: 2.84,
        activeTeams: 1410
      }
    },
    {
      roundNumber: 4,
      title: "Holo-Maritime & Sandstorm Shocks",
      theme: "Atmospheric Weather Volatility & Automated Ports",
      subtitle: "Unlocks in 3 days: Extreme Macro Event Modeling",
      startDate: "2035-10-19T08:00:00Z",
      endDate: "2035-10-24T18:00:00Z",
      status: "UPCOMING",
      eligibleAssets: ["HYDRO-DXB", "PALM-HORIZON", "CARGO-DRONE-INDEX", "EMIRATES-CARBON-V1"],
      description: "A simulated regional Category-3 shamal sandstorm will severely degrade aerial drone corridor visibility while boosting maritime and hydrogen tanker spot freight.",
      mechanics: [
        "Non-linear volatility surface fitting",
        "Event-driven NLP sentiment execution",
        "Liquidity blackouts under zero-visibility weather alerts"
      ],
      maxLeverage: "8x",
      benchmarks: {
        topPnL: "Pending",
        medianSharpe: 0,
        activeTeams: 1200
      }
    },
    {
      roundNumber: 5,
      title: "The Sovereign Consensus",
      theme: "The Grand Finale: Multi-Asset Liquidity Shockwave",
      subtitle: "Final 48-Hour Live Broadcast Tournament",
      startDate: "2035-10-26T00:00:00Z",
      endDate: "2035-10-28T00:00:00Z",
      status: "LOCKED",
      eligibleAssets: ["ALL 8 ASSETS UNLOCKED"],
      description: "The top 50 teams compete simultaneously on a live unified central limit order book with randomized sovereign capital injections, flash crashes, and algorithmic counter-parties.",
      mechanics: [
        "Full portfolio optimization across all asset classes",
        "Execution slippage realistic modeling",
        "Audited by Dubai Financial Services Authority (DFSA-35)"
      ],
      maxLeverage: "20x",
      benchmarks: {
        topPnL: "Locked",
        medianSharpe: 0,
        activeTeams: 50
      }
    }
  ],
  rulesSummary: {
    languageSupport: ["Python 3.12", "C++ 23", "Rust 1.82"],
    tickRateHz: 100,
    maxOrdersPerSecond: 250,
    liquidityRequirement: "Minimum 35% time-at-inside quote",
    scoringFormula: "Final Score = (Normalized Cumulative P&L × 0.60) + (Sharpe Ratio × 0.25) - (Max Drawdown Penalty × 0.15)"
  }
};
