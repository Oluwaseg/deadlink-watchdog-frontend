'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCrawls } from '@/hooks/use-crawls';
import type { CrawlResult } from '@/types/crawls';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Fingerprint,
  Globe,
  LinkIcon,
  RefreshCw,
  RotateCcw,
  Search,
  Timer,
  X,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/* ------------------------------------------------------------------ */
/* Presentation helpers (UI only – theme tokens)                       */
/* ------------------------------------------------------------------ */

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className='h-3.5 w-3.5' />;
    case 'failed':
      return <XCircle className='h-3.5 w-3.5' />;
    case 'in_progress':
    case 'running':
      return (
        <Clock className='h-3.5 w-3.5 animate-spin [animation-duration:3s]' />
      );
    default:
      return <AlertCircle className='h-3.5 w-3.5' />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-success/10 text-success ring-success/25';
    case 'failed':
      return 'bg-destructive/10 text-destructive ring-destructive/25';
    case 'in_progress':
    case 'running':
      return 'bg-secondary-soft text-secondary-foreground ring-secondary/40';
    default:
      return 'bg-muted text-muted-foreground ring-border-strong';
  }
};

const getStatusRail = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-success';
    case 'failed':
      return 'bg-destructive';
    case 'in_progress':
    case 'running':
      return 'bg-secondary';
    default:
      return 'bg-border-strong';
  }
};

const STATUS_FILTERS = [
  { value: 'all', label: 'All', dot: 'bg-primary' },
  { value: 'completed', label: 'Completed', dot: 'bg-success' },
  { value: 'in_progress', label: 'In Progress', dot: 'bg-secondary' },
  { value: 'failed', label: 'Failed', dot: 'bg-destructive' },
];

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || '•';

/* ------------------------------------------------------------------ */

export default function CrawlsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('all');
  const [websiteId, setWebsiteId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data, isLoading, error, refetch } = useCrawls(
    page,
    12,
    status === 'all' ? '' : status,
    websiteId
  );

  const handleRefresh = () => {
    refetch();
  };

  const handleRetry = async (crawlId: string) => {
    // TODO: Implement retry functionality
    console.log('Retrying crawl:', crawlId);
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='h-40 rounded-3xl bg-surface-muted animate-pulse' />
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-12'>
          <div className='h-56 rounded-3xl bg-surface-muted animate-pulse lg:col-span-5' />
          <div className='grid grid-cols-2 gap-4 lg:col-span-7'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='h-[106px] rounded-2xl bg-surface-muted animate-pulse'
              />
            ))}
          </div>
        </div>
        <div className='h-20 rounded-2xl bg-surface-muted animate-pulse' />
        <div className='overflow-hidden rounded-2xl border bg-card'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='flex items-center gap-4 border-b px-6 py-5 last:border-0'
            >
              <div className='h-9 w-9 rounded-xl bg-muted animate-pulse' />
              <div className='h-4 w-1/4 rounded bg-muted animate-pulse' />
              <div className='ml-auto h-4 w-1/5 rounded bg-muted animate-pulse' />
              <div className='h-4 w-16 rounded bg-muted animate-pulse' />
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
          Failed to load crawls
        </h3>
        <p className='relative mt-1.5 max-w-sm text-sm text-muted-foreground'>
          {error instanceof Error
            ? error.message
            : 'An unexpected error occurred'}
        </p>
        <Button onClick={handleRefresh} className='relative mt-6 rounded-full'>
          <RefreshCw className='mr-2 h-4 w-4' />
          Try Again
        </Button>
      </div>
    );
  }

  if (!data?.data?.crawlResults) {
    return (
      <div className='relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-3xl border bg-card p-10 text-center'>
        <div className='absolute inset-0 bg-grid mask-radial-fade opacity-70' />
        <div className='relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary animate-[pulse-ring_2.4s_ease-out_infinite]'>
          <Activity className='h-6 w-6' />
        </div>
        <h3 className='relative mt-5 text-xl font-display text-foreground'>
          No crawls found
        </h3>
        <p className='relative mt-1.5 text-sm text-muted-foreground'>
          Start crawling your websites to see results here
        </p>
      </div>
    );
  }

  const { crawlResults, pagination } = data.data;

  // Calculate summary statistics
  const totalCrawls = crawlResults.length;
  const completedCrawls = crawlResults.filter(
    (c) => c.status === 'completed'
  ).length;
  const failedCrawls = crawlResults.filter((c) => c.status === 'failed').length;
  const inProgressCrawls = crawlResults.filter(
    (c) => c.status === 'in_progress'
  ).length;
  const avgResponseTime =
    crawlResults.length > 0
      ? Math.round(
          crawlResults.reduce(
            (acc, c) => acc + (c.averageResponseTime || 0),
            0
          ) / crawlResults.length
        )
      : 0;

  // Filter crawls based on search term
  const filteredCrawls = crawlResults.filter(
    (crawl) =>
      crawl.website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crawl.website.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---- display-only derived values ---- */
  const pct = (n: number) => (totalCrawls > 0 ? (n / totalCrawls) * 100 : 0);
  const successRate = Math.round(pct(completedCrawls));
  const ringR = 52;
  const ringC = 2 * Math.PI * ringR;
  const hasActiveFilters =
    status !== 'all' || websiteId !== '' || searchTerm !== '';

  return (
    <div className='space-y-6'>
      {/* ============ Header ============ */}
      <header className='relative overflow-hidden rounded-3xl border bg-card px-6 py-8 shadow-elegant sm:px-8 animate-fade-up'>
        <div className='pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-70' />
        <div
          className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl'
          style={{ background: 'var(--gradient-accent)' }}
        />
        <div className='relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <div className='inline-flex items-center gap-2 rounded-full border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground'>
              <span className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60' />
                <span className='relative inline-flex h-2 w-2 rounded-full bg-success' />
              </span>
              Crawler activity
            </div>
            <h1 className='mt-4 text-3xl font-display tracking-tight text-foreground sm:text-4xl'>
              Crawl History
            </h1>
            <p className='mt-1.5 max-w-md text-muted-foreground text-pretty'>
              Monitor and track your website crawling activities
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant='outline'
            disabled
            className='rounded-full bg-surface'
          >
            <RefreshCw className='mr-2 h-4 w-4' />
            Refresh (Coming Soon)
          </Button>
        </div>
      </header>

      {/* ============ Stats: health ring + tiles ============ */}
      <section className='grid grid-cols-1 gap-4 lg:grid-cols-12'>
        {/* Health ring */}
        <div
          className='relative overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-glow lg:col-span-5 animate-fade-up'
          style={{ background: 'var(--gradient-primary)' }}
        >
          <div className='pointer-events-none absolute inset-0 bg-dot opacity-20' />
          <div className='relative flex h-full items-center gap-6'>
            <div className='relative h-32 w-32 shrink-0'>
              <svg viewBox='0 0 120 120' className='h-full w-full -rotate-90'>
                <circle
                  cx='60'
                  cy='60'
                  r={ringR}
                  fill='none'
                  strokeWidth='10'
                  className='stroke-primary-foreground/15'
                />
                <circle
                  cx='60'
                  cy='60'
                  r={ringR}
                  fill='none'
                  strokeWidth='10'
                  strokeLinecap='round'
                  className='stroke-secondary transition-[stroke-dashoffset] duration-1000'
                  strokeDasharray={ringC}
                  strokeDashoffset={ringC - (ringC * successRate) / 100}
                />
              </svg>
              <div className='absolute inset-0 flex flex-col items-center justify-center'>
                <span className='text-3xl font-display leading-none'>
                  {successRate}%
                </span>
                <span className='mt-1 text-[10px] uppercase tracking-[0.18em] opacity-75'>
                  success
                </span>
              </div>
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-xs uppercase tracking-[0.18em] opacity-75'>
                Total Crawls
              </p>
              <p className='mt-1 text-5xl font-display leading-none'>
                {totalCrawls}
              </p>
              {/* segmented distribution bar */}
              <div className='mt-5 flex h-2 w-full overflow-hidden rounded-full bg-primary-foreground/15'>
                <div
                  className='h-full bg-success'
                  style={{ width: `${pct(completedCrawls)}%` }}
                />
                <div
                  className='h-full bg-secondary'
                  style={{ width: `${pct(inProgressCrawls)}%` }}
                />
                <div
                  className='h-full bg-destructive'
                  style={{ width: `${pct(failedCrawls)}%` }}
                />
              </div>
              <div className='mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-90'>
                <span className='inline-flex items-center gap-1.5'>
                  <i className='h-1.5 w-1.5 rounded-full bg-success' />
                  {completedCrawls} done
                </span>
                <span className='inline-flex items-center gap-1.5'>
                  <i className='h-1.5 w-1.5 rounded-full bg-secondary' />
                  {inProgressCrawls} live
                </span>
                <span className='inline-flex items-center gap-1.5'>
                  <i className='h-1.5 w-1.5 rounded-full bg-destructive' />
                  {failedCrawls} failed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tiles */}
        <div className='grid grid-cols-2 gap-4 lg:col-span-7'>
          {[
            {
              label: 'Completed',
              value: completedCrawls,
              icon: CheckCircle,
              tone: 'text-success',
              bar: 'bg-success',
              share: pct(completedCrawls),
            },
            {
              label: 'In Progress',
              value: inProgressCrawls,
              icon: Clock,
              tone: 'text-secondary-foreground',
              bar: 'bg-secondary',
              share: pct(inProgressCrawls),
            },
            {
              label: 'Failed',
              value: failedCrawls,
              icon: XCircle,
              tone: 'text-destructive',
              bar: 'bg-destructive',
              share: pct(failedCrawls),
            },
            {
              label: 'Avg Response',
              value: `${avgResponseTime}ms`,
              icon: Timer,
              tone: 'text-primary',
              bar: 'bg-primary',
              share: Math.min(100, avgResponseTime / 20),
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className='group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elegant animate-fade-up'
              style={{ animationDelay: `${(i + 1) * 70}ms` }}
            >
              <div className='flex items-start justify-between'>
                <p className='text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground'>
                  {s.label}
                </p>
                <s.icon
                  className={`h-4 w-4 ${s.tone} opacity-70 transition-transform duration-300 group-hover:scale-110`}
                />
              </div>
              <p className='mt-3 font-mono-data text-3xl tabular-nums text-foreground'>
                {s.value}
              </p>
              <div className='mt-3 h-1 w-full overflow-hidden rounded-full bg-muted'>
                <div
                  className={`h-full rounded-full ${s.bar} transition-[width] duration-700`}
                  style={{ width: `${s.share}%` }}
                />
              </div>
              <span className='pointer-events-none absolute -bottom-6 -right-3 text-7xl font-display text-foreground/[0.04] select-none'>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ Command-bar filters ============ */}
      <section className='rounded-2xl border bg-card p-2 shadow-elegant'>
        <div className='flex flex-col gap-2 lg:flex-row lg:items-center'>
          <div className='relative flex-1'>
            <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search websites by name or URL...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='h-11 rounded-xl border-0 bg-surface-muted pl-11 shadow-none focus-visible:ring-2 focus-visible:ring-ring'
            />
          </div>

          <div
            role='radiogroup'
            aria-label='Filter by status'
            className='flex items-center gap-1 overflow-x-auto rounded-xl bg-surface-muted p-1'
          >
            {STATUS_FILTERS.map((f) => {
              const active = status === f.value;
              return (
                <button
                  key={f.value}
                  type='button'
                  role='radio'
                  aria-checked={active}
                  onClick={() => setStatus(f.value)}
                  className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-card text-foreground shadow-elegant ring-1 ring-border'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${f.dot} ${active ? '' : 'opacity-50'}`}
                  />
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className='relative lg:w-56'>
            <Fingerprint className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Website ID'
              value={websiteId}
              onChange={(e) => setWebsiteId(e.target.value)}
              className='h-11 rounded-xl border-0 bg-surface-muted pl-11 font-mono-data text-sm shadow-none focus-visible:ring-2 focus-visible:ring-ring'
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className='flex flex-wrap items-center gap-2 px-2 pb-1 pt-3 text-xs'>
            <span className='text-muted-foreground'>Active:</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 font-medium text-accent-foreground hover:bg-accent'
              >
                “{searchTerm}” <X className='h-3 w-3' />
              </button>
            )}
            {status !== 'all' && (
              <button
                onClick={() => setStatus('all')}
                className='inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 font-medium text-accent-foreground hover:bg-accent'
              >
                {status.replace('_', ' ')} <X className='h-3 w-3' />
              </button>
            )}
            {websiteId && (
              <button
                onClick={() => setWebsiteId('')}
                className='inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 font-mono-data text-accent-foreground hover:bg-accent'
              >
                {websiteId} <X className='h-3 w-3' />
              </button>
            )}
            <span className='ml-auto text-muted-foreground'>
              {filteredCrawls.length} result
              {filteredCrawls.length === 1 ? '' : 's'}
            </span>
          </div>
        )}
      </section>

      {/* ============ Crawls Table ============ */}
      {filteredCrawls.length === 0 ? (
        <div className='relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed bg-card text-center'>
          <div className='absolute inset-0 bg-dot mask-radial-fade opacity-60' />
          <div className='relative flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground'>
            <Search className='h-5 w-5' />
          </div>
          <h3 className='relative mt-4 text-lg font-display text-foreground'>
            No crawls found
          </h3>
          <p className='relative mt-1 text-sm text-muted-foreground'>
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className='overflow-hidden rounded-2xl border bg-card shadow-elegant animate-fade-in'>
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[860px] text-sm'>
              <thead>
                <tr className='border-b bg-surface-muted/70 text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
                  <th className='py-3.5 pl-6 pr-4 font-medium'>Website</th>
                  <th className='px-4 py-3.5 font-medium'>Status</th>
                  <th className='px-4 py-3.5 font-medium'>Links Checked</th>
                  <th className='px-4 py-3.5 font-medium'>Response</th>
                  <th className='px-4 py-3.5 font-medium'>Started</th>
                  <th className='py-3.5 pl-4 pr-6 text-right font-medium'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCrawls.map((crawl: CrawlResult) => {
                  const running =
                    crawl.status === 'in_progress' ||
                    crawl.status === 'running';
                  const created = new Date(crawl.createdAt);
                  return (
                    <tr
                      key={crawl.id}
                      className='group relative border-b transition-colors last:border-0 hover:bg-primary-soft/40'
                    >
                      {/* Website */}
                      <td className='relative py-4 pl-6 pr-4'>
                        <span
                          className={`absolute inset-y-3 left-0 w-[3px] rounded-r-full ${getStatusRail(crawl.status)} opacity-0 transition-opacity group-hover:opacity-100`}
                        />
                        <div className='flex items-center gap-3'>
                          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-xs font-semibold text-primary ring-1 ring-primary/10'>
                            {getInitials(crawl.website.name)}
                          </div>
                          <div className='min-w-0'>
                            <p className='max-w-[220px] truncate font-semibold text-foreground'>
                              {crawl.website.name}
                            </p>
                            <p className='flex max-w-[220px] items-center gap-1 truncate text-xs text-muted-foreground'>
                              <Globe className='h-3 w-3 shrink-0' />
                              {crawl.website.url}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className='px-4 py-4'>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${getStatusColor(crawl.status)}`}
                        >
                          {getStatusIcon(crawl.status)}
                          {crawl.status.replace('_', ' ')}
                        </span>
                        {running && (
                          <div
                            className='mt-2 w-32'
                            aria-label='Crawl progress'
                          >
                            <div
                              className='h-1.5 overflow-hidden rounded-full bg-muted'
                              role='progressbar'
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={crawl.progress ?? 0}
                            >
                              <div
                                className='h-full rounded-full transition-[width] duration-300'
                                style={{
                                  width: `${crawl.progress ?? 0}%`,
                                  background: 'var(--gradient-accent)',
                                }}
                              />
                            </div>
                            <p className='mt-1 font-mono-data text-[10px] text-muted-foreground'>
                              {crawl.progress ?? 0}% crawled
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Links */}
                      <td className='px-4 py-4'>
                        <div className='flex items-center gap-2'>
                          <LinkIcon className='h-3.5 w-3.5 text-muted-foreground' />
                          <span className='font-mono-data tabular-nums text-foreground'>
                            {crawl.totalLinksChecked?.toLocaleString() || 0}
                          </span>
                        </div>
                      </td>

                      {/* Response */}
                      <td className='px-4 py-4'>
                        <span className='font-mono-data tabular-nums text-foreground'>
                          {crawl.averageResponseTime || 0}
                        </span>
                        <span className='ml-0.5 text-xs text-muted-foreground'>
                          ms
                        </span>
                      </td>

                      {/* Date */}
                      <td className='px-4 py-4'>
                        <p className='text-foreground'>
                          {created.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className='font-mono-data text-xs text-muted-foreground'>
                          {created.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className='py-4 pl-4 pr-6'>
                        <div className='flex items-center justify-end gap-1.5'>
                          {crawl.status === 'failed' && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleRetry(crawl.id)}
                              className='rounded-full text-primary hover:bg-primary-soft hover:text-primary'
                            >
                              <RotateCcw className='mr-1.5 h-3.5 w-3.5' />
                              Retry
                            </Button>
                          )}
                          <Link href={`/dashboard/crawls/${crawl.id}`}>
                            <Button
                              variant='outline'
                              size='sm'
                              className='rounded-full transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground'
                            >
                              Details
                              <ArrowUpRight className='ml-1 h-3.5 w-3.5' />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination (table footer) */}
          {pagination && pagination.pages > 1 && (
            <div className='flex flex-col items-center justify-between gap-3 border-t bg-surface-muted/50 px-6 py-4 sm:flex-row'>
              <p className='text-sm text-muted-foreground'>
                Page{' '}
                <span className='font-mono-data text-foreground'>{page}</span>{' '}
                of{' '}
                <span className='font-mono-data text-foreground'>
                  {pagination.pages}
                </span>
                <span className='mx-2 text-border-strong'>•</span>
                {pagination.total} total crawls
              </p>
              <div className='flex items-center gap-1.5'>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-9 w-9 rounded-full'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label='Previous'
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <span className='min-w-12 text-center font-mono-data text-sm'>
                  {page}
                </span>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-9 w-9 rounded-full'
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={page === pagination.pages}
                  aria-label='Next'
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
