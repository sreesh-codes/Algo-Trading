from typing import Dict, List
from .models import Position, Trade, OrderSide

class Portfolio:
    def __init__(self, starting_cash: float):
        self.initial_cash = starting_cash
        self.cash = starting_cash
        self.positions: Dict[str, Position] = {}
        self.trades: List[Trade] = []
        
    def get_position(self, symbol: str) -> Position:
        if symbol not in self.positions:
            self.positions[symbol] = Position(symbol=symbol)
        return self.positions[symbol]

    def add_trade(self, trade: Trade):
        self.trades.append(trade)
        pos = self.get_position(trade.symbol)
        
        # Calculate impact on position and P&L
        trade_qty = trade.quantity if trade.side == OrderSide.BUY else -trade.quantity
        trade_value = trade.quantity * trade.price
        
        # Cash deduction/addition
        if trade.side == OrderSide.BUY:
            self.cash -= trade_value
        else:
            self.cash += trade_value
            
        # P&L Calculation logic (Average Cost)
        if pos.quantity == 0:
            # Opening new position
            pos.average_price = trade.price
            pos.quantity = trade_qty
        elif (pos.quantity > 0 and trade_qty > 0) or (pos.quantity < 0 and trade_qty < 0):
            # Increasing existing position
            total_value = (abs(pos.quantity) * pos.average_price) + trade_value
            pos.quantity += trade_qty
            pos.average_price = total_value / abs(pos.quantity)
        else:
            # Decreasing or reversing position
            closing_qty = min(abs(pos.quantity), abs(trade_qty))
            
            # Realized P&L
            if pos.quantity > 0: # Long being closed
                realized = closing_qty * (trade.price - pos.average_price)
            else: # Short being closed
                realized = closing_qty * (pos.average_price - trade.price)
                
            pos.realized_pnl += realized
            trade.realized_pnl = realized
            
            new_qty = pos.quantity + trade_qty
            if new_qty == 0:
                pos.quantity = 0
                pos.average_price = 0.0
            elif (pos.quantity > 0 and new_qty < 0) or (pos.quantity < 0 and new_qty > 0):
                # Reversed position
                pos.quantity = new_qty
                pos.average_price = trade.price
            else:
                # Partially closed
                pos.quantity = new_qty
                # average_price remains the same

    def update_unrealized_pnl(self, symbol: str, current_price: float):
        pos = self.get_position(symbol)
        if pos.quantity == 0:
            pos.unrealized_pnl = 0.0
        elif pos.quantity > 0:
            pos.unrealized_pnl = pos.quantity * (current_price - pos.average_price)
        else:
            pos.unrealized_pnl = abs(pos.quantity) * (pos.average_price - current_price)

    def get_total_equity(self) -> float:
        unrealized = sum(p.unrealized_pnl for p in self.positions.values())
        return self.cash + unrealized

    def get_total_realized_pnl(self) -> float:
        return sum(p.realized_pnl for p in self.positions.values())
