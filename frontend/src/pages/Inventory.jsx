import React, { useState, useEffect } from 'react';
import { getInventoryByStatus } from '../services/inventoryService';
import InventoryTable from '../components/dashboard/InventoryTable';
import Card from '../components/common/Card';
import KPI from '../components/common/KPI';
import { Package, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';

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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Inventory Health</h2>
        <p className="text-gray-600">Monitor and manage your inventory status</p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI
          title="Total Products"
          value={stats.total}
          icon={Package}
        />
        <KPI
          title="Overstocked"
          value={stats.overstocked}
          icon={AlertTriangle}
          subtitle="Requires attention"
        />
        <KPI
          title="Understocked"
          value={stats.understocked}
          icon={TrendingDown}
          subtitle="Needs restocking"
        />
        <KPI
          title="Healthy"
          value={stats.healthy}
          icon={CheckCircle}
          subtitle="Optimal levels"
        />
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading inventory data...</div>
          </div>
        ) : (
          <InventoryTable
            inventory={inventory}
            onFilterChange={setFilter}
            selectedFilter={filter}
          />
        )}
      </Card>
    </div>
  );
};

export default Inventory;
