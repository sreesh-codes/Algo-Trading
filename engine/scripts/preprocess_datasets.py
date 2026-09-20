import os
import pandas as pd
import glob

def simulate_depth(row):
    bid = row['bid']
    ask = row['ask']
    vol = row['volume']
    
    # Ensure minimum volumes
    vol = max(vol, 10)
    
    bid_v1 = int(vol * 0.5)
    bid_v2 = int(vol * 0.3)
    bid_v3 = int(vol * 0.2)
    
    ask_v1 = int(vol * 0.5)
    ask_v2 = int(vol * 0.3)
    ask_v3 = int(vol * 0.2)
    
    return pd.Series({
        'timestamp': int(row['timestamp']),
        'product': str(row['asset']),
        'bid_price_1': float(bid),
        'bid_volume_1': bid_v1,
        'bid_price_2': float(bid - 1.0),
        'bid_volume_2': bid_v2,
        'bid_price_3': float(bid - 2.0),
        'bid_volume_3': bid_v3,
        'ask_price_1': float(ask),
        'ask_volume_1': ask_v1,
        'ask_price_2': float(ask + 1.0),
        'ask_volume_2': ask_v2,
        'ask_price_3': float(ask + 2.0),
        'ask_volume_3': ask_v3,
        'mid_price': float(row['mid_price'])
    })

def main():
    datasets_dir = os.path.join(os.path.dirname(__file__), '..', 'datasets')
    
    # Create directories
    pub_dev_dir = os.path.join(datasets_dir, 'public', 'development')
    pub_eval_dir = os.path.join(datasets_dir, 'public', 'evaluation')
    priv_scen_dir = os.path.join(datasets_dir, 'private', 'scenario_01')
    
    for d in [pub_dev_dir, pub_eval_dir, priv_scen_dir]:
        os.makedirs(d, exist_ok=True)
        
    csv_files = [f for f in glob.glob(os.path.join(datasets_dir, '*.csv')) if os.path.isfile(f)]
    
    for file_path in csv_files:
        print(f"Processing {file_path}...")
        df = pd.read_csv(file_path)
        
        # Ensure we sort by timestamp
        if 'timestamp' in df.columns:
            df = df.sort_values('timestamp').reset_index(drop=True)
            
        # Apply transformation
        transformed_df = df.apply(simulate_depth, axis=1)
        
        # Split logic: 50% / 20% / 30%
        n = len(transformed_df)
        dev_end = int(n * 0.5)
        eval_end = int(n * 0.7)
        
        dev_df = transformed_df.iloc[:dev_end]
        eval_df = transformed_df.iloc[dev_end:eval_end]
        scen_df = transformed_df.iloc[eval_end:]
        
        filename = os.path.basename(file_path)
        
        dev_df.to_csv(os.path.join(pub_dev_dir, filename), index=False)
        eval_df.to_csv(os.path.join(pub_eval_dir, filename), index=False)
        scen_df.to_csv(os.path.join(priv_scen_dir, filename), index=False)
        
        print(f"  -> Saved {len(dev_df)} to development")
        print(f"  -> Saved {len(eval_df)} to evaluation")
        print(f"  -> Saved {len(scen_df)} to scenario_01")
        
        # Delete original
        os.remove(file_path)

if __name__ == "__main__":
    main()
