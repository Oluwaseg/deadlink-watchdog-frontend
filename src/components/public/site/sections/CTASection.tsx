import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '../Reveal';

export function CTASection() {
  return (
    <section
      id='cta'
      className='relative overflow-hidden border-t border-border bg-foreground py-24 text-background sm:py-32'
    >
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.08]'
      >
        <div className='absolute inset-0 bg-grid' />
      </div>
      <div
        aria-hidden
        className='pointer-events-none absolute left-1/2 top-0 h-64 w-[900px] -translate-x-1/2 rounded-full bg-primary/40 blur-3xl'
      />
      <div className='relative mx-auto max-w-4xl px-6 text-center'>
        <Reveal>
          <h2 className='text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl lg:text-6xl'>
            Your site has broken links right now. You just don't know which ones
            yet.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <div className='mt-10 flex flex-wrap items-center justify-center gap-3'>
            <Button
              asChild
              size='lg'
              className='group h-12 rounded-full bg-background px-6 text-foreground hover:bg-background/90'
            >
              <Link href='/auth/register'>
                Find Out Free
                <ArrowRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
