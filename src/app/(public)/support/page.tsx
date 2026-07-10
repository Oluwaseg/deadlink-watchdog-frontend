import { Reveal } from '@/components/public/site/Reveal';
import { Button } from '@/components/ui/button';
import { BookOpen, LifeBuoy, MessageCircle, Send } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support, DeadLink Watchdog',
  description:
    'Get help with DeadLink Watchdog. Docs, live chat, and a real human on email, usually within a few hours.',
  openGraph: {
    title: 'Support, DeadLink Watchdog',
    description: 'Docs, live chat, and email support for DeadLink Watchdog.',
  },
};

const channels = [
  {
    icon: MessageCircle,
    title: 'Live chat',
    body: 'Weekdays, 9am–6pm WAT. Look for the chat bubble in the corner of your dashboard.',
    cta: 'Open chat',
    href: '#',
  },
  {
    icon: Send,
    title: 'Email us',
    body: "For anything that isn't urgent. We usually reply within a few hours.",
    cta: 'hello@deadlinkwatchdog.com',
    href: 'mailto:hello@deadlinkwatchdog.com',
  },
  {
    icon: BookOpen,
    title: 'Documentation',
    body: 'Guides, setup steps, and answers to the questions we get asked most.',
    cta: 'Read the docs',
    href: '#',
  },
];

const faqs = [
  {
    q: 'How often does DeadLink Watchdog check my site?',
    a: 'You pick the cadence per site, anywhere from every 15 minutes to once a week. Paid plans go as often as every minute.',
  },
  {
    q: 'Do you support sites behind login?',
    a: 'Yes. You can add authenticated crawlers with a scoped token so we only see what you want us to see.',
  },
  {
    q: 'Will crawling slow down my server?',
    a: "We rate-limit per host and respect robots.txt. On big sites we default to a gentle 1 request per second, tune it up if you'd rather go faster.",
  },
  {
    q: 'Can I export my data?',
    a: "Any time. CSV and JSON exports are one click, and there's a public API on paid plans.",
  },
];

export default function SupportPage() {
  return (
    <div className='relative overflow-hidden'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-96'
      >
        <div className='absolute inset-0 bg-grid mask-fade-b opacity-40' />
      </div>
      <section className='pt-20 pb-16 sm:pt-28 sm:pb-20'>
        <div className='mx-auto max-w-5xl px-6'>
          <Reveal>
            <div className='inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface'>
              <LifeBuoy className='h-5 w-5 text-primary' />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className='mt-6 text-balance text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl'>
              We're here when you need us.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className='mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground'>
              Pick the channel that suits you. Real humans on the other end, no
              bots pretending to understand.
            </p>
          </Reveal>

          <div className='mt-12 grid gap-4 md:grid-cols-3'>
            {channels.map(({ icon: Icon, title, body, cta, href }, i) => (
              <Reveal key={title} delay={i * 80}>
                <a
                  href={href}
                  className='group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-elegant transition-colors hover:border-primary/40'
                >
                  <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary'>
                    <Icon className='h-5 w-5' />
                  </span>
                  <h3 className='mt-5 text-lg font-semibold text-foreground'>
                    {title}
                  </h3>
                  <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                    {body}
                  </p>
                  <span className='mt-6 inline-flex items-center text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5'>
                    {cta} →
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className='pb-24 sm:pb-32'>
        <div className='mx-auto max-w-3xl px-6'>
          <Reveal>
            <h2 className='text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl'>
              Frequently asked
            </h2>
          </Reveal>
          <div className='mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface'>
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className='group px-6 py-5'>
                  <summary className='flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground'>
                    {f.q}
                    <span
                      aria-hidden
                      className='inline-flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45'
                    >
                      +
                    </span>
                  </summary>
                  <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className='mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-primary p-6 text-primary-foreground'>
              <div>
                <h3 className='text-lg font-semibold'>Still stuck?</h3>
                <p className='mt-1 text-sm text-primary-foreground/80'>
                  Send us the details and we'll get on it.
                </p>
              </div>
              <Button
                asChild
                size='lg'
                variant='secondary'
                className='h-11 rounded-full px-5'
              >
                <a href='mailto:hello@deadlinkwatchdog.com'>Email support</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
