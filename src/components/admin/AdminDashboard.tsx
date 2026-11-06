'use client';

import {
  Activity,
  AlertCircle,
  CalendarDays,
  Globe,
  Link2,
  Loader2,
  ServerCrash,
  Users,
} from 'lucide-react';
import { useAdminStats } from '../../hooks/use-admin-stats';
import { Analytics } from './Analytics';
import { StatsCard } from './StatsCard';

export function AdminDashboard() {
  const { data: response, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='h-56 animate-pulse rounded-3xl bg-primary-soft' />
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='h-32 animate-pulse rounded-2xl bg-surface-muted'
            />
          ))}
        </div>
        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
          <Loader2 className='size-4 animate-spin' /> Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center gap-3 rounded-3xl border border-destructive/30 bg-destructive/5 p-12 text-center animate-fade-up'>
        <span className='grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive'>
          <ServerCrash className='size-6' />
        </span>
        <p className='font-display text-lg font-semibold'>
          Error loading admin stats
        </p>
        <p className='text-sm text-muted-foreground'>
          Please refresh the page or try again shortly.
        </p>
      </div>
    );
  }

  if (!response?.data) {
    return null;
  }

  const stats = response.data;

  // Calculate total queue stats with optional chaining
  const crawlStats = stats.queueStats?.crawl || {
    active: 0,
    waiting: 0,
    completed: 0,
  };
  const notificationStats = stats.queueStats?.notification || {
    active: 0,
    waiting: 0,
    completed: 0,
  };

  const totalActive = crawlStats.active + notificationStats.active;
  const totalPending = crawlStats.waiting + notificationStats.waiting;
  const totalCompleted = crawlStats.completed + notificationStats.completed;

  // Calculate percentage only if totalWebsites is not zero
  const activePercentage =
    stats.totalWebsites > 0
      ? Math.round((stats.activeWebsites / stats.totalWebsites) * 100)
      : 0;

  // Get recent users with null check
  const recentUsers = stats.recentUsers || [];

  // Presentational only: share of queue jobs per state for the segmented bar
  const queueTotal = totalActive + totalPending + totalCompleted;
  const pct = (n: number) => (queueTotal > 0 ? (n / queueTotal) * 100 : 0);

  return (
    <div className='space-y-6'>
      {/* ───────── Command banner ───────── */}
      <section className='relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-elegant md:p-8 animate-fade-up'>
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 bg-grid opacity-15 mask-fade-b'
        />
        <div
          aria-hidden
          className='pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-secondary/30 blur-3xl animate-float-y'
        />

        <div className='relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end'>
          <div>
            <span className='inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em]'>
              <span className='relative flex size-2'>
                <span className='absolute inset-0 rounded-full bg-secondary animate-pulse-ring' />
                <span className='relative size-2 rounded-full bg-secondary' />
              </span>
              Platform overview
            </span>
            <h1 className='mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl text-balance'>
              Admin control room
            </h1>

            <div className='mt-6 flex flex-wrap items-end gap-x-10 gap-y-4'>
              <div>
                <p className='text-xs uppercase tracking-[0.14em] text-primary-foreground/70'>
                  Total users
                </p>
                <p className='font-display text-5xl font-semibold font-mono-data md:text-6xl'>
                  {stats.totalUsers}
                </p>
              </div>
              <div>
                <p className='text-xs uppercase tracking-[0.14em] text-primary-foreground/70'>
                  Total websites
                </p>
                <p className='font-display text-3xl font-semibold font-mono-data'>
                  {stats.totalWebsites}
                </p>
              </div>
            </div>
          </div>

          {/* Active website ring */}
          <div className='flex items-center gap-5 rounded-2xl bg-primary-foreground/10 p-5 backdrop-blur-sm'>
            <div
              className='relative grid size-24 shrink-0 place-items-center rounded-full'
              style={{
                background: `conic-gradient(var(--secondary) ${activePercentage * 3.6}deg, color-mix(in oklab, var(--primary-foreground) 18%, transparent) 0deg)`,
              }}
            >
              <div className='grid size-[76px] place-items-center rounded-full bg-primary'>
                <span className='font-display text-xl font-semibold font-mono-data'>
                  {activePercentage}%
                </span>
              </div>
            </div>
            <div>
              <p className='text-xs uppercase tracking-[0.14em] text-primary-foreground/70'>
                Active websites
              </p>
              <p className='font-display text-2xl font-semibold font-mono-data'>
                {stats.activeWebsites}
              </p>
              <p className='text-sm text-primary-foreground/70'>
                {activePercentage}% of total
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Stat tiles ───────── */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          index={0}
          tone='primary'
          title='Total Users'
          value={stats.totalUsers}
          icon={<Users />}
        />
        <StatsCard
          index={1}
          tone='primary'
          title='Total Websites'
          value={stats.totalWebsites}
          icon={<Globe />}
        />
        <StatsCard
          index={2}
          tone='accent'
          title='Active Websites'
          value={stats.activeWebsites}
          description={`${activePercentage}% of total`}
          icon={<Activity />}
        />
        <StatsCard
          index={3}
          tone='destructive'
          title='Broken Links'
          value={stats.totalBrokenLinks}
          icon={<Link2 />}
        />
      </div>

      {/* ───────── Crawls + queue | recent users ───────── */}
      <div className='grid gap-4 lg:grid-cols-5'>
        <div className='space-y-4 lg:col-span-2'>
          <StatsCard
            index={4}
            tone='accent'
            title='Total Crawls'
            value={stats.totalCrawls}
            icon={<Activity />}
          />

          {/* Queue status */}
          <div
            className='rounded-2xl border border-border bg-card p-5 animate-fade-up'
            style={{ animationDelay: '300ms', animationFillMode: 'both' }}
          >
            <div className='flex items-start justify-between'>
              <div>
                <p className='text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
                  Queue Status
                </p>
                <p className='mt-3 font-display text-3xl font-semibold font-mono-data'>{`${totalActive} active`}</p>
                <p className='mt-1 text-xs text-muted-foreground'>{`${totalPending} pending, ${totalCompleted} completed`}</p>
              </div>
              <span className='grid size-9 place-items-center rounded-xl bg-primary-soft text-primary'>
                <AlertCircle className='size-4' />
              </span>
            </div>

            <div className='mt-5 flex h-2.5 overflow-hidden rounded-full bg-surface-muted'>
              <span
                className='bg-secondary transition-all duration-700'
                style={{ width: `${pct(totalActive)}%` }}
              />
              <span
                className='bg-warning transition-all duration-700'
                style={{ width: `${pct(totalPending)}%` }}
              />
              <span
                className='bg-primary transition-all duration-700'
                style={{ width: `${pct(totalCompleted)}%` }}
              />
            </div>
            <div className='mt-3 grid grid-cols-3 gap-2 text-xs'>
              {[
                { label: 'Active', value: totalActive, dot: 'bg-secondary' },
                { label: 'Pending', value: totalPending, dot: 'bg-warning' },
                {
                  label: 'Completed',
                  value: totalCompleted,
                  dot: 'bg-primary',
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className='rounded-lg bg-surface-muted px-2.5 py-2'
                >
                  <span className='flex items-center gap-1.5 text-muted-foreground'>
                    <span className={`size-1.5 rounded-full ${s.dot}`} />{' '}
                    {s.label}
                  </span>
                  <span className='mt-0.5 block font-semibold font-mono-data text-foreground'>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent users */}
        <section
          className='overflow-hidden rounded-2xl border border-border bg-card lg:col-span-3 animate-fade-up'
          style={{ animationDelay: '360ms', animationFillMode: 'both' }}
        >
          <header className='flex items-center justify-between border-b border-border px-5 py-4'>
            <div>
              <h2 className='font-display text-base font-semibold'>
                Recent Users
              </h2>
              <p className='text-xs text-muted-foreground'>
                Newest sign-ups on the platform
              </p>
            </div>
            <span className='rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary font-mono-data'>
              {recentUsers.length}
            </span>
          </header>

          {recentUsers.length === 0 ? (
            <div className='flex flex-col items-center gap-2 px-5 py-12 text-center'>
              <span className='grid size-10 place-items-center rounded-xl bg-surface-muted text-muted-foreground'>
                <Users className='size-5' />
              </span>
              <p className='text-sm text-muted-foreground'>No recent users</p>
            </div>
          ) : (
            <ul className='divide-y divide-border'>
              {recentUsers.map((user, i) => {
                const initials =
                  `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
                return (
                  <li
                    key={user.id}
                    className='group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-muted animate-reveal-slide-left'
                    style={{
                      animationDelay: `${400 + i * 50}ms`,
                      animationFillMode: 'both',
                    }}
                  >
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-xl text-sm font-semibold ${i % 2 === 0 ? 'bg-primary-soft text-primary' : 'bg-secondary-soft text-secondary'}`}
                    >
                      {initials || '?'}
                    </span>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate font-medium'>
                        {user.firstName} {user.lastName}
                      </p>
                      <p className='truncate text-sm text-muted-foreground'>
                        {user.email}
                      </p>
                    </div>
                    <span className='flex shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground font-mono-data'>
                      <CalendarDays className='size-3' />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <Analytics />
    </div>
  );
}
