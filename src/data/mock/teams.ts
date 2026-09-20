export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  specialization: string;
  lead: boolean;
}

export interface SubmissionRecord {
  submissionId: string;
  roundNumber: number;
  timestamp: string;
  filename: string;
  language: string;
  status: "ACTIVE" | "BENCHMARKED" | "FAILED" | "REPLACED";
  benchmarkScore: number;
  sharpeRatio: number;
  simulatedPnLBlitz: number;
  commitHash: string;
  logSummary: string;
}

export interface TeamProfile {
  teamId: string;
  teamName: string;
  tagline: string;
  institution: string;
  division: string;
  country: string;
  globalRank: number;
  registrationDate: string;
  apiKey: string;
  apiSecretMasked: string;
  members: TeamMember[];
  submissions: SubmissionRecord[];
  achievements: {
    id: string;
    title: string;
    description: string;
    unlockedAt: string;
    badgeIcon: string;
  }[];
}

export const MOCK_TEAM_PROFILE: TeamProfile = {
  teamId: "TEAM-DXB-007",
  teamName: "Falcon Arbitrage DIFC",
  tagline: "Sub-millisecond latency arbitrage across clean grid and quantum derivatives",
  institution: "DIFC Academy of Finance & Technology",
  division: "Institutional Quant Division",
  country: "United Arab Emirates",
  globalRank: 7,
  registrationDate: "September 24, 2035",
  apiKey: "dmx_live_pk_9a87f2e104b2c89d5f78",
  apiSecretMasked: "dmx_sec_••••••••••••••••••••••••34f9",
  members: [
    {
      id: "MEM-01",
      name: "Rashid Al-Kindi",
      role: "Team Lead & Lead Strategist",
      avatarInitials: "RA",
      specialization: "Stochastic Control & Energy Microstructure",
      lead: true
    },
    {
      id: "MEM-02",
      name: "Zainab Mir",
      role: "Senior Quantitative Developer",
      avatarInitials: "ZM",
      specialization: "Low-Latency Execution & C++ Core",
      lead: false
    },
    {
      id: "MEM-03",
      name: "Vikram Malhotra",
      role: "Machine Learning Researcher",
      avatarInitials: "VM",
      specialization: "Deep RL & Order Flow Imbalance",
      lead: false
    }
  ],
  submissions: [
    {
      submissionId: "SUB-R3-8891",
      roundNumber: 3,
      timestamp: "2035-10-13 19:42 GST",
      filename: "quantum_grid_arb_v3.2.py",
      language: "Python 3.12",
      status: "ACTIVE",
      benchmarkScore: 91.8,
      sharpeRatio: 2.84,
      simulatedPnLBlitz: 1428950,
      commitHash: "c4f810a",
      logSummary: "Validated across 12,000 synthetic tick frames. Circuit breaker cushion: 4.8%. 0 syntax errors."
    },
    {
      submissionId: "SUB-R3-8840",
      roundNumber: 3,
      timestamp: "2035-10-12 11:15 GST",
      filename: "quantum_grid_arb_v3.1.py",
      language: "Python 3.12",
      status: "REPLACED",
      benchmarkScore: 88.4,
      sharpeRatio: 2.61,
      simulatedPnLBlitz: 1190400,
      commitHash: "b7e2019",
      logSummary: "Replaced by v3.2 due to improved inventory decay parameter."
    },
    {
      submissionId: "SUB-R2-7102",
      roundNumber: 2,
      timestamp: "2035-10-09 17:50 GST",
      filename: "hyperloop_corridor_fast.py",
      language: "Python 3.12",
      status: "BENCHMARKED",
      benchmarkScore: 88.4,
      sharpeRatio: 2.45,
      simulatedPnLBlitz: 894150,
      commitHash: "a1c9004",
      logSummary: "Round 2 Final locked submission. Ranked #10 globally in Round 2."
    },
    {
      submissionId: "SUB-R1-4019",
      roundNumber: 1,
      timestamp: "2035-10-04 18:00 GST",
      filename: "solar_baseload_maker.py",
      language: "Python 3.12",
      status: "BENCHMARKED",
      benchmarkScore: 85.0,
      sharpeRatio: 2.20,
      simulatedPnLBlitz: 482900,
      commitHash: "90ff12e",
      logSummary: "Round 1 Final locked submission. Ranked #14 globally in Round 1."
    }
  ],
  achievements: [
    {
      id: "ACH-01",
      title: "Clean Energy Pioneer",
      description: "Provided >50,000 MWh of continuous two-sided liquidity in Round 1.",
      unlockedAt: "Oct 05, 2035",
      badgeIcon: "Zap"
    },
    {
      id: "ACH-02",
      title: "Top 10 Global Contender",
      description: "Broke into the top 10 overall institutional rankings in Round 2.",
      unlockedAt: "Oct 10, 2035",
      badgeIcon: "Award"
    },
    {
      id: "ACH-03",
      title: "Sharpe Ratio > 2.5",
      description: "Maintained a risk-adjusted return ratio above 2.5 across 48 consecutive trading hours.",
      unlockedAt: "Oct 13, 2035",
      badgeIcon: "TrendingUp"
    }
  ]
};
