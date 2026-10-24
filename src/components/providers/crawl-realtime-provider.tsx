'use client';

import { useAuthState } from '@/hooks/use-auth';
import { refreshAuthSession } from '@/lib/auth-session';
import { getAccessToken } from '@/lib/auth-storage';
import type {
  CrawlResult,
  CrawlResultResponse,
  CrawlsResponse,
} from '@/types/crawls';
import type {
  Notification,
  NotificationsResponse,
} from '@/types/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

interface CrawlEvent {
  crawlId: string;
  websiteId: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  completedAt?: string;
  totalLinksFound?: number;
  totalLinksChecked?: number;
  brokenLinksFound?: number;
  errorMessage?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const NOTIFICATIONS_QUERY_KEY = ['notifications', 'list'] as const;

function updateCrawl(crawl: CrawlResult, event: CrawlEvent): CrawlResult {
  if (crawl.id !== event.crawlId) return crawl;
  if (
    (crawl.status === 'completed' || crawl.status === 'failed') &&
    event.status === 'running'
  ) {
    return crawl;
  }

  return {
    ...crawl,
    status: event.status === 'running' ? 'in_progress' : event.status,
    progress: Math.max(crawl.progress ?? 0, event.progress),
    ...(event.completedAt ? { completedAt: event.completedAt } : {}),
    ...(event.totalLinksFound !== undefined
      ? { totalLinksFound: event.totalLinksFound }
      : {}),
    ...(event.totalLinksChecked !== undefined
      ? { totalLinksChecked: event.totalLinksChecked }
      : {}),
    ...(event.brokenLinksFound !== undefined
      ? { brokenLinksFound: event.brokenLinksFound }
      : {}),
    ...(event.errorMessage ? { errorMessage: event.errorMessage } : {}),
  };
}

export function CrawlRealtimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuthState();
  const queryClient = useQueryClient();
  const refreshingSocketAuthRef = useRef(false);
  const hasConnectedRef = useRef(false);
  const connectedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!isAuthenticated || !user || !accessToken) return;

    const socket = io(API_URL, {
      autoConnect: false,
      withCredentials: true,
      auth: (callback) => callback({ accessToken: getAccessToken() }),
      reconnection: true,
      reconnectionAttempts: Infinity,
    });

    const onCrawlEvent = (event: CrawlEvent) => {
      if (
        !event ||
        typeof event.crawlId !== 'string' ||
        typeof event.websiteId !== 'string' ||
        !['running', 'completed', 'failed'].includes(event.status) ||
        !Number.isInteger(event.progress) ||
        event.progress < 0 ||
        event.progress > 100
      ) {
        return;
      }

      let foundInCache = false;
      queryClient.setQueriesData<CrawlsResponse>(
        { queryKey: ['crawls'] },
        (current) => {
          if (!current?.data?.crawlResults) return current;
          if (
            current.data.crawlResults.some(
              (crawl) => crawl.id === event.crawlId
            )
          ) {
            foundInCache = true;
          }
          return {
            ...current,
            data: {
              ...current.data,
              crawlResults: current.data.crawlResults.map((crawl) =>
                updateCrawl(crawl, event)
              ),
            },
          };
        }
      );

      if (event.status === 'running' && event.progress === 0 && !foundInCache) {
        void queryClient.invalidateQueries({ queryKey: ['crawls'] });
      }

      queryClient.setQueryData<CrawlResultResponse>(
        ['crawl', event.crawlId],
        (current) => {
          if (!current?.data?.crawlResult) return current;
          return {
            ...current,
            data: {
              ...current.data,
              crawlResult: updateCrawl(current.data.crawlResult, event),
            },
          };
        }
      );

      if (event.status !== 'running') {
        void queryClient.invalidateQueries({ queryKey: ['crawls'] });
        void queryClient.invalidateQueries({
          queryKey: ['crawl', event.crawlId],
        });
        void queryClient.invalidateQueries({
          queryKey: ['dashboard', 'overview'],
        });
        void queryClient.invalidateQueries({ queryKey: ['websites'] });
      }
    };

    const onNotification = (notification: Notification) => {
      if (
        !notification ||
        typeof notification.id !== 'string' ||
        typeof notification.crawlId !== 'string' ||
        typeof notification.title !== 'string' ||
        typeof notification.message !== 'string'
      ) {
        return;
      }

      const current = queryClient.getQueryData<NotificationsResponse>(
        NOTIFICATIONS_QUERY_KEY
      );
      if (!current) {
        void queryClient.invalidateQueries({
          queryKey: NOTIFICATIONS_QUERY_KEY,
        });
        return;
      }
      if (
        current.data.notifications.some((item) => item.id === notification.id)
      ) {
        return;
      }

      queryClient.setQueryData<NotificationsResponse>(NOTIFICATIONS_QUERY_KEY, {
        ...current,
        data: {
          notifications: [notification, ...current.data.notifications].slice(
            0,
            20
          ),
          unreadCount: current.data.unreadCount + (notification.readAt ? 0 : 1),
        },
      });
    };

    const onConnectError = (error: Error & { data?: { code?: string } }) => {
      if (
        error.data?.code !== 'TOKEN_EXPIRED' ||
        refreshingSocketAuthRef.current
      )
        return;

      refreshingSocketAuthRef.current = true;
      void renewSocketSession();
    };

    const renewSocketSession = async () => {
      try {
        const tokens = await refreshAuthSession(API_URL);
        socket.auth = (callback) =>
          callback({ accessToken: tokens.accessToken });
        socket.disconnect();
        socket.connect();
      } catch {
        socket.disconnect();
      } finally {
        refreshingSocketAuthRef.current = false;
      }
    };

    const onConnect = () => {
      if (!hasConnectedRef.current) {
        hasConnectedRef.current = true;
        connectedTokenRef.current = getAccessToken();
        return;
      }
      connectedTokenRef.current = getAccessToken();
      void queryClient.invalidateQueries({ queryKey: ['crawls'] });
      void queryClient.invalidateQueries({
        queryKey: ['dashboard', 'overview'],
      });
      void queryClient.invalidateQueries({ queryKey: ['websites'] });
      void queryClient.invalidateQueries({
        queryKey: NOTIFICATIONS_QUERY_KEY,
      });
    };

    const onAuthLogout = () => socket.disconnect();
    const onAuthExpired = () => {
      if (refreshingSocketAuthRef.current) return;
      const currentToken = getAccessToken();
      if (currentToken && currentToken !== connectedTokenRef.current) {
        socket.auth = (callback) => callback({ accessToken: currentToken });
        socket.disconnect();
        socket.connect();
        return;
      }
      refreshingSocketAuthRef.current = true;
      void renewSocketSession();
    };

    socket.on('crawl:started', onCrawlEvent);
    socket.on('crawl:progress', onCrawlEvent);
    socket.on('crawl:completed', onCrawlEvent);
    socket.on('crawl:failed', onCrawlEvent);
    socket.on('notification:new', onNotification);
    socket.on('connect_error', onConnectError);
    socket.on('connect', onConnect);
    socket.on('auth:expired', onAuthExpired);
    window.addEventListener('deadlink:auth-logout', onAuthLogout);
    socket.connect();

    return () => {
      socket.off('crawl:started', onCrawlEvent);
      socket.off('crawl:progress', onCrawlEvent);
      socket.off('crawl:completed', onCrawlEvent);
      socket.off('crawl:failed', onCrawlEvent);
      socket.off('notification:new', onNotification);
      socket.off('connect_error', onConnectError);
      socket.off('connect', onConnect);
      socket.off('auth:expired', onAuthExpired);
      window.removeEventListener('deadlink:auth-logout', onAuthLogout);
      socket.disconnect();
      refreshingSocketAuthRef.current = false;
      hasConnectedRef.current = false;
      connectedTokenRef.current = null;
    };
  }, [isAuthenticated, user?.id, queryClient]);

  return children;
}
