import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure

def get_database():
    """Get MongoDB database connection"""
    mongodb_uri = os.getenv("MONGODB_URI")
    
    if not mongodb_uri:
        raise ValueError(
            "MONGODB_URI environment variable is not set. "
            "Please add it to your .env file."
        )
    
    try:
        client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        # Test the connection
        client.admin.command('ping')
        db = client['smartretail360']
        return db
    except ConnectionFailure as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise

def save_generated_campaign(campaign_id, campaign_data):
    """Save a generated campaign to MongoDB"""
    try:
        db = get_database()
        campaigns_collection = db['campaigns']
        
        # Add the campaign_id to the document
        document = {
            "_id": campaign_id,
            **campaign_data
        }
        
        # Use replace_one with upsert to update if exists, insert if not
        result = campaigns_collection.replace_one(
            {"_id": campaign_id},
            document,
            upsert=True
        )
        
        return True
    except Exception as e:
        print(f"Error saving generated campaign: {e}")
        return False

def get_all_generated_campaigns():
    """Get all generated campaigns from MongoDB"""
    try:
        db = get_database()
        campaigns_collection = db['campaigns']
        
        # Fetch all campaigns and convert to dict format
        campaigns = {}
        for doc in campaigns_collection.find():
            campaign_id = doc.pop('_id')
            campaigns[campaign_id] = doc
        
        return campaigns
    except Exception as e:
        print(f"Error loading generated campaigns: {e}")
        return {}
