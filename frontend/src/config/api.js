// API Configuration
// In production, this will use VITE_API_BASE_URL from environment variables
// In development, it defaults to localhost:8000

const getApiBaseUrl = () => {
  // Check for environment variable (set during build)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Development fallback
  if (import.meta.env.DEV) {
    return 'http://localhost:8000';
  }
  
  // Production fallback (update this to your production API URL)
  return 'http://localhost:8000'; // Change this to your production backend URL
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  INVENTORY: '/inventory',
  DEMAND: '/demand',
  CAMPAIGN_PLAN: '/campaign-plan',
  GENERATE_CAMPAIGN: '/generate-campaign',
  GENERATED_CAMPAIGNS: '/generated-campaigns',
};

// Log API base URL in development (helpful for debugging)
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}
