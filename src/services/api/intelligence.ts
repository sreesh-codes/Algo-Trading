export type EventSeverity = "NORMAL" | "WATCH" | "ALERT" | "CRITICAL" | "SYSTEMIC";

export type DistrictName = "DIFC" | "JEBEL ALI" | "ENERGY GRID" | "AI CITY" | "ORBITAL NETWORK";

export type NetworkThreatLevel = "STABLE" | "ELEVATED VOLATILITY" | "SYSTEMIC EVENT DETECTED";

export interface TelemetryStat {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  delta: string;
}

export interface IntelligenceEvent {
  id: string;
  timestamp: string; // e.g. "09:14", "11:37", "13:05", "14:22"
  fullTime: string; // e.g. "2035.04.17 — 13:05:42 GST"
  relativeTime: string; // e.g. "25 mins ago"
  district: DistrictName;
  severity: EventSeverity;
  headline: string;
  shortDescription: string;
  fullBriefing: string;
  affectedAsset: string;
  telemetryStats: TelemetryStat[];
  sourceAuthority: string;
  transmissionChecksum: string;
  isFeatured?: boolean;
}

export const MOCK_INTELLIGENCE_EVENTS: IntelligenceEvent[] = [
  {
    id: "INTEL-2035-084",
    timestamp: "14:22",
    fullTime: "2035.04.17 — 14:22:18 GST",
    relativeTime: "10 mins ago",
    district: "ENERGY GRID",
    severity: "CRITICAL",
    headline: "Unusual energy flows detected across the Dubai Energy Grid",
    shortDescription:
      "Automated load balancers trigger localized sub-station shedding following unexpected 1.8 GW diversion toward Jebel Ali high-density computing vaults.",
    fullBriefing:
      "Telemetry from DEWA-35 supervisory automated control systems reports an anomalous 1.8 GW transient draw originating at Substation Cluster Delta. The diversion coincided with high-frequency order placement spikes on the continuous DUNE ENERGY contract. Grid frequency dipped momentarily to 49.82 Hz before rapid superconducting battery stabilization engaged. Market surveillance has heightened quoting collars for energy-linked derivatives.",
    affectedAsset: "DUNE-ENERGY",
    telemetryStats: [
      { label: "GRID DIVERSION", value: "1.82 GW", trend: "up", delta: "+34.2%" },
      { label: "BASELOAD FREQ", value: "49.88 Hz", trend: "down", delta: "-0.24%" },
      { label: "SPREAD VOLATILITY", value: "8.4 bps", trend: "up", delta: "+4.1 bps" },
    ],
    sourceAuthority: "Dubai Electricity & Water Authority (DEWA-35 Telemetry)",
    transmissionChecksum: "SHA256-8e9102bfa49c",
    isFeatured: true,
  },
  {
    id: "INTEL-2035-083",
    timestamp: "13:05",
    fullTime: "2035.04.17 — 13:05:04 GST",
    relativeTime: "1 hour ago",
    district: "JEBEL ALI",
    severity: "ALERT",
    headline: "Jebel Ali logistics volumes have deviated from seasonal norms",
    shortDescription:
      "Autonomous container throughput surges 28% above quarterly baseline as magnetic maglev freight lines prioritize cryogenic fuel transport.",
    fullBriefing:
      "Terminal 4 automated robotic gantry cranes recorded an unprecedented 32,400 TEU turnaround between dawn and mid-day. Real-time manifest surveillance indicates rapid bunkering of green liquid hydrogen containers bound for Far East corridors. Subterranean pneumatic freight conduits are operating at 94% continuous pipeline capacity, driving localized basis price divergence against spot logistics contracts.",
    affectedAsset: "ORBIT-LOG",
    telemetryStats: [
      { label: "THROUGHPUT", value: "32.4K TEU", trend: "up", delta: "+28.1%" },
      { label: "MAGLEV VELOCITY", value: "380 km/h", trend: "stable", delta: "Nominal" },
      { label: "FREIGHT BASIS", value: "+12.4 Blitz", trend: "up", delta: "+3.8 Blitz" },
    ],
    sourceAuthority: "DP World Autonomous Port Terminal Surveillance",
    transmissionChecksum: "SHA256-4b8291cad01e",
  },
  {
    id: "INTEL-2035-082",
    timestamp: "11:37",
    fullTime: "2035.04.17 — 11:37:52 GST",
    relativeTime: "3 hours ago",
    district: "DIFC",
    severity: "NORMAL",
    headline: "DIFC liquidity conditions remain stable",
    shortDescription:
      "Order book depth across tier-1 algorithmic market makers absorbs synthetic basket flows with nominal bid-ask spreads at 0.08 bps.",
    fullBriefing:
      "The DIFC financial district quantum execution corridor reports optimal continuous market operations. Over 14,000 synthetic derivative contracts were filled during the morning auction window with zero recorded slippage spikes. Cryogenic cooling arrays in subterranean server vaults are operating at 4.2 Kelvin, providing sub-microsecond matching latency for institutional quantitative models.",
    affectedAsset: "DIFC-100",
    telemetryStats: [
      { label: "MEDIAN SPREAD", value: "0.08 bps", trend: "stable", delta: "0.00 bps" },
      { label: "BOOK DEPTH (L2)", value: "148M Blitz", trend: "up", delta: "+8.5%" },
      { label: "ORACLE LATENCY", value: "0.38 ms", trend: "down", delta: "-0.04 ms" },
    ],
    sourceAuthority: "Dubai International Financial Centre Regulatory Authority",
    transmissionChecksum: "SHA256-2e8179cbe33f",
  },
  {
    id: "INTEL-2035-081",
    timestamp: "10:48",
    fullTime: "2035.04.17 — 10:48:19 GST",
    relativeTime: "4 hours ago",
    district: "AI CITY",
    severity: "WATCH",
    headline: "Compute cluster reallocation detected in Silicon Oasis AI City",
    shortDescription:
      "Autonomous model inference workloads shifted dynamically from European data centers to local solar-powered neuromorphic arrays.",
    fullBriefing:
      "Silicon Oasis Neuromorphic Core 7 experienced an abrupt migration of 4.5 PFLOPS in institutional compute capacity. The computational workload realignment corresponds with opening of regional options settlement windows. Fiber optic interconnects along Al Khail data pipelines report sustained optical utilization above 88%, without packet drops.",
    affectedAsset: "NEXUS-AI",
    telemetryStats: [
      { label: "COMPUTE LOAD", value: "4.5 PFLOPS", trend: "up", delta: "+18.4%" },
      { label: "ARRAY TEMP", value: "18.2 °C", trend: "stable", delta: "+0.4 °C" },
      { label: "TOKEN VELOCITY", value: "1.2M / sec", trend: "up", delta: "+12.0%" },
    ],
    sourceAuthority: "Dubai AI Autonomous Computing Registry",
    transmissionChecksum: "SHA256-118279cf441a",
  },
  {
    id: "INTEL-2035-080",
    timestamp: "09:14",
    fullTime: "2035.04.17 — 09:14:00 GST",
    relativeTime: "5 hours ago",
    district: "ORBITAL NETWORK",
    severity: "NORMAL",
    headline: "MARKET OPEN: Continuous auction session initialized across all five districts",
    shortDescription:
      "DMX-35 centralized matching engine opens morning trading with synthetic commodity and compute contracts fully operational.",
    fullBriefing:
      "The Mercantile Exchange opened continuous order matching at 09:14 GST following complete calibration of orbital GPS synchronization satellites. All 24 registered collegiate and institutional algorithmic trading bots verified secure WebSocket feeds. Initial opening volume centered heavily on synthetic energy and infrastructure arbitrage spreads.",
    affectedAsset: "DIFC-100",
    telemetryStats: [
      { label: "INITIAL VOLUME", value: "482M Blitz", trend: "stable", delta: "Nominal" },
      { label: "ACTIVE ALGORITHMS", value: "24 TEAMS", trend: "stable", delta: "100% Online" },
      { label: "FEED JITTER", value: "1.2 µs", trend: "down", delta: "-0.4 µs" },
    ],
    sourceAuthority: "The Mercantile Central Exchange Surveillance",
    transmissionChecksum: "SHA256-001928fa8892",
  },
  {
    id: "INTEL-2035-079",
    timestamp: "08:30",
    fullTime: "2035.04.17 — 08:30:15 GST",
    relativeTime: "6 hours ago",
    district: "ENERGY GRID",
    severity: "SYSTEMIC",
    headline: "Atmospheric solar dust filtration warning issued for Mohammed bin Rashid Solar Park",
    shortDescription:
      "Category-2 high altitude particulate drift detected over the southern desert array, triggering automated robotic wiper cycles.",
    fullBriefing:
      "Orbital hyperspectral telemetry from the KhalifaSat-4 observation satellite confirms a localized particulate suspension moving north-northwest from the Empty Quarter. DEWA automated wiper drones were deployed across Phase 6 photovoltaic fields to maintain 99.4% optical transmission. Baseload supply commitments were seamlessly bridged by green hydrogen storage cells without spot price destabilization.",
    affectedAsset: "DESERT-H2",
    telemetryStats: [
      { label: "OPTICAL CLARITY", value: "94.2%", trend: "down", delta: "-4.8%" },
      { label: "WIPER DRONES", value: "1,420 ACTIVE", trend: "up", delta: "+100%" },
      { label: "H2 RESERVE DRAW", value: "240 MWh", trend: "up", delta: "+15.2%" },
    ],
    sourceAuthority: "UAE National Meteorological & Satellite Observation Center",
    transmissionChecksum: "SHA256-778192ba0911",
  },
];

const delay = <T>(data: T, ms = 50): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const IntelligenceApi = {
  async getEvents(): Promise<IntelligenceEvent[]> {
    return delay(MOCK_INTELLIGENCE_EVENTS);
  },

  async getFeatured(): Promise<IntelligenceEvent> {
    const featured = MOCK_INTELLIGENCE_EVENTS.find((e) => e.isFeatured) || MOCK_INTELLIGENCE_EVENTS[0];
    return delay(featured);
  },

  async getNetworkStatus(): Promise<{
    status: NetworkThreatLevel;
    activeAlertsCount: number;
    highestSeverity: EventSeverity;
    surveillanceLatencyMs: number;
    lastTelemetrySync: string;
  }> {
    return delay({
      status: "ELEVATED VOLATILITY",
      activeAlertsCount: 3,
      highestSeverity: "CRITICAL",
      surveillanceLatencyMs: 0.38,
      lastTelemetrySync: "14:32:17 GST",
    });
  },
};
