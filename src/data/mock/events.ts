export interface MarketEvent {
  id: string;
  timestamp: string;
  category: "WEATHER" | "ENERGY" | "QUANTUM" | "REGULATORY" | "LOGISTICS" | "INFRASTRUCTURE";
  urgency: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  headline: string;
  summary: string;
  affectedTickers: string[];
  estimatedImpact: string;
  sentiment: "BULLISH" | "BEARISH" | "VOLATILE";
  verifiedSource: string;
}

export const MOCK_EVENTS: MarketEvent[] = [
  {
    id: "EVT-2035-104",
    timestamp: "12m ago",
    category: "WEATHER",
    urgency: "CRITICAL",
    headline: "Category-3 Shamal Sandstorm Detected in Northern Gulf; Skyway Drone Visibility Degraded",
    summary: "UAE National Centre of Meteorology warns of sudden sand-wall arriving at 60 km/h within 4 hours. General Civil Aviation Authority triggers automated flight corridors reduction to 20% capacity.",
    affectedTickers: ["CARGO-DRONE-INDEX", "HYPER-DXB-AUH", "SOL-MWH"],
    estimatedImpact: "Surge in subterranean pneumatic freight (+12%); Drone transport slot pricing collapse (-8%).",
    sentiment: "VOLATILE",
    verifiedSource: "UAE National Meteorological Telemetry Grid"
  },
  {
    id: "EVT-2035-103",
    timestamp: "38m ago",
    category: "ENERGY",
    urgency: "HIGH",
    headline: "MBR Solar Phase 7 Molten Salt Reservoir Initiates Thermal Cycle Cleaning",
    summary: "Scheduled automated heliostat mirror dust wash will take 800 MW offline between 14:00 and 17:00 GST. Spot power prices on baseload contract surging ahead of evening AC load ramp.",
    affectedTickers: ["SOL-MWH", "Q-FLOP"],
    estimatedImpact: "Short-term supply contraction expected to push SOL-MWH past 390.00 Blitz barrier.",
    sentiment: "BULLISH",
    verifiedSource: "Dubai Electricity and Water Authority (DEWA-35)"
  },
  {
    id: "EVT-2035-102",
    timestamp: "2h ago",
    category: "QUANTUM",
    urgency: "MEDIUM",
    headline: "DIFC Cryogenic Facility Expands Qubit Coherence Window to 480 Milliseconds",
    summary: "Dilution refrigerator cluster upgrades complete ahead of schedule. Compute capacity per teraFLOP token jumps 14%, reducing latency for quantitative market makers.",
    affectedTickers: ["Q-FLOP", "NEO-GRAPHENE"],
    estimatedImpact: "Increased supply of compute tokens expected to dampen spot premium by 2-3%.",
    sentiment: "BEARISH",
    verifiedSource: "DIFC Quantum Infrastructure Board"
  },
  {
    id: "EVT-2035-101",
    timestamp: "5h ago",
    category: "LOGISTICS",
    urgency: "HIGH",
    headline: "Jebel Ali Automated Deepwater Terminal Sets 24-Hour TEU Unloading World Record",
    summary: "Autonomous magnetic straddle carriers and robotic gantry cranes processed 42,000 TEU in 24 hours. Liquid hydrogen bunkering operations running with zero demurrage.",
    affectedTickers: ["HYDRO-DXB", "HYPER-DXB-AUH"],
    estimatedImpact: "Enhanced turnaround velocity stabilizes green hydrogen export futures.",
    sentiment: "BULLISH",
    verifiedSource: "DP World Global Automated Terminals"
  },
  {
    id: "EVT-2035-100",
    timestamp: "9h ago",
    category: "REGULATORY",
    urgency: "INFO",
    headline: "DMX-35 Circuit Breaker Threshold Adjusted for Round 3 Cross-Asset Arbitrage",
    summary: "Exchange surveillance announces dynamic circuit breaker widen from 8% to 12% for the Q-FLOP / SOL-MWH synthetic pairs market to accommodate expected sandstorm volatility.",
    affectedTickers: ["ALL ASSETS"],
    estimatedImpact: "Higher volatility band allowance gives algorithmic market makers broader quoting margins.",
    sentiment: "VOLATILE",
    verifiedSource: "Mercantile Market Surveillance Division"
  },
  {
    id: "EVT-2035-099",
    timestamp: "14h ago",
    category: "INFRASTRUCTURE",
    urgency: "INFO",
    headline: "Emirates Sovereign Carbon Registry Minting 500,000 Blue Carbon Certificates",
    summary: "Mangrove biodiversity expansion along Arabian Gulf coastline verified via orbital hyperspectral imaging satellites.",
    affectedTickers: ["EMIRATES-CARBON-V1"],
    estimatedImpact: "Institutional demand expected to absorb liquidity at 88.50 Blitz support level.",
    sentiment: "BULLISH",
    verifiedSource: "UAE Ministry of Climate Change and Environment"
  }
];
