import React, { useState, useEffect } from 'react';
import { getInventory } from '../services/inventoryService';
import { getCampaignPlan } from '../services/campaignService';
import { getGeneratedCampaigns } from '../services/campaignService';
import Card from '../components/common/Card';
import KPI from '../components/common/KPI';
import { Package, AlertCircle, Sparkles, TrendingUp, TrendingDown, DollarSign, BarChart3, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [generatedCampaigns, setGeneratedCampaigns] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all data in parallel
      const [inventoryData, campaignData, generatedData] = await Promise.all([
        getInventory(),
        getCampaignPlan(),
        getGeneratedCampaigns()
      ]);

      const inventoryArray = Array.isArray(inventoryData) ? inventoryData : inventoryData.data || [];
      setInventory(inventoryArray);
      const campaignArray = Array.isArray(campaignData) ? campaignData : campaignData.data || [];
      setCampaigns(campaignArray);
      setGeneratedCampaigns(generatedData || {});
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    totalProducts: inventory.length,
    overstocked: inventory.filter(item => item.Inventory_Status === 'OVERSTOCKED').length,
    understocked: inventory.filter(item => item.Inventory_Status === 'UNDERSTOCKED').length,
    healthy: inventory.filter(item => item.Inventory_Status === 'HEALTHY').length,
    campaignsActive: Object.keys(generatedCampaigns).length,
    totalInventoryValue: inventory.reduce((sum, item) => {
      const stock = item.Current_Stock || item.current_stock || 0;
      const demand = item.Predicted_7d_Demand || item.Predicted_Demand || 0;
      return sum + (stock * (demand * 10)); // Rough estimate: demand * 10 as unit price
    }, 0)
  };

  // Calculate average discount rate for active campaigns
  const activeCampaignsList = Object.values(generatedCampaigns);
  const averageDiscount = activeCampaignsList.length > 0
    ? (activeCampaignsList.reduce((sum, campaign) => sum + (campaign.Discount || 0), 0) / activeCampaignsList.length).toFixed(1)
    : 0;

  // Campaigns by objective
  const campaignsByObjective = campaigns.reduce((acc, campaign) => {
    const objective = campaign.Objective || 'Unknown';
    acc[objective] = (acc[objective] || 0) + 1;
    return acc;
  }, {});

  const objectiveData = Object.entries(campaignsByObjective).map(([name, value]) => ({
    name,
    value
  }));

  // Inventory status distribution for pie chart
  const inventoryDistribution = [
    { name: 'Overstocked', value: stats.overstocked, color: '#f97316' },
    { name: 'Understocked', value: stats.understocked, color: '#ef4444' },
    { name: 'Healthy', value: stats.healthy, color: '#22c55e' }
  ];

  // Top overstocked products
  const topOverstocked = inventory
    .filter(item => item.Inventory_Status === 'OVERSTOCKED')
    .sort((a, b) => {
      const aStock = a.Current_Stock || 0;
      const bStock = b.Current_Stock || 0;
      return bStock - aStock;
    })
    .slice(0, 10)
    .map(item => ({
      name: (item.ProductName || item.StockCode || 'Unknown').substring(0, 20),
      stock: item.Current_Stock || 0,
      demand: Math.round(item.Predicted_7d_Demand || 0)
    }));

  // Campaign distribution by cluster
  const campaignByCluster = Object.values(generatedCampaigns).reduce((acc, campaign) => {
    const cluster = campaign.TargetCluster || campaign.Target_Cluster || 'Unknown';
    acc[cluster] = (acc[cluster] || 0) + 1;
    return acc;
  }, {});

  const campaignDistribution = Object.entries(campaignByCluster).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#8b5cf6', '#3b82f6', '#f97316', '#22c55e', '#ef4444'];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Retail Manager Dashboard</h2>
        <p className="text-gray-600">Live inventory analytics and AI-recommended campaigns</p>
      </div>

      {/* Overview KPIs */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
        />
        <KPI
          title="Overstocked"
          value={stats.overstocked}
          icon={AlertCircle}
          subtitle="Requires attention"
        />
        <KPI
          title="Active Campaigns"
          value={stats.campaignsActive}
          icon={Sparkles}
          subtitle="Generated & active"
        />
        <KPI
          title="Understocked"
          value={stats.understocked}
          icon={TrendingDown}
          subtitle="Needs restocking"
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Inventory Status Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {inventoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Campaign Distribution by Cluster */}
        {campaignDistribution.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Campaigns by Customer Cluster</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Campaigns by Objective */}
      {objectiveData.length > 0 && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Campaigns by Objective</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={objectiveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Top Overstocked Products */}
      {topOverstocked.length > 0 && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 10 Overstocked Products</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topOverstocked} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#f97316" name="Current Stock" />
              <Bar dataKey="demand" fill="#3b82f6" name="Predicted Demand (7d)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Healthy Inventory</p>
              <p className="text-2xl font-bold text-green-600">{stats.healthy}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalProducts > 0 ? ((stats.healthy / stats.totalProducts) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overstock Ratio</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.totalProducts > 0 ? ((stats.overstocked / stats.totalProducts) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.overstocked} products need attention
              </p>
            </div>
            <AlertCircle className="text-orange-600" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Discount Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {averageDiscount}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Across {stats.campaignsActive} active campaigns
              </p>
            </div>
            <Target className="text-blue-600" size={32} />
          </div>
        </Card>
      </div>

      {loading && (
        <Card className="mt-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading dashboard data...</div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
