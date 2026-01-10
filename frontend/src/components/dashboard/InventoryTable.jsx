import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const InventoryTable = ({ inventory, onFilterChange, selectedFilter }) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Round predicted demand to whole number
  const roundDemand = (value) => {
    if (typeof value === 'number') {
      return Math.round(value);
    }
    const num = parseFloat(value);
    return isNaN(num) ? 0 : Math.round(num);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="ml-1" />;
    }
    return sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />;
  };

  const sortedInventory = [...inventory].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;

    if (sortField === 'current_stock') {
      aValue = a.Current_Stock || a.current_stock || a.CurrentStock || 0;
      bValue = b.Current_Stock || b.current_stock || b.CurrentStock || 0;
    } else if (sortField === 'predicted_demand') {
      aValue = roundDemand(a.Predicted_7d_Demand || a.Predicted_Demand || a.predicted_demand || 0);
      bValue = roundDemand(b.Predicted_7d_Demand || b.Predicted_Demand || b.predicted_demand || 0);
    } else {
      return 0;
    }

    if (sortDirection === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  return (
    <div className="w-full">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => onFilterChange('ALL')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedFilter === 'ALL'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange('OVERSTOCKED')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedFilter === 'OVERSTOCKED'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Overstocked
        </button>
        <button
          onClick={() => onFilterChange('UNDERSTOCKED')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedFilter === 'UNDERSTOCKED'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Understocked
        </button>
        <button
          onClick={() => onFilterChange('HEALTHY')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedFilter === 'HEALTHY'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Healthy
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('predicted_demand')}
              >
                <div className="flex items-center">
                  Predicted Demand (7d)
                  {getSortIcon('predicted_demand')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('current_stock')}
              >
                <div className="flex items-center">
                  Current Stock
                  {getSortIcon('current_stock')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedInventory.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No inventory items found
                </td>
              </tr>
            ) : (
              sortedInventory.map((item, index) => {
                // Handle different column name variations from CSV
                const stockCode = item.StockCode || item.stock_code;
                const predictedDemand = item.Predicted_7d_Demand || item.Predicted_Demand || item.predicted_demand || 0;
                const currentStock = item.Current_Stock || item.current_stock || item.CurrentStock || 0;
                const status = item.Inventory_Status || item.inventory_status || item.Status || 'UNKNOWN';
                const productName = item.ProductName || item.product_name || item.Description || item.description || stockCode || 'N/A';

                return (
                  <tr key={stockCode || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stockCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {roundDemand(predictedDemand)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {currentStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
