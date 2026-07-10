import { Button } from '@/components/ui/button';
import { Coffee } from 'lucide-react';
import { Reveal } from '../Reveal';

export function SupportSection() {
  return (
    <section id='support' className='py-24'>
      <div className='mx-auto max-w-3xl px-6 text-center'>
        <Reveal>
          <div className='inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface'>
            <Coffee className='h-5 w-5 text-primary' />
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className='mt-6 text-balance text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl'>
            Like what we're building?
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className='mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground'>
            DeadLink Watchdog is free to use today, run by a small team that'd
            rather spend time shipping features than chasing sponsors. If it's
            saved you from an embarrassing 404, you can help keep it running.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className='mt-8'>
            <Button
              asChild
              size='lg'
              variant='outline'
              className='h-12 rounded-full border-border-strong bg-surface px-6 shadow-elegant hover:bg-primary-soft/60'
            >
              <a
                href='https://selar.com/showlove/oluwaseg'
                target='_blank'
                rel='noreferrer'
              >
                Show Some Love ☕
              </a>
            </Button>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <p className='mt-5 text-sm italic text-muted-foreground'>
            Every bit goes straight back into keeping your sites monitored.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
