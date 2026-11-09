import { getApiClient } from '@/lib/api-client';
import type {
  FeedbackDetailResponse,
  FeedbackListResponse,
  FeedbackSubmission,
} from '@/types/feedback';

const API_BASE = '/api/feedback';

export const submitFeedback = (feedback: FeedbackSubmission) =>
  getApiClient().post(`${API_BASE}`, feedback);

export const getFeedback = (page = 1, limit = 20) =>
  getApiClient().get<FeedbackListResponse>(
    `${API_BASE}?page=${page}&limit=${limit}`
  );

export const getFeedbackById = (id: string) =>
  getApiClient().get<FeedbackDetailResponse>(
    `${API_BASE}/${encodeURIComponent(id)}`
  );
