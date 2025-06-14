'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCrawlResult } from '@/features/crawls/api/crawlsApi';
import type { CrawlResultResponse } from '@/features/crawls/types';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Globe,
  LinkIcon,
  RefreshCw,
  Timer,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className='h-5 w-5 text-emerald-500' />;
    case 'failed':
      return <XCircle className='h-5 w-5 text-red-500' />;
    case 'in_progress':
      return <Clock className='h-5 w-5 text-amber-500' />;
    default:
      return <AlertCircle className='h-5 w-5 text-gray-500' />;
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

const getErrorTypeColor = (errorType: string) => {
  switch (errorType) {
    case '404_not_found':
      return 'bg-red-50 text-red-700 border-red-200';
    case '500_server_error':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'timeout':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'connection_error':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

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
        <div className='flex items-center gap-4'>
          <div className='h-10 w-10 bg-muted animate-pulse rounded' />
          <div className='h-8 w-48 bg-muted animate-pulse rounded' />
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

        <Card>
          <CardContent className='p-6'>
            <div className='space-y-4'>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className='h-4 w-full bg-muted animate-pulse rounded'
                />
              ))}
            </div>
          </CardContent>
        </Card>
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
            Failed to load crawl details
          </h3>
          <p className='text-muted-foreground mt-1'>
            {error instanceof Error
              ? error.message
              : 'An unexpected error occurred'}
          </p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={() => router.back()} variant='outline'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Go Back
          </Button>
          <Button onClick={handleRefresh}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!crawlData?.data?.crawlResult) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] space-y-4'>
        <div className='rounded-full bg-muted p-3'>
          <Activity className='h-6 w-6 text-muted-foreground' />
        </div>
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-foreground'>
            Crawl not found
          </h3>
          <p className='text-muted-foreground mt-1'>
            The requested crawl could not be found
          </p>
        </div>
        <Button onClick={() => router.back()} variant='outline'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Go Back
        </Button>
      </div>
    );
  }

  const { crawlResult } = crawlData.data;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='sm' onClick={() => router.back()}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back
          </Button>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              Crawl Details
            </h1>
            <p className='text-muted-foreground mt-1'>
              Detailed analysis of your website crawl
            </p>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={handleExport} disabled>
            <Download className='h-4 w-4 mr-2' />
            Export (Coming Soon)
          </Button>
          <Button onClick={handleRefresh} disabled>
            <RefreshCw className='h-4 w-4 mr-2' />
            Refresh (Coming Soon)
          </Button>
        </div>
      </div>

      {/* Website Info */}
      <Card className='border-l-4 border-l-primary'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-full bg-primary/10 p-2'>
                <Globe className='h-5 w-5 text-primary' />
              </div>
              <div>
                <CardTitle className='text-xl'>
                  {crawlResult.website.name}
                </CardTitle>
                <p className='text-muted-foreground flex items-center gap-2 mt-1'>
                  {crawlResult.website.url}
                  <a
                    href={crawlResult.website.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:text-primary/80'
                  >
                    <ExternalLink className='h-4 w-4' />
                  </a>
                </p>
              </div>
            </div>
            <Badge
              className={`${getStatusColor(
                crawlResult.status
              )} border text-sm px-3 py-1`}
            >
              <div className='flex items-center gap-2'>
                {getStatusIcon(crawlResult.status)}
                <span className='font-medium'>
                  {crawlResult.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Crawl Overview */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Total Links
                </p>
                <p className='text-2xl font-bold text-foreground'>
                  {crawlResult.totalLinksFound?.toLocaleString() || 0}
                </p>
              </div>
              <div className='rounded-full bg-primary/10 p-3'>
                <LinkIcon className='h-5 w-5 text-primary' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Broken Links
                </p>
                <p className='text-2xl font-bold text-red-600'>
                  {crawlResult.brokenLinksFound || 0}
                </p>
              </div>
              <div className='rounded-full bg-red-100 p-3'>
                <AlertTriangle className='h-5 w-5 text-red-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Success Rate
                </p>
                <p className='text-2xl font-bold text-emerald-600'>
                  {crawlResult.totalLinksFound > 0
                    ? Math.round(
                        ((crawlResult.totalLinksFound -
                          (crawlResult.brokenLinksFound || 0)) /
                          crawlResult.totalLinksFound) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className='rounded-full bg-emerald-100 p-3'>
                <TrendingUp className='h-5 w-5 text-emerald-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Duration
                </p>
                <p className='text-2xl font-bold text-foreground'>
                  {formatDuration(crawlResult.summary?.crawlDuration || 0)}
                </p>
              </div>
              <div className='rounded-full bg-secondary/10 p-3'>
                <Timer className='h-5 w-5 text-secondary' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crawl Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='h-5 w-5' />
            Crawl Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center gap-4 p-4 bg-muted/50 rounded-lg'>
              <div className='rounded-full bg-primary p-2'>
                <Activity className='h-4 w-4 text-primary-foreground' />
              </div>
              <div className='flex-1'>
                <p className='font-medium'>Crawl Started</p>
                <p className='text-sm text-muted-foreground'>
                  {new Date(crawlResult.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {crawlResult.status === 'completed' && (
              <div className='flex items-center gap-4 p-4 bg-emerald-50 rounded-lg'>
                <div className='rounded-full bg-emerald-500 p-2'>
                  <CheckCircle className='h-4 w-4 text-white' />
                </div>
                <div className='flex-1'>
                  <p className='font-medium'>Crawl Completed</p>
                  <p className='text-sm text-muted-foreground'>
                    Found {crawlResult.totalLinksFound} links,{' '}
                    {crawlResult.brokenLinksFound} broken
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Broken Links */}
      {crawlResult.brokenLinkRecords &&
        crawlResult.brokenLinkRecords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <AlertTriangle className='h-5 w-5 text-red-500' />
                Broken Links ({crawlResult.brokenLinkRecords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {crawlResult.brokenLinkRecords.map((link) => (
                  <div
                    key={link.id}
                    className='border rounded-lg p-4 hover:bg-muted/50 transition-colors'
                  >
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-2'>
                          <Badge
                            className={`${getErrorTypeColor(
                              link.errorType
                            )} border text-xs`}
                          >
                            {link.errorType.replace(/_/g, ' ').toUpperCase()}
                          </Badge>
                          {link.statusCode && (
                            <Badge variant='outline' className='text-xs'>
                              {link.statusCode}
                            </Badge>
                          )}
                        </div>
                        <p className='font-medium text-foreground break-all mb-1'>
                          {link.url}
                        </p>
                        <p className='text-sm text-muted-foreground break-all'>
                          Found on: {link.sourceUrl}
                        </p>
                      </div>
                      <a
                        href={link.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:text-primary/80 flex-shrink-0'
                      >
                        <ExternalLink className='h-4 w-4' />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* No Broken Links */}
      {(!crawlResult.brokenLinkRecords ||
        crawlResult.brokenLinkRecords.length === 0) && (
        <Card>
          <CardContent className='p-12'>
            <div className='text-center'>
              <div className='rounded-full bg-emerald-100 p-3 w-fit mx-auto mb-4'>
                <CheckCircle className='h-6 w-6 text-emerald-600' />
              </div>
              <h3 className='text-lg font-semibold text-foreground'>
                No Broken Links Found
              </h3>
              <p className='text-muted-foreground mt-1'>
                Great! All links on this website are working properly.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
