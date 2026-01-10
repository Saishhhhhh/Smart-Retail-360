import React, { useState, useEffect } from 'react';
import { getForecast, getAvailableStockCodes } from '../services/forecastService';
import DemandChart from '../components/dashboard/DemandChart';
import Card from '../components/common/Card';
import KPI from '../components/common/KPI';
import { TrendingUp, Package, AlertCircle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [selectedStockCode, setSelectedStockCode] = useState('10080');
  const [forecastData, setForecastData] = useState(null);
  const [stockCodes, setStockCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStockCodes();
  }, []);

  useEffect(() => {
    if (selectedStockCode) {
      loadForecast();
    }
  }, [selectedStockCode]);

  const loadStockCodes = async () => {
    try {
      const codes = await getAvailableStockCodes();
      setStockCodes(codes);
      if (codes.length > 0 && !selectedStockCode) {
        setSelectedStockCode(codes[0].code);
      }
    } catch (error) {
      console.error('Error loading stock codes:', error);
    }
  };

  const loadForecast = async () => {
    setLoading(true);
    try {
      const data = await getForecast(selectedStockCode);
      setForecastData(data);
    } catch (error) {
      console.error('Error loading forecast:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = stockCodes.find(code => code.code === selectedStockCode);
  const averageForecast = forecastData?.forecast 
    ? (forecastData.forecast.reduce((sum, item) => sum + item.value, 0) / forecastData.forecast.length).toFixed(2)
    : '0';

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Demand Forecasting Dashboard</h2>
        <p className="text-gray-600">View 7-day demand forecasts for your products</p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI
          title="Selected Product"
          value={selectedProduct?.name || 'N/A'}
          subtitle={`Stock Code: ${selectedStockCode}`}
        />
        <KPI
          title="Avg Forecast (7d)"
          value={averageForecast}
          subtitle="units per day"
          icon={TrendingUp}
        />
        <KPI
          title="Total Forecast"
          value={(parseFloat(averageForecast) * 7).toFixed(2)}
          subtitle="units (7 days)"
          icon={Package}
        />
        <KPI
          title="Status"
          value={forecastData ? 'Active' : 'Loading'}
          subtitle="Forecast ready"
          icon={forecastData ? CheckCircle : AlertCircle}
        />
      </div>

      <Card className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Product (Stock Code)
          </label>
          <select
            value={selectedStockCode}
            onChange={(e) => setSelectedStockCode(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {stockCodes.map((code) => (
              <option key={code.code} value={code.code}>
                {code.code} - {code.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">Loading forecast data...</div>
          </div>
        ) : forecastData ? (
          <DemandChart 
            data={forecastData} 
            productName={selectedProduct?.name || 'Product'}
          />
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">No forecast data available</div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
