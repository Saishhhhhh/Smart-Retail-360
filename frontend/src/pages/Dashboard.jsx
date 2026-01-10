import React, { useState, useEffect } from 'react';
import { getInventory } from '../services/inventoryService';
import { getCampaignPlan } from '../services/campaignService';
import { getGeneratedCampaigns } from '../services/campaignService';
import Card from '../components/common/Card';
import KPI from '../components/common/KPI';
import { Package, AlertCircle, Sparkles, TrendingUp, TrendingDown, Target, Activity, Zap, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
      name: (item.ProductName || item.StockCode || 'Unknown').substring(0, 25),
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
    name: name.replace(' Customers', ''),
    value
  }));

  const COLORS = ['#8b5cf6', '#3b82f6', '#f97316', '#22c55e', '#ef4444'];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xl">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Retail Manager Dashboard</h1>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg">Real-time inventory insights & AI-powered campaign management</p>
              </div>
              <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                  <div className="text-xs text-blue-200">Total Products</div>
                  <div className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                  <div className="text-xs text-blue-200">Active Campaigns</div>
                  <div className="text-2xl font-bold">{stats.campaignsActive}</div>
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
                <Package size={24} className="sm:w-7 sm:h-7" />
              </div>
              <span className="text-blue-100 text-xs sm:text-sm font-medium">Total Products</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.totalProducts.toLocaleString()}</div>
            <div className="text-blue-100 text-xs sm:text-sm">Across all categories</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                <AlertCircle size={24} className="sm:w-7 sm:h-7" />
              </div>
              <span className="text-orange-100 text-xs sm:text-sm font-medium">Overstocked</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.overstocked}</div>
            <div className="text-orange-100 text-xs sm:text-sm">
              {stats.totalProducts > 0 ? ((stats.overstocked / stats.totalProducts) * 100).toFixed(1) : 0}% of inventory
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                <Sparkles size={24} className="sm:w-7 sm:h-7" />
              </div>
              <span className="text-purple-100 text-xs sm:text-sm font-medium">Active Campaigns</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.campaignsActive}</div>
            <div className="text-purple-100 text-xs sm:text-sm">AI-generated & running</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                <TrendingDown size={24} className="sm:w-7 sm:h-7" />
              </div>
              <span className="text-red-100 text-xs sm:text-sm font-medium">Understocked</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.understocked}</div>
            <div className="text-red-100 text-xs sm:text-sm">Requires restocking</div>
          </div>
        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Inventory Status Distribution */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 rounded-lg p-2">
                <Activity className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Inventory Status Distribution</h3>
            </div>
            <div className="h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {inventoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              {inventoryDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Campaign Distribution by Cluster */}
          {campaignDistribution.length > 0 ? (
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 rounded-lg p-2">
                  <BarChart3 className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Campaigns by Customer Cluster</h3>
              </div>
              <div className="h-[280px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          ) : (
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-center h-full min-h-[320px] text-gray-400">
                <div className="text-center">
                  <Sparkles size={48} className="mx-auto mb-4" />
                  <p>No active campaigns yet</p>
                  <p className="text-sm mt-2">Generate campaigns to see distribution</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Campaigns by Objective */}
        {objectiveData.length > 0 && (
          <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 rounded-lg p-2">
                <Target className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Campaigns by Objective</h3>
            </div>
            <div className="h-[300px] sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={objectiveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={120}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Top Overstocked Products */}
        {topOverstocked.length > 0 && (
          <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 rounded-lg p-2">
                <Zap className="text-orange-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Top 10 Overstocked Products</h3>
            </div>
            <div className="h-[400px] sm:h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topOverstocked} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={180}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="stock" fill="#f97316" name="Current Stock" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="demand" fill="#3b82f6" name="Predicted Demand (7d)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Healthy Inventory</p>
                <p className="text-3xl font-bold text-green-800">{stats.healthy}</p>
                <p className="text-xs text-green-600 mt-2">
                  {stats.totalProducts > 0 ? ((stats.healthy / stats.totalProducts) * 100).toFixed(1) : 0}% of total products
                </p>
              </div>
              <div className="bg-green-200 rounded-full p-4">
                <TrendingUp className="text-green-700" size={36} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 mb-1">Overstock Ratio</p>
                <p className="text-3xl font-bold text-orange-800">
                  {stats.totalProducts > 0 ? ((stats.overstocked / stats.totalProducts) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  {stats.overstocked} products require attention
                </p>
              </div>
              <div className="bg-orange-200 rounded-full p-4">
                <AlertCircle className="text-orange-700" size={36} />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Average Discount Rate</p>
                <p className="text-3xl font-bold text-blue-800">
                  {averageDiscount}%
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Across {stats.campaignsActive} active campaigns
                </p>
              </div>
              <div className="bg-blue-200 rounded-full p-4">
                <Target className="text-blue-700" size={36} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
