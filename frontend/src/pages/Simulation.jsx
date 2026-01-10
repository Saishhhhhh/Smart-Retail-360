import React, { useState } from 'react';
import Card from '../components/common/Card';
import { PlayCircle, Clock, TrendingUp, Package } from 'lucide-react';
import Button from '../components/common/Button';

const Simulation = () => {
  const [simulationHistory, setSimulationHistory] = useState([
    { date: '2021-12-05', action: 'Initial state loaded', timestamp: '10:00:00' },
  ]);

  const handleRunSimulation = () => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      action: 'Simulation executed - Inventory updated',
      timestamp: timeStr
    };
    setSimulationHistory(prev => [newEntry, ...prev]);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Simulation Control</h2>
        <p className="text-gray-600">Run day-by-day simulations to see inventory and campaign changes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <PlayCircle color="#2563eb" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">How It Works</h3>
          </div>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">1.</span>
              <p>Click "Run Next Day" to advance the simulation by one day</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">2.</span>
              <p>The system subtracts predicted daily sales from inventory</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">3.</span>
              <p>Inventory status is recalculated based on new stock levels</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-600">4.</span>
              <p>AI campaigns are regenerated for newly overstocked items</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp color="#16a34a" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Simulation Benefits</h3>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <Package size={16} color="#16a34a" />
              <span>Test inventory management strategies</span>
            </li>
            <li className="flex items-center gap-2">
              <Package size={16} color="#16a34a" />
              <span>Predict future inventory states</span>
            </li>
            <li className="flex items-center gap-2">
              <Package size={16} color="#16a34a" />
              <span>Optimize marketing campaign timing</span>
            </li>
            <li className="flex items-center gap-2">
              <Package size={16} color="#16a34a" />
              <span>Understand demand patterns over time</span>
            </li>
          </ul>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Clock color="#4b5563" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Simulation History</h3>
        </div>
        <div className="space-y-3">
          {simulationHistory.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-medium text-gray-800">{entry.action}</p>
                <p className="text-sm text-gray-500">{entry.date} at {entry.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Simulation;
