export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
  depthPercent: number; // For rendering visual depth bar 0-100
}

export interface OrderBook {
  ticker: string;
  timestamp: string;
  lastPrice: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface MarketSystemOverview {
  exchangeName: string;
  localTimeGst: string;
  exchangeStatus: "OPEN" | "CIRCUIT_BREAKER" | "POST_CLOSE" | "PRE_OPEN";
  engineLatencyMs: number;
  matchedOrdersPerSec: number;
  total24hVolumeBlitz: number;
  totalActiveTraders: number;
  activeContractsCount: number;
  activeCircuitBreakers: number;
  systemIntegrity: number; // e.g. 99.98%
}

export const MOCK_SYSTEM_OVERVIEW: MarketSystemOverview = {
  exchangeName: "Dubai Mercantile Network (DMX-35)",
  localTimeGst: "2035.04.17 — 14:32:17 GST",
  exchangeStatus: "OPEN",
  engineLatencyMs: 0.38,
  matchedOrdersPerSec: 18450,
  total24hVolumeBlitz: 753833899,
  totalActiveTraders: 1420,
  activeContractsCount: 5,
  activeCircuitBreakers: 0,
  systemIntegrity: 99.998
};

export const MOCK_ORDER_BOOKS: Record<string, OrderBook> = {
  "DUNE-NRG": {
    ticker: "DUNE-NRG",
    timestamp: "2035-04-17T14:32:17Z",
    lastPrice: 428.60,
    bids: [
      { price: 428.50, size: 340, total: 340, depthPercent: 28 },
      { price: 428.40, size: 520, total: 860, depthPercent: 46 },
      { price: 428.30, size: 810, total: 1670, depthPercent: 68 },
      { price: 428.20, size: 1150, total: 2820, depthPercent: 84 },
      { price: 428.10, size: 1420, total: 4240, depthPercent: 94 },
      { price: 428.00, size: 2100, total: 6340, depthPercent: 100 },
    ],
    asks: [
      { price: 428.70, size: 310, total: 310, depthPercent: 25 },
      { price: 428.80, size: 480, total: 790, depthPercent: 42 },
      { price: 428.90, size: 760, total: 1550, depthPercent: 65 },
      { price: 429.00, size: 1240, total: 2790, depthPercent: 82 },
      { price: 429.10, size: 1680, total: 4470, depthPercent: 95 },
      { price: 429.20, size: 1950, total: 6420, depthPercent: 100 },
    ]
  },
  "NEX-AI": {
    ticker: "NEX-AI",
    timestamp: "2035-04-17T14:32:17Z",
    lastPrice: 1842.20,
    bids: [
      { price: 1841.80, size: 65, total: 65, depthPercent: 25 },
      { price: 1841.40, size: 110, total: 175, depthPercent: 48 },
      { price: 1841.00, size: 185, total: 360, depthPercent: 72 },
      { price: 1840.60, size: 240, total: 600, depthPercent: 88 },
      { price: 1840.20, size: 310, total: 910, depthPercent: 100 },
    ],
    asks: [
      { price: 1842.60, size: 72, total: 72, depthPercent: 28 },
      { price: 1843.00, size: 130, total: 202, depthPercent: 54 },
      { price: 1843.40, size: 195, total: 397, depthPercent: 76 },
      { price: 1843.80, size: 220, total: 617, depthPercent: 90 },
      { price: 1844.20, size: 295, total: 912, depthPercent: 100 },
    ]
  },
  "ORBT-LOG": {
    ticker: "ORBT-LOG",
    timestamp: "2035-04-17T14:32:17Z",
    lastPrice: 745.50,
    bids: [
      { price: 745.20, size: 140, total: 140, depthPercent: 30 },
      { price: 744.95, size: 220, total: 360, depthPercent: 55 },
      { price: 744.70, size: 380, total: 740, depthPercent: 78 },
      { price: 744.45, size: 510, total: 1250, depthPercent: 92 },
      { price: 744.20, size: 620, total: 1870, depthPercent: 100 },
    ],
    asks: [
      { price: 745.75, size: 125, total: 125, depthPercent: 26 },
      { price: 746.00, size: 240, total: 365, depthPercent: 52 },
      { price: 746.25, size: 360, total: 725, depthPercent: 74 },
      { price: 746.50, size: 490, total: 1215, depthPercent: 88 },
      { price: 746.75, size: 580, total: 1795, depthPercent: 100 },
    ]
  },
  "DES-H2": {
    ticker: "DES-H2",
    timestamp: "2035-04-17T14:32:17Z",
    lastPrice: 518.75,
    bids: [
      { price: 518.60, size: 410, total: 410, depthPercent: 32 },
      { price: 518.50, size: 620, total: 1030, depthPercent: 58 },
      { price: 518.40, size: 850, total: 1880, depthPercent: 78 },
      { price: 518.30, size: 1120, total: 3000, depthPercent: 92 },
      { price: 518.20, size: 1450, total: 4450, depthPercent: 100 },
    ],
    asks: [
      { price: 518.90, size: 380, total: 380, depthPercent: 30 },
      { price: 519.00, size: 590, total: 970, depthPercent: 54 },
      { price: 519.10, size: 810, total: 1780, depthPercent: 75 },
      { price: 519.20, size: 1080, total: 2860, depthPercent: 89 },
      { price: 519.30, size: 1390, total: 4250, depthPercent: 100 },
    ]
  },
  "DIFC-100": {
    ticker: "DIFC-100",
    timestamp: "2035-04-17T14:32:17Z",
    lastPrice: 14892.40,
    bids: [
      { price: 14891.50, size: 25, total: 25, depthPercent: 30 },
      { price: 14890.50, size: 42, total: 67, depthPercent: 55 },
      { price: 14889.50, size: 68, total: 135, depthPercent: 75 },
      { price: 14888.50, size: 95, total: 230, depthPercent: 90 },
      { price: 14887.50, size: 130, total: 360, depthPercent: 100 },
    ],
    asks: [
      { price: 14893.30, size: 22, total: 22, depthPercent: 28 },
      { price: 14894.30, size: 39, total: 61, depthPercent: 52 },
      { price: 14895.30, size: 71, total: 132, depthPercent: 74 },
      { price: 14896.30, size: 92, total: 224, depthPercent: 88 },
      { price: 14897.30, size: 125, total: 349, depthPercent: 100 },
    ]
  }
};
