from typing import List, Dict, Any
from backtester.models import Order, OrderSide, OrderType, MarketEvent
import uuid

class Strategy:
    def __init__(self):
        self._orders: List[Order] = []
        self._internal_state: Dict[str, Any] = {}

    def on_start(self, context: Dict[str, Any]):
        """Called once before the simulation starts."""
        pass

    def on_tick(self, market: MarketEvent):
        """Called on every market data update."""
        pass

    def on_order_update(self, order: Order):
        """Called when an order status changes (filled, cancelled, etc)."""
        pass

    def on_end(self, context: Dict[str, Any]):
        """Called once after the simulation ends."""
        pass

    def buy(self, symbol: str, price: float, quantity: int) -> str:
        """Place a buy limit order."""
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
        if price <= 0:
            raise ValueError("Price must be positive")
            
        order_id = str(uuid.uuid4())
        order = Order(
            id=order_id,
            symbol=symbol,
            side=OrderSide.BUY,
            order_type=OrderType.LIMIT,
            price=price,
            quantity=quantity,
            timestamp=0 # Timestamp injected by engine
        )
        self._orders.append(order)
        return order_id

    def sell(self, symbol: str, price: float, quantity: int) -> str:
        """Place a sell limit order."""
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
        if price <= 0:
            raise ValueError("Price must be positive")
            
        order_id = str(uuid.uuid4())
        order = Order(
            id=order_id,
            symbol=symbol,
            side=OrderSide.SELL,
            order_type=OrderType.LIMIT,
            price=price,
            quantity=quantity,
            timestamp=0 # Timestamp injected by engine
        )
        self._orders.append(order)
        return order_id

    def cancel_order(self, order_id: str):
        """Notifies the engine to cancel an open order."""
        # Special magic order to signal cancellation to the engine
        order = Order(
            id=order_id,
            symbol="",
            side=OrderSide.BUY,
            order_type=OrderType.LIMIT,
            price=0,
            quantity=0,
            timestamp=0
        )
        order.status = "REQUEST_CANCEL" # type: ignore
        self._orders.append(order)

    # Private method used by the engine to fetch emitted orders
    def _flush_orders(self, current_timestamp: int) -> List[Order]:
        orders = self._orders
        self._orders = []
        for o in orders:
            if o.timestamp == 0:
                o.timestamp = current_timestamp
        return orders
