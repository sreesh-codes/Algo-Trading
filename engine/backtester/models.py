from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional

class OrderSide(Enum):
    BUY = "BUY"
    SELL = "SELL"

class OrderStatus(Enum):
    PENDING = "PENDING"
    PARTIALLY_FILLED = "PARTIALLY_FILLED"
    FILLED = "FILLED"
    CANCELLED = "CANCELLED"
    REJECTED = "REJECTED"

class OrderType(Enum):
    LIMIT = "LIMIT"
    MARKET = "MARKET"

@dataclass
class Order:
    id: str
    symbol: str
    side: OrderSide
    order_type: OrderType
    price: float
    quantity: int
    timestamp: int
    status: OrderStatus = OrderStatus.PENDING
    filled_quantity: int = 0

@dataclass
class Trade:
    id: str
    order_id: str
    symbol: str
    side: OrderSide
    price: float
    quantity: int
    timestamp: int
    realized_pnl: float = 0.0

@dataclass
class MarketEvent:
    timestamp: int
    symbol: str
    bids: List[List[float]] # [[price, volume], ...]
    asks: List[List[float]] # [[price, volume], ...]
    mid_price: float

@dataclass
class Position:
    symbol: str
    quantity: int = 0
    average_price: float = 0.0
    realized_pnl: float = 0.0
    unrealized_pnl: float = 0.0

@dataclass
class CompetitionConfig:
    starting_cash: float = 100000.0
    max_position: Dict[str, int] = field(default_factory=dict)
    max_order_quantity: Dict[str, int] = field(default_factory=dict)
    max_open_orders: int = 100
    allow_market_orders: bool = False
    transaction_fee_bps: float = 0.0
