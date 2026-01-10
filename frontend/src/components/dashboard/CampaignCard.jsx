import React, { useState } from 'react';
import { Mail, MessageCircle, Users, Tag, ChevronDown, ChevronUp } from 'lucide-react';

const CampaignCard = ({ campaign }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const clusterColors = {
    'VIP Customers': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    'Regular': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    'Regular Customers': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    'At-Risk Customers': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
    'New Customers': 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    'Lost Customers': 'bg-gradient-to-r from-red-500 to-red-600 text-white'
  };

  const clusterName = campaign.targetCluster || 'Regular';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {campaign.productName}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm ${clusterColors[clusterName] || clusterColors.Regular}`}>
              <Users size={14} className="mr-1.5" />
              {clusterName}
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-sm">
              <Tag size={14} className="mr-1.5" />
              {campaign.discount}% OFF
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <div className="space-y-3">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-500 rounded-lg p-1.5">
              <Mail size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Email Subject</span>
          </div>
          <p className="text-sm text-gray-800 font-medium">{campaign.emailSubject}</p>
        </div>

        {isExpanded && (
          <>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-gray-600 rounded-lg p-1.5">
                  <Mail size={14} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Email Body</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{campaign.emailBody}</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-green-500 rounded-lg p-1.5">
                  <MessageCircle size={14} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">WhatsApp Message</span>
              </div>
              <p className="text-sm text-gray-800 font-medium">{campaign.whatsappMessage || campaign.pushNotification}</p>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Stock Code: <span className="font-semibold text-gray-700">{campaign.stockCode}</span></span>
                <span>Surplus: <span className="font-semibold text-gray-700">{campaign.stockSurplus ? campaign.stockSurplus.toFixed(2) : 'N/A'}</span></span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;
