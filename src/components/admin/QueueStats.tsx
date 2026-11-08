'use client';

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Globe,
  Loader2,
  User,
  XCircle,
} from 'lucide-react';
import { useQueueStats } from '../../hooks/use-queue-stats';

interface Job {
  id: string;
  name: string;
  queue: 'crawl' | 'notification';
  status: string;
  createdAt: string;
  progress: number | null;
  websiteName: string | null;
  websiteUrl: string | null;
  userName: string | null;
  scheduledBy: string | null;
}

const TEAL = '#0d9488';
const TEAL_DARK = '#0f766e';
const GOLD = '#d4af37';
const RED = '#dc2626';

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  delay,
}: {
  label: string;
  value: number;
  icon: typeof Activity;
  accent: string;
  delay: number;
}) {
  return (
    <div
      className='group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'
      style={{ animation: `queueFadeUp 0.5s ease ${delay}ms both` }}
    >
      <div
        className='absolute inset-x-0 top-0 h-1'
        style={{ backgroundColor: accent }}
      />
      <div className='flex items-start justify-between p-5'>
        <div>
          <p className='text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400'>
            {label}
          </p>
          <p className='mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-50'>
            {value.toLocaleString()}
          </p>
        </div>
        <div
          className='flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110'
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          <Icon className='h-5 w-5' />
        </div>
      </div>
    </div>
  );
}

function QueueTag({ queue }: { queue: Job['queue'] }) {
  const isCrawl = queue === 'crawl';
  return (
    <span
      className='inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase'
      style={{
        backgroundColor: isCrawl ? `${TEAL}1a` : `${GOLD}26`,
        color: isCrawl ? TEAL_DARK : '#92700d',
      }}
    >
      {queue}
    </span>
  );
}

export function QueueStats() {
  const { data: response, isLoading, error } = useQueueStats();

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='h-36 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60' />
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-28 animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-800/60'
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        <div className='h-64 animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-800/60' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50/50 px-6 py-16 text-center dark:border-red-900/40 dark:bg-red-950/20'>
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40'>
          <AlertTriangle className='h-6 w-6 text-red-600 dark:text-red-400' />
        </div>
        <p className='text-lg font-semibold text-slate-900 dark:text-slate-50'>
          Queue stats unavailable
        </p>
        <p className='max-w-sm text-sm text-slate-500 dark:text-slate-400'>
          We could not load the queue right now. Try refreshing the page in a
          moment.
        </p>
      </div>
    );
  }

  if (!response?.data?.stats) {
    return null;
  }

  const { stats, activeJobs } = response.data;

  // Calculate totals with safe fallbacks
  const totalActive =
    (stats.crawl?.active || 0) + (stats.notification?.active || 0);
  const totalPending =
    (stats.crawl?.waiting || 0) + (stats.notification?.waiting || 0);
  const totalCompleted =
    (stats.crawl?.completed || 0) + (stats.notification?.completed || 0);
  const totalFailed =
    (stats.crawl?.failed || 0) + (stats.notification?.failed || 0);

  const grandTotal = totalActive + totalPending + totalCompleted + totalFailed;
  const successShare =
    grandTotal > 0 ? Math.round((totalCompleted / grandTotal) * 100) : 0;

  const ringRadius = 34;
  const ringCircumference = 2 * Math.PI * ringRadius;

  return (
    <div className='space-y-6'>
      <style>{`
        @keyframes queueFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes queuePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>

      {/* Hero banner */}
      <div
        className='relative overflow-hidden rounded-2xl p-6 text-white sm:p-8'
        style={{
          background: `linear-gradient(135deg, ${TEAL_DARK} 0%, ${TEAL} 60%, #14b8a6 100%)`,
        }}
      >
        <div
          className='pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full opacity-20'
          style={{ backgroundColor: GOLD }}
        />
        <div
          className='pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full opacity-10'
          style={{ backgroundColor: GOLD }}
        />
        <div className='relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <div className='flex items-center gap-2'>
              <span
                className='h-2 w-2 rounded-full'
                style={{
                  backgroundColor: GOLD,
                  animation: 'queuePulse 1.6s ease-in-out infinite',
                }}
              />
              <p className='text-xs font-semibold tracking-widest text-teal-100 uppercase'>
                Live queue monitor
              </p>
            </div>
            <p className='mt-3 text-5xl font-bold tabular-nums'>
              {grandTotal.toLocaleString()}
            </p>
            <p className='mt-1 text-sm text-teal-100'>
              jobs processed across crawl and notification queues
            </p>
            <div className='mt-4 flex flex-wrap items-center gap-2 text-xs font-medium'>
              <span className='rounded-full bg-white/15 px-3 py-1'>
                {totalActive} running now
              </span>
              <span className='rounded-full bg-white/15 px-3 py-1'>
                {totalPending} waiting
              </span>
            </div>
          </div>

          {/* Success ring */}
          <div className='flex items-center gap-4'>
            <div className='relative h-24 w-24'>
              <svg viewBox='0 0 84 84' className='h-full w-full -rotate-90'>
                <circle
                  cx='42'
                  cy='42'
                  r={ringRadius}
                  fill='none'
                  stroke='rgba(255,255,255,0.2)'
                  strokeWidth='8'
                />
                <circle
                  cx='42'
                  cy='42'
                  r={ringRadius}
                  fill='none'
                  stroke={GOLD}
                  strokeWidth='8'
                  strokeLinecap='round'
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={
                    ringCircumference * (1 - successShare / 100)
                  }
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-xl font-bold tabular-nums'>
                  {successShare}%
                </span>
              </div>
            </div>
            <div className='text-sm'>
              <p className='font-semibold'>Success rate</p>
              <p className='text-teal-100'>
                {totalCompleted.toLocaleString()} completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          label='Total Jobs'
          value={grandTotal}
          icon={Activity}
          accent={TEAL_DARK}
          delay={0}
        />
        <StatCard
          label='Pending Jobs'
          value={totalPending}
          icon={Clock}
          accent={GOLD}
          delay={80}
        />
        <StatCard
          label='Completed Jobs'
          value={totalCompleted}
          icon={CheckCircle2}
          accent={TEAL}
          delay={160}
        />
        <StatCard
          label='Failed Jobs'
          value={totalFailed}
          icon={XCircle}
          accent={RED}
          delay={240}
        />
      </div>

      {/* Active Jobs */}
      <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
        <div className='flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800'>
          <div className='flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' style={{ color: TEAL }} />
            <h2 className='text-base font-semibold text-slate-900 dark:text-slate-50'>
              Active Jobs
            </h2>
          </div>
          <span
            className='rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums'
            style={{ backgroundColor: `${TEAL}1a`, color: TEAL_DARK }}
          >
            {activeJobs?.length ?? 0} running
          </span>
        </div>

        {!activeJobs?.length ? (
          <div className='flex flex-col items-center gap-3 px-6 py-14 text-center'>
            <div
              className='flex h-12 w-12 items-center justify-center rounded-full'
              style={{ backgroundColor: `${TEAL}1a` }}
            >
              <CheckCircle2 className='h-6 w-6' style={{ color: TEAL }} />
            </div>
            <p className='font-medium text-slate-900 dark:text-slate-50'>
              All clear
            </p>
            <p className='max-w-xs text-sm text-slate-500 dark:text-slate-400'>
              No jobs are running right now. New crawls and notifications will
              appear here as they start.
            </p>
          </div>
        ) : (
          <ul className='divide-y divide-slate-100 dark:divide-slate-800'>
            {activeJobs.map((job: Job, index: number) => (
              <li
                key={job.id}
                className='group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-slate-800/50'
                style={{
                  animation: `queueFadeUp 0.4s ease ${index * 60}ms both`,
                }}
              >
                <div className='min-w-0 flex-1 space-y-1.5'>
                  <div className='flex items-center gap-2'>
                    <QueueTag queue={job.queue} />
                    <p className='truncate font-medium text-slate-900 dark:text-slate-50'>
                      {job.websiteName || job.name}
                    </p>
                  </div>
                  {job.websiteUrl && (
                    <p className='flex items-center gap-1.5 truncate text-sm text-slate-500 dark:text-slate-400'>
                      <Globe className='h-3.5 w-3.5 shrink-0' />
                      {job.websiteUrl}
                    </p>
                  )}
                  <p className='flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400'>
                    <User className='h-3.5 w-3.5 shrink-0' />
                    {job.userName || 'Unknown'}
                    <span className='text-slate-300 dark:text-slate-600'>
                      ·
                    </span>
                    scheduled by {job.scheduledBy || 'unspecified'}
                  </p>
                  {job.queue === 'crawl' && job.progress !== null && (
                    <div
                      aria-label={`Crawl progress ${job.progress}%`}
                      aria-valuemax={100}
                      aria-valuemin={0}
                      aria-valuenow={job.progress}
                      className='h-1.5 max-w-md overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800'
                      role='progressbar'
                    >
                      <div
                        className='h-full rounded-full transition-[width] duration-500'
                        style={{
                          width: `${job.progress}%`,
                          background: `linear-gradient(90deg, ${GOLD}, ${TEAL})`,
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className='shrink-0 text-sm sm:text-right'>
                  <p className='font-medium text-slate-700 capitalize dark:text-slate-200'>
                    {job.status}
                    {job.queue === 'crawl' && job.progress !== null ? (
                      <span
                        className='ml-1 tabular-nums'
                        style={{ color: TEAL_DARK }}
                      >
                        · {job.progress}%
                      </span>
                    ) : (
                      ''
                    )}
                  </p>
                  <p className='text-xs text-slate-500 dark:text-slate-400'>
                    {Number.isNaN(Date.parse(job.createdAt))
                      ? 'Started time unavailable'
                      : new Date(job.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
