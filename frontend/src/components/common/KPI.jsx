import React from 'react';

const KPI = ({ title, value, subtitle = null, icon: Icon = null, trend = null }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.icon && <trend.icon size={14} />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="ml-4 p-3 bg-blue-100 rounded-full">
            <Icon color="#2563eb" size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default KPI;
