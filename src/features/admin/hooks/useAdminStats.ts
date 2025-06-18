import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '../api/adminApi';
import { AdminStatsResponse } from '../types';

export const useAdminStats = () => {
    return useQuery<AdminStatsResponse>({
        queryKey: ['admin', 'stats'],
        queryFn: getAdminStats,
    });
}; 