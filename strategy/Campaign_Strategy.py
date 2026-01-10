import pandas as pd
inventory = pd.read_csv("../inventory/inventory_state.csv")
customers = pd.read_csv("../data/processed/customer_segments.csv")
transactions = pd.read_csv("../data/processed/cleaned.csv")
transactions = transactions.merge(customers[['Customer ID','ClusterLabel']], on="Customer ID")

product_cluster = (
    transactions.groupby(["StockCode", "ClusterLabel"])
    .size()
    .reset_index(name="count")
)

total_per_product = (
    product_cluster.groupby("StockCode")["count"]
    .sum()
    .reset_index(name="total")
)

product_cluster = product_cluster.merge(total_per_product, on="StockCode")
product_cluster["share"] = product_cluster["count"] / product_cluster["total"]

def choose_target_cluster(df_product):
    # df_product is all rows for one StockCode
    
    cluster_share = dict(zip(df_product["ClusterLabel"], df_product["share"]))

    at_risk = cluster_share.get("At-Risk Customers", 0)
    new = cluster_share.get("New Customers", 0)
    vip = cluster_share.get("VIP Customers", 0)
    regular = cluster_share.get("Regular Customers", 0)

    # Marketing priority logic
    if at_risk >= 0.15:
        return "At-Risk Customers"
    elif new >= 0.20:
        return "New Customers"
    elif vip >= 0.10:
        return "VIP Customers"
    else:
        return "Regular Customers"

target_clusters = (
    product_cluster
    .groupby("StockCode")
    .apply(choose_target_cluster)
    .reset_index()
)

target_clusters.columns = ["StockCode", "TargetCluster"]

df = inventory.merge(target_clusters, on="StockCode", how="left")

df["OverstockRatio"] = df["Current_Stock"] / df["Predicted_7d_Demand"]
df = inventory.merge(target_clusters, on="StockCode", how="left")
df = df[df["Predicted_7d_Demand"] > 0]

DEMAND_THRESHOLD = 30

df["DemandLevel"] = df["Predicted_7d_Demand"].apply(
    lambda x: "High" if x >= DEMAND_THRESHOLD else "Low"
)

df["OverstockRatio"] = df["Current_Stock"] / df["Predicted_7d_Demand"]

df["IsOverstock"] = df["OverstockRatio"] > 1.5
def get_objective(row):
    if row["IsOverstock"] and row["DemandLevel"] == "Low":
        return "Clear Stock"
    elif row["IsOverstock"] and row["DemandLevel"] == "High":
        return "Customer Acquisition"
    elif not row["IsOverstock"] and row["DemandLevel"] == "High":
        return "Maximize Profit"
    else:
        return "Retention"

df["Objective"] = df.apply(get_objective, axis=1)

def choose_cluster(row):
    if row["Objective"] == "Clear Stock":
        return "At-Risk Customers"
    elif row["Objective"] == "Customer Acquisition":
        return "New Customers"
    elif row["Objective"] == "Maximize Profit":
        return "VIP Customers"
    else:
        return "Regular Customers"
    
df["TargetCluster"] = df.apply(choose_cluster, axis=1)

def get_discount(row):
    r = row["OverstockRatio"]
    obj = row["Objective"]

    if obj == "Clear Stock":
        if r > 2.5:
            return 60
        elif r > 2.0:
            return 50
        else:
            return 40

    elif obj == "Customer Acquisition":
        if r > 2.0:
            return 30
        else:
            return 20

    elif obj == "Maximize Profit":
        return 5   # VIP exclusivity, no margin killing

    elif obj == "Retention":
        return 10
df["Discount"] = df.apply(get_discount, axis=1)

MIN_DEMAND = 10
MIN_STOCK = 15
df = df[
    (df["Predicted_7d_Demand"] >= MIN_DEMAND) &
    (df["Current_Stock"] >= MIN_STOCK)
]
df = df[
    df["Objective"].isin(["Clear Stock", "Customer Acquisition", "Maximize Profit"])
]
final_campaigns = df[[
    "StockCode",
    "Predicted_7d_Demand",
    "Current_Stock",
    "OverstockRatio",
    "Objective",
    "TargetCluster",
    "Discount"
]]
regular_engine = inventory.copy()
regular_engine = regular_engine[regular_engine["Predicted_7d_Demand"] > 30]
regular_engine["OverstockRatio"] = (
    regular_engine["Current_Stock"] / regular_engine["Predicted_7d_Demand"]
)

regular_engine = regular_engine[
    (regular_engine["OverstockRatio"] >= 0.8) &
    (regular_engine["OverstockRatio"] <= 1.5)
]
regular_engine["Objective"] = "Stability Revenue"
regular_engine["TargetCluster"] = "Regular Customers"
regular_engine["Discount"] = 5   # loyalty style

regular_campaigns = regular_engine[[
    "StockCode",
    "Predicted_7d_Demand",
    "Current_Stock",
    "OverstockRatio",
    "Objective",
    "TargetCluster",
    "Discount"
]]
all_campaigns = pd.concat(
    [final_campaigns, regular_campaigns],
    ignore_index=True
)
lost_campaigns = all_campaigns[
    (all_campaigns["TargetCluster"] == "At-Risk Customers") &
    (all_campaigns["Discount"] >= 50)
].copy()

lost_campaigns["TargetCluster"] = "Lost Customers"
lost_campaigns["Objective"] = "Win Back & Clear Stock"
all_campaigns = pd.concat(
    [all_campaigns, lost_campaigns],
    ignore_index=True
)
all_campaigns.to_csv('../data/processed/campaign_plan.csv', index=False)