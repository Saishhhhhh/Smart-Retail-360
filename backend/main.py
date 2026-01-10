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



app = FastAPI(title="SmartRetail 360 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your React URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "SmartRetail 360 running"}


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
def get_generated_campaigns():
    return get_all_generated_campaigns()
