import pandas as pd
import os
from backend.services.product_service import get_product_names_mapping

# Get the root directory path (Smart-Retail-360)
# backend/services/strategy_service.py -> go up 2 levels to get root
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PLAN_PATH = os.path.join(BASE_DIR, "data", "processed", "campaign_plan.csv")

def get_campaign_plan():
    if not os.path.exists(PLAN_PATH):
        raise FileNotFoundError(f"Campaign plan file not found at: {PLAN_PATH}")
    df = pd.read_csv(PLAN_PATH)
    
    # Add product names
    product_names = get_product_names_mapping()
    df['ProductName'] = df['StockCode'].map(product_names).fillna(df['StockCode'])
    
    # Ensure consistent column names
    if 'TargetCluster' in df.columns:
        df['Target_Cluster'] = df['TargetCluster']
    if 'Cluster' in df.columns and 'Target_Cluster' not in df.columns:
        df['Target_Cluster'] = df['Cluster']
    
    return df.to_dict(orient="records")
