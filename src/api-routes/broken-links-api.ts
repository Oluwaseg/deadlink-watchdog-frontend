import { getApiClient } from '@/lib/api-client';
import type { BrokenLinksResponse } from '../types/broken-links';

interface GetBrokenLinksParams {
  page?: number;
  limit?: number;
  errorType?: string;
  isFixed?: boolean;
  search?: string;
}

export const getBrokenLinks = async (
  params: GetBrokenLinksParams = {}
): Promise<BrokenLinksResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.errorType) queryParams.append('errorType', params.errorType);
  if (params.isFixed !== undefined)
    queryParams.append('isFixed', params.isFixed.toString());
  if (params.search?.trim()) queryParams.append('search', params.search.trim());

  const apiClient = getApiClient();
  return apiClient.get<BrokenLinksResponse>(
    `/api/dashboard/broken-links-summary?${queryParams.toString()}`
  );
};
