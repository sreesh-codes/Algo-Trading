export interface ExecutedTrade {
  tradeId: string;
  ticker: string;
  timestamp: string;
  side: "BUY" | "SELL";
  price: number;
  quantity: number;
  volumeBlitz: number;
  buyer: string;
  seller: string;
  latencyMs: number;
}

export const MOCK_RECENT_TRADES: ExecutedTrade[] = [
  {
    tradeId: "TRD-2035-10492",
    ticker: "DUNE-NRG",
    timestamp: "14:32:16.892",
    side: "BUY",
    price: 428.60,
    quantity: 120,
    volumeBlitz: 51432.00,
    buyer: "Falcon Arbitrage DIFC",
    seller: "Apex Quant Zurich",
    latencyMs: 0.38
  },
  {
    tradeId: "TRD-2035-10491",
    ticker: "DUNE-NRG",
    timestamp: "14:32:15.420",
    side: "SELL",
    price: 428.50,
    quantity: 340,
    volumeBlitz: 145690.00,
    buyer: "MBR Solar Automated MM",
    seller: "Kite Alpha Labs",
    latencyMs: 0.41
  },
  {
    tradeId: "TRD-2035-10490",
    ticker: "NEX-AI",
    timestamp: "14:32:14.918",
    side: "BUY",
    price: 1842.20,
    quantity: 45,
    volumeBlitz: 82899.00,
    buyer: "Q-Hyperion MIT",
    seller: "Neural Nomad DIFC",
    latencyMs: 0.29
  },
  {
    tradeId: "TRD-2035-10489",
    ticker: "NEX-AI",
    timestamp: "14:32:13.104",
    side: "BUY",
    price: 1841.80,
    quantity: 30,
    volumeBlitz: 55254.00,
    buyer: "Caelum Imperial",
    seller: "DMX Cryo Pool",
    latencyMs: 0.34
  },
  {
    tradeId: "TRD-2035-10488",
    ticker: "ORBT-LOG",
    timestamp: "14:32:12.775",
    side: "SELL",
    price: 745.50,
    quantity: 80,
    volumeBlitz: 59640.00,
    buyer: "Jebel Ali FastRoute",
    seller: "Falcon Arbitrage DIFC",
    latencyMs: 0.45
  },
  {
    tradeId: "TRD-2035-10487",
    ticker: "DES-H2",
    timestamp: "14:32:11.890",
    side: "BUY",
    price: 518.75,
    quantity: 210,
    volumeBlitz: 108937.50,
    buyer: "Fujairah Cryo Logistics",
    seller: "Stochastic Delta",
    latencyMs: 0.36
  },
  {
    tradeId: "TRD-2035-10486",
    ticker: "DIFC-100",
    timestamp: "14:32:10.451",
    side: "BUY",
    price: 14892.40,
    quantity: 15,
    volumeBlitz: 223386.00,
    buyer: "Sovereign Alpha Fund",
    seller: "DIFC Index Arbitrageur",
    latencyMs: 0.25
  },
  {
    tradeId: "TRD-2035-10485",
    ticker: "DUNE-NRG",
    timestamp: "14:32:09.112",
    side: "BUY",
    price: 428.50,
    quantity: 200,
    volumeBlitz: 85700.00,
    buyer: "Vortex Delta ETH",
    seller: "DMX Market Maker B",
    latencyMs: 0.39
  }
];
