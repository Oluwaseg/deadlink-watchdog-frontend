import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '../Reveal';

const bullets = [
  'Monitor up to 3 websites',
  'Run manual crawls or schedule daily, weekly, or monthly checks',
  'Get email alerts when a notification address is configured',
  'Review health scores, crawl history, and broken-link details',
];

export function PricingPreview() {
  return (
    <section className='py-24 sm:py-32'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='relative overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-elegant sm:p-12'>
          <div
            aria-hidden
            className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl'
          />
          <div className='grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center'>
            <Reveal>
              <p className='text-sm font-medium uppercase tracking-[0.14em] text-primary'>
                Pricing
              </p>
              <h2 className='mt-3 text-balance text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl lg:text-[44px]'>
                Monitor up to 3 websites for free.
              </h2>
              <p className='mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground'>
                The Free plan is available now during early access, with no
                payment required. Pro and Enterprise are planned for later and
                are not available yet.
              </p>
              <div className='mt-8'>
                <Button
                  asChild
                  size='lg'
                  className='group h-12 rounded-full px-6'
                >
                  <Link href='/pricing'>
                    Compare plans
                    <ArrowRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className='rounded-2xl border border-border bg-background p-6'>
                <div className='flex items-baseline justify-between'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Free plan
                    </p>
                    <p className='mt-1 text-3xl font-semibold tracking-tight text-foreground'>
                      ₦0{' '}
                      <span className='text-base font-normal text-muted-foreground'>
                        / during early access
                      </span>
                    </p>
                  </div>
                  <span className='inline-flex items-center rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-accent-foreground'>
                    Available now
                  </span>
                </div>
                <ul className='mt-6 space-y-3'>
                  {bullets.map((b) => (
                    <li
                      key={b}
                      className='flex items-start gap-2.5 text-sm text-foreground'
                    >
                      <Check className='mt-0.5 h-4 w-4 shrink-0 text-primary' />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
