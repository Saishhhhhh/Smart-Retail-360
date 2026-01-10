import pandas as pd
import os
from backend.services.product_service import get_product_names_mapping

# Get the root directory path (Smart-Retail-360)
# backend/services/inventory_service.py -> go up 2 levels to get root
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Try inventory_state.csv in inventory/ directory first, then data/processed/
inventory_path_1 = os.path.join(BASE_DIR, "inventory", "inventory_state.csv")
inventory_path_2 = os.path.join(BASE_DIR, "data", "processed", "inventory_state.csv")

# Use the first path that exists
if os.path.exists(inventory_path_1):
    INVENTORY_PATH = inventory_path_1
elif os.path.exists(inventory_path_2):
    INVENTORY_PATH = inventory_path_2
else:
    # Fallback to inventory path
    INVENTORY_PATH = inventory_path_1

def get_inventory():
    if not os.path.exists(INVENTORY_PATH):
        raise FileNotFoundError(f"Inventory file not found at: {INVENTORY_PATH}")
    df = pd.read_csv(INVENTORY_PATH)
    
    # Add product names
    product_names = get_product_names_mapping()
    df['ProductName'] = df['StockCode'].map(product_names).fillna(df['StockCode'])
    
    return df.to_dict(orient="records")
