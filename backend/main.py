import sys
import os

# Get the path of the root directory (Smart-Retail-360)
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(root_path)

from fastapi import FastAPI
from services.inventory_service import get_inventory
from services.forecast_service import get_demand
from services.strategy_service import get_campaign_plan
from services.genai_service import generate_campaign
from services.campaign_storage import get_all_generated_campaigns
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SmartRetail 360 API", version="1.0.0")

# CORS Configuration - Get from environment or use defaults
cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://localhost:5174"
).split(",")

# Remove whitespace from origins
cors_origins = [origin.strip() for origin in cors_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "SmartRetail 360 API running",
        "version": "1.0.0",
        "endpoints": {
            "inventory": "/inventory",
            "demand": "/demand",
            "campaign_plan": "/campaign-plan",
            "generate_campaign": "/generate-campaign",
            "generated_campaigns": "/generated-campaigns"
        }
    }


@app.get("/inventory")
def inventory():
    return get_inventory()


@app.get("/demand")
def demand():
    return get_demand()


@app.get("/campaign-plan")
def campaign_plan():
    return get_campaign_plan()


@app.post("/generate-campaign")
def gen_campaign(payload: dict):
    return generate_campaign(payload)


@app.get("/generated-campaigns")
def get_generated_campaigns_endpoint():
    return get_all_generated_campaigns()
