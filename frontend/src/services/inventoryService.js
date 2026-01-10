import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getInventory = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.INVENTORY);
    // Backend returns CSV data, parse it if needed or return as-is if backend handles parsing
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

export const getInventoryByStatus = async (status) => {
  try {
    const inventory = await getInventory();
    // Handle both array and object responses
    const inventoryArray = Array.isArray(inventory) ? inventory : inventory.data || [];
    if (!status || status === 'ALL') return inventoryArray;
    return inventoryArray.filter(item => item.Inventory_Status === status);
  } catch (error) {
    console.error('Error filtering inventory by status:', error);
    throw error;
  }
};
