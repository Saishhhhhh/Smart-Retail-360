<div align="center">

# 🧠 SmartRetail 360  
### *AI-Powered Retail Intelligence & Campaign Decision Platform*

![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![XGBoost](https://img.shields.io/badge/XGBoost-Demand%20Forecasting-orange.svg)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Clustering-green.svg)
![Gemini](https://img.shields.io/badge/Gemini-Generative%20AI-purple.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-teal.svg)
![React](https://img.shields.io/badge/React-Frontend-blue.svg)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

**SmartRetail 360** is an AI-powered retail intelligence system that transforms raw transaction data into  
**demand forecasts, customer insights, and AI-driven marketing campaigns.**

It helps retail managers answer:

> **What should we sell? Who should we target? How should we market it?**

</div>


---

# 🚀 What Problem Does It Solve?

Retailers struggle with:

| Problem               | Why it hurts                    |
| --------------------- | ------------------------------- |
| Overstock             | Money stuck in unsold inventory |
| Understock            | Lost sales                      |
| Random discounts      | Kill profit margins             |
| Generic marketing     | Low conversion                  |
| No AI-driven planning | Decisions made blindly          |

SmartRetail 360 solves this by creating an **AI-driven retail brain** that answers:

> “Which products should we discount, for whom, and why?”

---

# 🧩 System Architecture

```
Sales Data
   ↓
Machine Learning
(Demand + Segmentation)
   ↓
Inventory Engine
   ↓
Strategy Engine
   ↓
GenAI (Gemini)
   ↓
FastAPI
   ↓
React Dashboard
```

---

# 📁 Project Structure

```
SMART-RETAIL-360/
│
├── data/
│   └── processed/
│       ├── cleaned.csv
│       ├── customer_segments.csv
│       ├── predicted_7d_demand.csv
│       ├── inventory_state.csv
│       └── campaign_plan.csv
│
├── models/
│   ├── xgb_demand_forecasting_model.pkl
│   ├── kmeans_rfm.pkl
│   ├── rfm_scaler.pkl
│   └── forecast_features.json
│
├── inventory/
│   └── inventory_engine.py
│
├── strategy/
│   └── campaign_strategy.py
│
├── genai/
│   ├── prompt_templates.py
│   └── campaign_engine.py
│
├── backend/
│   ├── main.py
│   └── services/
│       ├── forecast_service.py
│       ├── segmentation_service.py
│       ├── inventory_service.py
│       ├── strategy_service.py
│       └── genai_service.py
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── services/
│
└── notebooks/
```

---

# 🧠 Machine Learning Layer

## 1️⃣ Customer Segmentation (K-Means)

Customers are segmented using **RFM (Recency, Frequency, Monetary)**.

They are clustered into:

* VIP Customers
* Regular Customers
* New Customers
* At-Risk Customers
* Lost Customers

Saved as:

```
customer_segments.csv
kmeans_rfm.pkl
rfm_scaler.pkl
```

---

## 2️⃣ Demand Forecasting (XGBoost)

Each product’s sales are predicted using:

* Lag features (7, 14, 30 days)
* Rolling averages
* Calendar effects

Model:

```
xgb_demand_forecasting_model.pkl
```

Output:

```
predicted_7d_demand.csv
```

This tells the system:

> How many units each product is expected to sell in the next 7 days.

---

# 📦 Inventory Engine

`inventory_engine.py` builds the current store inventory.

It creates realistic stock levels and classifies products as:

| Status       | Meaning           |
| ------------ | ----------------- |
| OVERSTOCKED  | Too much stock    |
| HEALTHY      | Balanced          |
| UNDERSTOCKED | Risk of stock-out |

Saved as:

```
inventory_state.csv
```

---

# 🧠 Strategy Engine (Core Intelligence)

`strategy/campaign_strategy.py` is the **brain** of SmartRetail 360.

It uses:

* Demand forecasts
* Inventory status
* Customer segments

To decide:

| Objective            | Target            |
| -------------------- | ----------------- |
| Clear Stock          | At-Risk Customers |
| Customer Acquisition | New Customers     |
| Maximize Profit      | VIP Customers     |
| Win-Back             | Lost Customers    |
| Stability            | Regular Customers |

It outputs:

```
campaign_plan.csv
```

This file contains:

* Product
* Objective
* Target customer segment
* Discount

This is **what the AI recommends the business should do**.

---

# 🤖 GenAI Layer (Gemini)

Gemini does **not** decide strategy.
Gemini only **writes the marketing copy**.

`campaign_engine.py` takes one row from `campaign_plan.csv` and generates:

* Email subject
* Email body
* WhatsApp message

Using structured prompts from:

```
prompt_templates.py
```

This ensures the text is:

* Personalized
* Segment-aware
* Business-aligned

---

# 🌐 FastAPI — The Control Plane

FastAPI connects everything.

| Endpoint             | What it does                 |
| -------------------- | ---------------------------- |
| `/inventory`         | Returns current stock        |
| `/demand`            | Returns demand forecast      |
| `/campaign-plan`     | Returns AI strategy          |
| `/generate-campaign` | Calls Gemini for one product |

React never touches CSV files directly.

FastAPI acts as the **brain API**.

---

# 🖥 React Manager Dashboard

The React app is a **Retail Control Panel**.

It shows:

### Dashboard

KPIs, stock risk, campaign counts

### Inventory

Live stock vs predicted demand

### Campaigns

AI-recommended campaigns
Manager clicks → Gemini generates marketing copy

This is how **real retail teams** use AI.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📺 Demo Video

Watch the full walkthrough and see DevNotes-AI in action:

**[🎬 Watch Demo Video](https://drive.google.com/file/d/1dtJfPcS9UmK-i_jK_EQFJ_TgMv7N8Ic6/view?usp=drive_link)**

---

<div align="center">

<div align="center">

**Made with ❤️ by Saish**

⭐ Star this repo if you find it useful!

</div>