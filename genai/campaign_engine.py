import os
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser
from prompt_templates import create_campaign_prompt, get_style_description


# -------------------------------
# 1. Response Schema
# -------------------------------
class CampaignResponse(BaseModel):
    email_subject: str = Field(description="Catchy subject line for the email")
    email_body: str = Field(description="Persuasive email content (max 150 words)")
    whatsapp_message: str = Field(description="Short WhatsApp message with emojis")


parser = JsonOutputParser(pydantic_object=CampaignResponse)
prompt = create_campaign_prompt(parser)


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.7
)

chain = prompt | llm | parser


# -------------------------------
# 2. Main function called by FastAPI
# -------------------------------
def generate_campaign(campaign_row: dict):
    """
    campaign_row is one row from campaign_plan.csv
    sent by React through FastAPI
    """

    stock_surplus = int(
        campaign_row["Current_Stock"] - campaign_row["Predicted_7d_Demand"]
    )

    style = get_style_description(campaign_row["TargetCluster"])

    inputs = {
        "objective": campaign_row["Objective"],
        "customer_segment": campaign_row["TargetCluster"],
        "style_description": style,
        "product_name": str(campaign_row["StockCode"]),
        "stock_surplus": stock_surplus,
        "discount": int(campaign_row["Discount"])
    }

    result = chain.invoke(inputs)

    result["StockCode"] = campaign_row["StockCode"]
    result["Objective"] = campaign_row["Objective"]
    result["TargetCluster"] = campaign_row["TargetCluster"]
    result["Discount"] = campaign_row["Discount"]

    return result
