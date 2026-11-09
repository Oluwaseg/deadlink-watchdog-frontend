import { getFeedback, getFeedbackById } from '@/api-routes/feedback-api';
import { useQuery } from '@tanstack/react-query';

export const useFeedback = (page: number, limit = 20) =>
  useQuery({
    queryKey: ['admin', 'feedback', { page, limit }],
    queryFn: () => getFeedback(page, limit),
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
  });

export const useFeedbackById = (id: string | undefined) =>
  useQuery({
    queryKey: ['admin', 'feedback', id],
    queryFn: () => getFeedbackById(id!),
    enabled: Boolean(id),
  });
