import pandas as pd
from typing import List, Optional
from .models import MarketEvent

class MarketReplay:
    def __init__(self, dataset_path: str, symbol: str):
        self.dataset_path = dataset_path
        self.symbol = symbol
        self.events: List[MarketEvent] = []
        self.current_index = 0
        self._load_dataset()

    def _load_dataset(self):
        try:
            df = pd.read_csv(self.dataset_path)
            
            # Real schema: timestamp, product, bid_price_1..3, bid_volume_1..3, ask_price_1..3, ask_volume_1..3, mid_price
            required = ['timestamp', 'product', 'mid_price', 'bid_price_1', 'bid_volume_1', 'ask_price_1', 'ask_volume_1']
            for col in required:
                if col not in df.columns:
                    raise ValueError(f"Missing required column: {col}")
                    
            # Ensure chronological order
            df = df.sort_values(by='timestamp').reset_index(drop=True)
            
            for _, row in df.iterrows():
                bids = []
                for i in range(1, 4):
                    if f'bid_price_{i}' in row and pd.notna(row[f'bid_price_{i}']) and pd.notna(row[f'bid_volume_{i}']):
                        bids.append([float(row[f'bid_price_{i}']), int(row[f'bid_volume_{i}'])])
                
                asks = []
                for i in range(1, 4):
                    if f'ask_price_{i}' in row and pd.notna(row[f'ask_price_{i}']) and pd.notna(row[f'ask_volume_{i}']):
                        asks.append([float(row[f'ask_price_{i}']), int(row[f'ask_volume_{i}'])])
                
                event = MarketEvent(
                    timestamp=int(row['timestamp']),
                    symbol=str(row['product']),
                    bids=bids,
                    asks=asks,
                    mid_price=float(row['mid_price'])
                )
                self.events.append(event)
                
        except Exception as e:
            raise RuntimeError(f"Failed to load dataset {self.dataset_path}: {str(e)}")

    def next_tick(self) -> Optional[MarketEvent]:
        if self.current_index < len(self.events):
            event = self.events[self.current_index]
            self.current_index += 1
            return event
        return None

    def reset(self):
        self.current_index = 0
