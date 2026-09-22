import sys
import os
import json
import traceback

# Add the parent directory to sys.path so we can import backtester
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backtester.engine import BacktestEngine
from backtester.models import CompetitionConfig
import importlib.util

def run():
    if len(sys.argv) != 4:
        print(json.dumps({"status": "FAILED", "error": "Usage: python runner.py <strategy_file.py> <dataset.csv> <symbol>"}))
        sys.exit(1)
        
    strategy_path = sys.argv[1]
    dataset_path = sys.argv[2]
    symbol = sys.argv[3]
    
    try:
        # Load the strategy dynamically
        spec = importlib.util.spec_from_file_location("strategy_module", strategy_path)
        if spec is None or spec.loader is None:
            raise ImportError("Could not load strategy.")
            
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
        
        # We can pass custom configuration via env vars or hardcode for now
        config = CompetitionConfig(starting_cash=100000.0)
        
        engine = BacktestEngine(config, dataset_path, symbol, strategy_instance)
        
        # Run engine
        report = engine.run()
        
        # Only print the JSON payload to stdout
        print(json.dumps(report))
        
    except Exception as e:
        # Capture strategy errors safely
        error_msg = str(e)
        tb = traceback.format_exc()
        print(json.dumps({
            "status": "FAILED",
            "error": error_msg,
            "traceback": tb
        }))
        sys.exit(1)

if __name__ == "__main__":
    run()
