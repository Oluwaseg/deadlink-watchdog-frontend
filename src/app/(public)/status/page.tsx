import { Reveal } from '@/components/public/site/Reveal';
import { CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Status, DeadLink Watchdog',
  description:
    'Live status of DeadLink Watchdog services, crawlers, dashboards, alerts, and API.',
  openGraph: {
    title: 'System Status, DeadLink Watchdog',
    description:
      'Live status of DeadLink Watchdog services and recent incidents.',
  },
};

const services = [
  { name: 'Web dashboard', uptime: '99.99%' },
  { name: 'Crawler workers', uptime: '99.97%' },
  { name: 'Alerts (email + Slack)', uptime: '99.98%' },
  { name: 'Public API', uptime: '99.96%' },
  { name: 'Marketing site', uptime: '100.00%' },
];

const history = [
  { date: 'July 8, 2026', title: 'No incidents reported.' },
  { date: 'July 7, 2026', title: 'No incidents reported.' },
  {
    date: 'July 6, 2026',
    title:
      'Scheduled maintenance on the crawler queue, 04:00–04:20 WAT. Completed on time.',
  },
  { date: 'July 5, 2026', title: 'No incidents reported.' },
  { date: 'July 4, 2026', title: 'No incidents reported.' },
];

export default function StatusPage() {
  return (
    <div className='relative overflow-hidden'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-96'
      >
        <div className='absolute inset-0 bg-grid mask-fade-b opacity-40' />
      </div>
      <section className='pt-20 pb-24 sm:pt-28 sm:pb-32'>
        <div className='mx-auto max-w-4xl px-6'>
          <Reveal>
            <p className='text-sm font-medium uppercase tracking-[0.14em] text-primary'>
              Status
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className='mt-3 text-balance text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl'>
              All systems operational.
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <div className='mt-8 flex items-center gap-3 rounded-2xl border border-border bg-success/10 p-5'>
              <span className='relative flex h-3 w-3'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70' />
                <span className='relative inline-flex h-3 w-3 rounded-full bg-success' />
              </span>
              <p className='text-sm font-medium text-foreground'>
                Everything is running smoothly. Last checked a moment ago.
              </p>
            </div>
          </Reveal>

          <div className='mt-14'>
            <Reveal>
              <h2 className='text-xs font-semibold uppercase tracking-[0.14em] text-foreground'>
                Services
              </h2>
            </Reveal>
            <div className='mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface'>
              {services.map((s, i) => (
                <Reveal key={s.name} delay={i * 40}>
                  <div className='flex items-center justify-between gap-4 px-5 py-4'>
                    <div className='flex items-center gap-3'>
                      <CheckCircle2 className='h-5 w-5 text-success' />
                      <span className='text-sm font-medium text-foreground'>
                        {s.name}
                      </span>
                    </div>
                    <div className='flex items-center gap-4'>
                      <span className='hidden text-xs text-muted-foreground sm:inline'>
                        90-day uptime
                      </span>
                      <span className='font-mono text-sm text-foreground'>
                        {s.uptime}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className='mt-14'>
            <Reveal>
              <h2 className='text-xs font-semibold uppercase tracking-[0.14em] text-foreground'>
                Past 5 days
              </h2>
            </Reveal>
            <ul className='mt-4 space-y-4'>
              {history.map((h, i) => (
                <Reveal key={h.date} delay={i * 40}>
                  <li className='rounded-2xl border border-border bg-surface p-5'>
                    <time className='text-xs uppercase tracking-[0.14em] text-muted-foreground'>
                      {h.date}
                    </time>
                    <p className='mt-2 text-sm text-foreground'>{h.title}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
