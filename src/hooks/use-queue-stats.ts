import { useQuery } from '@tanstack/react-query';
import { getQueueStats } from '../api-routes/admin-api';
import { QueueResponse } from '../types/admin';

export const useQueueStats = () => {
  return useQuery<QueueResponse>({
    queryKey: ['admin', 'queue'],
    queryFn: getQueueStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
