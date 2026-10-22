import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '../api-routes/admin-api';
import { AdminStatsResponse } from '../types/admin';

export const useAdminStats = () => {
  return useQuery<AdminStatsResponse>({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStats,
  });
};
