import { useQuery } from '@tanstack/react-query';
import { getWebsitesModeration } from '../api/adminApi';

interface UseWebsitesModerationOptions {
  page?: number;
  limit?: number;
  status?: 'flagged' | 'reported' | 'blocked';
}

export const useWebsitesModeration = ({
  page = 1,
  limit = 20,
  status,
}: UseWebsitesModerationOptions = {}) => {
  return useQuery({
    queryKey: ['admin', 'websites', 'moderation', { page, limit, status }],
    queryFn: () => getWebsitesModeration({ page, limit, status }),
  });
}; 