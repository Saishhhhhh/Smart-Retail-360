
# ⚙️ SmartRetail 360 — Backend (FastAPI Control Plane)

The backend of **SmartRetail 360** acts as the **central nervous system** of the platform.

It connects:
- Machine Learning models
- Business strategy logic
- Inventory state
- Generative AI (Gemini)
- The React Manager Dashboard

All intelligence flows through this API.

---

## 🎯 Purpose of the Backend

The backend exists to answer one question:

> **“What does the AI think we should do right now?”**

It exposes ML predictions, strategy decisions, and AI-generated campaigns in a clean, production-style API.

The frontend never touches files or models directly.

---

## 🧱 Architecture

```

React Dashboard
↓
FastAPI
↓
┌────────────────────────────────┐
│   Strategy + ML Services       │
├────────────────────────────────┤
│  Inventory  Forecast  GenAI    │
│  Campaign Storage (MongoDB)    │
└────────────────────────────────┘
↓
CSV state + Models + MongoDB

```

FastAPI acts as a **control plane** that orchestrates everything.

---

## 📁 Folder Structure

```

backend/
├── main.py
└── services/
    ├── inventory_service.py
    ├── forecast_service.py
    ├── segmentation_service.py
    ├── strategy_service.py
    ├── genai_service.py
    ├── product_service.py
    └── campaign_storage.py  

```

Each service represents one **business capability**.

---

## 🔌 API Endpoints

| Endpoint | Description |
|--------|-------------|
| `GET /inventory` | Returns current inventory state |
| `GET /demand` | Returns demand forecast |
| `GET /campaign-plan` | Returns AI strategy recommendations |
| `POST /generate-campaign` | Uses Gemini to generate marketing copy |
| `GET /generated-campaigns` | Returns all saved campaigns from MongoDB |

These endpoints allow the React app to function as a **live retail dashboard**.

---

## 🧠 Services Explained

### `inventory_service.py`
Reads `inventory_state.csv` and exposes:
- Stock levels
- Inventory status
- Overstock / understock risk

---

### `forecast_service.py`
Reads `predicted_7d_demand.csv` and exposes:
- Product-level demand forecasts

These forecasts drive inventory and campaign decisions.

---

### `segmentation_service.py`
Uses:
- `kmeans_rfm.pkl`
- `rfm_scaler.pkl`

To classify customers into:
- VIP
- Regular
- New
- At-Risk
- Lost

This powers personalization.

---

### `strategy_service.py`
Reads:
```

campaign_plan.csv

```

This file is produced by the Strategy Engine and contains:
- Which products need campaigns
- Why (objective)
- Who to target
- Discount to apply

This is the **AI’s business plan**.

---

### `genai_service.py`
This service:
- Receives a campaign row from React
- Sends it to Gemini (via LangChain)
- Returns:
  - Email subject
  - Email body
  - WhatsApp message

Gemini does not decide strategy — it only communicates it.

---

### `campaign_storage.py` (NEW)
This service handles **persistent storage** of generated campaigns using **MongoDB Atlas**.

**Why MongoDB?**
- Enables serverless deployment (Vercel, Railway)
- Cloud-based persistence (no local file dependency)
- Scalable campaign management

**Functions:**
- `save_generated_campaign()` - Saves/updates campaigns in MongoDB
- `get_all_generated_campaigns()` - Retrieves all campaigns from database
- `get_database()` - Establishes MongoDB connection

**Environment Variable Required:**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

---

## 🚀 Deployment

### Local Development
```bash
uvicorn backend.main:app --reload
```

### Vercel Deployment
The backend is configured for serverless deployment on Vercel:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `CORS_ORIGINS` - Your frontend URL
   - `GOOGLE_API_KEY` - For Gemini AI

**Configuration Files:**
- `vercel.json` - Vercel deployment configuration
- `api/index.py` - Serverless entry point

---