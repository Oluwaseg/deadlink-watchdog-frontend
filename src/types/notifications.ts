export type NotificationType = 'crawl_completed' | 'crawl_failed';

export interface Notification {
  id: string;
  userId: string;
  crawlId: string;
  type: NotificationType;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    unreadCount: number;
  };
}
