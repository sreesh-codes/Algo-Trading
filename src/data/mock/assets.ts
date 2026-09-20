export interface HistoricalPoint {
  timestamp: string;
  timeLabel: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  volatility?: number;
}

export interface AssetContract {
  ticker: string;
  slug: string;
  name: string;
  category: "Energy" | "Compute" | "Logistics" | "Commodities" | "Real Estate" | "Environmental" | "Indices";
  sector: string;
  description: string;
  lastPrice: number;
  change24h: number;
  change24hPercent: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  volume24hBlitz: number;
  bidPrice: number;
  askPrice: number;
  spread: number;
  contractSize: string;
  tickSize: number;
  marginRequirement: number; // percentage e.g. 10%
  volatility: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  volatilityPct: number; // e.g. 18.4%
  openInterest?: number; // open contracts
  openInterestBlitz?: number;
  activeRound: number;
  image: string;
  sparkline: number[];
  history: HistoricalPoint[];
}

export const MOCK_ASSETS: AssetContract[] = [
  {
    ticker: "DUNE-NRG",
    slug: "dune-energy",
    name: "Dune Energy",
    category: "Energy",
    sector: "Clean Solar & Storage",
    image: "/assets/dune-energy.jpg",
    description: "Baseload solar capacity and molten salt storage derivatives from the Mohammed bin Rashid Solar Array and subterranean high-temperature energy vaults.",
    lastPrice: 428.60,
    change24h: 25.80,
    change24hPercent: 6.40,
    high24h: 436.40,
    low24h: 398.20,
    volume24h: 112450,
    volume24hBlitz: 48196070,
    bidPrice: 428.50,
    askPrice: 428.70,
    spread: 0.20,
    contractSize: "25 MWh Clean Generation Equivalent",
    tickSize: 0.10,
    marginRequirement: 8,
    volatility: "HIGH",
    volatilityPct: 24.8,
    openInterest: 14250,
    openInterestBlitz: 61075500,
    activeRound: 2,
    sparkline: [398, 404, 401, 412, 420, 416, 425, 428.6],
    history: [
      { timestamp: "2035-04-17T08:00:00Z", timeLabel: "08:00", open: 402.0, high: 408.5, low: 398.2, close: 405.2, volume: 14200, volatility: 21.2 },
      { timestamp: "2035-04-17T09:00:00Z", timeLabel: "09:00", open: 405.2, high: 414.0, low: 403.5, close: 411.8, volume: 16400, volatility: 22.5 },
      { timestamp: "2035-04-17T10:00:00Z", timeLabel: "10:00", open: 411.8, high: 422.0, low: 410.0, close: 419.1, volume: 22800, volatility: 26.4 },
      { timestamp: "2035-04-17T11:00:00Z", timeLabel: "11:00", open: 419.1, high: 426.0, low: 416.8, close: 421.6, volume: 19400, volatility: 25.1 },
      { timestamp: "2035-04-17T12:00:00Z", timeLabel: "12:00", open: 421.6, high: 432.2, low: 418.0, close: 425.5, volume: 25100, volatility: 28.7 },
      { timestamp: "2035-04-17T13:00:00Z", timeLabel: "13:00", open: 425.5, high: 436.4, low: 423.5, close: 431.2, volume: 28400, volatility: 31.2 },
      { timestamp: "2035-04-17T14:00:00Z", timeLabel: "14:00", open: 431.2, high: 434.0, low: 426.0, close: 428.6, volume: 21300, volatility: 24.8 },
    ]
  },
  {
    ticker: "NEX-AI",
    slug: "nexus-ai",
    name: "Nexus AI",
    category: "Compute",
    sector: "Neuromorphic Qubits",
    image: "/assets/nexus-ai.jpg",
    description: "Cryogenic superconducting quantum core compute allocations and ultra-low-latency neural inference contracts verified by DIFC Quantum Exchange.",
    lastPrice: 1842.20,
    change24h: 208.50,
    change24hPercent: 12.76,
    high24h: 1895.00,
    low24h: 1620.00,
    volume24h: 71920,
    volume24hBlitz: 132491024,
    bidPrice: 1841.80,
    askPrice: 1842.60,
    spread: 0.80,
    contractSize: "1,000 Superconducting Qubit-Hours",
    tickSize: 0.20,
    marginRequirement: 14,
    volatility: "EXTREME",
    volatilityPct: 41.5,
    openInterest: 8940,
    openInterestBlitz: 164692680,
    activeRound: 2,
    sparkline: [1630, 1665, 1710, 1690, 1760, 1815, 1790, 1842.2],
    history: [
      { timestamp: "2035-04-17T08:00:00Z", timeLabel: "08:00", open: 1633.0, high: 1675.0, low: 1620.0, close: 1662.0, volume: 8400, volatility: 34.0 },
      { timestamp: "2035-04-17T09:00:00Z", timeLabel: "09:00", open: 1662.0, high: 1720.0, low: 1655.0, close: 1705.0, volume: 11200, volatility: 38.2 },
      { timestamp: "2035-04-17T10:00:00Z", timeLabel: "10:00", open: 1705.0, high: 1750.0, low: 1685.0, close: 1735.0, volume: 14800, volatility: 42.1 },
      { timestamp: "2035-04-17T11:00:00Z", timeLabel: "11:00", open: 1735.0, high: 1785.0, low: 1720.0, close: 1770.0, volume: 13500, volatility: 40.5 },
      { timestamp: "2035-04-17T12:00:00Z", timeLabel: "12:00", open: 1770.0, high: 1845.0, low: 1755.0, close: 1820.0, volume: 17900, volatility: 44.8 },
      { timestamp: "2035-04-17T13:00:00Z", timeLabel: "13:00", open: 1820.0, high: 1895.0, low: 1805.0, close: 1860.0, volume: 22100, volatility: 46.2 },
      { timestamp: "2035-04-17T14:00:00Z", timeLabel: "14:00", open: 1860.0, high: 1870.0, low: 1830.0, close: 1842.2, volume: 16800, volatility: 41.5 },
    ]
  },
  {
    ticker: "ORBT-LOG",
    slug: "orbit-logistics",
    name: "Orbit Logistics",
    category: "Logistics",
    sector: "Pneumatic Hyperloop",
    image: "/assets/orbit-logistics.jpg",
    description: "Pressurized vacuum-tube priority dispatch slots linking Jebel Ali Automated Deepwater Port, Al Maktoum Cargo Terminal, and Abu Dhabi Logistics Rail.",
    lastPrice: 745.50,
    change24h: -10.20,
    change24hPercent: -1.35,
    high24h: 768.00,
    low24h: 738.50,
    volume24h: 39850,
    volume24hBlitz: 29708175,
    bidPrice: 745.20,
    askPrice: 745.75,
    spread: 0.55,
    contractSize: "10 Metric Ton Freight Corridor Pod",
    tickSize: 0.25,
    marginRequirement: 10,
    volatility: "MEDIUM",
    volatilityPct: 17.2,
    openInterest: 6810,
    openInterestBlitz: 50768550,
    activeRound: 2,
    sparkline: [758, 762, 755, 765, 750, 742, 748, 745.5],
    history: [
      { timestamp: "2035-04-17T08:00:00Z", timeLabel: "08:00", open: 755.7, high: 762.0, low: 752.0, close: 760.0, volume: 5400, volatility: 16.5 },
      { timestamp: "2035-04-17T09:00:00Z", timeLabel: "09:00", open: 760.0, high: 768.0, low: 758.0, close: 764.5, volume: 6800, volatility: 18.0 },
      { timestamp: "2035-04-17T10:00:00Z", timeLabel: "10:00", open: 764.5, high: 766.0, low: 752.0, close: 755.0, volume: 7200, volatility: 19.4 },
      { timestamp: "2035-04-17T11:00:00Z", timeLabel: "11:00", open: 755.0, high: 758.0, low: 745.0, close: 748.2, volume: 6900, volatility: 17.8 },
      { timestamp: "2035-04-17T12:00:00Z", timeLabel: "12:00", open: 748.2, high: 752.0, low: 740.0, close: 742.0, volume: 8400, volatility: 18.9 },
      { timestamp: "2035-04-17T13:00:00Z", timeLabel: "13:00", open: 742.0, high: 750.0, low: 738.5, close: 747.0, volume: 9100, volatility: 17.5 },
      { timestamp: "2035-04-17T14:00:00Z", timeLabel: "14:00", open: 747.0, high: 749.0, low: 743.0, close: 745.5, volume: 7300, volatility: 17.2 },
    ]
  },
  {
    ticker: "DES-H2",
    slug: "desert-hydrogen",
    name: "Desert Hydrogen",
    category: "Energy",
    sector: "Cryogenic Clean Fuels",
    image: "/assets/desert-hydrogen.jpg",
    description: "Green cryogenic liquid hydrogen forward delivery certificates produced by desert electrolysis arrays and standardized for Fujairah maritime bunkering.",
    lastPrice: 518.75,
    change24h: 16.10,
    change24hPercent: 3.20,
    high24h: 524.50,
    low24h: 501.00,
    volume24h: 118350,
    volume24hBlitz: 61394062,
    bidPrice: 518.60,
    askPrice: 518.90,
    spread: 0.30,
    contractSize: "1,000 kg Liquified H2 at 20 K",
    tickSize: 0.10,
    marginRequirement: 6,
    volatility: "MEDIUM",
    volatilityPct: 19.8,
    openInterest: 19500,
    openInterestBlitz: 101156250,
    activeRound: 2,
    sparkline: [502, 508, 505, 514, 519, 513, 517, 518.75],
    history: [
      { timestamp: "2035-04-17T08:00:00Z", timeLabel: "08:00", open: 502.6, high: 509.0, low: 501.0, close: 507.0, volume: 16200, volatility: 18.0 },
      { timestamp: "2035-04-17T09:00:00Z", timeLabel: "09:00", open: 507.0, high: 512.5, low: 505.0, close: 510.5, volume: 18400, volatility: 19.1 },
      { timestamp: "2035-04-17T10:00:00Z", timeLabel: "10:00", open: 510.5, high: 516.0, low: 508.5, close: 514.0, volume: 22100, volatility: 20.4 },
      { timestamp: "2035-04-17T11:00:00Z", timeLabel: "11:00", open: 514.0, high: 521.0, low: 512.0, close: 518.2, volume: 20500, volatility: 21.0 },
      { timestamp: "2035-04-17T12:00:00Z", timeLabel: "12:00", open: 518.2, high: 524.5, low: 516.0, close: 521.0, volume: 26400, volatility: 22.3 },
      { timestamp: "2035-04-17T13:00:00Z", timeLabel: "13:00", open: 521.0, high: 523.0, low: 515.0, close: 517.5, volume: 24200, volatility: 20.1 },
      { timestamp: "2035-04-17T14:00:00Z", timeLabel: "14:00", open: 517.5, high: 520.0, low: 516.5, close: 518.75, volume: 19300, volatility: 19.8 },
    ]
  },
  {
    ticker: "DIFC-100",
    slug: "difc-100",
    name: "DIFC-100",
    category: "Indices",
    sector: "Sovereign Composite Benchmark",
    image: "/assets/difc-100.jpg",
    description: "Capitalization-weighted composite benchmark index tracking Dubai's top 100 autonomous corporations, quantum data centers, and clean utility providers.",
    lastPrice: 14892.40,
    change24h: 588.60,
    change24hPercent: 4.11,
    high24h: 14980.00,
    low24h: 14240.00,
    volume24h: 32300,
    volume24hBlitz: 481024520,
    bidPrice: 14891.50,
    askPrice: 14893.30,
    spread: 1.80,
    contractSize: "100 Index Points (Notional: 1.48M Blitz)",
    tickSize: 0.50,
    marginRequirement: 5,
    volatility: "LOW",
    volatilityPct: 12.4,
    openInterest: 31200,
    openInterestBlitz: 464642880,
    activeRound: 2,
    sparkline: [14300, 14450, 14400, 14620, 14750, 14700, 14850, 14892.4],
    history: [
      { timestamp: "2035-04-17T08:00:00Z", timeLabel: "08:00", open: 14303.0, high: 14420.0, low: 14240.0, close: 14380.0, volume: 3800, volatility: 11.2 },
      { timestamp: "2035-04-17T09:00:00Z", timeLabel: "09:00", open: 14380.0, high: 14510.0, low: 14350.0, close: 14490.0, volume: 4600, volatility: 12.0 },
      { timestamp: "2035-04-17T10:00:00Z", timeLabel: "10:00", open: 14490.0, high: 14650.0, low: 14460.0, close: 14610.0, volume: 5900, volatility: 12.8 },
      { timestamp: "2035-04-17T11:00:00Z", timeLabel: "11:00", open: 14610.0, high: 14780.0, low: 14590.0, close: 14740.0, volume: 5400, volatility: 13.1 },
      { timestamp: "2035-04-17T12:00:00Z", timeLabel: "12:00", open: 14740.0, high: 14890.0, low: 14710.0, close: 14830.0, volume: 6800, volatility: 13.5 },
      { timestamp: "2035-04-17T13:00:00Z", timeLabel: "13:00", open: 14830.0, high: 14980.0, low: 14800.0, close: 14920.0, volume: 7600, volatility: 14.0 },
      { timestamp: "2035-04-17T14:00:00Z", timeLabel: "14:00", open: 14920.0, high: 14940.0, low: 14870.0, close: 14892.4, volume: 5100, volatility: 12.4 },
    ]
  }
];
