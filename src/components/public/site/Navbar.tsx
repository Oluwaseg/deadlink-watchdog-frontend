'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Activity, ArrowRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ScrollLink } from './ScrollLink';

const links = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className='sticky top-0 z-50 w-full'>
      <div className='mx-auto max-w-6xl px-4 pt-3 sm:px-6 sm:pt-4'>
        <div
          className={cn(
            'relative flex h-14 items-center justify-between gap-4 rounded-2xl border px-3 pl-4 transition-all duration-300',
            scrolled
              ? 'border-border/70 bg-background/85 shadow-elegant backdrop-blur-xl supports-[backdrop-filter]:bg-background/70'
              : 'border-transparent bg-transparent'
          )}
        >
          <Link
            href='/'
            className='group inline-flex items-center gap-2.5 font-semibold tracking-tight'
          >
            <span className='relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elegant ring-1 ring-primary/20'>
              <Activity className='h-4 w-4' strokeWidth={2.5} />
              <span className='absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-secondary ring-2 ring-background' />
            </span>
            <span className='text-[15px]'>
              DeadLink <span className='text-muted-foreground'>Watchdog</span>
            </span>
          </Link>

          <nav aria-label='Primary' className='hidden md:block'>
            <ul className='flex items-center gap-0.5 text-sm'>
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        'relative inline-flex h-9 items-center rounded-lg px-3 font-medium transition-colors',
                        active
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {l.label}
                      {active && (
                        <span className='absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-primary' />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className='hidden items-center gap-2 md:flex'>
            <Button
              asChild
              variant='ghost'
              size='sm'
              className='h-9 rounded-lg text-muted-foreground hover:text-foreground'
            >
              <Link href='/auth/login'>Sign in</Link>
            </Button>
            <ScrollLink
              id='cta'
              className='group inline-flex h-9 items-center rounded-lg bg-primary px-3.5 shadow-elegant hover:bg-primary/95 hover:shadow-glow text-sm font-medium text-primary-foreground'
            >
              Start Free
              <ArrowRight className='ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5' />
            </ScrollLink>
          </div>

          <button
            type='button'
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className='inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 bg-surface md:hidden'
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>
      </div>

      {open && (
        <div className='fixed inset-0 z-[70] md:hidden animate-reveal-fade-in'>
          <div className='absolute inset-0 bg-background' />
          <button
            type='button'
            aria-label='Close menu'
            onClick={() => setOpen(false)}
            className='absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-elegant'
          >
            <X className='h-5 w-5' />
          </button>
          <div className='relative flex h-dvh flex-col px-6 pt-24 pb-10'>
            <nav aria-label='Mobile' className='flex flex-col gap-1'>
              {links.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className={cn(
                    'animate-reveal-fade-up rounded-xl px-4 py-4 text-2xl font-semibold tracking-tight transition-colors',
                    pathname === l.href
                      ? 'bg-primary-soft text-accent-foreground'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className='mt-auto flex flex-col gap-3 pt-8'>
              <Button
                asChild
                variant='outline'
                size='lg'
                className='h-12 w-full rounded-xl text-base'
              >
                <Link href='/auth/login'>Sign in</Link>
              </Button>
              <ScrollLink
                id='cta'
                className='inline-flex h-12 w-full items-center justify-center rounded-xl text-base font-medium shadow-elegant bg-primary text-primary-foreground hover:bg-primary/95'
              >
                Start Monitoring Free
                <ArrowRight className='ml-1.5 h-4 w-4' />
              </ScrollLink>
              <p className='pt-2 text-center text-xs text-muted-foreground'>
                DeadLink Watchdog · Built in Nigeria
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
