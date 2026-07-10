'use client';
import { Reveal } from '@/components/public/site/Reveal';
import { CheckCircle2, Mail, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3500);
    }, 900);
  };

  return (
    <section id='contact' className='relative py-24 sm:py-32'>
      <div className='absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent' />
      <div className='mx-auto max-w-6xl px-6'>
        <div className='grid gap-12 lg:grid-cols-2 lg:gap-16 items-start'>
          <Reveal>
            <div className='space-y-6'>
              <span className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                <MessageSquare className='h-3.5 w-3.5' />
                Get in touch
              </span>
              <h2 className='text-4xl sm:text-5xl font-bold tracking-tight'>
                Questions? We're{' '}
                <span className='text-primary'>here to help.</span>
              </h2>
              <p className='text-lg text-muted-foreground leading-relaxed'>
                Whether you're evaluating DeadLink Watchdog for your team or
                need help with a specific setup, drop us a line and we'll get
                back within one business day.
              </p>
              <div className='space-y-4 pt-4'>
                <a
                  href='mailto:hello@deadlinkwatchdog.com'
                  className='flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors'
                >
                  <span className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <Mail className='h-5 w-5' />
                  </span>
                  hello@deadlinkwatchdog.com
                </a>
                <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                  <span className='flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 text-secondary-foreground'>
                    <span className='relative flex h-2.5 w-2.5'>
                      <span className='absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping' />
                      <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-primary' />
                    </span>
                  </span>
                  Avg. response time: under 4 hours
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form
              onSubmit={onSubmit}
              className='relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur p-6 sm:p-8 shadow-lg'
            >
              <div className='space-y-5'>
                <div className='space-y-2'>
                  <label htmlFor='name' className='text-sm font-medium'>
                    Name
                  </label>
                  <input
                    id='name'
                    type='text'
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder='Ada Lovelace'
                    className='w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'
                  />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='email' className='text-sm font-medium'>
                    Email
                  </label>
                  <input
                    id='email'
                    type='email'
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder='you@company.com'
                    className='w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'
                  />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='message' className='text-sm font-medium'>
                    Message
                  </label>
                  <textarea
                    id='message'
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Tell us about your site and what you're trying to monitor..."
                    className='w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'
                  />
                </div>
                <button
                  type='submit'
                  disabled={status !== 'idle'}
                  className='group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 disabled:opacity-70'
                >
                  {status === 'sent' ? (
                    <>
                      <CheckCircle2 className='h-4 w-4' />
                      Message sent
                    </>
                  ) : status === 'sending' ? (
                    'Sending...'
                  ) : (
                    <>
                      Send message
                      <Send className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                    </>
                  )}
                </button>
                <p className='text-center text-xs text-muted-foreground'>
                  By submitting, you agree to our privacy policy. We'll never
                  share your email.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
