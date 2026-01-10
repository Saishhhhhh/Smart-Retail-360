import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getCampaignPlan = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.CAMPAIGN_PLAN);
    // Backend returns campaign_plan.csv data
    return response.data;
  } catch (error) {
    console.error('Error fetching campaign plan:', error);
    throw error;
  }
};

export const generateCampaign = async (payload) => {
  try {
    const response = await api.post(API_ENDPOINTS.GENERATE_CAMPAIGN, payload);
    // Backend returns AI-generated campaign content
    return response.data;
  } catch (error) {
    console.error('Error generating campaign:', error);
    throw error;
  }
};

export const getGeneratedCampaigns = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.GENERATED_CAMPAIGNS);
    return response.data;
  } catch (error) {
    console.error('Error fetching generated campaigns:', error);
    return {};
  }
};

// Helper function to filter campaigns by cluster
export const getCampaignsByCluster = async (cluster) => {
  try {
    const campaignPlan = await getCampaignPlan();
    const campaignsArray = Array.isArray(campaignPlan) ? campaignPlan : campaignPlan.data || [];
    
    if (!cluster || cluster === 'ALL') return campaignsArray;
    return campaignsArray.filter(campaign => campaign.Target_Cluster === cluster || campaign.Cluster === cluster);
  } catch (error) {
    console.error('Error filtering campaigns by cluster:', error);
    throw error;
  }
};
