import pandas as pd

INVENTORY_PATH = "../data/processed/inventory_state.csv"

def get_inventory():
    df = pd.read_csv(INVENTORY_PATH)
    return df.to_dict(orient="records")
