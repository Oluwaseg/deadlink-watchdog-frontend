import { LegalPage, LegalSection } from '@/components/public/site/LegalPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service, DeadLink Watchdog',
  description:
    'The terms that govern your use of DeadLink Watchdog. Short, readable, and fair.',
  openGraph: {
    title: 'Terms of Service, DeadLink Watchdog',
    description: 'The terms that govern your use of DeadLink Watchdog.',
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow='Legal'
      title='Terms of Service'
      updated='July 10, 2026'
      intro="By using DeadLink Watchdog you agree to these terms. We've kept them short so you'll actually read them."
    >
      <LegalSection title='Your account'>
        <p>
          You're responsible for keeping your login details safe and for
          anything that happens on your account. Let us know right away if you
          think someone else has access.
        </p>
      </LegalSection>
      <LegalSection title='What you can monitor'>
        <p>
          You may only add sites you own or have explicit permission to monitor.
          Don't use the service to overwhelm someone else's server, to scrape at
          scale, or to do anything illegal.
        </p>
      </LegalSection>
      <LegalSection title='Availability'>
        <p>
          We work hard to keep DeadLink Watchdog running around the clock, but
          we can't promise zero downtime. When something breaks, we post updates
          on our status page and get it fixed as fast as we can.
        </p>
      </LegalSection>
      <LegalSection title='Payments and refunds'>
        <p>
          Paid plans are billed monthly or annually in advance. Cancel anytime,
          we won't charge you for the next cycle. If something's genuinely gone
          wrong, email us and we'll make it right.
        </p>
      </LegalSection>
      <LegalSection title='Ending your account'>
        <p>
          You can close your account whenever you want. We may suspend accounts
          that violate these terms after giving you a chance to fix it, unless
          the violation is serious enough to act immediately.
        </p>
      </LegalSection>
      <LegalSection title='Liability'>
        <p>
          DeadLink Watchdog is provided as-is. We're not liable for indirect
          losses caused by missed alerts or downtime. Our total liability in any
          dispute is capped at what you paid us in the previous 12 months.
        </p>
      </LegalSection>
      <LegalSection title='Contact'>
        <p>
          Questions? Email{' '}
          <a
            href='mailto:hello@deadlinkwatchdog.com'
            className='text-primary hover:underline'
          >
            hello@deadlinkwatchdog.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
