import pandas as pd
import os

# Get the root directory path (Smart-Retail-360)
# backend/services/product_service.py -> go up 2 levels to get root
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CLEANED_CSV_PATH = os.path.join(BASE_DIR, "data", "processed", "cleaned.csv")

# Cache for product names
_product_names_cache = None

def get_product_names_mapping():
    """Get a mapping of StockCode to ProductName from cleaned.csv"""
    global _product_names_cache
    
    if _product_names_cache is not None:
        return _product_names_cache
    
    if not os.path.exists(CLEANED_CSV_PATH):
        return {}
    
    try:
        # Read only StockCode and Description columns for efficiency
        df = pd.read_csv(CLEANED_CSV_PATH, usecols=['StockCode', 'Description'])
        # Get the most common description for each StockCode (in case there are variations)
        product_names = df.groupby('StockCode')['Description'].first().to_dict()
        _product_names_cache = product_names
        return product_names
    except Exception as e:
        print(f"Error loading product names: {e}")
        return {}

def get_product_name(stock_code):
    """Get product name for a given StockCode"""
    mapping = get_product_names_mapping()
    return mapping.get(stock_code, stock_code)  # Return StockCode if not found
