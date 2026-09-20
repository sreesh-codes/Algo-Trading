import uuid
import random
from typing import List
from collections import deque
import numpy as np

from .models import MarketEvent, Order, OrderSide, OrderType, Trade

class MarketBot:
    def __init__(self, bot_id: str, symbol: str):
        self.bot_id = bot_id
        self.symbol = symbol
        self.position = 0
        self.cash = 100000.0

    def on_tick(self, event: MarketEvent) -> List[Order]:
        return []

    def on_order_fill(self, trade: Trade):
        # Update position and cash
        if trade.side == OrderSide.BUY:
            self.position += trade.quantity
            self.cash -= (trade.price * trade.quantity)
        else:
            self.position -= trade.quantity
            self.cash += (trade.price * trade.quantity)
            
    def create_order(self, side: OrderSide, order_type: OrderType, price: float, quantity: int, timestamp: int) -> Order:
        return Order(
            id=f"{self.bot_id}_{uuid.uuid4()}",
            symbol=self.symbol,
            side=side,
            order_type=order_type,
            price=price,
            quantity=quantity,
            timestamp=timestamp
        )


class MarketMakerBot(MarketBot):
    def __init__(self, bot_id: str, symbol: str):
        super().__init__(bot_id, symbol)
        self.inventory_limit = 1000
        self.base_spread = 0.5
        
    def on_tick(self, event: MarketEvent) -> List[Order]:
        # Cancel old orders (the engine handles limit orders normally, 
        # but to keep it simple, the MM will just spray short-lived IOC-like orders or 
        # the engine can cancel them if we don't manage them. We will just spray new limits 
        # and assume the engine doesn't penalize spam, or we keep track of active orders.)
        
        # For simplicity, Market Maker will issue passive orders and we will rely on 
        # a slightly longer-lived strategy, but here we just place fresh limits each tick.
        # Since we don't track our active orders easily, let's just make it a simple reactive bot.
        
        orders = []
        
        fair_value = event.mid_price
        
        # Inventory penalty
        inventory_skew = (self.position / self.inventory_limit) * 0.5
        reservation_price = fair_value - inventory_skew
        
        bid_price = round(reservation_price - (self.base_spread / 2), 2)
        ask_price = round(reservation_price + (self.base_spread / 2), 2)
        
        qty = 50
        
        # Only quote if not over inventory limit
        if self.position < self.inventory_limit:
            orders.append(self.create_order(OrderSide.BUY, OrderType.LIMIT, bid_price, qty, event.timestamp))
            
        if self.position > -self.inventory_limit:
            orders.append(self.create_order(OrderSide.SELL, OrderType.LIMIT, ask_price, qty, event.timestamp))
            
        return orders


class MomentumBot(MarketBot):
    def __init__(self, bot_id: str, symbol: str):
        super().__init__(bot_id, symbol)
        self.history = deque(maxlen=20)
        self.threshold = 0.005 # 0.5% return
        
    def on_tick(self, event: MarketEvent) -> List[Order]:
        self.history.append(event.mid_price)
        orders = []
        
        if len(self.history) == 20:
            returns = (self.history[-1] - self.history[0]) / self.history[0]
            if returns > self.threshold and self.position < 500:
                orders.append(self.create_order(OrderSide.BUY, OrderType.LIMIT, event.asks[0][0] + 0.1, 100, event.timestamp))
            elif returns < -self.threshold and self.position > -500:
                orders.append(self.create_order(OrderSide.SELL, OrderType.LIMIT, event.bids[0][0] - 0.1, 100, event.timestamp))
                
        return orders


class MeanReversionBot(MarketBot):
    def __init__(self, bot_id: str, symbol: str):
        super().__init__(bot_id, symbol)
        self.history = deque(maxlen=50)
        
    def on_tick(self, event: MarketEvent) -> List[Order]:
        self.history.append(event.mid_price)
        orders = []
        
        if len(self.history) == 50:
            mean = np.mean(self.history)
            std = np.std(self.history)
            if std > 0:
                z_score = (event.mid_price - mean) / std
                
                if z_score > 2.0 and self.position > -300: # Overvalued -> Sell
                    orders.append(self.create_order(OrderSide.SELL, OrderType.LIMIT, event.bids[0][0], 50, event.timestamp))
                elif z_score < -2.0 and self.position < 300: # Undervalued -> Buy
                    orders.append(self.create_order(OrderSide.BUY, OrderType.LIMIT, event.asks[0][0], 50, event.timestamp))
                    
        return orders


class LiquidityBot(MarketBot):
    def __init__(self, bot_id: str, symbol: str):
        super().__init__(bot_id, symbol)
        
    def on_tick(self, event: MarketEvent) -> List[Order]:
        orders = []
        # 10% chance to place a passive limit order deep in the book
        if random.random() < 0.1:
            side = random.choice([OrderSide.BUY, OrderSide.SELL])
            if side == OrderSide.BUY:
                price = round(event.mid_price * (1 - random.uniform(0.01, 0.05)), 2)
            else:
                price = round(event.mid_price * (1 + random.uniform(0.01, 0.05)), 2)
            orders.append(self.create_order(side, OrderType.LIMIT, price, random.randint(10, 100), event.timestamp))
        return orders


class RandomTraderBot(MarketBot):
    def __init__(self, bot_id: str, symbol: str):
        super().__init__(bot_id, symbol)
        
    def on_tick(self, event: MarketEvent) -> List[Order]:
        orders = []
        # 5% chance to aggressively cross the spread
        if random.random() < 0.05:
            side = random.choice([OrderSide.BUY, OrderSide.SELL])
            price = event.asks[0][0] if side == OrderSide.BUY else event.bids[0][0]
            orders.append(self.create_order(side, OrderType.LIMIT, price, random.randint(20, 80), event.timestamp))
        return orders
