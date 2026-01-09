import numpy as np
import pandas as pd

demand_df = pd.read_csv('data/processed/predicted_7d_demand.csv')

print("Demand_df: ", demand_df.shape)

np.random.seed(42)

demand_df["Current_Stock"] = (
    demand_df["Predicted_7d_Demand"] *
    np.random.uniform(0.5, 2.5, size=len(demand_df))
).astype(int)

def classify_inventory(row):
    if row["Current_Stock"] > row["Predicted_7d_Demand"] * 1.5:
        return "OVERSTOCKED"
    elif row["Current_Stock"] < row["Predicted_7d_Demand"] * 0.8:
        return "UNDERSTOCKED"
    else:
        return "HEALTHY"

demand_df["Inventory_Status"] = demand_df.apply(classify_inventory, axis=1)

import os
# os.makedirs('/inventory', exist_ok=True)

path = '/inventory/inventory_state.csv'

demand_df.to_csv(path, index=False)

print("Inventory state saved to:", path)

print("\nInventory Status Distribution:")
print(demand_df["Inventory_Status"].value_counts())

print("\nSample Rows:")
print(demand_df.head())