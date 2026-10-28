import { Reveal } from '@/components/public/site/Reveal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Check } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing, DeadLink Watchdog',
  description:
    'Monitor up to 3 websites for free during early access. Pro and Enterprise plans are planned for later.',
  openGraph: {
    title: 'Pricing, DeadLink Watchdog',
    description:
      'Monitor up to 3 websites for free during early access. Pro and Enterprise are coming later.',
  },
};

interface Plan {
  name: string;
  tagline: string;
  status: string;
  featured?: boolean;
  features: string[];
  cta: string;
  href: string;
}

const plans: Plan[] = [
  {
    name: 'Free',
    tagline: 'For getting started',
    status: 'Available now',
    features: [
      'Monitor up to 3 websites for free during early access.',
      'Run manual crawls or schedule daily, weekly, or monthly checks',
      'Email alerts when a notification address is configured',
      'Health scores, crawl history, and broken-link details',
    ],
    cta: 'Start free, no card needed',
    href: '/auth/register',
  },
  {
    name: 'Pro',
    tagline: "For teams who can't afford surprises",
    status: 'Coming soon',
    featured: true,
    features: [
      'Up to 25 monitored websites',
      'Weekly or daily scheduled crawls',
      'Email and webhook notifications',
      '30-day data retention',
      'Priority support and custom crawler settings',
      'Advanced reporting and API access',
    ],
    cta: 'Ask about Pro',
    href: '/#contact',
  },
  {
    name: 'Enterprise',
    tagline: 'For organizations where downtime is a headline risk',
    status: 'Coming soon',
    features: [
      'Unlimited monitored websites',
      'Custom crawl schedules and integrations',
      'Email, webhook, and custom notifications',
      '90-day data retention',
      'Dedicated support and SLA options',
      'White-label reports and multi-user access',
    ],
    cta: 'Discuss Enterprise',
    href: '/#contact',
  },
];

export default function PricingPage() {
  return (
    <div className='relative overflow-hidden'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-96'
      >
        <div className='absolute inset-0 bg-grid mask-fade-b opacity-40' />
      </div>

      <section className='pt-20 pb-10 sm:pt-28'>
        <div className='mx-auto max-w-3xl px-6 text-center'>
          <Reveal>
            <h1 className='text-balance text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl'>
              Simple pricing. Built to grow with you.
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p className='mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground'>
              The Free plan is available now during early access, with no
              payment required. Pro and Enterprise are planned for later and are
              not available yet.
            </p>
          </Reveal>
        </div>
      </section>

      <section className='pb-24 sm:pb-32'>
        <div className='mx-auto max-w-6xl px-6'>
          <div className='grid gap-6 lg:grid-cols-3'>
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 80}>
                <article
                  className={cn(
                    'relative flex h-full flex-col rounded-3xl border p-8 shadow-elegant transition-all hover:-translate-y-0.5',
                    plan.featured
                      ? 'border-primary/40 bg-surface ring-1 ring-primary/20'
                      : 'border-border bg-surface'
                  )}
                >
                  <header>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-xl font-semibold tracking-tight text-foreground'>
                        {plan.name}
                      </h2>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                          plan.status === 'Available now'
                            ? 'bg-primary-soft text-accent-foreground'
                            : 'border border-border bg-background text-muted-foreground'
                        )}
                      >
                        {plan.status}
                      </span>
                    </div>
                    <p className='mt-2 text-sm text-muted-foreground'>
                      {plan.tagline}
                    </p>
                  </header>

                  <ul className='mt-8 flex-1 space-y-3'>
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className='flex items-start gap-2.5 text-[15px] text-foreground'
                      >
                        <Check className='mt-0.5 h-4 w-4 shrink-0 text-primary' />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className='mt-8'>
                    <Button
                      asChild
                      className={cn(
                        'group h-11 w-full rounded-full',
                        !plan.featured &&
                          'bg-foreground text-background hover:bg-foreground/90'
                      )}
                    >
                      <Link href={plan.href}>
                        {plan.cta}
                        <ArrowRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                      </Link>
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={280}>
            <p className='mx-auto mt-12 max-w-2xl text-center text-sm text-muted-foreground'>
              Pro and Enterprise are planned tiers, not current subscriptions.
              Their prices and release dates have not been announced.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
