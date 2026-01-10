import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import SimulationHeader from './components/layout/SimulationHeader';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Campaigns from './pages/Campaigns';
import Simulation from './pages/Simulation';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSimulationRun = () => {
    // Force refresh of all pages when simulation runs
    setRefreshKey(prev => prev + 1);
    // Reload window to refresh all data
    window.location.reload();
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64">
          <SimulationHeader onSimulationRun={handleSimulationRun} />
          <main className="bg-gray-50 min-h-screen">
            <Routes>
              <Route path="/" element={<Dashboard key={refreshKey} />} />
              <Route path="/inventory" element={<Inventory key={refreshKey} />} />
              <Route path="/campaigns" element={<Campaigns key={refreshKey} />} />
              <Route path="/simulation" element={<Simulation />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
