'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFeedback, useFeedbackById } from '@/hooks/use-feedback';
import type { FeedbackRecord } from '@/types/feedback';
import { ChevronLeft, ChevronRight, MessageSquareText } from 'lucide-react';
import { useState } from 'react';

const PAGE_SIZE = 20;

function displayAnswer(value: string) {
  const labels: Record<string, string> = {
    regularly: 'Uses it regularly',
    once_or_twice: 'Tried it once or twice',
    not_yet: 'Has not tried it yet',
    monitoring: 'Automatic website and broken-link monitoring',
    alerts: 'Alerts and notifications',
    reports: 'Reports, history, and health analytics',
    crawling: 'Advanced crawling and link discovery',
    collaboration: 'Team collaboration and integrations',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly or when needed',
    rarely: 'Rarely',
    yes: 'Yes',
    maybe: 'Maybe, depending on features and price',
    free_only: 'Free only',
    unsure: 'Not sure',
  };
  return labels[value] ?? value;
}

function Answer({ label, value }: { label: string; value: string | null }) {
  return (
    <div className='border-b py-4 last:border-b-0'>
      <dt className='text-sm font-medium text-muted-foreground'>{label}</dt>
      <dd className='mt-1 whitespace-pre-wrap text-sm text-foreground'>
        {value ? displayAnswer(value) : 'No response'}
      </dd>
    </div>
  );
}

export default function AdminFeedbackPage() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string>();
  const { data, isLoading, error } = useFeedback(page, PAGE_SIZE);
  const feedback = data?.data.feedback ?? [];
  const activeId = selectedId ?? feedback[0]?.id;
  const detail = useFeedbackById(activeId);
  const selected: FeedbackRecord | undefined = detail.data?.data.feedback;
  const pagination = data?.data.pagination;

  return (
    <section className='container mx-auto space-y-5 py-6'>
      <header className='flex items-center gap-3'>
        <MessageSquareText className='h-6 w-6 text-primary' />
        <div>
          <h1 className='text-2xl font-semibold'>Feedback</h1>
          <p className='text-sm text-muted-foreground'>
            Anonymous product responses
            {pagination ? ` · ${pagination.total} total` : ''}
          </p>
        </div>
      </header>

      {error ? (
        <Card>
          <CardContent className='py-8 text-sm text-destructive'>
            Could not load feedback. Check your admin access and try again.
          </CardContent>
        </Card>
      ) : isLoading ? (
        <p className='py-8 text-sm text-muted-foreground'>Loading feedback…</p>
      ) : feedback.length === 0 ? (
        <Card>
          <CardContent className='py-10 text-center text-sm text-muted-foreground'>
            No feedback responses yet.
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-5 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.4fr)]'>
          <Card className='min-w-0'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-base'>Responses</CardTitle>
            </CardHeader>
            <CardContent className='space-y-1'>
              {feedback.map((item) => (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-md border px-3 py-3 text-left transition-colors ${
                    activeId === item.id
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-transparent hover:bg-muted/60'
                  }`}
                >
                  <span className='block text-sm font-medium'>
                    {displayAnswer(item.usefulFeature)}
                  </span>
                  <span className='mt-1 block text-xs text-muted-foreground'>
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </button>
              ))}
              <div className='flex items-center justify-between border-t pt-3'>
                <span className='text-xs text-muted-foreground'>
                  Page {pagination?.page ?? page} of {pagination?.pages ?? 1}
                </span>
                <div className='flex gap-1'>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    aria-label='Previous page'
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((current) => current - 1);
                      setSelectedId(undefined);
                    }}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    aria-label='Next page'
                    disabled={!pagination || page >= pagination.pages}
                    onClick={() => {
                      setPage((current) => current + 1);
                      setSelectedId(undefined);
                    }}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='min-w-0'>
            <CardHeader>
              <CardTitle className='text-base'>Response details</CardTitle>
            </CardHeader>
            <CardContent>
              {detail.isLoading ? (
                <p className='text-sm text-muted-foreground'>
                  Loading response…
                </p>
              ) : detail.error ? (
                <p className='text-sm text-destructive'>
                  Could not load this response.
                </p>
              ) : selected ? (
                <dl className='divide-y'>
                  <div className='border-b pb-4'>
                    <dt className='text-sm font-medium text-muted-foreground'>
                      Submitted
                    </dt>
                    <dd className='mt-1 text-sm'>
                      {new Date(selected.createdAt).toLocaleString()}
                    </dd>
                  </div>
                  <Answer
                    label='Tried the product'
                    value={selected.triedProduct}
                  />
                  <Answer
                    label='Most useful feature'
                    value={selected.usefulFeature}
                  />
                  <Answer
                    label='Missing or frustrating'
                    value={selected.frustration}
                  />
                  <Answer
                    label='Expected usage frequency'
                    value={selected.usageFrequency}
                  />
                  <Answer
                    label='Willingness to pay'
                    value={selected.wouldPay}
                  />
                </dl>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  Select a response to review it.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
