'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex min-h-screen bg-background items-center justify-center px-6'>
      <div className='text-center'>
        <div className='mb-8'>
          <h1 className='text-6xl font-bold text-foreground sm:text-7xl'>
            Oops!
          </h1>
          <p className='mt-4 text-2xl font-semibold text-foreground sm:text-3xl'>
            Something went wrong
          </p>
        </div>

        <p className='mx-auto max-w-md text-lg text-muted-foreground'>
          We encountered an unexpected error. Please try again or contact
          support if the problem persists.
        </p>

        {error.message && (
          <p className='mt-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive'>
            {error.message}
          </p>
        )}

        <div className='mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center'>
          <Button onClick={reset} size='lg' className='group rounded-full'>
            Try Again
            <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
          </Button>
          <Button asChild variant='outline' size='lg' className='rounded-full'>
            <a href='/'>Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
