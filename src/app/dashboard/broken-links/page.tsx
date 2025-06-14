'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBrokenLinks } from '@/features/broken-links/hooks/useBrokenLinks';
import type { BrokenLink, ErrorSummary } from '@/features/broken-links/types';
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Filter,
  RefreshCw,
  Search,
  Server,
  TrendingDown,
  Wifi,
} from 'lucide-react';
import { useState } from 'react';

export default function BrokenLinksPage() {
  const [page, setPage] = useState(1);
  const [errorType, setErrorType] = useState<string>('all');
  const [isFixed, setIsFixed] = useState<boolean | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error, refetch } = useBrokenLinks(
    page,
    20,
    errorType === 'all' ? '' : errorType,
    isFixed
  );

  const getErrorIcon = (errorType: string) => {
    switch (errorType.toLowerCase()) {
      case '404_not_found':
        return <AlertCircle className='h-4 w-4' />;
      case '500_server_error':
        return <Server className='h-4 w-4' />;
      case 'timeout':
        return <Clock className='h-4 w-4' />;
      case 'connection_error':
        return <Wifi className='h-4 w-4' />;
      default:
        return <AlertTriangle className='h-4 w-4' />;
    }
  };

  const getErrorColor = (errorType: string) => {
    switch (errorType.toLowerCase()) {
      case '404_not_found':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case '500_server_error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'timeout':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'connection_error':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSummaryIcon = (errorType: string) => {
    switch (errorType.toLowerCase()) {
      case '404_not_found':
        return <AlertCircle className='h-5 w-5 text-orange-600' />;
      case '500_server_error':
        return <Server className='h-5 w-5 text-red-600' />;
      case 'timeout':
        return <Clock className='h-5 w-5 text-yellow-600' />;
      case 'connection_error':
        return <Wifi className='h-5 w-5 text-purple-600' />;
      default:
        return <AlertTriangle className='h-5 w-5 text-gray-600' />;
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='h-8 w-48 bg-muted animate-pulse rounded' />
          <div className='h-10 w-32 bg-muted animate-pulse rounded' />
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <div className='flex items-center space-x-2'>
                  <div className='h-5 w-5 bg-muted animate-pulse rounded' />
                  <div className='h-4 w-24 bg-muted animate-pulse rounded' />
                </div>
                <div className='mt-2 h-8 w-16 bg-muted animate-pulse rounded' />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='space-y-4'>
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <div className='space-y-3'>
                  <div className='h-4 w-3/4 bg-muted animate-pulse rounded' />
                  <div className='h-4 w-1/2 bg-muted animate-pulse rounded' />
                  <div className='h-4 w-1/4 bg-muted animate-pulse rounded' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='flex h-96 flex-col items-center justify-center space-y-4'>
        <AlertTriangle className='h-12 w-12 text-destructive' />
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-foreground'>
            Error Loading Broken Links
          </h3>
          <p className='text-sm text-muted-foreground mt-1'>
            {error instanceof Error
              ? error.message
              : 'An unexpected error occurred'}
          </p>
        </div>
        <Button onClick={() => refetch()} variant='outline'>
          <RefreshCw className='h-4 w-4 mr-2' />
          Try Again
        </Button>
      </div>
    );
  }

  // No data state
  if (!data?.data?.recentBrokenLinks) {
    return (
      <div className='flex h-96 flex-col items-center justify-center space-y-4'>
        <div className='rounded-full bg-green-100 p-3'>
          <AlertTriangle className='h-8 w-8 text-green-600' />
        </div>
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-foreground'>
            No Broken Links Found
          </h3>
          <p className='text-sm text-muted-foreground mt-1'>
            Great news! All your links are working properly.
          </p>
        </div>
      </div>
    );
  }

  const { recentBrokenLinks, summary, pagination } = data.data;

  // Filter broken links based on search query
  const filteredLinks = recentBrokenLinks.filter(
    (link) =>
      link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.sourceUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Broken Links</h1>
          <p className='text-muted-foreground mt-1'>
            Monitor and fix broken links across your websites
          </p>
        </div>
        <Button onClick={() => refetch()} variant='outline'>
          <RefreshCw className='h-4 w-4 mr-2' />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='border-l-4 border-l-primary'>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-2'>
              <TrendingDown className='h-5 w-5 text-primary' />
              <span className='text-sm font-medium text-muted-foreground'>
                Total Issues
              </span>
            </div>
            <div className='mt-2 text-3xl font-bold text-foreground'>
              {summary.reduce((acc, item) => acc + item.count, 0)}
            </div>
          </CardContent>
        </Card>

        {summary.slice(0, 3).map((item: ErrorSummary) => (
          <Card key={item.errorType}>
            <CardContent className='p-6'>
              <div className='flex items-center space-x-2'>
                {getSummaryIcon(item.errorType)}
                <span className='text-sm font-medium text-muted-foreground'>
                  {item.errorType
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </div>
              <div className='mt-2 text-3xl font-bold text-foreground'>
                {item.count}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  placeholder='Search broken links...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>
            <div className='flex gap-2'>
              <Select value={errorType} onValueChange={setErrorType}>
                <SelectTrigger className='w-48'>
                  <Filter className='h-4 w-4 mr-2' />
                  <SelectValue placeholder='Error Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Error Types</SelectItem>
                  <SelectItem value='404_not_found'>404 Not Found</SelectItem>
                  <SelectItem value='500_server_error'>
                    500 Server Error
                  </SelectItem>
                  <SelectItem value='timeout'>Timeout</SelectItem>
                  <SelectItem value='connection_error'>
                    Connection Error
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Broken Links List */}
      <div className='space-y-4'>
        {filteredLinks.length === 0 ? (
          <Card>
            <CardContent className='p-12 text-center'>
              <Search className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-foreground mb-2'>
                No Results Found
              </h3>
              <p className='text-muted-foreground'>
                Try adjusting your search terms or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLinks.map((link: BrokenLink) => (
            <Card key={link.id} className='hover:shadow-md transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                  <div className='flex-1 space-y-3'>
                    <div className='flex items-start gap-3'>
                      <div className='mt-1'>{getErrorIcon(link.errorType)}</div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <h3 className='font-medium text-foreground truncate'>
                            {link.url}
                          </h3>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => window.open(link.url, '_blank')}
                            className='h-6 w-6 p-0'
                          >
                            <ExternalLink className='h-3 w-3' />
                          </Button>
                        </div>
                        <p className='text-sm text-muted-foreground truncate'>
                          Found on: {link.sourceUrl}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                    <Badge
                      variant='outline'
                      className={`${getErrorColor(link.errorType)} border`}
                    >
                      {link.errorType
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>

                    {link.statusCode && (
                      <Badge variant='secondary'>{link.statusCode}</Badge>
                    )}

                    <div className='text-sm text-muted-foreground'>
                      {new Date(link.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                Showing page {page} of {pagination.pages} ({pagination.total}{' '}
                total issues)
              </div>
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
