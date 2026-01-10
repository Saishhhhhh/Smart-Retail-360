import React, { useState, useEffect } from 'react';
import { getCampaigns, getCampaignsByCluster } from '../services/campaignService';
import CampaignCard from '../components/dashboard/CampaignCard';
import Card from '../components/common/Card';
import KPI from '../components/common/KPI';
import { Sparkles, Users, Mail, Bell } from 'lucide-react';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [clusterFilter, setClusterFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, [clusterFilter]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await getCampaignsByCluster(clusterFilter === 'ALL' ? null : clusterFilter);
      setCampaigns(data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const clusters = ['ALL', 'VIP', 'Regular', 'At-Risk', 'New', 'Lost'];
  const stats = {
    total: campaigns.length,
    byCluster: campaigns.reduce((acc, campaign) => {
      acc[campaign.targetCluster] = (acc[campaign.targetCluster] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Campaign Center</h2>
        <p className="text-gray-600">AI-generated marketing campaigns for overstocked products</p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI
          title="Active Campaigns"
          value={stats.total}
          icon={Sparkles}
        />
        <KPI
          title="VIP Campaigns"
          value={stats.byCluster['VIP'] || 0}
          icon={Users}
        />
        <KPI
          title="Email Campaigns"
          value={stats.total}
          icon={Mail}
        />
        <KPI
          title="Push Notifications"
          value={stats.total}
          icon={Bell}
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
          <div className="text-gray-500">Loading campaigns...</div>
        </div>
      ) : campaigns.length === 0 ? (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
