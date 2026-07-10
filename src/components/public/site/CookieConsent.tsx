import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cookie-consent-v1';

type Consent = 'all' | 'essential' | null;

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY) as Consent;
      if (!v) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const decide = (choice: Exclude<Consent, null>) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role='dialog'
      aria-label='Cookie preferences'
      className='fixed inset-x-3 bottom-3 z-[65] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md'
    >
      <div className='relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-elegant'>
        <button
          onClick={() => decide('essential')}
          aria-label='Dismiss'
          className='absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-muted hover:text-foreground'
        >
          <X className='h-4 w-4' />
        </button>
        <div className='flex items-start gap-3'>
          <span className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary'>
            <Cookie className='h-5 w-5' />
          </span>
          <div className='pr-6'>
            <h2 className='text-base font-semibold text-foreground'>
              We use cookies
            </h2>
            <p className='mt-1 text-sm leading-relaxed text-muted-foreground'>
              Essential cookies keep the app running. Optional ones help us
              understand what to improve. You choose.{' '}
              <Link
                href='/cookies'
                className='font-medium text-primary hover:underline'
              >
                Read more
              </Link>
              .
            </p>
          </div>
        </div>
        <div className='mt-4 flex flex-wrap gap-2'>
          <Button
            size='sm'
            className='h-10 rounded-full px-4'
            onClick={() => decide('all')}
          >
            Accept all
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='h-10 rounded-full px-4'
            onClick={() => decide('essential')}
          >
            Essential only
          </Button>
        </div>
      </div>
    </div>
  );
}
