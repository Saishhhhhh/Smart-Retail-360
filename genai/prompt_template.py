from langchain_core.prompts import PromptTemplate

# -------------------------------
# 1. Tone Control by Cluster
# -------------------------------
def get_style_description(cluster):
    styles = {
        "VIP Customers": "Exclusive, premium, and sophisticated. Focus on quality, loyalty, and priority access. Avoid heavy discounts.",
        "Regular Customers": "Friendly, trustworthy, and value-oriented. Encourage repeat purchases and bundles.",
        "At-Risk Customers": "Emotional and urgent. Use a 'we miss you' tone and emphasize limited-time offers.",
        "New Customers": "Warm, welcoming, and discovery-focused. Introduce the brand and highlight value.",
        "Lost Customers": "Win-back and empathetic. Focus on understanding why they left and offering a strong incentive."
    }
    return styles.get(cluster, "Professional and promotional.")


# -------------------------------
# 2. Master Campaign Prompt
# -------------------------------
def create_campaign_prompt(parser):
    return PromptTemplate(
        template="""
You are a senior retail marketing specialist for SmartRetail 360.

Your job is to write high-converting marketing messages based on real inventory and customer data.

Use Customer Name as 'Arjun Pathak'

CAMPAIGN OBJECTIVE:
{objective}

TARGET CUSTOMER SEGMENT:
{customer_segment}

STYLE GUIDE:
{style_description}

PRODUCT:
Product Code: {product_name}
Product Description: {product_description}

INVENTORY SITUATION:
We have {stock_surplus} excess units in stock.

OFFER:
Give the customer a {discount}% discount.

TASK:
Write persuasive, on-brand marketing content that matches the objective and customer segment.
Use the product description to make the message more specific and compelling.

{format_instructions}
""",
        input_variables=[
            "objective",
            "customer_segment",
            "style_description",
            "product_name",
            "product_description",
            "stock_surplus",
            "discount"
        ],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
