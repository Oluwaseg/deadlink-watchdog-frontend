import { Button } from '@/components/ui/button';
import {
  IconActivity,
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandTwitter,
  IconMail,
} from '@tabler/icons-react';
import Link from 'next/link';
import { ScrollLink } from './ScrollLink';

const nav = {
  Product: [
    { label: 'Home', to: '/' as const },
    { label: 'Pricing', to: '/pricing' as const },
    { label: 'About', to: '/about' as const },
  ],
  Resources: [
    { label: 'How it works', scrollId: 'how-it-works' },
    { label: 'Health score', scrollId: 'how-it-works' },
    { label: 'Changelog', href: '/changelog' },
  ],
  Company: [
    { label: 'Support', scrollId: 'support' },
    // { label: 'Support', href: '/support' },
    { label: 'Contact', href: 'mailto:hello@deadlinkwatchdog.com' },
    { label: 'Status', href: '/status' },
    { label: 'Cookie preferences', href: '/cookies' },
  ],
};

export function Footer() {
  return (
    <footer className='relative overflow-hidden border-t border-border bg-surface-muted/60'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent'
      />

      <div className='mx-auto max-w-6xl px-6 pt-20 pb-10'>
        {/* CTA strip */}
        <div className='relative overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-elegant sm:p-10'>
          <div
            aria-hidden
            className='pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl'
          />
          <div
            aria-hidden
            className='pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-secondary/25 blur-3xl'
          />
          <div className='relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center'>
            <div>
              <h3 className='text-balance text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl'>
                Ready to catch every broken link?
              </h3>
              <p className='mt-2 max-w-lg text-sm text-muted-foreground'>
                Free while in early access. No card required. Set up in under 2
                minutes.
              </p>
            </div>
            <Button
              size='lg'
              className='group h-12 rounded-full px-6 shadow-elegant hover:shadow-glow'
              onClick={() => {
                const element = document.getElementById('cta');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start Monitoring Free
              <IconArrowUpRight className='ml-1 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
            </Button>
          </div>
        </div>

        {/* Main footer */}
        <div className='mt-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]'>
          <div>
            <Link
              href='/'
              className='inline-flex items-center gap-2.5 font-semibold tracking-tight'
            >
              <span className='relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elegant ring-1 ring-primary/20'>
                <IconActivity className='h-4 w-4' stroke={2.5} />
                <span className='absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-secondary ring-2 ring-surface-muted' />
              </span>
              <span className='text-base'>DeadLink Watchdog</span>
            </Link>
            <p className='mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground'>
              Around-the-clock link monitoring tuned for Nigerian websites.
              Catch broken links before your users do.
            </p>
            <div className='mt-6 flex items-center gap-2'>
              {[
                { icon: IconBrandTwitter, label: 'Twitter', href: '#' },
                { icon: IconBrandGithub, label: 'GitHub', href: '#' },
                {
                  icon: IconMail,
                  label: 'Email',
                  href: 'mailto:hello@deadlinkwatchdog.com',
                },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary'
                >
                  <Icon className='h-4 w-4' />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(nav).map(([heading, items]) => (
            <div key={heading}>
              <h4 className='text-xs font-semibold uppercase tracking-[0.14em] text-foreground'>
                {heading}
              </h4>
              <ul className='mt-5 space-y-3 text-sm text-muted-foreground'>
                {items.map((item) =>
                  'to' in item ? (
                    <li key={item.label}>
                      <Link
                        href={item.to}
                        className='transition-colors hover:text-foreground'
                      >
                        {item.label}
                      </Link>
                    </li>
                  ) : 'scrollId' in item ? (
                    <li key={item.label}>
                      <ScrollLink
                        id={item.scrollId}
                        className='transition-colors hover:text-foreground text-left'
                      >
                        {item.label}
                      </ScrollLink>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className='transition-colors hover:text-foreground'
                      >
                        {item.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center'>
          <p>
            © {new Date().getFullYear()} DeadLink Watchdog. Built in Nigeria,
            for Nigeria.
          </p>
          <div className='flex items-center gap-4'>
            <span className='inline-flex items-center gap-2'>
              <span className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70' />
                <span className='relative inline-flex h-2 w-2 rounded-full bg-success' />
              </span>
              All systems operational
            </span>
            <a href='/privacy' className='hover:text-foreground'>
              Privacy
            </a>
            <a href='/terms' className='hover:text-foreground'>
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
