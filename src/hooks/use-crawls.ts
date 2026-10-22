import { useQuery } from '@tanstack/react-query';
import * as crawlsApi from '../api-routes/crawls-api';
import type { CrawlsResponse } from '../types/crawls';

export const useCrawls = (
  page: number = 1,
  limit: number = 10,
  status?: string,
  websiteId?: string
) => {
  return useQuery<CrawlsResponse>({
    queryKey: ['crawls', page, limit, status, websiteId],
    queryFn: () => crawlsApi.getCrawls(page, limit, status, websiteId),
    staleTime: 60 * 1000, // 1 minute
  });
};
