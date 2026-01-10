import React, { useState, useEffect } from 'react';
import { getInventoryByStatus } from '../services/inventoryService';
import InventoryTable from '../components/dashboard/InventoryTable';
import Card from '../components/common/Card';
import { Package, AlertTriangle, CheckCircle, TrendingDown, Database, Filter } from 'lucide-react';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, [filter]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await getInventoryByStatus(filter === 'ALL' ? null : filter);
      setInventory(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: inventory.length,
    overstocked: inventory.filter(item => item.Inventory_Status === 'OVERSTOCKED').length,
    understocked: inventory.filter(item => item.Inventory_Status === 'UNDERSTOCKED').length,
    healthy: inventory.filter(item => item.Inventory_Status === 'HEALTHY').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-xl">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Inventory Health</h1>
                <p className="text-indigo-100 text-sm sm:text-base lg:text-lg">Monitor and manage your inventory status in real-time</p>
              </div>
              <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                  <div className="text-xs text-indigo-200">Total Products</div>
                  <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                  <div className="text-xs text-indigo-200">Filtered View</div>
                  <div className="text-2xl font-bold">{filter}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                <Database size={24} className="sm:w-7 sm:h-7" />
              </div>
              <span className="text-blue-100 text-xs sm:text-sm font-medium">Total Products</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.total.toLocaleString()}</div>
            <div className="text-blue-100 text-xs sm:text-sm">In current view</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                <AlertTriangle size={24} className="sm:w-7 sm:h-7" />
              </div>
              <span className="text-orange-100 text-xs sm:text-sm font-medium">Overstocked</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.overstocked}</div>
            <div className="text-orange-100 text-xs sm:text-sm">
              {stats.total > 0 ? ((stats.overstocked / stats.total) * 100).toFixed(1) : 0}% of inventory
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                <TrendingDown size={24} className="sm:w-7 sm:h-7" />
              </div>
              <span className="text-red-100 text-xs sm:text-sm font-medium">Understocked</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.understocked}</div>
            <div className="text-red-100 text-xs sm:text-sm">Needs restocking</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                <CheckCircle size={24} className="sm:w-7 sm:h-7" />
              </div>
              <span className="text-green-100 text-xs sm:text-sm font-medium">Healthy</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.healthy}</div>
            <div className="text-green-100 text-xs sm:text-sm">Optimal levels</div>
          </div>
        </div>

        {/* Inventory Table Card */}
        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 rounded-lg p-2">
              <Filter className="text-indigo-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Inventory Overview</h3>
            <div className="ml-auto text-sm text-gray-500">
              Showing {inventory.length} {inventory.length === 1 ? 'product' : 'products'}
            </div>
          </div>
          <InventoryTable
            inventory={inventory}
            onFilterChange={setFilter}
            selectedFilter={filter}
          />
        </Card>
      </div>
    </div>
  );
};

export default Inventory;
