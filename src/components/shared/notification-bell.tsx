'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotifications } from '@/hooks/use-notifications';
import {
  Bell,
  Check,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function formatTimestamp(value: string): string {
  return `${new Date(value).toISOString().slice(0, 16).replace('T', ' ')} UTC`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data, isLoading, isError, refetch, markRead, markAllRead } =
    useNotifications();
  const notifications = data?.data.notifications ?? [];
  const unreadCount = data?.data.unreadCount ?? 0;

  const openNotification = (id: string, crawlId: string, isRead: boolean) => {
    if (!isRead) markRead.mutate(id);
    setOpen(false);
    router.push(`/dashboard/crawls/${crawlId}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          aria-label={
            unreadCount
              ? `Notifications, ${unreadCount} unread`
              : 'Notifications'
          }
          aria-expanded={open}
          title='Notifications'
          className='relative rounded-md p-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          <Bell className='h-4 w-4' />
          {unreadCount > 0 && (
            <span className='absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        sideOffset={8}
        className='w-[min(24rem,calc(100vw-2rem))] p-0'
      >
        <div className='flex items-center justify-between border-b px-4 py-3'>
          <div>
            <h2 className='text-sm font-semibold'>Notifications</h2>
            <p className='text-xs text-muted-foreground'>
              {unreadCount} unread
            </p>
          </div>
          <button
            type='button'
            disabled={!unreadCount || markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
            className='inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50'
          >
            <Check className='h-3.5 w-3.5' />
            Mark all read
          </button>
        </div>

        <div className='max-h-[min(26rem,65vh)] overflow-y-auto'>
          {isLoading ? (
            <div className='flex items-center justify-center gap-2 px-4 py-10 text-sm text-muted-foreground'>
              <LoaderCircle className='h-4 w-4 animate-spin' />
              Loading notifications
            </div>
          ) : isError ? (
            <div className='space-y-3 px-4 py-8 text-center'>
              <p className='text-sm text-muted-foreground'>
                Could not load notifications.
              </p>
              <button
                type='button'
                onClick={() => void refetch()}
                className='text-sm font-medium text-primary hover:underline'
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className='px-4 py-10 text-center'>
              <Bell className='mx-auto mb-2 h-5 w-5 text-muted-foreground' />
              <p className='text-sm font-medium'>You’re all caught up</p>
              <p className='mt-1 text-xs text-muted-foreground'>
                New crawl updates will show here.
              </p>
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => {
                const failed = notification.type === 'crawl_failed';
                const Icon = failed ? CircleAlert : CircleCheck;
                return (
                  <li key={notification.id}>
                    <button
                      type='button'
                      onClick={() =>
                        openNotification(
                          notification.id,
                          notification.crawlId,
                          Boolean(notification.readAt)
                        )
                      }
                      className='flex w-full gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-accent/60'
                    >
                      <span
                        className={`mt-0.5 shrink-0 ${failed ? 'text-destructive' : 'text-emerald-600'}`}
                      >
                        <Icon className='h-4 w-4' />
                      </span>
                      <span className='min-w-0 flex-1'>
                        <span className='flex items-center gap-2'>
                          <span className='truncate text-sm font-medium'>
                            {notification.title}
                          </span>
                          {!notification.readAt && (
                            <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-primary' />
                          )}
                        </span>
                        <span className='mt-1 block text-xs leading-relaxed text-muted-foreground'>
                          {notification.message}
                        </span>
                        <span className='mt-1.5 block text-[10px] text-muted-foreground'>
                          {formatTimestamp(notification.createdAt)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
