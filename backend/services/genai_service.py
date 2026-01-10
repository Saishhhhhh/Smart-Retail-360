from genai.campaign_engine import generate_campaign

def generate_campaign(payload):
    """
    payload = {
      "StockCode": "21507",
      "Objective": "Clear Stock",
      "TargetCluster": "At-Risk Customers",
      "Discount": 40,
      "Predicted_7d_Demand": 30,
      "Current_Stock": 80
    }
    """
    return generate_campaign(payload)
