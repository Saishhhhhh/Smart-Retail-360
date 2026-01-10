import pandas as pd
import shutil
import os
from datetime import datetime


INVENTORY_PATH = "../data/processed/inventory_state.csv"
BASELINE_PATH = "../data/processed/inventory_state_day0.csv"


# -------------------------------
# Run one day forward
# -------------------------------
def run_next_day():
    print("⏳ Simulating next day...")

    inventory = pd.read_csv(INVENTORY_PATH)

    # Daily demand = 7d demand / 7
    inventory["Daily_Demand"] = inventory["Predicted_7d_Demand"] / 7

    # Reduce stock
    inventory["Current_Stock"] = (
        inventory["Current_Stock"] - inventory["Daily_Demand"]
    ).clip(lower=0).round()

    # Recompute inventory status
    inventory["OverstockRatio"] = (
        inventory["Current_Stock"] / inventory["Predicted_7d_Demand"]
    )

    def get_status(r):
        if r > 1.5:
            return "OVERSTOCKED"
        elif r < 0.8:
            return "UNDERSTOCKED"
        else:
            return "HEALTHY"

    inventory["Inventory_Status"] = inventory["OverstockRatio"].apply(get_status)

    # Save updated inventory
    inventory.to_csv(INVENTORY_PATH, index=False)

    print("📦 Inventory updated.")

    # Re-run campaign strategy
    print("🧠 Recomputing campaign plan...")
    os.system("python ../strategy/campaign_strategy.py")

    print("✅ Simulation step completed.\n")


# -------------------------------
# Reset to Day 0
# -------------------------------
def reset_simulation():
    print("🔄 Resetting simulation to Day 0...")

    shutil.copy(BASELINE_PATH, INVENTORY_PATH)

    print("📦 Inventory restored.")

    print("🧠 Recomputing campaign plan...")
    os.system("python ../strategy/campaign_strategy.py")

    print("✅ Simulation reset complete.\n")