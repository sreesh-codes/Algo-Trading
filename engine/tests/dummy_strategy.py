import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from participant_runtime.strategy_interface import Strategy

class MyStrategy(Strategy):
    def on_tick(self, market):
        # A simple dummy strategy: Buy if price drops below 100, Sell if above 102
        if market.mid_price < 100.0:
            self.buy(market.symbol, market.asks[0][0], 10)
        elif market.mid_price > 102.0:
            self.sell(market.symbol, market.bids[0][0], 10)
            


    def on_order_update(self, order):
        print(f"Order Update: {order.side} {order.quantity} @ {order.price} -> {order.status}")
