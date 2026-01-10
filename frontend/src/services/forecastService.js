import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getDemand = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.DEMAND);
    // Backend returns predicted_7d_demand.csv data
    return response.data;
  } catch (error) {
    console.error('Error fetching demand forecast:', error);
    throw error;
  }
};

export const getForecast = async (stockCode = null) => {
  try {
    const demandData = await getDemand();
    // Handle both array and object responses
    const demandArray = Array.isArray(demandData) ? demandData : demandData.data || [];
    
    if (stockCode) {
      // Filter by stock code if provided
      const productData = demandArray.find(item => item.StockCode === stockCode);
      if (!productData) {
        throw new Error(`No forecast data found for stock code: ${stockCode}`);
      }
      
      // Format data for chart display
      const today = new Date();
      const dates = [];
      const forecast = [];
      
      // Generate 7-day forecast dates
      for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
        // Use predicted demand divided by 7 for daily forecast
        forecast.push(productData.Predicted_7d_Demand / 7);
      }
      
      return {
        stockCode: productData.StockCode,
        productName: productData.ProductName || productData.StockCode,
        forecast: dates.map((date, idx) => ({
          date,
          value: forecast[idx]
        })),
        historical: [] // Historical data would come from backend if available
      };
    }
    
    return demandArray;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

export const getAvailableStockCodes = async () => {
  try {
    const demandData = await getDemand();
    const demandArray = Array.isArray(demandData) ? demandData : demandData.data || [];
    
    // Extract unique stock codes
    const stockCodes = demandArray.map(item => ({
      code: item.StockCode,
      name: item.ProductName || item.Description || item.StockCode
    }));
    
    return stockCodes;
  } catch (error) {
    console.error('Error fetching stock codes:', error);
    throw error;
  }
};
