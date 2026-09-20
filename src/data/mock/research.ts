export interface ResearchPaper {
  id: string;
  title: string;
  author: string;
  affiliation: string;
  publishedDate: string;
  abstract: string;
  tags: string[];
  readTimeMinutes: number;
  downloadFilename: string;
  fileSizeBytes: string;
}

export interface HistoricalDataset {
  id: string;
  name: string;
  format: "PARQUET" | "CSV" | "HDF5";
  timeframe: string;
  fileSize: string;
  recordCount: string;
  description: string;
  tickersIncluded: string[];
}

export interface StarterStrategy {
  id: string;
  name: string;
  language: "Python" | "C++" | "Rust";
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  description: string;
  codeSnippet: string;
}

export const MOCK_RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: "RES-2035-08",
    title: "Microstructure Asymmetries in High-Frequency Solar Baseload Contracts During Dust Storm Shocks",
    author: "Dr. Tariq Al-Mansoor & Elena Rostova",
    affiliation: "Dubai Future Foundation & Oxford Quantitative Institute",
    publishedDate: "October 2035",
    abstract: "We investigate order book replenishment dynamics in SOL-MWH contracts during automated heliostat cleaning cycles. Utilizing tick-level L3 depth snapshots from DMX-35, we demonstrate that liquidity consumption exhibits significant skewness 15 minutes prior to DEWA thermal dispatch broadcasts.",
    tags: ["Order Book Microstructure", "Clean Energy", "Poisson Arrival Process"],
    readTimeMinutes: 14,
    downloadFilename: "microstructure_solar_baseload_2035.pdf",
    fileSizeBytes: "2.4 MB"
  },
  {
    id: "RES-2035-07",
    title: "Statistical Arbitrage Between Pneumatic Hyperloop Freight and Autonomous Skyway Corridors",
    author: "Kenji Sato & Aisha Bin Thani",
    affiliation: "DIFC Quantitative Laboratory",
    publishedDate: "September 2035",
    abstract: "When weather conditions degrade urban air mobility corridors, cargo transit switches abruptly to the Dubai-Abu Dhabi subterranean hyperloop. We formulate an Ornstein-Uhlenbeck mean-reverting spread model capturing the synthetic cross between HYPER-DXB-AUH and CARGO-DRONE-INDEX.",
    tags: ["Pairs Trading", "Logistics Derivatives", "Cointegration"],
    readTimeMinutes: 19,
    downloadFilename: "hyperloop_drone_arbitrage.pdf",
    fileSizeBytes: "3.1 MB"
  },
  {
    id: "RES-2035-06",
    title: "Thermodynamic Hedging: Pricing Quantum Qubit Coherence Against Grid Megawatt Hours",
    author: "Prof. Marcus Thorne",
    affiliation: "Zurich Quantum Computational Lab",
    publishedDate: "August 2035",
    abstract: "Cryogenic dilution refrigerators operating at 15 millikelvin exhibit extreme power draw non-linearities. This paper presents an analytical closed-form pricing model for Q-FLOP futures as a derivative of baseline electrical power and local cooling capacity.",
    tags: ["Quantum Compute", "Stochastic Volatility", "Cryo-Pricing"],
    readTimeMinutes: 22,
    downloadFilename: "quantum_grid_hedging.pdf",
    fileSizeBytes: "4.2 MB"
  }
];

export const MOCK_DATASETS: HistoricalDataset[] = [
  {
    id: "DATA-2035-R2",
    name: "Round 2 Consolidated Tick Tape (High Frequency)",
    format: "PARQUET",
    timeframe: "Oct 06 – Oct 10, 2035",
    fileSize: "142 MB",
    recordCount: "8,920,400 Ticks",
    description: "Full tick-by-tick trade executions and best bid/ask quotes with nanosecond timestamps across all Round 2 active assets.",
    tickersIncluded: ["SOL-MWH", "HYPER-DXB-AUH", "CARGO-DRONE-INDEX"]
  },
  {
    id: "DATA-2035-OB-R3",
    name: "Round 3 Level-2 Order Book Snapshots (100ms)",
    format: "CSV",
    timeframe: "Oct 11 – Oct 14, 2035",
    fileSize: "284 MB",
    recordCount: "3,456,000 Depth Frames",
    description: "Ten-level bid/ask depth snapshots sampled at 10 Hz for Q-FLOP and SOL-MWH with cancellation flags and queue position markers.",
    tickersIncluded: ["Q-FLOP", "SOL-MWH", "NEO-GRAPHENE"]
  },
  {
    id: "DATA-2035-WX",
    name: "National Meteorological Weather & Shamal Telemetry",
    format: "CSV",
    timeframe: "Jan 01 – Oct 14, 2035",
    fileSize: "18 MB",
    recordCount: "412,000 Readings",
    description: "Airborne particulate index (PM10/PM2.5), wind velocity, solar irradiance (W/m²), and optical visibility indices across 14 Dubai sensors.",
    tickersIncluded: ["ENVIRONMENTAL TELEMETRY"]
  }
];

export const MOCK_STARTER_STRATEGIES: StarterStrategy[] = [
  {
    id: "STRAT-01",
    name: "Mean-Reverting Solar Baseload Market Maker",
    language: "Python",
    difficulty: "BEGINNER",
    description: "A continuous two-sided quoting bot that places symmetrical limit orders around the theoretical micro-price and adjusts inventory skew.",
    codeSnippet: `"""
Dubai 2035 — The Mercantile
Sample Python Starter Bot: Avellaneda-Stoikov Inventory Market Maker
Asset: SOL-MWH
"""

import numpy as np
from mercantile_sdk import TradingBot, OrderSide, OrderType

class SolarMarketMaker(TradingBot):
    def initialize(self):
        self.ticker = "SOL-MWH"
        self.gamma = 0.1       # Risk aversion
        self.sigma = 0.22      # Estimated asset volatility
        self.k = 1.5           # Order arrival intensity
        self.max_inventory = 500

    def on_tick(self, state):
        orderbook = state.get_orderbook(self.ticker)
        mid_price = (orderbook.best_bid + orderbook.best_ask) / 2.0
        inventory = state.get_position(self.ticker).quantity
        
        # Calculate reservation price with inventory penalty
        reservation_price = mid_price - inventory * self.gamma * (self.sigma ** 2)
        half_spread = (1.0 / self.gamma) * np.log(1.0 + (self.gamma / self.k))
        
        optimal_bid = np.round(reservation_price - half_spread, 1)
        optimal_ask = np.round(reservation_price + half_spread, 1)
        
        # Cancel stale orders and post new inventory-hedged quotes
        self.cancel_all_orders(self.ticker)
        if inventory < self.max_inventory:
            self.place_order(self.ticker, OrderSide.BUY, 25, optimal_bid)
        if inventory > -self.max_inventory:
            self.place_order(self.ticker, OrderSide.SELL, 25, optimal_ask)
`
  },
  {
    id: "STRAT-02",
    name: "Cross-Corridor Pairs Arbitrage (Hyperloop vs Drone)",
    language: "Python",
    difficulty: "INTERMEDIATE",
    description: "Monitors the synthetic spread between pneumatic freight and aerial drone corridors, taking statistical mean-reversion positions when z-score exceeds 2.0.",
    codeSnippet: `"""
Dubai 2035 — The Mercantile
Pairs Arbitrage Strategy: HYPER-DXB-AUH vs CARGO-DRONE-INDEX
"""

from collections import deque
import numpy as np
from mercantile_sdk import TradingBot, OrderSide

class LogisticsPairsArb(TradingBot):
    def initialize(self):
        self.leg1 = "HYPER-DXB-AUH"
        self.leg2 = "CARGO-DRONE-INDEX"
        self.spread_window = deque(maxlen=200)
        self.hedge_ratio = 4.55 # Beta derived from OLS regression

    def on_tick(self, state):
        p1 = state.get_last_price(self.leg1)
        p2 = state.get_last_price(self.leg2)
        spread = p1 - (self.hedge_ratio * p2)
        self.spread_window.append(spread)
        
        if len(self.spread_window) < 60:
            return
            
        mean = np.mean(self.spread_window)
        std = np.std(self.spread_window)
        z_score = (spread - mean) / (std + 1e-6)
        
        # Trading signals based on 2-sigma deviation
        if z_score > 2.0:
            # Spread is too high: Sell Leg 1, Buy Leg 2
            self.market_order(self.leg1, OrderSide.SELL, 10)
            self.market_order(self.leg2, OrderSide.BUY, int(10 * self.hedge_ratio))
        elif z_score < -2.0:
            # Spread is too low: Buy Leg 1, Sell Leg 2
            self.market_order(self.leg1, OrderSide.BUY, 10)
            self.market_order(self.leg2, OrderSide.SELL, int(10 * self.hedge_ratio))
`
  }
];
