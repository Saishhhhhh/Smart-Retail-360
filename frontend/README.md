# SmartRetail 360 - Frontend

A modern React dashboard for the SmartRetail 360 Retail Intelligence Simulator.

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── KPI.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── CampaignCard.jsx
│   │   │   ├── DemandChart.jsx
│   │   │   └── InventoryTable.jsx
│   │   └── layout/          # Layout components
│   │       ├── Sidebar.jsx
│   │       └── SimulationHeader.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Inventory.jsx
│   │   ├── Campaigns.jsx
│   │   └── Simulation.jsx
│   ├── services/            # Mock API services
│   │   ├── inventoryService.js
│   │   ├── forecastService.js
│   │   ├── campaignService.js
│   │   └── simulationService.js
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   └── style.css            # Global styles with Tailwind
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Features

### 📊 Dashboard Page
- 7-day demand forecasting visualization
- Product selector with stock codes
- KPI cards showing forecast metrics
- Interactive line charts using Recharts

### 📦 Inventory Health Page
- Complete inventory table with status badges
- Filter by status (All, Overstocked, Understocked, Healthy)
- Real-time inventory statistics
- Color-coded status indicators

### 🤖 AI Campaigns Page
- Grid of AI-generated campaign cards
- Filter by customer cluster (VIP, Regular, At-Risk, New, Lost)
- Expandable cards showing email subjects, bodies, and push notifications
- Campaign statistics

### 🎮 Simulation Page
- Explanation of simulation functionality
- Simulation history log
- Integration with simulation header controls

### 🎯 Global Features
- **Sidebar Navigation**: Fixed sidebar with navigation between pages
- **Simulation Header**: Sticky header with simulated date and "Run Next Day" button
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS

## Getting Started

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Mock Services

All data services are currently using mock data. When the backend API is ready, replace the service functions with actual API calls:

- `inventoryService.js` - Replace `getInventory()` with API call to `/api/inventory`
- `forecastService.js` - Replace `getForecast()` with API call to `/api/predict-demand`
- `campaignService.js` - Replace `getCampaigns()` with API call to `/api/campaigns`
- `simulationService.js` - Replace `runNextDay()` with API call to `/api/simulate/next-day`

Example replacement:
```javascript
// Before (mock)
export const getInventory = async () => {
  return [...mockData];
};

// After (API)
import axios from 'axios';

export const getInventory = async () => {
  const response = await axios.get('/api/inventory');
  return response.data;
};
```

## Color Scheme

- **Overstocked**: Orange (`bg-orange-100 text-orange-800`)
- **Understocked**: Red (`bg-red-100 text-red-800`)
- **Healthy**: Green (`bg-green-100 text-green-800`)
- **Primary Actions**: Blue (`bg-blue-600`)

## Notes

- All dates use the simulated date from `simulationService.js`
- The "Run Next Day" button triggers a console log and updates the simulated date
- When connected to the backend, this will trigger the actual simulation engine
