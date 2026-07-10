import { Reveal } from '@/components/public/site/Reveal';
import { Sparkles, Wrench, Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog, DeadLink Watchdog',
  description:
    "What's new in DeadLink Watchdog. Fresh features, fixes, and improvements shipped every week.",
  openGraph: {
    title: 'Changelog, DeadLink Watchdog',
    description:
      'The latest features, fixes, and improvements shipped by the team.',
  },
};

type Kind = 'feature' | 'improvement' | 'fix';
type Entry = {
  version: string;
  date: string;
  title: string;
  items: { kind: Kind; text: string }[];
};

const entries: Entry[] = [
  {
    version: 'v1.4.0',
    date: 'July 8, 2026',
    title: 'Slack alerts and mobile menu overhaul',
    items: [
      {
        kind: 'feature',
        text: 'Slack channel integration for real-time broken link alerts.',
      },
      {
        kind: 'improvement',
        text: 'Full-screen mobile menu with larger tap targets.',
      },
      {
        kind: 'improvement',
        text: 'Accessibility button with text size and reduced motion controls.',
      },
    ],
  },
  {
    version: 'v1.3.2',
    date: 'June 27, 2026',
    title: 'Faster crawls, calmer dashboard',
    items: [
      {
        kind: 'improvement',
        text: 'Crawler is 34% faster on sites with 10k+ pages.',
      },
      {
        kind: 'fix',
        text: 'Health score no longer flickers while a new crawl is running.',
      },
      {
        kind: 'fix',
        text: "Fixed an edge case where PDF links weren't being followed.",
      },
    ],
  },
  {
    version: 'v1.3.0',
    date: 'June 12, 2026',
    title: 'Nigerian-hosted probes',
    items: [
      {
        kind: 'feature',
        text: 'New probe location in Lagos for realistic response times.',
      },
      { kind: 'feature', text: 'Currency-aware pricing for local plans.' },
      { kind: 'improvement', text: 'Cleaner report exports (CSV + JSON).' },
    ],
  },
  {
    version: 'v1.2.0',
    date: 'May 21, 2026',
    title: 'Health score v2',
    items: [
      {
        kind: 'feature',
        text: 'Redesigned health score with per-section breakdowns.',
      },
      {
        kind: 'improvement',
        text: "Weekly digest email summarising your site's health.",
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
              <Reveal key={entry.version} delay={i * 60}>
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
                    <span className='inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-semibold text-foreground'>
                      {entry.version}
                    </span>
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
