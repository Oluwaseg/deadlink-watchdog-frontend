import { getApiClient } from '@/lib/api-client';
import type { DashboardData } from '../types';

const API_BASE = '/api/dashboard';

// Get dashboard overview data
export const getDashboardOverview = async (): Promise<DashboardData> => {
  const apiClient = getApiClient();
  const response = await apiClient.get<DashboardData>(`${API_BASE}/overview`);
  return response;
};

// Get health scores for all websites
export const getHealthScores = async () => {
  const apiClient = getApiClient();
  return apiClient.get(`${API_BASE}/health-scores`);
};

// Get broken links summary
export const getBrokenLinksSummary = async () => {
  const apiClient = getApiClient();
  return apiClient.get(`${API_BASE}/broken-links-summary`);
};

// Get crawl performance metrics
export const getCrawlPerformance = async (days: number = 30) => {
  const apiClient = getApiClient();
  return apiClient.get(`${API_BASE}/crawl-performance?days=${days}`);
};

// Get website categories distribution
export const getWebsiteCategories = async () => {
  const apiClient = getApiClient();
  return apiClient.get(`${API_BASE}/website-categories`);
};

// Get dashboard alerts
export const getDashboardAlerts = async () => {
  const apiClient = getApiClient();
  return apiClient.get(`${API_BASE}/alerts`);
}; 