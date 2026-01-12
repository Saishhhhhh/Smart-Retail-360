import os
import json

# Get the root directory path (Smart-Retail-360)
# backend/services/product_service.py -> go up 2 levels to get root
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PRODUCTS_JSON_PATH = os.path.join(BASE_DIR, "data", "processed", "products.json")

def get_product_names_mapping():
    """Get a mapping of StockCode to ProductName from products.json"""
    if not os.path.exists(PRODUCTS_JSON_PATH):
        print(f"Warning: Products file not found at {PRODUCTS_JSON_PATH}")
        return {}
    
    try:
        with open(PRODUCTS_JSON_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading products file: {e}")
        return {}

def get_product_name(stock_code):
    """Get product name for a given StockCode"""
    mapping = get_product_names_mapping()
    return mapping.get(stock_code, stock_code)  # Return StockCode if not found
