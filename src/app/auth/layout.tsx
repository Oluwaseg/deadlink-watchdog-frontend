import { Activity, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

const pulseRows = [
  { site: 'gtbank.com.ng', ms: 128, status: '200' },
  { site: 'jumia.com.ng', ms: 214, status: '200' },
  { site: 'nairaland.com', ms: 92, status: '200' },
  { site: 'flutterwave.com', ms: 143, status: '200' },
];

export default function AuthLayout({
  children,
  eyebrow = 'Secure access',
  title,
  description,
  footnote,
}: {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  footnote?: ReactNode;
}) {
  return (
    <div className='relative min-h-dvh overflow-hidden bg-background text-foreground'>
      {/* Ambient background */}
      <div aria-hidden className='pointer-events-none absolute inset-0'>
        <div className='absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-primary-soft)_0%,transparent_70%)] opacity-60' />
        <div
          className='absolute inset-0 opacity-[0.35]'
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage:
              'radial-gradient(ellipse at center, black 40%, transparent 75%)',
          }}
        />
        <div className='absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-secondary/20 blur-3xl' />
        <div className='absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl' />
      </div>

      {/* Top rail */}
      <header className='relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8'>
        <Link href='/' className='inline-flex items-center gap-2.5'>
          <span className='relative inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-foreground text-background'>
            <Activity className='h-4 w-4' strokeWidth={2.6} />
          </span>
          <span className='flex flex-col leading-tight'>
            <span className='text-[13px] font-semibold tracking-tight'>
              DeadLink Watchdog
            </span>
            <span className='font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground'>
              /auth
            </span>
          </span>
        </Link>
        <Link
          href='/'
          className='group inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface/70 px-3 py-1.5 text-[11px] font-medium text-muted-foreground backdrop-blur transition-colors hover:border-border-strong hover:text-foreground'
        >
          <ArrowLeft className='h-3 w-3 transition-transform group-hover:-translate-x-0.5' />
          Back to site
        </Link>
      </header>

      {/* Center stage */}
      <main className='relative z-10 mx-auto flex w-full max-w-[520px] flex-col items-center px-5 pb-16 pt-6 sm:px-8'>
        {/* Status pill */}
        <div className='mb-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/80 px-3 py-1.5 shadow-elegant backdrop-blur'>
          <span className='relative inline-flex h-1.5 w-1.5'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70 opacity-75' />
            <span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-success' />
          </span>
          <span className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
            Live · Lagos edge · 99.98% uptime
          </span>
        </div>

        {/* Heading */}
        <div className='mb-8 w-full text-center'>
          <div className='mb-4 inline-flex items-center gap-2'>
            <span className='h-px w-6 bg-foreground/40' />
            <span className='font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground'>
              {eyebrow}
            </span>
            <span className='h-px w-6 bg-foreground/40' />
          </div>
          <h1 className='font-display text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[2.75rem]'>
            {title}
          </h1>
          {description && (
            <p className='mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground'>
              {description}
            </p>
          )}
        </div>

        {/* Form card with corner ticks */}
        <div className='relative w-full'>
          <span
            aria-hidden
            className='absolute -left-1.5 -top-1.5 h-3 w-3 border-l border-t border-foreground/40'
          />
          <span
            aria-hidden
            className='absolute -right-1.5 -top-1.5 h-3 w-3 border-r border-t border-foreground/40'
          />
          <span
            aria-hidden
            className='absolute -bottom-1.5 -left-1.5 h-3 w-3 border-b border-l border-foreground/40'
          />
          <span
            aria-hidden
            className='absolute -bottom-1.5 -right-1.5 h-3 w-3 border-b border-r border-foreground/40'
          />

          <div className='rounded-2xl border border-border bg-surface p-6 shadow-elegant sm:p-8'>
            {children}
          </div>
        </div>

        {/* Legal / footnote */}
        {footnote ? (
          <div className='mt-6 text-center text-[13px] text-muted-foreground'>
            {footnote}
          </div>
        ) : (
          <p className='mt-6 max-w-sm text-center text-[12px] leading-relaxed text-muted-foreground'>
            By continuing you agree to our{' '}
            <Link
              href='/terms'
              className='font-medium text-foreground underline-offset-4 hover:underline'
            >
              Terms
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='font-medium text-foreground underline-offset-4 hover:underline'
            >
              Privacy Policy
            </Link>
            .
          </p>
        )}

        {/* Trust bar */}
        <div className='mt-10 flex w-full flex-col items-center gap-4'>
          <div className='flex items-center gap-2 text-[11px] text-muted-foreground'>
            <ShieldCheck className='h-3.5 w-3.5 text-success' />
            <span className='font-mono uppercase tracking-[0.2em]'>
              Encrypted · SOC-ready · Made in Nigeria
            </span>
          </div>

          {/* Live pulse strip */}
          <div className='w-full max-w-md rounded-2xl border border-border/70 bg-surface/60 p-4 backdrop-blur'>
            <div className='mb-3 flex items-center justify-between'>
              <span className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                Live checks
              </span>
              <span className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                last 30s
              </span>
            </div>
            <ul className='divide-y divide-border/60'>
              {pulseRows.map((row) => (
                <li
                  key={row.site}
                  className='grid grid-cols-[1fr_auto_auto] items-center gap-4 py-2 font-mono text-[11px]'
                >
                  <span className='truncate text-foreground/85'>
                    {row.site}
                  </span>
                  <span className='tabular-nums text-muted-foreground'>
                    {row.ms}ms
                  </span>
                  <span className='inline-flex h-5 items-center rounded-full bg-success/15 px-2 text-[10px] font-semibold text-success'>
                    {row.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
