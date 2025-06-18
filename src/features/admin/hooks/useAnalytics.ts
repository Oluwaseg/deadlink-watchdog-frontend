import { useQuery } from '@tanstack/react-query';
import { getUserAnalytics, getWebsiteAnalytics } from '../api/adminApi';

interface UseAnalyticsOptions {
  period?: string;
}

export const useWebsiteAnalytics = ({ period = '30d' }: UseAnalyticsOptions = {}) => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'websites', { period }],
    queryFn: () => getWebsiteAnalytics(period),
  });
};

export const useUserAnalytics = ({ period = '30d' }: UseAnalyticsOptions = {}) => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'users', { period }],
    queryFn: () => getUserAnalytics(period),
  });
}; 