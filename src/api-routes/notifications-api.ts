import { getApiClient } from '@/lib/api-client';
import type {
  Notification,
  NotificationsResponse,
} from '@/types/notifications';

const API_BASE = '/api/notifications';

export function getNotifications(limit = 20): Promise<NotificationsResponse> {
  return getApiClient().get(`${API_BASE}?limit=${limit}`);
}

export function markNotificationRead(id: string): Promise<{
  success: boolean;
  data: { notification: Notification };
}> {
  return getApiClient().patch(`${API_BASE}/${id}/read`);
}

export function markAllNotificationsRead(): Promise<{
  success: boolean;
  data: { updatedCount: number };
}> {
  return getApiClient().patch(`${API_BASE}/read-all`);
}
