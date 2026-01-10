import pandas as pd

PLAN_PATH = "../data/processed/campaign_plan.csv"

def get_campaign_plan():
    df = pd.read_csv(PLAN_PATH)
    return df.to_dict(orient="records")
