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
      <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={() => onFilterChange('ALL')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
            selectedFilter === 'ALL'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange('OVERSTOCKED')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
            selectedFilter === 'OVERSTOCKED'
              ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Overstocked
        </button>
        <button
          onClick={() => onFilterChange('UNDERSTOCKED')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
            selectedFilter === 'UNDERSTOCKED'
              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Understocked
        </button>
        <button
          onClick={() => onFilterChange('HEALTHY')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
            selectedFilter === 'HEALTHY'
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Healthy
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm -mx-4 sm:mx-0">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Stock Code
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Product Name
              </th>
              <th 
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('predicted_demand')}
              >
                <div className="flex items-center">
                  <span className="hidden sm:inline">Predicted Demand (7d)</span>
                  <span className="sm:hidden">Demand (7d)</span>
                  {getSortIcon('predicted_demand')}
                </div>
              </th>
              <th 
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('current_stock')}
              >
                <div className="flex items-center">
                  Current Stock
                  {getSortIcon('current_stock')}
                </div>
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedInventory.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="text-gray-400">
                    <Package size={48} className="mx-auto mb-3" />
                    <p className="text-lg font-medium">No inventory items found</p>
                    <p className="text-sm mt-1">Try selecting a different filter</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedInventory.map((item, index) => {
                const stockCode = item.StockCode || item.stock_code;
                const predictedDemand = item.Predicted_7d_Demand || item.Predicted_Demand || item.predicted_demand || 0;
                const currentStock = item.Current_Stock || item.current_stock || item.CurrentStock || 0;
                const status = item.Inventory_Status || item.inventory_status || item.Status || 'UNKNOWN';
                const productName = item.ProductName || item.product_name || item.Description || item.description || stockCode || 'N/A';

                return (
                  <tr 
                    key={stockCode || index} 
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-150"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">{stockCode}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className="text-xs sm:text-sm text-gray-700 line-clamp-2">{productName}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-medium text-gray-600">{roundDemand(predictedDemand)}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-medium text-gray-600">{currentStock}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
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
