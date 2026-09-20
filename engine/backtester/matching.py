import uuid
from typing import List, Tuple, Dict
from .models import Order, MarketEvent, OrderSide, OrderStatus, OrderType, Trade

class MatchingEngine:
    def __init__(self):
        # Resting orders (persistent)
        self.bids: List[Order] = [] # Sorted highest price first, then oldest
        self.asks: List[Order] = [] # Sorted lowest price first, then oldest
        
        # Shadow orders from the dataset snapshot (reset each tick)
        self.shadow_bids: List[Order] = []
        self.shadow_asks: List[Order] = []
        
        self.trades_this_tick: List[Trade] = []

    def inject_shadow_book(self, event: MarketEvent):
        """Inject the historical order book snapshot as shadow orders."""
        self.shadow_bids.clear()
        self.shadow_asks.clear()
        
        for price, vol in event.bids:
            order = Order(
                id=f"shadow_bid_{price}_{event.timestamp}",
                symbol=event.symbol,
                side=OrderSide.BUY,
                order_type=OrderType.LIMIT,
                price=price,
                quantity=vol,
                timestamp=event.timestamp
            )
            self.shadow_bids.append(order)
            
        for price, vol in event.asks:
            order = Order(
                id=f"shadow_ask_{price}_{event.timestamp}",
                symbol=event.symbol,
                side=OrderSide.SELL,
                order_type=OrderType.LIMIT,
                price=price,
                quantity=vol,
                timestamp=event.timestamp
            )
            self.shadow_asks.append(order)
            
        # Sort shadow books
        self.shadow_bids.sort(key=lambda x: (-x.price, x.timestamp))
        self.shadow_asks.sort(key=lambda x: (x.price, x.timestamp))

    def _get_combined_bids(self) -> List[Order]:
        combined = self.bids + self.shadow_bids
        combined.sort(key=lambda x: (-x.price, x.timestamp))
        return [o for o in combined if o.status not in (OrderStatus.FILLED, OrderStatus.CANCELLED)]

    def _get_combined_asks(self) -> List[Order]:
        combined = self.asks + self.shadow_asks
        combined.sort(key=lambda x: (x.price, x.timestamp))
        return [o for o in combined if o.status not in (OrderStatus.FILLED, OrderStatus.CANCELLED)]

    def add_order(self, order: Order):
        # Try to match immediately
        if order.side == OrderSide.BUY:
            self._match_buy_order(order)
            if order.status != OrderStatus.FILLED and order.order_type == OrderType.LIMIT:
                self.bids.append(order)
                self.bids.sort(key=lambda x: (-x.price, x.timestamp))
        else:
            self._match_sell_order(order)
            if order.status != OrderStatus.FILLED and order.order_type == OrderType.LIMIT:
                self.asks.append(order)
                self.asks.sort(key=lambda x: (x.price, x.timestamp))

    def _match_buy_order(self, buy_order: Order):
        asks = self._get_combined_asks()
        
        for ask in asks:
            if buy_order.status == OrderStatus.FILLED:
                break
                
            if buy_order.order_type == OrderType.LIMIT and buy_order.price < ask.price:
                break # Ask price is too high for our buy limit
                
            match_qty = min(buy_order.quantity - buy_order.filled_quantity, 
                            ask.quantity - ask.filled_quantity)
                            
            if match_qty > 0:
                match_price = ask.price # Price improvement: matched at resting order price
                
                # Execute Trade
                self._execute_trade(buy_order, ask, match_price, match_qty)

    def _match_sell_order(self, sell_order: Order):
        bids = self._get_combined_bids()
        
        for bid in bids:
            if sell_order.status == OrderStatus.FILLED:
                break
                
            if sell_order.order_type == OrderType.LIMIT and sell_order.price > bid.price:
                break # Bid price is too low for our sell limit
                
            match_qty = min(sell_order.quantity - sell_order.filled_quantity, 
                            bid.quantity - bid.filled_quantity)
                            
            if match_qty > 0:
                match_price = bid.price # Price improvement: matched at resting order price
                
                # Execute Trade
                self._execute_trade(sell_order, bid, match_price, match_qty)

    def _execute_trade(self, taker_order: Order, maker_order: Order, price: float, quantity: int):
        taker_order.filled_quantity += quantity
        maker_order.filled_quantity += quantity
        
        if taker_order.filled_quantity >= taker_order.quantity:
            taker_order.status = OrderStatus.FILLED
        else:
            taker_order.status = OrderStatus.PARTIALLY_FILLED
            
        if maker_order.filled_quantity >= maker_order.quantity:
            maker_order.status = OrderStatus.FILLED
        else:
            maker_order.status = OrderStatus.PARTIALLY_FILLED
            
        trade = Trade(
            id=str(uuid.uuid4()),
            order_id=taker_order.id, # We attribute trade to taker, but the portfolio will parse it
            symbol=taker_order.symbol,
            side=taker_order.side,
            price=price,
            quantity=quantity,
            timestamp=max(taker_order.timestamp, maker_order.timestamp)
        )
        self.trades_this_tick.append(trade)
        
        # In a real system, we also generate a Trade for the maker order to inform their portfolio,
        # but in our engine, Portfolio.add_trade processes by matching order_id to tracked orders.
        # We must emit two trades (one for buyer, one for seller) so both portfolios update.
        maker_trade = Trade(
            id=str(uuid.uuid4()),
            order_id=maker_order.id,
            symbol=maker_order.symbol,
            side=maker_order.side,
            price=price,
            quantity=quantity,
            timestamp=trade.timestamp
        )
        self.trades_this_tick.append(maker_trade)

    def cancel_order(self, order_id: str) -> bool:
        for order_list in [self.bids, self.asks]:
            for order in order_list:
                if order.id == order_id:
                    order.status = OrderStatus.CANCELLED
                    return True
        return False

    def process_orders(self, event: MarketEvent) -> List[Trade]:
        # Ticking the matching engine just flushes the accumulated trades and resets
        # because the matching happens synchronously in add_order()
        trades = self.trades_this_tick.copy()
        self.trades_this_tick.clear()
        
        # Cleanup filled/cancelled orders
        self.bids = [o for o in self.bids if o.status not in (OrderStatus.FILLED, OrderStatus.CANCELLED)]
        self.asks = [o for o in self.asks if o.status not in (OrderStatus.FILLED, OrderStatus.CANCELLED)]
        
        return trades
