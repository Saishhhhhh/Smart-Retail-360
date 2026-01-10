import pandas as pd

DEMAND_PATH = "../data/processed/predicted_7d_demand.csv"

def get_demand():
    df = pd.read_csv(DEMAND_PATH)
    return df.to_dict(orient="records")
