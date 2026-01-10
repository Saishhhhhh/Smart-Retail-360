import React, { useState, useEffect } from 'react';
import { getCampaignPlan, generateCampaign, getGeneratedCampaigns } from '../services/campaignService';
import CampaignCard from '../components/dashboard/CampaignCard';
import Card from '../components/common/Card';
import KPI from '../components/common/KPI';
import Button from '../components/common/Button';
import { Sparkles, Users, Mail, MessageCircle, Loader, ChevronDown, ChevronUp } from 'lucide-react';

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
      // Try to load from backend first
      const backendCampaigns = await getGeneratedCampaigns();
      
      // Also load from localStorage as backup
      const localCampaigns = localStorage.getItem(STORAGE_KEY);
      const parsedLocal = localCampaigns ? JSON.parse(localCampaigns) : {};
      
      // Merge: backend takes precedence, then localStorage
      const merged = { ...parsedLocal, ...backendCampaigns };
      setGeneratedCampaigns(merged);
      
      // Save merged to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (error) {
      console.error('Error loading generated campaigns:', error);
      // Fallback to localStorage only
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
      
      // Save to state and localStorage
      saveGeneratedCampaign(campaignId, campaignData);
    } catch (error) {
      console.error('Error generating campaign:', error);
      alert('Failed to generate campaign. Please try again.');
    } finally {
      setGenerating(prev => ({ ...prev, [campaignId]: false }));
    }
  };

  // Filter campaigns by cluster
  const filteredCampaigns = clusterFilter === 'ALL' 
    ? campaignPlan 
    : campaignPlan.filter(campaign => {
        const cluster = campaign.Target_Cluster || campaign.TargetCluster || campaign.Cluster || '';
        return cluster === clusterFilter || cluster.includes(clusterFilter);
      });

  const clusters = ['ALL', 'VIP Customers', 'Regular', 'At-Risk Customers', 'New Customers', 'Lost'];
  
  // Count only generated campaigns
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Campaign Center</h2>
        <p className="text-gray-600">AI-recommended marketing campaigns for overstocked products</p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI
          title="Active Campaigns"
          value={stats.activeCampaigns}
          icon={Sparkles}
        />
        <KPI
          title="VIP Campaigns"
          value={stats.byCluster['VIP Customers'] || 0}
          icon={Users}
        />
        <KPI
          title="Email Campaigns"
          value={stats.activeCampaigns}
          icon={Mail}
        />
        <KPI
          title="WhatsApp Messages"
          value={stats.activeCampaigns}
          icon={MessageCircle}
        />
      </div>

      <Card className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Customer Cluster
          </label>
          <div className="flex flex-wrap gap-2">
            {clusters.map((cluster) => (
              <button
                key={cluster}
                onClick={() => setClusterFilter(cluster)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  clusterFilter === cluster
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cluster}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading campaign plan...</div>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Sparkles className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No campaigns available</p>
            <p className="text-sm text-gray-500 mt-2">
              Campaigns are generated for overstocked products
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Campaign Plan Table - Collapsible */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Campaign Plan</h3>
              <button
                onClick={() => setTableCollapsed(!tableCollapsed)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objective
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cluster
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Discount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {row.StockCode}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {productName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {row.Objective}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {targetCluster}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row.Discount || row.Discount_Percent}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {!generatedCampaign ? (
                              <Button
                                onClick={() => handleGenerateCampaign(row)}
                                disabled={isGenerating}
                                variant="primary"
                                className="text-xs"
                              >
                                {isGenerating ? (
                                  <>
                                    <Loader className="animate-spin" size={14} />
                                    Activating...
                                  </>
                                ) : (
                                  'Activate Campaign'
                                )}
                              </Button>
                            ) : (
                              <span className="text-green-600 text-xs font-medium">Active ✓</span>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Campaigns ({activeCampaigns})</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    
                    // Format campaign data for CampaignCard component
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
  );
};

export default Campaigns;
