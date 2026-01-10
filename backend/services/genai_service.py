from genai.campaign_engine import generate_campaign as genai_generate_campaign
from backend.services.campaign_storage import save_generated_campaign

def generate_campaign(payload):
    """
    payload = {
      "stock_code": "21507",
      "target_cluster": "At-Risk Customers",
      "objective": "Clear Stock",
      "discount": 40,
      "current_stock": 80,
      "predicted_demand": 30,
      "product_description": "Product description here"
    }
    """
    # Transform payload to match what genai.campaign_engine expects
    campaign_row = {
        "StockCode": payload.get("stock_code") or payload.get("StockCode"),
        "Objective": payload.get("objective") or payload.get("Objective") or "Clear Stock",
        "TargetCluster": payload.get("target_cluster") or payload.get("TargetCluster") or payload.get("Target_Cluster") or "Regular",
        "Discount": payload.get("discount") or payload.get("Discount") or 10,
        "Current_Stock": payload.get("current_stock") or payload.get("Current_Stock") or payload.get("CurrentStock") or 0,
        "Predicted_7d_Demand": payload.get("predicted_demand") or payload.get("Predicted_7d_Demand") or payload.get("Predicted_Demand") or 0,
        "ProductDescription": payload.get("product_description") or payload.get("ProductDescription") or payload.get("Description") or payload.get("ProductName") or ""
    }
    
    if not campaign_row["StockCode"]:
        raise ValueError("StockCode is required")
    
    result = genai_generate_campaign(campaign_row)
    
    campaign_id = f"{campaign_row['StockCode']}_{campaign_row['TargetCluster']}"
    save_generated_campaign(campaign_id, result)
    
    return result
