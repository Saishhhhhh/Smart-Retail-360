from fastapi import FastAPI
from services.inventory_service import get_inventory
from services.forecast_service import get_demand
from services.strategy_service import get_campaign_plan
from services.genai_service import generate_campaign
from services.simulation_service import run_day, reset_simulation

app = FastAPI(title="SmartRetail 360 API")


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


@app.post("/simulate-day")
def simulate():
    return run_day()


@app.post("/reset-simulation")
def reset():
    return reset_simulation()
