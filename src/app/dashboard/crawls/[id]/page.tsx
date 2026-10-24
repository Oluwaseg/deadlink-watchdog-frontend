'use client';

import { getCrawlResult } from '@/api-routes/crawls-api';
import { Button } from '@/components/ui/button';
import type { CrawlResultResponse } from '@/types/crawls';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  CornerDownRight,
  Download,
  ExternalLink,
  Globe,
  LinkIcon,
  RefreshCw,
  ShieldCheck,
  Timer,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

/* ------------------------------------------------------------------ */
/* Presentation helpers (UI only – theme tokens)                       */
/* ------------------------------------------------------------------ */

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className='h-4 w-4' />;
    case 'failed':
      return <XCircle className='h-4 w-4' />;
    case 'in_progress':
    case 'running':
      return <Clock className='h-4 w-4 animate-spin [animation-duration:3s]' />;
    default:
      return <AlertCircle className='h-4 w-4' />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-success/15 text-success ring-success/30';
    case 'failed':
      return 'bg-destructive/15 text-destructive ring-destructive/30';
    case 'in_progress':
    case 'running':
      return 'bg-secondary-soft text-secondary-foreground ring-secondary/40';
    default:
      return 'bg-muted text-muted-foreground ring-border-strong';
  }
};

const getErrorTypeColor = (errorType: string) => {
  switch (errorType) {
    case '404_not_found':
      return 'bg-destructive/10 text-destructive ring-destructive/25';
    case '500_server_error':
      return 'bg-destructive/5 text-destructive ring-destructive/15';
    case 'timeout':
      return 'bg-secondary-soft text-secondary-foreground ring-secondary/40';
    case 'connection_error':
      return 'bg-primary-soft text-accent-foreground ring-primary/20';
    default:
      return 'bg-muted text-muted-foreground ring-border-strong';
  }
};

const getErrorRail = (errorType: string) => {
  switch (errorType) {
    case '404_not_found':
    case '500_server_error':
      return 'bg-destructive';
    case 'timeout':
      return 'bg-secondary';
    case 'connection_error':
      return 'bg-primary';
    default:
      return 'bg-border-strong';
  }
};

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

/* ------------------------------------------------------------------ */

export default function CrawlDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const crawlId = params.id as string;

  const {
    data: crawlData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['crawl', crawlId],
    queryFn: async () => {
      const response = await getCrawlResult(crawlId);
      return response as CrawlResultResponse;
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting crawl data...');
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='h-56 rounded-3xl bg-surface-muted animate-pulse' />
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-12'>
          <div className='h-64 rounded-3xl bg-surface-muted animate-pulse lg:col-span-5' />
          <div className='grid grid-cols-2 gap-4 lg:col-span-7'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='h-[120px] rounded-2xl bg-surface-muted animate-pulse'
              />
            ))}
          </div>
        </div>
        <div className='overflow-hidden rounded-2xl border bg-card'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='flex items-center gap-4 border-b px-6 py-5 last:border-0'
            >
              <div className='h-6 w-24 rounded-full bg-muted animate-pulse' />
              <div className='h-4 flex-1 rounded bg-muted animate-pulse' />
              <div className='h-4 w-10 rounded bg-muted animate-pulse' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-3xl border bg-card p-10 text-center'>
        <div className='absolute inset-0 bg-dot mask-radial-fade opacity-60' />
        <div className='relative flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/20'>
          <AlertTriangle className='h-6 w-6' />
        </div>
        <h3 className='relative mt-5 text-xl font-display text-foreground'>
          Failed to load crawl details
        </h3>
        <p className='relative mt-1.5 max-w-sm text-sm text-muted-foreground'>
          {error instanceof Error
            ? error.message
            : 'An unexpected error occurred'}
        </p>
        <div className='relative mt-6 flex gap-2'>
          <Button
            onClick={() => router.back()}
            variant='outline'
            className='rounded-full'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Go Back
          </Button>
          <Button onClick={handleRefresh} className='rounded-full'>
            <RefreshCw className='mr-2 h-4 w-4' />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!crawlData?.data?.crawlResult) {
    return (
      <div className='relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-3xl border bg-card p-10 text-center'>
        <div className='absolute inset-0 bg-grid mask-radial-fade opacity-70' />
        <div className='relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary'>
          <Activity className='h-6 w-6' />
        </div>
        <h3 className='relative mt-5 text-xl font-display text-foreground'>
          Crawl not found
        </h3>
        <p className='relative mt-1.5 text-sm text-muted-foreground'>
          The requested crawl could not be found
        </p>
        <Button
          onClick={() => router.back()}
          variant='outline'
          className='relative mt-6 rounded-full'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Go Back
        </Button>
      </div>
    );
  }

  const { crawlResult } = crawlData.data;

  /* ---- display-only derived values ---- */
  const total = crawlResult.totalLinksFound || 0;
  const broken = crawlResult.brokenLinksFound || 0;
  const successRate =
    crawlResult.totalLinksFound > 0
      ? Math.round(
          ((crawlResult.totalLinksFound - (crawlResult.brokenLinksFound || 0)) /
            crawlResult.totalLinksFound) *
            100
        )
      : 0;
  const isRunning =
    crawlResult.status === 'in_progress' || crawlResult.status === 'running';
  const brokenRecords = crawlResult.brokenLinkRecords || [];
  const ringR = 70;
  const ringC = 2 * Math.PI * ringR;
  const startedAt = new Date(crawlResult.createdAt);
  const brokenShare = total > 0 ? (broken / total) * 100 : 0;

  return (
    <div className='space-y-6'>
      {/* ============ Hero ============ */}
      <header
        className='relative overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-glow sm:p-8 animate-fade-up'
        style={{ background: 'var(--gradient-primary)' }}
      >
        <div className='pointer-events-none absolute inset-0 bg-grid opacity-15 mask-fade-b' />
        <div
          className='pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full opacity-40 blur-3xl'
          style={{ background: 'var(--gradient-accent)' }}
        />

        <div className='relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
          <div className='min-w-0'>
            <p className='text-[11px] uppercase tracking-[0.2em] opacity-75'>
              Crawl Details
            </p>
            <div className='mt-3 flex items-center gap-4'>
              <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15 ring-1 ring-primary-foreground/25 backdrop-blur'>
                <Globe className='h-6 w-6' />
              </div>
              <div className='min-w-0'>
                <h1 className='truncate text-3xl font-display tracking-tight sm:text-4xl'>
                  {crawlResult.website.name}
                </h1>
                <a
                  href={crawlResult.website.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-1 inline-flex max-w-full items-center gap-1.5 truncate text-sm opacity-80 transition-opacity hover:opacity-100'
                >
                  <span className='truncate'>{crawlResult.website.url}</span>
                  <ExternalLink className='h-3.5 w-3.5 shrink-0' />
                </a>
              </div>
            </div>

            <div className='mt-5 flex flex-wrap items-center gap-2'>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${getStatusColor(crawlResult.status)}`}
              >
                {getStatusIcon(crawlResult.status)}
                {crawlResult.status.replace('_', ' ')}
              </span>
              <span className='inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs ring-1 ring-primary-foreground/20'>
                <Clock className='h-3.5 w-3.5' />
                {startedAt.toLocaleString()}
              </span>
              <span className='inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 font-mono-data text-xs ring-1 ring-primary-foreground/20'>
                #{crawlId.slice(0, 8)}
              </span>
            </div>
          </div>

          <div className='flex shrink-0 gap-2'>
            <Button
              variant='outline'
              onClick={handleExport}
              disabled
              className='rounded-full border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground'
            >
              <Download className='mr-2 h-4 w-4' />
              Export (Coming Soon)
            </Button>
            <Button
              onClick={handleRefresh}
              disabled
              className='rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90'
            >
              <RefreshCw className='mr-2 h-4 w-4' />
              Refresh (Coming Soon)
            </Button>
          </div>
        </div>

        {isRunning && (
          <section
            className='relative mt-7 space-y-2'
            aria-label='Crawl progress'
          >
            <div className='flex justify-between text-xs uppercase tracking-[0.14em] opacity-85'>
              <span className='inline-flex items-center gap-2'>
                <span className='relative flex h-2 w-2'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-70' />
                  <span className='relative inline-flex h-2 w-2 rounded-full bg-secondary' />
                </span>
                Crawl in progress
              </span>
              <span className='font-mono-data'>
                {crawlResult.progress ?? 0}%
              </span>
            </div>
            <div
              className='h-2.5 overflow-hidden rounded-full bg-primary-foreground/15'
              role='progressbar'
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={crawlResult.progress ?? 0}
            >
              <div
                className='h-full rounded-full bg-secondary transition-[width] duration-300'
                style={{ width: `${crawlResult.progress ?? 0}%` }}
              />
            </div>
          </section>
        )}
      </header>

      {/* ============ Health + metrics ============ */}
      <section className='grid grid-cols-1 gap-4 lg:grid-cols-12'>
        {/* Health gauge */}
        <div className='relative overflow-hidden rounded-3xl border bg-card p-6 shadow-elegant lg:col-span-5 animate-fade-up'>
          <div className='pointer-events-none absolute inset-0 bg-dot mask-radial-fade opacity-50' />
          <div className='relative flex items-center gap-6'>
            <div className='relative h-40 w-40 shrink-0'>
              <svg viewBox='0 0 160 160' className='h-full w-full -rotate-90'>
                <circle
                  cx='80'
                  cy='80'
                  r={ringR}
                  fill='none'
                  strokeWidth='12'
                  className='stroke-muted'
                />
                <circle
                  cx='80'
                  cy='80'
                  r={ringR}
                  fill='none'
                  strokeWidth='12'
                  strokeLinecap='round'
                  className='stroke-primary transition-[stroke-dashoffset] duration-1000'
                  strokeDasharray={ringC}
                  strokeDashoffset={ringC - (ringC * successRate) / 100}
                />
              </svg>
              <div className='absolute inset-0 flex flex-col items-center justify-center'>
                <span className='text-4xl font-display leading-none text-foreground'>
                  {successRate}%
                </span>
                <span className='mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground'>
                  link health
                </span>
              </div>
            </div>
            <div className='min-w-0 flex-1 space-y-4'>
              <div>
                <p className='text-[11px] uppercase tracking-[0.16em] text-muted-foreground'>
                  Healthy links
                </p>
                <p className='font-mono-data text-2xl text-foreground'>
                  {(total - broken).toLocaleString()}
                </p>
              </div>
              <div>
                <p className='text-[11px] uppercase tracking-[0.16em] text-muted-foreground'>
                  Broken links
                </p>
                <p className='font-mono-data text-2xl text-destructive'>
                  {broken.toLocaleString()}
                </p>
              </div>
              <div className='flex h-1.5 overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full bg-primary'
                  style={{ width: `${100 - brokenShare}%` }}
                />
                <div
                  className='h-full bg-destructive'
                  style={{ width: `${brokenShare}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metric tiles */}
        <div className='grid grid-cols-2 gap-4 lg:col-span-7'>
          {[
            {
              label: 'Total Links',
              value: crawlResult.totalLinksFound?.toLocaleString() || 0,
              icon: LinkIcon,
              tone: 'text-primary bg-primary-soft',
            },
            {
              label: 'Broken Links',
              value: crawlResult.brokenLinksFound || 0,
              icon: AlertTriangle,
              tone: 'text-destructive bg-destructive/10',
            },
            {
              label: 'Success Rate',
              value: `${successRate}%`,
              icon: TrendingUp,
              tone: 'text-success bg-success/10',
            },
            {
              label: 'Duration',
              value: formatDuration(crawlResult.summary?.crawlDuration || 0),
              icon: Timer,
              tone: 'text-secondary-foreground bg-secondary-soft',
            },
          ].map((m, i) => (
            <div
              key={m.label}
              className='group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elegant animate-fade-up'
              style={{ animationDelay: `${(i + 1) * 70}ms` }}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${m.tone} transition-transform duration-300 group-hover:scale-110`}
              >
                <m.icon className='h-4 w-4' />
              </div>
              <p className='mt-4 font-mono-data text-3xl tabular-nums text-foreground'>
                {m.value}
              </p>
              <p className='mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground'>
                {m.label}
              </p>
              <span className='pointer-events-none absolute -bottom-6 -right-3 select-none text-7xl font-display text-foreground/[0.04]'>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ Timeline + Broken links ============ */}
      <section className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        {/* Timeline */}
        <aside className='rounded-2xl border bg-card p-6 shadow-elegant lg:col-span-4 h-fit'>
          <h2 className='flex items-center gap-2 text-sm font-display uppercase tracking-[0.14em] text-muted-foreground'>
            <Activity className='h-4 w-4 text-primary' />
            Crawl Timeline
          </h2>
          <ol className='relative mt-6 space-y-6 pl-8'>
            <span className='absolute bottom-2 left-[11px] top-2 w-px bg-border-strong' />
            <li className='relative'>
              <span className='absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-primary-soft'>
                <Activity className='h-3 w-3' />
              </span>
              <p className='font-medium text-foreground'>Crawl Started</p>
              <p className='text-sm text-muted-foreground'>
                {new Date(crawlResult.createdAt).toLocaleString()}
              </p>
            </li>

            {isRunning && (
              <li className='relative'>
                <span className='absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-4 ring-secondary-soft animate-pulse'>
                  <Clock className='h-3 w-3' />
                </span>
                <p className='font-medium text-foreground'>Crawling…</p>
                <p className='text-sm text-muted-foreground'>
                  {crawlResult.progress ?? 0}% complete
                </p>
              </li>
            )}

            {crawlResult.status === 'completed' && (
              <li className='relative'>
                <span className='absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full bg-success text-primary-foreground ring-4 ring-success/15'>
                  <CheckCircle className='h-3 w-3' />
                </span>
                <p className='font-medium text-foreground'>Crawl Completed</p>
                <p className='text-sm text-muted-foreground'>
                  Found {crawlResult.totalLinksFound} links,{' '}
                  {crawlResult.brokenLinksFound} broken
                </p>
              </li>
            )}

            {crawlResult.status === 'failed' && (
              <li className='relative'>
                <span className='absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground ring-4 ring-destructive/15'>
                  <XCircle className='h-3 w-3' />
                </span>
                <p className='font-medium text-foreground'>Crawl Failed</p>
              </li>
            )}
          </ol>
        </aside>

        {/* Broken links */}
        <div className='lg:col-span-8'>
          {brokenRecords.length > 0 ? (
            <div className='overflow-hidden rounded-2xl border bg-card shadow-elegant animate-fade-in'>
              <div className='flex items-center justify-between border-b px-6 py-4'>
                <h2 className='flex items-center gap-2 font-display text-foreground'>
                  <span className='flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10 text-destructive'>
                    <AlertTriangle className='h-4 w-4' />
                  </span>
                  Broken Links
                </h2>
                <span className='rounded-full bg-destructive/10 px-2.5 py-0.5 font-mono-data text-xs text-destructive'>
                  {brokenRecords.length}
                </span>
              </div>
              <ul className='divide-y'>
                {brokenRecords.map((link) => (
                  <li
                    key={link.id}
                    className='group relative px-6 py-4 transition-colors hover:bg-surface-muted'
                  >
                    <span
                      className={`absolute inset-y-3 left-0 w-[3px] rounded-r-full ${getErrorRail(link.errorType)} opacity-60 transition-opacity group-hover:opacity-100`}
                    />
                    <div className='flex items-start justify-between gap-4'>
                      <div className='min-w-0 flex-1'>
                        <div className='mb-2 flex flex-wrap items-center gap-2'>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${getErrorTypeColor(link.errorType)}`}
                          >
                            {link.errorType.replace(/_/g, ' ')}
                          </span>
                          {link.statusCode && (
                            <span className='rounded-md border bg-surface px-2 py-0.5 font-mono-data text-[11px] text-foreground'>
                              {link.statusCode}
                            </span>
                          )}
                        </div>
                        <p className='break-all font-mono-data text-sm text-foreground'>
                          {link.url}
                        </p>
                        <p className='mt-1.5 flex items-start gap-1.5 break-all text-xs text-muted-foreground'>
                          <CornerDownRight className='mt-0.5 h-3 w-3 shrink-0' />
                          Found on: {link.sourceUrl}
                        </p>
                      </div>
                      <a
                        href={link.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label='Open link'
                        className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-primary transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground'
                      >
                        <ArrowUpRight className='h-4 w-4' />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className='relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border bg-card p-12 text-center shadow-elegant'>
              <div className='absolute inset-0 bg-grid mask-radial-fade opacity-60' />
              <div className='relative flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success animate-[pulse-ring_2.4s_ease-out_infinite]'>
                <ShieldCheck className='h-6 w-6' />
              </div>
              <h3 className='relative mt-5 text-xl font-display text-foreground'>
                No Broken Links Found
              </h3>
              <p className='relative mt-1.5 text-sm text-muted-foreground'>
                Great! All links on this website are working properly.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
