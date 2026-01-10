import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DemandChart = ({ data, productName }) => {
  // Combine historical and forecast data
  const chartData = [
    ...(data.historical || []).map(item => ({
      ...item,
      type: 'Historical'
    })),
    ...(data.forecast || []).map(item => ({
      ...item,
      type: 'Forecast'
    }))
  ];

  return (
    <div className="w-full h-96">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {productName || 'Demand Forecast'} - 7 Day Forecast
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            labelFormatter={(value) => `Date: ${value}`}
            formatter={(value, name) => [value.toFixed(2), name]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            name="Demand (Units)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DemandChart;
