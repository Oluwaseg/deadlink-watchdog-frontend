import { Reveal } from '@/components/public/site/Reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About, DeadLink Watchdog',
  description:
    "We built the tool we couldn't find. DeadLink Watchdog is link monitoring tuned for Nigerian websites.",
  openGraph: {
    title: 'About, DeadLink Watchdog',
    description:
      'Why we built DeadLink Watchdog, link monitoring tuned for Nigerian websites.',
  },
};

export default function AboutPage() {
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
              About
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className='mt-3 text-balance text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl'>
              We built the tool we couldn't find.
            </h1>
          </Reveal>

          <div className='mt-10 space-y-6 text-pretty text-lg leading-relaxed text-muted-foreground'>
            <Reveal delay={140}>
              <p>
                Every Nigerian website eventually accumulates dead weight, a
                payment link that moved, a government form that got renamed, an
                old blog post pointing to a page that no longer exists.
                Somewhere, a visitor hits that link, gets a blank page, and
                quietly leaves.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p>
                The tools that exist to catch this were built for someone else's
                internet - someone else's hosting, someone else's connectivity
                assumptions, someone else's currency.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <p>
                DeadLink Watchdog exists so that doesn't have to be your problem
                to solve alone. Point it at your site, tell it how often to
                look, and get back to building the thing your site was actually
                meant to do.
              </p>
            </Reveal>
          </div>

          <Reveal delay={340}>
            <div className='mt-12'>
              <Button
                asChild
                size='lg'
                className='group h-12 rounded-full px-6'
              >
                <Link href='/'>
                  Try It on Your Site
                  <ArrowRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
