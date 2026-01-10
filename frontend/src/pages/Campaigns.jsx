import React, { useState, useEffect } from 'react';
import { getCampaignPlan, generateCampaign, getGeneratedCampaigns } from '../services/campaignService';
import CampaignCard from '../components/dashboard/CampaignCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Sparkles, Users, Mail, MessageCircle, Loader, ChevronDown, ChevronUp, Zap, Target, List } from 'lucide-react';

const STORAGE_KEY = 'smartretail_generated_campaigns';

const Campaigns = () => {
  const [campaignPlan, setCampaignPlan] = useState([]);
  const [generatedCampaigns, setGeneratedCampaigns] = useState({});
  const [clusterFilter, setClusterFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState({});
  const [tableCollapsed, setTableCollapsed] = useState(false);

  useEffect(() => {
    loadCampaignPlan();
    loadGeneratedCampaigns();
  }, []);

  const loadCampaignPlan = async () => {
    setLoading(true);
    try {
      const data = await getCampaignPlan();
      const campaignsArray = Array.isArray(data) ? data : data.data || [];
      setCampaignPlan(campaignsArray);
    } catch (error) {
      console.error('Error loading campaign plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGeneratedCampaigns = async () => {
    try {
      const backendCampaigns = await getGeneratedCampaigns();
      const localCampaigns = localStorage.getItem(STORAGE_KEY);
      const parsedLocal = localCampaigns ? JSON.parse(localCampaigns) : {};
      const merged = { ...parsedLocal, ...backendCampaigns };
      setGeneratedCampaigns(merged);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (error) {
      console.error('Error loading generated campaigns:', error);
      const localCampaigns = localStorage.getItem(STORAGE_KEY);
      if (localCampaigns) {
        setGeneratedCampaigns(JSON.parse(localCampaigns));
      }
    }
  };

  const saveGeneratedCampaign = (campaignId, campaignData) => {
    const updated = { ...generatedCampaigns, [campaignId]: campaignData };
    setGeneratedCampaigns(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleGenerateCampaign = async (row) => {
    const targetCluster = row.Target_Cluster || row.TargetCluster || row.Cluster || 'Regular';
    const campaignId = `${row.StockCode}_${targetCluster}`;
    setGenerating(prev => ({ ...prev, [campaignId]: true }));

    try {
      const payload = {
        stock_code: row.StockCode,
        target_cluster: targetCluster,
        objective: row.Objective,
        discount: row.Discount || row.Discount_Percent || 0,
        current_stock: row.Current_Stock || row.CurrentStock || 0,
        predicted_demand: row.Predicted_7d_Demand || row.Predicted_Demand || 0,
        product_description: row.ProductName || row.product_name || row.Description || ''
      };

      const response = await generateCampaign(payload);
      const campaignData = response.data || response;
      saveGeneratedCampaign(campaignId, campaignData);
    } catch (error) {
      console.error('Error generating campaign:', error);
      alert('Failed to generate campaign. Please try again.');
    } finally {
      setGenerating(prev => ({ ...prev, [campaignId]: false }));
    }
  };

  const filteredCampaigns = clusterFilter === 'ALL' 
    ? campaignPlan 
    : campaignPlan.filter(campaign => {
        const cluster = campaign.Target_Cluster || campaign.TargetCluster || campaign.Cluster || '';
        return cluster === clusterFilter || cluster.includes(clusterFilter);
      });

  const clusters = ['ALL', 'VIP Customers', 'Regular', 'At-Risk Customers', 'New Customers', 'Lost'];
  const activeCampaigns = Object.keys(generatedCampaigns).length;
  
  const stats = {
    total: campaignPlan.length,
    activeCampaigns: activeCampaigns,
    byCluster: Object.values(generatedCampaigns).reduce((acc, campaign) => {
      const cluster = campaign.TargetCluster || campaign.Target_Cluster || 'Unknown';
      acc[cluster] = (acc[cluster] || 0) + 1;
      return acc;
    }, {})
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaign plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-700 text-white shadow-xl">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">AI Campaign Center</h1>
                <p className="text-purple-100 text-sm sm:text-base lg:text-lg">AI-powered marketing campaigns for overstocked products</p>
              </div>
              <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                  <div className="text-xs text-purple-200">Active Campaigns</div>
                  <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                  <div className="text-xs text-purple-200">Total Plans</div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                <Sparkles size={24} className="sm:w-7 sm:h-7" />
              </div>
              <span className="text-purple-100 text-xs sm:text-sm font-medium">Active Campaigns</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.activeCampaigns}</div>
            <div className="text-purple-100 text-xs sm:text-sm">Generated & running</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                <Users size={24} className="sm:w-7 sm:h-7" />
              </div>
              <span className="text-indigo-100 text-xs sm:text-sm font-medium">VIP Campaigns</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.byCluster['VIP Customers'] || 0}</div>
            <div className="text-indigo-100 text-xs sm:text-sm">Premium segment</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                <Mail size={24} className="sm:w-7 sm:h-7" />
              </div>
              <span className="text-blue-100 text-xs sm:text-sm font-medium">Email Campaigns</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.activeCampaigns}</div>
            <div className="text-blue-100 text-xs sm:text-sm">Ready to send</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                <MessageCircle size={24} className="sm:w-7 sm:h-7" />
              </div>
              <span className="text-green-100 text-xs sm:text-sm font-medium">WhatsApp Messages</span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.activeCampaigns}</div>
            <div className="text-green-100 text-xs sm:text-sm">Ready to send</div>
          </div>
        </div>

        {/* Filter Section */}
        <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 rounded-lg p-2">
              <Target className="text-purple-600" size={20} />
            </div>
            <label className="text-sm font-semibold text-gray-700">
              Filter by Customer Cluster
            </label>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {clusters.map((cluster) => (
              <button
                key={cluster}
                onClick={() => setClusterFilter(cluster)}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                  clusterFilter === cluster
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cluster}
              </button>
            ))}
          </div>
        </Card>

        {filteredCampaigns.length === 0 ? (
          <Card className="shadow-lg">
            <div className="text-center py-16">
              <Sparkles className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-xl font-semibold text-gray-600 mb-2">No campaigns available</p>
              <p className="text-sm text-gray-500">
                Campaigns are generated for overstocked products
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Campaign Plan Table - Collapsible */}
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="bg-purple-100 rounded-lg p-2">
                    <List className="text-purple-600" size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Campaign Plan</h3>
                  <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium">
                    {filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'campaign' : 'campaigns'}
                  </span>
                </div>
                <button
                  onClick={() => setTableCollapsed(!tableCollapsed)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto justify-center"
                >
                  {tableCollapsed ? (
                    <>
                      <ChevronDown size={18} />
                      <span>Show Table</span>
                    </>
                  ) : (
                    <>
                      <ChevronUp size={18} />
                      <span>Hide Table</span>
                    </>
                  )}
                </button>
              </div>
              
              {!tableCollapsed && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 -mx-4 sm:mx-0">
                  <table className="min-w-full divide-y divide-gray-200 bg-white">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Stock Code
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                          Objective
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                          Cluster
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Discount
                        </th>
                        <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCampaigns.map((row, index) => {
                        const targetCluster = row.Target_Cluster || row.TargetCluster || row.Cluster || 'Regular';
                        const campaignId = `${row.StockCode}_${targetCluster}`;
                        const isGenerating = generating[campaignId];
                        const generatedCampaign = generatedCampaigns[campaignId];
                        const productName = row.ProductName || row.product_name || row.Description || row.StockCode;
                        
                        return (
                          <tr 
                            key={index} 
                            className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors duration-150"
                          >
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className="text-xs sm:text-sm font-semibold text-gray-900">{row.StockCode}</span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                              <span className="text-xs sm:text-sm text-gray-700 line-clamp-2">{productName}</span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                              <span className="text-xs sm:text-sm text-gray-700">{row.Objective}</span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                              <span className="text-xs sm:text-sm text-gray-600">{targetCluster}</span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm font-medium">
                                {row.Discount || row.Discount_Percent}%
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              {!generatedCampaign ? (
                                <Button
                                  onClick={() => handleGenerateCampaign(row)}
                                  disabled={isGenerating}
                                  variant="primary"
                                  className="text-xs px-2 sm:px-4 py-1.5 sm:py-2"
                                >
                                  {isGenerating ? (
                                    <>
                                      <Loader className="animate-spin" size={14} />
                                      Activating...
                                    </>
                                  ) : (
                                    <>
                                      <Zap size={14} className="mr-1" />
                                      Activate Campaign
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                  ✓ Active
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Generated Campaign Cards */}
            {activeCampaigns > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-2">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Active Campaigns</h3>
                  <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {activeCampaigns} {activeCampaigns === 1 ? 'campaign' : 'campaigns'}
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {filteredCampaigns
                    .filter(row => {
                      const targetCluster = row.Target_Cluster || row.TargetCluster || row.Cluster || 'Regular';
                      return generatedCampaigns[`${row.StockCode}_${targetCluster}`];
                    })
                    .map((row, index) => {
                      const targetCluster = row.Target_Cluster || row.TargetCluster || row.Cluster || 'Regular';
                      const campaignId = `${row.StockCode}_${targetCluster}`;
                      const generatedCampaign = generatedCampaigns[campaignId];
                      const productName = row.ProductName || row.product_name || row.Description || row.StockCode;
                      
                      const campaignData = {
                        id: campaignId,
                        stockCode: row.StockCode,
                        productName: productName,
                        targetCluster: targetCluster,
                        discount: row.Discount || row.Discount_Percent,
                        stockSurplus: row.Stock_Surplus || (row.Current_Stock - row.Predicted_7d_Demand) || 0,
                        emailSubject: generatedCampaign.email_subject || generatedCampaign.subject || '',
                        emailBody: generatedCampaign.email_body || generatedCampaign.body || '',
                        whatsappMessage: generatedCampaign.whatsapp_message || generatedCampaign.message || '',
                        generatedAt: generatedCampaign.generatedAt || new Date().toISOString()
                      };

                      return (
                        <CampaignCard key={campaignId} campaign={campaignData} />
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
