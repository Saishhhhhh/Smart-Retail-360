import pandas as pd
import os

# Get the root directory path (Smart-Retail-360)
# backend/services/forecast_service.py -> go up 2 levels to get root
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEMAND_PATH = os.path.join(BASE_DIR, "data", "processed", "predicted_7d_demand.csv")

def get_demand():
    if not os.path.exists(DEMAND_PATH):
        raise FileNotFoundError(f"Demand file not found at: {DEMAND_PATH}")
    df = pd.read_csv(DEMAND_PATH)
    return df.to_dict(orient="records")
