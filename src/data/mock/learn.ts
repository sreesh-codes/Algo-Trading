export type ModuleProgressionStatus = "COMPLETED" | "IN PROGRESS" | "UPCOMING";

export interface LearningModule {
  id: string; // e.g. "01"
  number: string; // "01"
  title: string; // e.g. "HOW MARKETS WORK"
  category: string;
  readTime: string;
  status: ModuleProgressionStatus;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  hasSimulator?: boolean;
  hasStrategyRunner?: boolean;
  diagramType?: "orderbook" | "inventorySkew" | "cointegration";
  codeSnippet?: string;
}

export const MOCK_LEARNING_MODULES: LearningModule[] = [
  {
    id: "01",
    number: "01",
    title: "HOW MARKETS WORK",
    category: "Foundations",
    readTime: "6 min",
    status: "COMPLETED",
    summary:
      "Understand continuous double auction market dynamics, decentralized liquidity pools, and the fundamental mechanics of price discovery.",
    content: [
      "A financial exchange is not a store where a single vendor dictates the price. Instead, it is a continuous double auction matching engine where independent buyers and sellers submit competing bids and offers simultaneously.",
      "Price discovery occurs when the highest price a buyer is willing to pay (the Best Bid) crosses or matches the lowest price a seller is willing to accept (the Best Ask). In Dubai 2035, the DMX-35 centralized matching engine processes thousands of synthetic contract orders every second with sub-millisecond deterministic execution.",
      "Liquidity represents how easily contracts can be bought or sold without distorting the current market price. When many market makers quote tight spreads, liquidity is deep and execution slippage is minimized.",
    ],
    keyTakeaways: [
      "The market price is formed dynamically by the intersection of buyer and seller queues.",
      "Bid = Maximum buying price; Ask = Minimum selling price.",
      "Spread = Ask minus Bid. Tighter spreads indicate higher market efficiency.",
    ],
    diagramType: "orderbook",
    hasSimulator: true,
    hasStrategyRunner: true,
  },
  {
    id: "02",
    number: "02",
    title: "ORDERS",
    category: "Execution Mechanics",
    readTime: "8 min",
    status: "IN PROGRESS",
    summary:
      "Master the fundamental order types: Limit, Market, Immediate-or-Cancel (IOC), and Post-Only execution protocols.",
    content: [
      "Algorithmic trading begins with knowing how instructions are communicated to the exchange order book. The two foundational order archetypes are Limit Orders and Market Orders.",
      "A **Limit Order** specifies both a quantity and a maximum buy (or minimum sell) price. It adds liquidity to the book and rests in the queue until matched by an incoming counterparty. You control execution price, but risk non-execution if the market drifts away.",
      "A **Market Order** guarantees immediate execution at the current best prevailing quotes in the order book. However, if the order size exceeds depth at the best quote, the order sweeps through the queue, causing slippage.",
      "Advanced algorithmic traders utilize execution flags such as **IOC (Immediate-or-Cancel)** to ensure quotes either fill instantaneously or vanish without resting in the public book.",
    ],
    keyTakeaways: [
      "Limit Orders: Control price, earn liquidity rebates, but bear execution delay risk.",
      "Market Orders: Guarantee immediacy, but pay the spread and incur potential slippage.",
      "IOC Orders: Immediate fill or immediate cancellation—vital for arbitrage bots.",
    ],
  },
  {
    id: "03",
    number: "03",
    title: "ORDER BOOKS",
    category: "Market Microstructure",
    readTime: "9 min",
    status: "UPCOMING",
    summary:
      "Inspect Level 2 order book queues, price-time priority matching algorithms, and depth imbalance signals.",
    content: [
      "The Level 2 (L2) Order Book maintains an organized memory of all active limit orders grouped by price level.",
      "Bids are arranged descending from the highest buying quote (Best Bid down). Asks are arranged ascending from the lowest selling quote (Best Ask up). The gap between Best Ask and Best Bid is the bid-ask spread.",
      "Under **FIFO (Price-Time Priority)** matching, an order placed earlier at price $P$ will always execute before an order placed later at the same price $P$. Algorithms compete fiercely for queue priority to secure early fills.",
    ],
    keyTakeaways: [
      "Order books match orders under strict Price-Time priority rules.",
      "Depth Imbalance (bids total volume vs asks total volume) signals near-term directional pressure.",
      "Interactive tutorial below allows hands-on order placement into the live book.",
    ],
    hasSimulator: true,
  },
  {
    id: "04",
    number: "04",
    title: "POSITION & PNL",
    category: "Portfolio Accounting",
    readTime: "7 min",
    status: "UPCOMING",
    summary:
      "Calculate real-time Mark-to-Market valuation, gross vs net exposure, and realize the distinction between realized and unrealized PnL.",
    content: [
      "Your trading portfolio tracks your current asset holdings (Position) and their ongoing financial profitability (PnL).",
      "When you buy contracts, your position is **Long (+)**; when you sell contracts short, your position is **Short (-)**.",
      "**Unrealized PnL** reflects the paper gain or loss if all open positions were closed at the current mid-price: $\\text{Unrealized} = \\text{Position} \\times (P_{\\text{mid}} - P_{\\text{entry}})$.",
      "**Realized PnL** locks in permanently only when a position is exited: $\\text{Realized} = \\text{Quantity} \\times (P_{\\text{exit}} - P_{\\text{entry}})$. Holding large unhedged positions subjects your capital to adverse market drift.",
    ],
    keyTakeaways: [
      "Long positions profit when prices rise; short positions profit when prices fall.",
      "Mark-to-market pricing calculates unrealized equity continually every tick.",
      "Position limits prevent catastrophic over-leverage during liquidity vacuums.",
    ],
    hasSimulator: true,
  },
  {
    id: "05",
    number: "05",
    title: "MARKET MAKING",
    category: "Quantitative Strategy",
    readTime: "12 min",
    status: "UPCOMING",
    summary:
      "Provide passive two-sided liquidity, capture bid-ask spreads, and manage inventory risk using the Avellaneda-Stoikov model.",
    content: [
      "Market makers continuously post both a Buy quote and a Sell quote, capturing the spread each time both sides fill.",
      "However, naive market making fails when the market moves strongly in one direction: the bot buys as prices fall and sells as prices rise, accumulating toxic inventory.",
      "Under the classic **Avellaneda-Stoikov Model**, the market maker shifts their reservation price ($r$) based on current net inventory ($q$):",
      "$$r(s, q) = s - q \\cdot \\gamma \\cdot \\sigma^2$$",
      "When holding long inventory ($q > 0$), the bot lowers both its bid and ask prices to discourage further buys and incentivize immediate selling, flattening inventory back to neutral.",
    ],
    keyTakeaways: [
      "Market makers earn revenue from the spread while providing liquidity to the exchange.",
      "Inventory risk is the greatest danger: skew quotes downward when long, upward when short.",
      "Reservation price formula dynamically re-centers quotes to protect against one-way drift.",
    ],
    diagramType: "inventorySkew",
    hasStrategyRunner: true,
    codeSnippet: `class MarketMakerBot:
    def __init__(self):
        self.gamma = 0.15     # Risk aversion
        self.sigma = 0.20     # Volatility
        self.position = 0     # Inventory
        self.half_spread = 0.20

    def on_tick(self, market):
        mid = (market.best_bid + market.best_ask) / 2.0
        # Compute reservation price skewed by inventory
        reservation = mid - (self.position * self.gamma * (self.sigma ** 2))
        
        my_bid = round(reservation - self.half_spread, 2)
        my_ask = round(reservation + self.half_spread, 2)
        
        return {"bid": my_bid, "ask": my_ask}`,
  },
  {
    id: "06",
    number: "06",
    title: "STATISTICAL ARBITRAGE",
    category: "Quantitative Strategy",
    readTime: "14 min",
    status: "UPCOMING",
    summary:
      "Exploit temporary cointegrated price discrepancies between correlated asset pairs using mean-reverting z-scores.",
    content: [
      "Statistical Arbitrage assumes that related assets (such as Dune Energy and the DIFC-100 benchmark) share an underlying economic relationship.",
      "When the price spread between the two assets temporarily diverges past its historical standard deviation, the spread tends to mean-revert back to its equilibrium.",
      "We calculate the normalized **Rolling Z-Score**:",
      "$$Z_t = \\frac{\\text{Spread}_t - \\mu_{\\text{rolling}}}{\\sigma_{\\text{rolling}}}$$",
      "Trading Rules:",
      "- When $Z_t > +2.0$: Spread is abnormally wide. Sell the overpriced leg, buy the underpriced leg.",
      "- When $Z_t < -2.0$: Spread is abnormally compressed. Buy the undervalued leg, sell the overvalued leg.",
      "- When $|Z_t| < 0.25$: Spread has converged to fair value. Close both legs to lock in arbitrage profit.",
    ],
    keyTakeaways: [
      "Statistical arbitrage does not predict market direction, only relative pricing divergence.",
      "Always verify cointegration before deploying pair mean-reversion strategies.",
      "Enforce strict stop-losses in case a fundamental regime break occurs.",
    ],
    diagramType: "cointegration",
    hasStrategyRunner: true,
    codeSnippet: `class StatArbPairBot:
    def __init__(self):
        self.z_threshold = 2.0
        self.position = 0

    def on_tick(self, market):
        p1 = market.get_price("DUNE-ENERGY")
        p2 = market.get_price("DIFC-100")
        spread = p1 - (p2 * 0.028)  # Hedge ratio
        z_score = market.calc_rolling_z(spread)

        if z_score > self.z_threshold and self.position <= 0:
            self.position = 10
            return {"action": "ENTER_SHORT_SPREAD"}
        elif z_score < -self.z_threshold and self.position >= 0:
            self.position = -10
            return {"action": "ENTER_LONG_SPREAD"}
        elif abs(z_score) < 0.3 and self.position != 0:
            self.position = 0
            return {"action": "EXIT_ALL"}`,
  },
  {
    id: "07",
    number: "07",
    title: "RISK MANAGEMENT",
    category: "Capital Preservation",
    readTime: "10 min",
    status: "UPCOMING",
    summary:
      "Implement hard stop-losses, maximum drawdown ceilings, volatility scaling, and adhere to DMX-35 circuit collars.",
    content: [
      "The primary difference between an amateur bot and an institutional quantitative model is risk controls.",
      "A trading algorithm with an 85% win rate will still blow up if it experiences a single unhedged tail event that consumes all available margin.",
      "Key Institutional Metrics:",
      "- **Maximum Drawdown (Max DD)**: The largest peak-to-trough capital decline. The Mercantile penalizes drawdowns exceeding 8.0%.",
      "- **Sharpe Ratio**: Excess return per unit of volatility: $S = \\frac{R_p - R_f}{\\sigma_p}$. High competition scores require Sharpe > 2.5.",
      "- **Circuit Collar Protection**: Never place orders outside the exchange's dynamic 12% price collar band.",
    ],
    keyTakeaways: [
      "Capital preservation takes precedence over raw return.",
      "Size positions inversely to instantaneous market volatility.",
      "Never hard-code assumptions that prices will always mean-revert.",
    ],
  },
  {
    id: "08",
    number: "08",
    title: "STRATEGY API",
    category: "Software Architecture",
    readTime: "8 min",
    status: "UPCOMING",
    summary:
      "Tour the official DMX-35 Python SDK interface: lifecycle methods, tick stream signatures, and order routing formats.",
    content: [
      "The tournament matching engine runs Python 3.12 containers in an air-gapped sandbox.",
      "Your algorithm inherits from `class MyStrategy` and must implement two primary methods:",
      "1. `__init__(self)`: Configures hyperparameters, initial buffers, and risk thresholds.",
      "2. `on_tick(self, market)`: Executed synchronously on each incoming market tick. Must return an order specification or `None` within $\\le 5.0$ milliseconds.",
      "Submissions are evaluated over 14,000 synthetic frames to verify that memory usage remains below 512MB and no external network calls are attempted.",
    ],
    keyTakeaways: [
      "All strategy code lives inside `class MyStrategy`.",
      "Execution latency SLA: Return decisions within <= 5ms per tick.",
      "Use pre-allocated numpy arrays to avoid memory garbage collection stalls.",
    ],
    hasStrategyRunner: true,
    codeSnippet: `class MyStrategy:
    def __init__(self):
        self.target_spread = 0.45
        self.position_limit = 100

    def on_tick(self, market):
        # Read market quotes
        best_bid = market.bids[0][0]
        best_ask = market.asks[0][0]
        
        # Simple threshold spread signal
        if (best_ask - best_bid) > self.target_spread:
            return {
                "action": "ORDER_SUBMIT",
                "symbol": "TUTORIAL-ENERGY",
                "side": "BUY",
                "order_type": "LIMIT",
                "price": best_bid,
                "quantity": 10
            }
        return None`,
  },
];
