'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBrokenLinks } from '@/hooks/use-broken-links';
import type { BrokenLink, ErrorSummary } from '@/types/broken-links';
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Filter,
  Link2Off,
  RefreshCw,
  Search,
  Server,
  TrendingDown,
  Wifi,
} from 'lucide-react';
import { useState } from 'react';

// Presentation only. Error classification and data stay unchanged.
const getErrorIcon = (errorType: string) => {
  switch (errorType.toLowerCase()) {
    case '404_not_found':
      return <AlertCircle className='h-4 w-4' />;
    case '500_server_error':
      return <Server className='h-4 w-4' />;
    case 'timeout':
      return <Clock className='h-4 w-4' />;
    case 'connection_refused':
      return <Wifi className='h-4 w-4' />;
    default:
      return <AlertTriangle className='h-4 w-4' />;
  }
};

const getErrorColor = (errorType: string) => {
  switch (errorType.toLowerCase()) {
    case '404_not_found':
      return 'bg-secondary-soft text-secondary-foreground border-secondary/40';
    case '500_server_error':
      return 'bg-destructive/10 text-destructive border-destructive/25';
    case 'timeout':
      return 'bg-secondary-soft text-secondary-foreground border-secondary/40';
    case 'connection_refused':
      return 'bg-primary-soft text-primary border-primary/25';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const errorLabel = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

export default function BrokenLinksPage() {
  const [page, setPage] = useState(1);
  const [errorType, setErrorType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fixedFilter, setFixedFilter] = useState<string>('all');

  const { data, isLoading, error, refetch } = useBrokenLinks(
    page,
    20,
    errorType === 'all' ? '' : errorType,
    fixedFilter === 'all' ? undefined : fixedFilter === 'fixed',
    searchQuery
  );

  if (isLoading) {
    return (
      <div
        className='space-y-8'
        role='status'
        aria-label='Loading broken links'
        aria-busy='true'
      >
        <div className='flex items-center justify-between gap-4 border-b pb-8'>
          <div className='space-y-3'>
            <div className='h-4 w-28 animate-pulse rounded bg-muted' />
            <div className='h-10 w-56 animate-pulse rounded bg-muted' />
          </div>
          <div className='h-10 w-24 animate-pulse rounded bg-muted' />
        </div>
        <div className='grid grid-cols-2 gap-6 border-b pb-8 lg:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='space-y-4'>
              <div className='h-4 w-24 animate-pulse rounded bg-muted' />
              <div className='h-12 w-20 animate-pulse rounded bg-muted' />
            </div>
          ))}
        </div>
        <div className='h-12 animate-pulse rounded bg-muted' />
        <div className='overflow-hidden rounded-lg border'>
          <div className='h-11 bg-muted' />
          {[...Array(5)].map((_, i) => (
            <div key={i} className='flex h-24 items-center gap-6 border-t px-5'>
              <div className='h-9 w-9 shrink-0 animate-pulse rounded bg-muted' />
              <div className='h-4 w-1/2 animate-pulse rounded bg-muted' />
              <div className='ml-auto h-6 w-20 animate-pulse rounded bg-muted' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center'>
        <div className='flex h-16 w-16 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive'>
          <AlertTriangle className='h-7 w-7' />
        </div>
        <h3 className='mt-6 text-xl font-semibold text-foreground'>
          Error Loading Broken Links
        </h3>
        <p className='mt-2 max-w-md break-words text-sm text-muted-foreground'>
          {error instanceof Error
            ? error.message
            : 'An unexpected error occurred'}
        </p>
        <Button
          onClick={() => refetch()}
          variant='outline'
          className='mt-6 gap-2'
        >
          <RefreshCw className='h-4 w-4' /> Try Again
        </Button>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className='flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center'>
        <div className='flex h-16 w-16 items-center justify-center rounded-lg border border-primary/20 bg-primary-soft text-primary'>
          <CheckCircle2 className='h-7 w-7' />
        </div>
        <h3 className='mt-6 text-xl font-semibold text-foreground'>
          No Broken Links Found
        </h3>
        <p className='mt-2 text-sm text-muted-foreground'>
          Great news! All your links are working properly.
        </p>
      </div>
    );
  }

  const { recentBrokenLinks, summary, pagination } = data.data;

  return (
    <div className='space-y-8'>
      <header className='flex flex-col gap-5 border-b pb-7 sm:flex-row sm:items-end sm:justify-between motion-safe:animate-fade-up'>
        <div className='min-w-0'>
          <div className='mb-3 flex items-center gap-2 text-xs font-medium uppercase text-primary'>
            <Link2Off className='h-4 w-4' /> Link health
          </div>
          <h1 className='text-3xl font-semibold text-foreground sm:text-4xl'>
            Broken Links<span className='text-secondary'>.</span>
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Monitor and fix broken links across your websites
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant='outline'
          className='shrink-0 gap-2 self-start border-border-strong bg-surface sm:self-auto'
        >
          <RefreshCw className='h-4 w-4' /> Refresh
        </Button>
      </header>

      {/* An editorial metric strip, not another grid of cards. */}
      <section
        aria-label='Issue summary'
        className='grid grid-cols-2 border-b pb-8 lg:grid-cols-4 motion-safe:animate-fade-up'
      >
        <div className='border-l-4 border-secondary py-2 pl-4 pr-5 sm:pl-5'>
          <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
            <TrendingDown className='h-4 w-4 text-primary' /> Total Issues
          </div>
          <div className='mt-4 break-words text-4xl font-semibold tabular-nums text-primary sm:text-5xl'>
            {summary.reduce((acc, item) => acc + item.count, 0)}
          </div>
          <div className='mt-3 h-1 w-12 rounded-full bg-secondary' />
        </div>
        {summary.slice(0, 3).map((item: ErrorSummary) => (
          <div
            key={item.errorType}
            className='min-w-0 border-l px-4 py-2 even:mt-0 odd:mt-6 sm:px-6 lg:odd:mt-0'
          >
            <div className='flex min-h-10 items-start gap-2 text-sm text-muted-foreground'>
              <span
                className={`inline-flex shrink-0 rounded border p-1 ${getErrorColor(item.errorType)}`}
              >
                {getErrorIcon(item.errorType)}
              </span>
              <span className='break-words pt-1'>
                {errorLabel(item.errorType)}
              </span>
            </div>
            <div className='mt-2 break-words text-3xl font-semibold tabular-nums text-foreground sm:text-4xl'>
              {item.count}
            </div>
          </div>
        ))}
      </section>

      <section
        aria-label='Broken link results'
        className='space-y-5 motion-safe:animate-fade-up'
      >
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <h2 className='text-lg font-semibold text-foreground'>
              Issue register
            </h2>
            <Badge
              variant='outline'
              className='border-border-strong bg-surface font-mono tabular-nums'
            >
              {pagination ? pagination.total : recentBrokenLinks.length}
            </Badge>
          </div>
          <span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
            <Clock className='h-3.5 w-3.5' /> Recent broken links
          </span>
        </div>

        <div className='flex flex-col gap-3 lg:flex-row'>
          <div className='relative min-w-0 flex-1'>
            <Search className='pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              aria-label='Search broken links'
              placeholder='Search broken links...'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className='h-11 border-border-strong bg-surface pl-10'
            />
          </div>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex'>
            <Select
              value={errorType}
              onValueChange={(value) => {
                setErrorType(value);
                setPage(1);
              }}
            >
              <SelectTrigger
                aria-label='Error type'
                className='h-11 w-full border-border-strong bg-surface lg:w-52'
              >
                <Filter className='mr-2 h-4 w-4 shrink-0 text-primary' />
                <SelectValue placeholder='Error Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Error Types</SelectItem>
                <SelectItem value='404_not_found'>404 Not Found</SelectItem>
                <SelectItem value='500_server_error'>
                  500 Server Error
                </SelectItem>
                <SelectItem value='timeout'>Timeout</SelectItem>
                <SelectItem value='connection_refused'>
                  Connection Error
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={fixedFilter}
              onValueChange={(value) => {
                setFixedFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger
                aria-label='Link status'
                className='h-11 w-full border-border-strong bg-surface lg:w-40'
              >
                <SelectValue placeholder='Link status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Links</SelectItem>
                <SelectItem value='unfixed'>Unfixed</SelectItem>
                <SelectItem value='fixed'>Fixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='overflow-hidden rounded-lg border border-border-strong bg-surface'>
          {recentBrokenLinks.length === 0 ? (
            <div className='flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center'>
              <Search className='mb-5 h-9 w-9 text-primary' />
              <h3 className='text-lg font-semibold text-foreground'>
                No Results Found
              </h3>
              <p className='mt-2 text-sm text-muted-foreground'>
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <div
              className='overflow-x-auto'
              role='region'
              aria-label='Broken links table'
              tabIndex={0}
            >
              <table className='w-full min-w-[880px] table-fixed text-left text-sm'>
                <caption className='sr-only'>
                  Recent broken links, error types, HTTP codes, fix status and
                  discovery dates
                </caption>
                <thead className='border-b border-border-strong bg-surface-muted text-xs text-muted-foreground'>
                  <tr>
                    <th scope='col' className='w-[42%] px-5 py-3.5 font-medium'>
                      Broken link / Source
                    </th>
                    <th scope='col' className='w-[21%] px-4 py-3.5 font-medium'>
                      Error type
                    </th>
                    <th scope='col' className='w-[8%] px-4 py-3.5 font-medium'>
                      HTTP
                    </th>
                    <th scope='col' className='w-[11%] px-4 py-3.5 font-medium'>
                      Status
                    </th>
                    <th scope='col' className='w-[12%] px-4 py-3.5 font-medium'>
                      Detected
                    </th>
                    <th scope='col' className='w-[6%] px-2 py-3.5'>
                      <span className='sr-only'>Open link</span>
                      <ArrowUpRight className='mx-auto h-4 w-4' />
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                  {recentBrokenLinks.map((link: BrokenLink) => (
                    <tr
                      key={link.id}
                      className='group transition-colors hover:bg-primary-soft/40'
                    >
                      <td className='border-l-2 border-l-transparent px-5 py-5 group-hover:border-l-primary'>
                        <div className='flex items-start gap-3'>
                          <span
                            className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${getErrorColor(link.errorType)}`}
                          >
                            {getErrorIcon(link.errorType)}
                          </span>
                          <div className='min-w-0'>
                            <div
                              title={link.url}
                              className='truncate font-medium text-foreground'
                            >
                              {link.url}
                            </div>
                            <div
                              title={link.sourceUrl}
                              className='mt-1.5 truncate text-xs text-muted-foreground'
                            >
                              Found on: {link.sourceUrl}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-5'>
                        <Badge
                          variant='outline'
                          className={`max-w-full whitespace-normal rounded-md text-xs ${getErrorColor(link.errorType)}`}
                        >
                          {errorLabel(link.errorType)}
                        </Badge>
                      </td>
                      <td className='px-4 py-5'>
                        {link.statusCode && (
                          <Badge
                            variant='secondary'
                            className='rounded-md bg-muted font-mono text-muted-foreground'
                          >
                            {link.statusCode}
                          </Badge>
                        )}
                      </td>
                      <td className='px-4 py-5'>
                        <Badge
                          variant={link.isFixed ? 'default' : 'outline'}
                          className={
                            link.isFixed
                              ? 'gap-1.5 rounded-md border-primary/20 bg-primary-soft text-primary'
                              : 'gap-1.5 rounded-md border-border-strong text-muted-foreground'
                          }
                        >
                          {link.isFixed ? (
                            <CheckCircle2 className='h-3 w-3' />
                          ) : (
                            <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-secondary' />
                          )}
                          {link.isFixed ? 'Fixed' : 'Unfixed'}
                        </Badge>
                      </td>
                      <td className='px-4 py-5 text-xs tabular-nums text-muted-foreground'>
                        {new Date(link.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className='px-2 py-5 text-center'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => window.open(link.url, '_blank')}
                          aria-label={`Open ${link.url}`}
                          title='Open broken link'
                          className='h-8 w-8 rounded-md p-0 text-muted-foreground hover:bg-primary hover:text-primary-foreground'
                        >
                          <ExternalLink className='h-4 w-4' />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {pagination && pagination.pages > 1 && (
            <div className='flex flex-col items-start justify-between gap-4 border-t bg-surface-muted px-5 py-4 sm:flex-row sm:items-center'>
              <div className='text-xs tabular-nums text-muted-foreground'>
                Showing page{' '}
                <span className='font-semibold text-foreground'>{page}</span> of{' '}
                {pagination.pages} ({pagination.total} total issues)
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className='gap-1.5 bg-surface'
                >
                  <ChevronLeft className='h-4 w-4' /> Previous
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={page === pagination.pages}
                  className='gap-1.5 bg-surface'
                >
                  Next <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
