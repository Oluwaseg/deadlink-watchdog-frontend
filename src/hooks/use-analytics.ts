import { useQuery } from '@tanstack/react-query';
import { getUserAnalytics, getWebsiteAnalytics } from '../api-routes/admin-api';

interface UseAnalyticsOptions {
  period?: number;
}

export const useWebsiteAnalytics = ({
  period = 30,
}: UseAnalyticsOptions = {}) => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'websites', { period }],
    queryFn: () => getWebsiteAnalytics(period),
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
  });
};

export const useUserAnalytics = ({ period = 30 }: UseAnalyticsOptions = {}) => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'users', { period }],
    queryFn: () => getUserAnalytics(period),
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
  });
};
