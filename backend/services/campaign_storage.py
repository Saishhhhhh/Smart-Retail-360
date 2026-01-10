import json
import os

# Get the root directory path (Smart-Retail-360)
# backend/services/campaign_storage.py -> go up 2 levels to get root
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
STORAGE_PATH = os.path.join(BASE_DIR, "data", "processed", "generated_campaigns.json")

def load_generated_campaigns():
    """Load generated campaigns from JSON file"""
    if not os.path.exists(STORAGE_PATH):
        return {}
    
    try:
        with open(STORAGE_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading generated campaigns: {e}")
        return {}

def save_generated_campaign(campaign_id, campaign_data):
    """Save a generated campaign to JSON file"""
    campaigns = load_generated_campaigns()
    campaigns[campaign_id] = campaign_data
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(STORAGE_PATH), exist_ok=True)
    
    try:
        with open(STORAGE_PATH, 'w', encoding='utf-8') as f:
            json.dump(campaigns, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving generated campaign: {e}")
        return False

def get_all_generated_campaigns():
    """Get all generated campaigns"""
    return load_generated_campaigns()
