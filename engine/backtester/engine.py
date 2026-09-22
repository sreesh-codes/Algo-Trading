import time
import sys
import json
from typing import Dict, Any

from .models import CompetitionConfig, MarketEvent
from .market import MarketReplay
from .matching import MatchingEngine
from .portfolio import Portfolio
from .statistics import StatisticsEngine
from .bots import MarketMakerBot, MomentumBot, MeanReversionBot, LiquidityBot, RandomTraderBot
# Importing the user strategy will be done dynamically by the runner

class BacktestEngine:
    def __init__(self, config: CompetitionConfig, dataset_path: str, symbol: str, strategy_instance):
        self.config = config
        self.market = MarketReplay(dataset_path, symbol)
        self.matching = MatchingEngine()
        self.portfolio = Portfolio(config.starting_cash)
        self.statistics = StatisticsEngine(config.starting_cash)
        self.strategy = strategy_instance
        
        # Initialize hidden bots
        self.bots = [
            MarketMakerBot("bot_mm", symbol),
            MomentumBot("bot_mom", symbol),
            MeanReversionBot("bot_mr", symbol),
            LiquidityBot("bot_liq", symbol),
            RandomTraderBot("bot_rnd", symbol)
        ]
        
    def run(self) -> Dict[str, Any]:
        start_time = time.time()
        
        # 1. On Start
        if hasattr(self.strategy, 'on_start'):
            self.strategy.on_start({"starting_cash": self.config.starting_cash})
        
        # Pull any initial orders placed during on_start
        initial_orders = []
        if hasattr(self.strategy, '_flush_orders'):
            initial_orders = self.strategy._flush_orders(0)
        for order in initial_orders:
            self.matching.add_order(order)
            
        # 2. Main Event Loop
        while True:
            event = self.market.next_tick()
            if not event:
                break
                
            # 1. Inject shadow book
            self.matching.inject_shadow_book(event)
            
            # 2. Tick bots
            for bot in self.bots:
                bot_orders = bot.on_tick(event)
                for order in bot_orders:
                    self.matching.add_order(order)
                    
            # 3. Update mark-to-market prices
            self.portfolio.update_unrealized_pnl(event.symbol, event.mid_price)
            
            # 4. Tick participant strategy
            order_dict = None
            if hasattr(self.strategy, 'on_tick'):
                order_dict = self.strategy.on_tick(event)
            
            # Flush new orders from strategy
            new_orders = []
            if hasattr(self.strategy, '_flush_orders'):
                new_orders = self.strategy._flush_orders(event.timestamp)
                
            # Handle dictionary or list of dictionaries returns from on_tick
            if order_dict:
                from .models import Order, OrderSide, OrderType
                import uuid
                
                # Convert a single dict to a list for uniform processing
                raw_orders = order_dict if isinstance(order_dict, list) else [order_dict]
                
                for raw_order in raw_orders:
                    if isinstance(raw_order, dict):
                        # Accept either {"action": "ORDER_SUBMIT"} or just {"side": "BUY", "quantity": 10}
                        side = OrderSide.BUY if raw_order.get("side") == "BUY" else OrderSide.SELL
                        legacy_order = Order(
                            id=str(uuid.uuid4()),
                            symbol=raw_order.get("symbol") or raw_order.get("asset") or event.symbol,
                            side=side,
                            order_type=OrderType.LIMIT,
                            price=raw_order.get("price", 0.0),
                            quantity=raw_order.get("quantity", 0),
                            timestamp=event.timestamp
                        )
                        new_orders.append(legacy_order)

            for order in new_orders:
                if getattr(order, 'status', None) == "REQUEST_CANCEL":
                    self.matching.cancel_order(order.id)
                else:
                    self.matching.add_order(order)
                    
            # 5. Process Orders & Match
            trades = self.matching.process_orders(event)
            
            # 6. Route Fills
            for trade in trades:
                # Route to portfolio if it belongs to participant
                if not trade.order_id.startswith("bot_") and not trade.order_id.startswith("shadow_"):
                    self.portfolio.add_trade(trade)
                
                # Route to specific bot if it belongs to one
                if trade.order_id.startswith("bot_"):
                    bot_id = trade.order_id.split("_")[1] # e.g. "bot_mm"
                    full_bot_id = f"bot_{bot_id}"
                    for bot in self.bots:
                        if bot.bot_id == full_bot_id:
                            bot.on_order_fill(trade)
                            break
                            
            # Record tick statistics
            self.statistics.record_tick(event.timestamp, self.portfolio)
            
        # 3. On End
        if hasattr(self.strategy, 'on_end'):
            self.strategy.on_end({"ending_cash": self.portfolio.cash})
        
        # 4. Generate Report
        runtime_ms = int((time.time() - start_time) * 1000)
        report = self.statistics.generate_report(self.portfolio, runtime_ms)
        
        return report

def run_backtest_cli(strategy_path: str, dataset_path: str, symbol: str):
    import importlib.util
    import os
    
    # Load the strategy dynamically
    spec = importlib.util.spec_from_file_location("strategy_module", strategy_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not load strategy from {strategy_path}")
    strategy_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(strategy_module)
    
    import inspect
    
    strategy_class = None
    if hasattr(strategy_module, 'MyStrategy'):
        strategy_class = strategy_module.MyStrategy
    else:
        for name, obj in inspect.getmembers(strategy_module, inspect.isclass):
            if hasattr(obj, 'on_tick') and callable(getattr(obj, 'on_tick')):
                strategy_class = obj
                break
                
    if not strategy_class:
        raise AttributeError("Strategy file must define a class with an 'on_tick' method")
        
    strategy_instance = strategy_class()
    
    config = CompetitionConfig(starting_cash=100000.0)
    engine = BacktestEngine(config, dataset_path, symbol, strategy_instance)
    
    report = engine.run()
    
    print(json.dumps(report, indent=2))
    
if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python -m backtester.engine <strategy_file.py> <dataset.csv> <symbol>")
        sys.exit(1)
        
    run_backtest_cli(sys.argv[1], sys.argv[2], sys.argv[3])
