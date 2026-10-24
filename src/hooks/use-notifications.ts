import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/api-routes/notifications-api';
import type { NotificationsResponse } from '@/types/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const notificationsQueryKey = ['notifications', 'list'] as const;

export function useNotifications() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: notificationsQueryKey,
    queryFn: () => getNotifications(),
  });

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: ({ data: { notification } }) => {
      queryClient.setQueryData<NotificationsResponse>(
        notificationsQueryKey,
        (current) => {
          if (!current) return current;
          const wasUnread = current.data.notifications.some(
            (item) => item.id === notification.id && !item.readAt
          );
          return {
            ...current,
            data: {
              notifications: current.data.notifications.map((item) =>
                item.id === notification.id ? notification : item
              ),
              unreadCount: Math.max(
                0,
                current.data.unreadCount - (wasUnread ? 1 : 0)
              ),
            },
          };
        }
      );
    },
  });

  const markAllRead = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.setQueryData<NotificationsResponse>(
        notificationsQueryKey,
        (current) =>
          current
            ? {
                ...current,
                data: {
                  notifications: current.data.notifications.map((item) => ({
                    ...item,
                    readAt: item.readAt || new Date().toISOString(),
                  })),
                  unreadCount: 0,
                },
              }
            : current
      );
    },
  });

  return { ...query, markRead, markAllRead };
}
