import { useQuery } from '@tanstack/react-query';
import * as dashboardApi from '../api/dashboardApi';
import type { DashboardData } from '../types';

export const useDashboardOverview = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', 'overview'],
    queryFn: dashboardApi.getDashboardOverview,
    staleTime: 60 * 1000, // 1 minute
  });
}; 