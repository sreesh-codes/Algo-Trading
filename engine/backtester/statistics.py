from typing import List, Dict, Any
from .portfolio import Portfolio

class StatisticsEngine:
    def __init__(self, starting_cash: float):
        self.starting_cash = starting_cash
        self.equity_curve: List[Dict[str, Any]] = []
        self.peak_equity = starting_cash
        self.max_drawdown = 0.0

    def record_tick(self, timestamp: int, portfolio: Portfolio):
        current_equity = portfolio.get_total_equity()
        total_pnl = current_equity - self.starting_cash
        
        self.equity_curve.append({
            "timestamp": timestamp,
            "equity": current_equity,
            "pnl": total_pnl
        })
        
        if current_equity > self.peak_equity:
            self.peak_equity = current_equity
            
        drawdown = current_equity - self.peak_equity
        if drawdown < self.max_drawdown:
            self.max_drawdown = drawdown

    def generate_report(self, portfolio: Portfolio, runtime_ms: int) -> Dict[str, Any]:
        total_trades = len(portfolio.trades)
        winning_trades = sum(1 for t in portfolio.trades if t.realized_pnl > 0)
        losing_trades = sum(1 for t in portfolio.trades if t.realized_pnl < 0)
        
        unrealized = sum(p.unrealized_pnl for p in portfolio.positions.values())
        realized = sum(p.realized_pnl for p in portfolio.positions.values())
        
        final_positions = {
            symbol: {
                "quantity": pos.quantity,
                "average_price": pos.average_price,
                "realized_pnl": pos.realized_pnl,
                "unrealized_pnl": pos.unrealized_pnl
            }
            for symbol, pos in portfolio.positions.items()
        }
        
        trade_history = [
            {
                "trade_id": t.id,
                "order_id": t.order_id,
                "timestamp": t.timestamp,
                "symbol": t.symbol,
                "side": t.side.value,
                "price": t.price,
                "quantity": t.quantity,
                "realized_pnl": t.realized_pnl
            }
            for t in portfolio.trades
        ]
        
        # Downsample equity curve if it's too large (e.g. > 1000 points)
        # For phase 1, return the whole thing
        sampled_curve = self.equity_curve
        if len(self.equity_curve) > 1000:
            step = len(self.equity_curve) // 1000
            sampled_curve = self.equity_curve[::step]
            # Always ensure the last point is included
            if sampled_curve[-1] != self.equity_curve[-1]:
                sampled_curve.append(self.equity_curve[-1])

        return {
            "status": "COMPLETED",
            "starting_cash": self.starting_cash,
            "ending_cash": portfolio.cash,
            "realized_pnl": realized,
            "unrealized_pnl": unrealized,
            "total_pnl": realized + unrealized,
            "max_drawdown": self.max_drawdown,
            "trade_count": total_trades,
            "winning_trades": winning_trades,
            "losing_trades": losing_trades,
            "final_positions": final_positions,
            "runtime_ms": runtime_ms,
            "equity_curve": sampled_curve,
            "trades": trade_history
        }
