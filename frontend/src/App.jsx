import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Campaigns from './pages/Campaigns';
import { Menu } from 'lucide-react';

import ServerAwake from './components/common/ServerAwake';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <ServerAwake>
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content */}
          <div className="flex-1 lg:ml-72 w-full lg:w-auto">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} />
            </button>

            <main className="bg-gray-50 min-h-screen">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/campaigns" element={<Campaigns />} />
              </Routes>
            </main>
          </div>
        </div>
      </ServerAwake>
    </Router>
  );
}

export default App;
