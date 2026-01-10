# 🖥 SmartRetail 360 — Frontend (React Manager Dashboard)

The frontend of **SmartRetail 360** is a **Retail Manager Control Panel** built using **React**.

It allows business users (managers, analysts, marketers) to:
- Monitor inventory health
- Review AI-recommended marketing campaigns
- Generate AI-written campaign content
- Make informed, human-in-the-loop decisions

This dashboard does **not** execute sales or ecommerce flows.  
It mirrors the type of **internal AI dashboards** used by retail organizations.

---

## 🎯 Purpose of the Frontend

The frontend exists to answer one core question:

> **“What actions should the business take today, and why?”**

It visualizes the output of:
- Machine Learning models
- Business strategy logic
- Generative AI (Gemini)

All decisions are **AI-assisted but human-approved**.

---

## 🧱 Frontend Architecture

```

frontend/
└── src/
├── pages/
│   ├── Dashboard.jsx
│   ├── Inventory.jsx
│   ├── Campaigns.jsx
│   └── Simulation.jsx
│
├── components/
│   ├── KPI.jsx
│   ├── ProductTable.jsx
│   ├── CampaignCard.jsx
│   └── StatusBadge.jsx
│
└── services/
├── inventoryService.js
├── forecastService.js
├── campaignService.js
└── simulationService.js

```

---

## 🔌 Backend Integration 

The frontend **never reads CSV files directly**.

All data flows through **FastAPI**, ensuring:
- Separation of concerns
- Production-ready architecture
- Clean data contracts

### API Endpoints Used

| Endpoint | Purpose |
|--------|--------|
`GET /inventory` | Fetch current inventory state |
`GET /demand` | Fetch demand forecasts |
`GET /campaign-plan` | Fetch AI-recommended campaigns |
`POST /generate-campaign` | Generate AI marketing copy |

---

## 📊 Pages Overview

### 🟦 Dashboard

High-level business overview:
- Total products
- Number of overstocked items
- Active campaign recommendations

This page helps managers quickly assess:
> “Is the business healthy today?”

---

### 🟧 Inventory

Displays real-time inventory intelligence:

| Product | Predicted Demand | Current Stock | Status |
|------|-----------------|--------------|--------|

Inventory status is derived from:
- ML demand forecasts
- Inventory Engine logic

This helps identify:
- Overstock risks
- Understock risks
- Stable products

---

### 🟩 Campaigns

The most critical page.

Displays AI-recommended marketing actions:

| Product | Objective | Target Segment | Discount |
|-------|----------|----------------|----------|

Managers can:
- Review **why** a campaign is recommended
- Click **Generate Campaign**
- Receive AI-written:
  - Email subject
  - Email body
  - WhatsApp message

This ensures **human-in-the-loop control**.

---

## 🧠 Human-in-the-Loop Design

A key design principle of SmartRetail 360:

> **AI recommends. Humans decide.**

The frontend:
- Shows AI insights clearly
- Avoids auto-execution
- Keeps managers in control

This builds **trust**, **explainability**, and **adoption**.

---

## 🧰 Technology Stack

- **React** — UI framework
- **Axios** — API communication
- **FastAPI** — Backend control plane
- **Gemini (via LangChain)** — Generative AI content

---
