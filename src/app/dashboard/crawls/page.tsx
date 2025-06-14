'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCrawls } from '@/features/crawls/hooks/useCrawls';
import type { CrawlResult } from '@/features/crawls/types';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  LinkIcon,
  RefreshCw,
  RotateCcw,
  Search,
  Timer,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className='h-4 w-4 text-emerald-500' />;
    case 'failed':
      return <XCircle className='h-4 w-4 text-red-500' />;
    case 'in_progress':
      return <Clock className='h-4 w-4 text-amber-500' />;
    default:
      return <AlertCircle className='h-4 w-4 text-gray-500' />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'failed':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'in_progress':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

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
        <div className='flex items-center justify-between'>
          <div className='h-8 w-48 bg-muted animate-pulse rounded' />
          <div className='h-10 w-32 bg-muted animate-pulse rounded' />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <div className='h-4 w-20 bg-muted animate-pulse rounded mb-2' />
                <div className='h-8 w-16 bg-muted animate-pulse rounded' />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  <div className='h-4 w-3/4 bg-muted animate-pulse rounded' />
                  <div className='h-4 w-1/2 bg-muted animate-pulse rounded' />
                  <div className='h-4 w-2/3 bg-muted animate-pulse rounded' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] space-y-4'>
        <div className='rounded-full bg-red-100 p-3'>
          <AlertTriangle className='h-6 w-6 text-red-600' />
        </div>
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-foreground'>
            Failed to load crawls
          </h3>
          <p className='text-muted-foreground mt-1'>
            {error instanceof Error
              ? error.message
              : 'An unexpected error occurred'}
          </p>
        </div>
        <Button onClick={handleRefresh} variant='outline'>
          <RefreshCw className='h-4 w-4 mr-2' />
          Try Again
        </Button>
      </div>
    );
  }

  if (!data?.data?.crawlResults) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] space-y-4'>
        <div className='rounded-full bg-muted p-3'>
          <Activity className='h-6 w-6 text-muted-foreground' />
        </div>
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-foreground'>
            No crawls found
          </h3>
          <p className='text-muted-foreground mt-1'>
            Start crawling your websites to see results here
          </p>
        </div>
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

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Crawl History</h1>
          <p className='text-muted-foreground mt-1'>
            Monitor and track your website crawling activities
          </p>
        </div>
        <Button onClick={handleRefresh} variant='outline' disabled>
          <RefreshCw className='h-4 w-4 mr-2' />
          Refresh (Coming Soon)
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Total Crawls
                </p>
                <p className='text-2xl font-bold text-foreground'>
                  {totalCrawls}
                </p>
              </div>
              <div className='rounded-full bg-primary/10 p-3'>
                <Activity className='h-5 w-5 text-primary' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Completed
                </p>
                <p className='text-2xl font-bold text-emerald-600'>
                  {completedCrawls}
                </p>
              </div>
              <div className='rounded-full bg-emerald-100 p-3'>
                <CheckCircle className='h-5 w-5 text-emerald-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  In Progress
                </p>
                <p className='text-2xl font-bold text-amber-600'>
                  {inProgressCrawls}
                </p>
              </div>
              <div className='rounded-full bg-amber-100 p-3'>
                <Clock className='h-5 w-5 text-amber-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Failed
                </p>
                <p className='text-2xl font-bold text-red-600'>
                  {failedCrawls}
                </p>
              </div>
              <div className='rounded-full bg-red-100 p-3'>
                <XCircle className='h-5 w-5 text-red-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Avg Response
                </p>
                <p className='text-2xl font-bold text-foreground'>
                  {avgResponseTime}ms
                </p>
              </div>
              <div className='rounded-full bg-secondary/10 p-3'>
                <Timer className='h-5 w-5 text-secondary' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search websites...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className='w-full sm:w-48'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='failed'>Failed</SelectItem>
                <SelectItem value='in_progress'>In Progress</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder='Website ID'
              value={websiteId}
              onChange={(e) => setWebsiteId(e.target.value)}
              className='w-full sm:w-48'
            />
          </div>
        </CardContent>
      </Card>

      {/* Crawls Grid */}
      {filteredCrawls.length === 0 ? (
        <div className='flex flex-col items-center justify-center min-h-[300px] space-y-4'>
          <div className='rounded-full bg-muted p-3'>
            <Search className='h-6 w-6 text-muted-foreground' />
          </div>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-foreground'>
              No crawls found
            </h3>
            <p className='text-muted-foreground mt-1'>
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
          {filteredCrawls.map((crawl: CrawlResult) => (
            <Card
              key={crawl.id}
              className='hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary'
            >
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1 min-w-0'>
                    <CardTitle className='text-lg font-semibold text-foreground truncate'>
                      {crawl.website.name}
                    </CardTitle>
                    <p className='text-sm text-muted-foreground truncate mt-1'>
                      {crawl.website.url}
                    </p>
                  </div>
                  <Badge
                    className={`ml-2 ${getStatusColor(crawl.status)} border`}
                  >
                    <div className='flex items-center gap-1'>
                      {getStatusIcon(crawl.status)}
                      <span className='text-xs font-medium'>
                        {crawl.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className='pt-0'>
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div className='flex items-center gap-2'>
                    <LinkIcon className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-xs text-muted-foreground'>
                        Links Checked
                      </p>
                      <p className='text-sm font-semibold text-foreground'>
                        {crawl.totalLinksChecked?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Timer className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-xs text-muted-foreground'>
                        Response Time
                      </p>
                      <p className='text-sm font-semibold text-foreground'>
                        {crawl.averageResponseTime || 0}ms
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-2 mb-4'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>
                    {new Date(crawl.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className='flex items-center justify-between pt-2 border-t'>
                  <Link href={`/dashboard/crawls/${crawl.id}`}>
                    <Button variant='outline' size='sm'>
                      <Eye className='h-4 w-4 mr-2' />
                      View Details
                    </Button>
                  </Link>

                  {crawl.status === 'failed' && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleRetry(crawl.id)}
                      className='text-primary hover:text-primary/80'
                    >
                      <RotateCcw className='h-4 w-4 mr-2' />
                      Retry
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>
                Showing page {page} of {pagination.pages} ({pagination.total}{' '}
                total crawls)
              </p>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
