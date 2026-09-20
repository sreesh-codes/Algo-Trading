import os
import sys
import numpy as np
import pandas as pd
import argparse

def generate_scenario(seed: int, scenario: str, output_path: str, num_ticks: int = 10000, product: str = "SYNTHETIC_ASSET"):
    np.random.seed(seed)
    
    prices = np.zeros(num_ticks)
    prices[0] = 1000.0 # Starting price
    
    # 1. Generate the underlying true mid price based on the regime
    if scenario == "mean_reversion":
        # Ornstein-Uhlenbeck process
        theta = 0.1 # reversion speed
        mu = 1000.0 # long term mean
        sigma = 1.0 # volatility
        for t in range(1, num_ticks):
            dW = np.random.normal(0, 1)
            prices[t] = prices[t-1] + theta * (mu - prices[t-1]) + sigma * dW
            
    elif scenario == "momentum":
        # Trending random walk
        drift = 0.05
        sigma = 0.5
        for t in range(1, num_ticks):
            # drift occasionally flips
            if t % 2000 == 0:
                drift = -drift
            dW = np.random.normal(0, 1)
            prices[t] = prices[t-1] + drift + sigma * dW
            
    elif scenario == "high_volatility":
        # Random walk with high sigma
        sigma = 3.0
        for t in range(1, num_ticks):
            dW = np.random.normal(0, 1)
            prices[t] = prices[t-1] + sigma * dW
            
    elif scenario == "liquidity_shock":
        # Normal, but occasionally jumps
        sigma = 0.5
        for t in range(1, num_ticks):
            jump = 0
            if np.random.random() < 0.005: # 0.5% chance of a jump
                jump = np.random.normal(0, 20.0)
            dW = np.random.normal(0, 1)
            prices[t] = prices[t-1] + sigma * dW + jump
            
    elif scenario == "mixed_regime":
        # Cycles through regimes every 2000 ticks
        for t in range(1, num_ticks):
            regime = (t // 2000) % 4
            if regime == 0: # mean rev
                prices[t] = prices[t-1] + 0.1 * (1000.0 - prices[t-1]) + np.random.normal(0, 1)
            elif regime == 1: # momentum
                prices[t] = prices[t-1] + 0.1 + np.random.normal(0, 0.5)
            elif regime == 2: # high vol
                prices[t] = prices[t-1] + np.random.normal(0, 3.0)
            elif regime == 3: # shock
                jump = np.random.normal(0, 20.0) if np.random.random() < 0.005 else 0
                prices[t] = prices[t-1] + np.random.normal(0, 0.5) + jump
    else:
        # Default Random Walk
        for t in range(1, num_ticks):
            prices[t] = prices[t-1] + np.random.normal(0, 1)

    # 2. Generate the order book depths
    
    records = []
    
    for t in range(num_ticks):
        mid = round(prices[t], 2)
        
        # Determine spread based on regime
        base_spread = 0.5
        if scenario == "high_volatility":
            base_spread = np.random.uniform(1.0, 3.0)
        elif scenario == "liquidity_shock":
            # 5% chance of massive spread
            if np.random.random() < 0.05:
                base_spread = np.random.uniform(5.0, 10.0)
            else:
                base_spread = np.random.uniform(0.5, 1.5)
        elif scenario == "mixed_regime":
            if (t // 2000) % 4 == 2: # high vol
                base_spread = np.random.uniform(1.0, 3.0)
            elif (t // 2000) % 4 == 3: # shock
                base_spread = np.random.uniform(5.0, 10.0) if np.random.random() < 0.05 else np.random.uniform(0.5, 1.5)
            
        b1 = round(mid - base_spread/2, 2)
        a1 = round(mid + base_spread/2, 2)
        
        b2 = round(b1 - np.random.uniform(0.1, 0.5), 2)
        a2 = round(a1 + np.random.uniform(0.1, 0.5), 2)
        
        b3 = round(b2 - np.random.uniform(0.1, 1.0), 2)
        a3 = round(a2 + np.random.uniform(0.1, 1.0), 2)
        
        # Volumes
        v_base = 100
        if scenario == "liquidity_shock" or ((scenario == "mixed_regime") and (t // 2000) % 4 == 3):
            if base_spread > 5.0:
                v_base = 10 # very thin liquidity during shocks
                
        bv1 = int(np.random.normal(v_base, v_base * 0.2))
        av1 = int(np.random.normal(v_base, v_base * 0.2))
        bv2 = int(np.random.normal(v_base * 1.5, v_base * 0.3))
        av2 = int(np.random.normal(v_base * 1.5, v_base * 0.3))
        bv3 = int(np.random.normal(v_base * 2.0, v_base * 0.5))
        av3 = int(np.random.normal(v_base * 2.0, v_base * 0.5))
        
        bv1 = max(1, bv1)
        av1 = max(1, av1)
        bv2 = max(1, bv2)
        av2 = max(1, av2)
        bv3 = max(1, bv3)
        av3 = max(1, av3)
        
        records.append({
            "timestamp": t * 100, # e.g. every 100ms
            "product": product,
            "bid_price_1": b1,
            "bid_volume_1": bv1,
            "bid_price_2": b2,
            "bid_volume_2": bv2,
            "bid_price_3": b3,
            "bid_volume_3": bv3,
            "ask_price_1": a1,
            "ask_volume_1": av1,
            "ask_price_2": a2,
            "ask_volume_2": av2,
            "ask_price_3": a3,
            "ask_volume_3": av3,
            "mid_price": mid
        })
        
    df = pd.DataFrame(records)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Successfully generated {scenario} dataset to {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Private Market Scenario Generator")
    parser.add_argument("--seed", type=int, required=True, help="Deterministic random seed")
    parser.add_argument("--scenario", type=str, required=True, help="Scenario name (mean_reversion, momentum, high_volatility, liquidity_shock, mixed_regime)")
    parser.add_argument("--output", type=str, required=True, help="Output path for the generated CSV")
    parser.add_argument("--symbol", type=str, default="PRIVATE_ASSET", help="Asset symbol name")
    parser.add_argument("--ticks", type=int, default=10000, help="Number of ticks")
    
    args = parser.parse_args()
    
    generate_scenario(args.seed, args.scenario, args.output, args.ticks, args.symbol)
