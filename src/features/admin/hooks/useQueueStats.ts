import { useQuery } from '@tanstack/react-query';
import { getQueueStats } from '../api/adminApi';
import { QueueResponse } from '../types';

export const useQueueStats = () => {
  return useQuery<QueueResponse>({
    queryKey: ['admin', 'queue'],
    queryFn: getQueueStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}; 