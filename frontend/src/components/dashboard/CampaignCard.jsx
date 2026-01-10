import React, { useState } from 'react';
import { Mail, Bell, Users, Tag, ChevronDown, ChevronUp } from 'lucide-react';

const CampaignCard = ({ campaign }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const clusterColors = {
    VIP: 'bg-purple-100 text-purple-800 border-purple-200',
    Regular: 'bg-blue-100 text-blue-800 border-blue-200',
    'At-Risk': 'bg-orange-100 text-orange-800 border-orange-200',
    New: 'bg-green-100 text-green-800 border-green-200',
    Lost: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {campaign.productName}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${clusterColors[campaign.targetCluster] || clusterColors.Regular}`}>
              <Users size={12} className="mr-1" />
              {campaign.targetCluster}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              <Tag size={12} className="mr-1" />
              {campaign.discount}% OFF
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} color="#4b5563" />
            <span className="text-sm font-medium text-gray-700">Email Subject</span>
          </div>
          <p className="text-sm text-gray-800">{campaign.emailSubject}</p>
        </div>

        {isExpanded && (
          <>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} color="#4b5563" />
                <span className="text-sm font-medium text-gray-700">Email Body</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">{campaign.emailBody}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={16} color="#4b5563" />
                <span className="text-sm font-medium text-gray-700">Push Notification</span>
              </div>
              <p className="text-sm text-gray-800">{campaign.pushNotification}</p>
            </div>

            <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
              Stock Code: {campaign.stockCode} | Surplus: {campaign.stockSurplus.toFixed(2)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;
