# 🧠 SmartRetail 360 — Strategy Engine

The Strategy Engine is the **business brain** of SmartRetail 360.

It converts:
- demand forecasts
- inventory status
- customer segmentation

into **concrete, AI-driven marketing decisions**.

It answers the most important business question:

> **“Which product should we promote, to which customer segment, and with what discount?”**

---

## 📥 Inputs

The Strategy Engine reads three core datasets:

| File | What it contains |
|------|----------------|
`inventory_state.csv` | Current stock and inventory status |
`predicted_7d_demand.csv` | How much each product will sell |
`customer_segments.csv` | Which customers belong to which segment |

These represent the **current state of the business**.

---

## 🧮 Step 1 — Product → Customer Mapping

The engine analyzes transaction history to determine:

> **Which customer segment usually buys each product**

It calculates, for every product:
- How many purchases came from each cluster
- The percentage share per cluster

This produces a **buyer profile per product**.

This prevents the AI from recommending campaigns to the wrong audience.

---

## 📊 Step 2 — Inventory & Demand Analysis

For each product, the engine computes:

| Metric | Meaning |
|-------|--------|
Predicted_7d_Demand | Expected sales next week |
Current_Stock | Units in inventory |
OverstockRatio | Stock ÷ Demand |
DemandLevel | High or Low |

This tells the AI:
- Is this product risky?
- Is it a growth opportunity?
- Is it safe to maximize profit?

---

## 🎯 Step 3 — Business Objective Selection

The engine assigns each product a **strategic objective**:

| Condition | Objective |
|---------|----------|
Overstock + Low Demand | Clear Stock |
Overstock + High Demand | Customer Acquisition |
Healthy Stock + High Demand | Maximize Profit |
Otherwise | Retention |

This makes the system **multi-objective**, not one-size-fits-all.

---

## 👥 Step 4 — Target Customer Selection

Each objective maps to a specific customer segment:

| Objective | Target Segment |
|---------|----------------|
Clear Stock | At-Risk Customers |
Customer Acquisition | New Customers |
Maximize Profit | VIP Customers |
Retention | Regular Customers |

This ensures that:
- Discounts go to price-sensitive users
- Premium users are not devalued
- Loyal customers are protected

---

## 💰 Step 5 — Discount Optimization

Discounts are determined dynamically using:

| Factor | Role |
|------|-----|
OverstockRatio | How urgent the clearance is |
Objective | Whether profit or volume matters |

Examples:
- Extreme overstock → 50–60% discount
- Acquisition → 20–30%
- VIP profit → 5%
- Regular loyalty → 5–10%

This prevents **margin destruction**.

---

## 🧾 Step 6 — Regular Customer Stability Engine

Products that are:
- High demand
- Healthy stock

Are assigned to:
> **Regular Customers with small loyalty discounts**

This keeps baseline revenue stable.

---

## 🔄 Step 7 — Lost Customer Recovery

Highly discounted clearance campaigns are also cloned into:
> **Lost Customer win-back campaigns**

This simulates:
- Reactivation
- Feedback gathering
- High-incentive re-engagement

---

## 📤 Output

The final output is:

```

data/processed/campaign_plan.csv

```

Each row represents an **AI-recommended marketing action**:

| Column | Meaning |
|-------|--------|
StockCode | Product |
Predicted_7d_Demand | Expected sales |
Current_Stock | Inventory |
OverstockRatio | Risk indicator |
Objective | Why to run campaign |
TargetCluster | Who to target |
Discount | How aggressive |

This file is consumed by:
- FastAPI
- React dashboard
- Gemini (GenAI layer)

---