import { getApiClient } from '@/lib/api-client';
import type { CrawlsResponse } from '../types';

const API_BASE = '/api/crawls';

// Get crawls with pagination and filters
export const getCrawls = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  websiteId?: string
): Promise<CrawlsResponse> => {
  const apiClient = getApiClient();
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) queryParams.append('status', status);
  if (websiteId) queryParams.append('websiteId', websiteId);

  return apiClient.get<CrawlsResponse>(`${API_BASE}?${queryParams.toString()}`);
};

// Get crawl statistics summary
export const getCrawlStatsSummary = async () => {
  const apiClient = getApiClient();
  return apiClient.get(`${API_BASE}/stats/summary`);
};

// Get crawl trends data
export const getCrawlTrends = async (days: number = 30) => {
  const apiClient = getApiClient();
  return apiClient.get(`${API_BASE}/stats/trends?days=${days}`);
};

// Get broken links for a specific crawl
export const getCrawlBrokenLinks = async (
  crawlId: string,
  page: number = 1,
  limit: number = 20,
  errorType?: string
) => {
  const apiClient = getApiClient();
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (errorType) queryParams.append('errorType', errorType);

  return apiClient.get(`${API_BASE}/${crawlId}/broken-links?${queryParams.toString()}`);
};

// Retry a failed crawl
export const retryCrawl = async (crawlId: string) => {
  const apiClient = getApiClient();
  return apiClient.post(`${API_BASE}/${crawlId}/retry`);
};

// Get a specific crawl result
export const getCrawlResult = async (crawlId: string) => {
  const apiClient = getApiClient();
  return apiClient.get(`${API_BASE}/${crawlId}`);
}; 