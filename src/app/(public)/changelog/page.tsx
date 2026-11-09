import { Reveal } from '@/components/public/site/Reveal';
import { Sparkles, Wrench, Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog, DeadLink Watchdog',
  description:
    'A running history of shipped features, fixes, and improvements to DeadLink Watchdog.',
  openGraph: {
    title: 'Changelog, DeadLink Watchdog',
    description:
      'A running history of shipped features, fixes, and improvements to DeadLink Watchdog.',
  },
};

type Kind = 'feature' | 'improvement' | 'fix';
type Entry = {
  date: string;
  title: string;
  items: { kind: Kind; text: string }[];
};

const entries: Entry[] = [
  {
    date: 'November 8, 2026',
    title: 'Queue visibility and reliable scheduling',
    items: [
      {
        kind: 'improvement',
        text: 'Admin queue jobs show the monitored website, job owner, trigger type, start time, and current progress.',
      },
      {
        kind: 'improvement',
        text: 'Recurring crawls avoid overlapping runs and retry temporary scheduling contention.',
      },
      {
        kind: 'improvement',
        text: 'Dashboard and admin data refresh after realtime events, with periodic polling to recover missed updates.',
      },
    ],
  },
  {
    date: 'November 6, 2026',
    title: 'Better crawl follow-up and analytics',
    items: [
      {
        kind: 'improvement',
        text: 'Scheduled crawls recheck known broken links and mark them fixed only after a successful check.',
      },
      {
        kind: 'improvement',
        text: 'Crawl email reports include clearer results and follow-up details.',
      },
      {
        kind: 'improvement',
        text: 'Admin analytics include daily website and user statistics with consistent date handling.',
      },
    ],
  },
  {
    date: 'November 5, 2026',
    title: 'Deployment and configuration hardening',
    items: [
      {
        kind: 'feature',
        text: 'Added a Docker image and documented Docker Compose deployment.',
      },
      {
        kind: 'improvement',
        text: 'Redis connection settings now use a validated REDIS_URL configuration.',
      },
      {
        kind: 'improvement',
        text: 'Trusted proxy hop configuration is explicit and covered by tests.',
      },
    ],
  },
  {
    date: 'October 26, 2026',
    title: 'Controlled crawl concurrency',
    items: [
      {
        kind: 'improvement',
        text: 'Crawl workers enforce per-user execution limits so one account cannot occupy all crawl slots.',
      },
    ],
  },
  {
    date: 'October 24, 2026',
    title: 'Live crawl updates and notifications',
    items: [
      {
        kind: 'feature',
        text: 'Crawl progress, completion, and failure events are delivered to authenticated users in real time.',
      },
      {
        kind: 'feature',
        text: 'Added in-app notifications for completed and failed crawls.',
      },
    ],
  },
  {
    date: 'October 23, 2025',
    title: 'A more resilient crawler',
    items: [
      {
        kind: 'improvement',
        text: 'Transient crawl failures can be retried with exponential backoff.',
      },
      {
        kind: 'improvement',
        text: 'Added URL safety checks, per-domain throttling, and clearer error classification.',
      },
      {
        kind: 'improvement',
        text: 'Link checks use controlled concurrency and caching to reduce redundant work.',
      },
    ],
  },
  {
    date: 'June 18, 2025',
    title: 'Admin monitoring tools',
    items: [
      {
        kind: 'feature',
        text: 'Added an admin dashboard for system statistics, user management, queue activity, and analytics.',
      },
    ],
  },
  {
    date: 'June 10, 2025',
    title: 'Dashboard and account settings',
    items: [
      {
        kind: 'feature',
        text: 'Introduced the signed-in dashboard for managing websites and reviewing crawl results.',
      },
      {
        kind: 'feature',
        text: 'Added account settings for profile information and password changes.',
      },
    ],
  },
];

const kindMeta: Record<
  Kind,
  { label: string; icon: typeof Sparkles; className: string }
> = {
  feature: {
    label: 'New',
    icon: Sparkles,
    className: 'bg-primary-soft text-primary',
  },
  improvement: {
    label: 'Improved',
    icon: Zap,
    className: 'bg-secondary-soft text-secondary-foreground',
  },
  fix: {
    label: 'Fixed',
    icon: Wrench,
    className: 'bg-surface-muted text-foreground',
  },
};

export default function ChangelogPage() {
  return (
    <div className='relative overflow-hidden'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-96'
      >
        <div className='absolute inset-0 bg-grid mask-fade-b opacity-40' />
      </div>
      <section className='pt-20 pb-24 sm:pt-28 sm:pb-32'>
        <div className='mx-auto max-w-3xl px-6'>
          <Reveal>
            <p className='text-sm font-medium uppercase tracking-[0.14em] text-primary'>
              Changelog
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className='mt-3 text-balance text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl'>
              What we've been shipping.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className='mt-5 text-pretty text-lg leading-relaxed text-muted-foreground'>
              Small team, steady cadence. Here's what's new.
            </p>
          </Reveal>

          <div className='mt-16 space-y-14'>
            {entries.map((entry, i) => (
              <Reveal key={entry.date} delay={i * 60}>
                <article className='relative pl-8 sm:pl-10'>
                  <span
                    aria-hidden
                    className='absolute left-0 top-2 inline-flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-primary/15'
                  />
                  <span
                    aria-hidden
                    className='absolute left-[5px] top-8 h-[calc(100%-1rem)] w-px bg-border'
                  />
                  <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
                    <time className='text-xs uppercase tracking-[0.14em] text-muted-foreground'>
                      {entry.date}
                    </time>
                  </div>
                  <h2 className='mt-3 text-2xl font-semibold tracking-[-0.02em] text-foreground'>
                    {entry.title}
                  </h2>
                  <ul className='mt-5 space-y-3'>
                    {entry.items.map((item, idx) => {
                      const meta = kindMeta[item.kind];
                      const Icon = meta.icon;
                      return (
                        <li key={idx} className='flex items-start gap-3'>
                          <span
                            className={`inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-[11px] font-semibold uppercase tracking-wide ${meta.className}`}
                          >
                            <Icon className='h-3 w-3' />
                            {meta.label}
                          </span>
                          <p className='text-base leading-relaxed text-muted-foreground'>
                            {item.text}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
