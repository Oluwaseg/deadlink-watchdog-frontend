import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  children: ReactNode;
}) {
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
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className='mt-3 text-balance text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl'>
              {title}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className='mt-4 text-sm text-muted-foreground'>
              Last updated {updated}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className='mt-8 text-pretty text-lg leading-relaxed text-muted-foreground'>
              {intro}
            </p>
          </Reveal>
          <div className='mt-10 space-y-10 text-pretty text-base leading-relaxed text-muted-foreground'>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section>
        <h2 className='text-xl font-semibold tracking-tight text-foreground sm:text-2xl'>
          {title}
        </h2>
        <div className='mt-4 space-y-4'>{children}</div>
      </section>
    </Reveal>
  );
}
