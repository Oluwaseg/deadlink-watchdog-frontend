import { LegalPage, LegalSection } from '@/components/public/site/LegalPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy, DeadLink Watchdog',
  description:
    'How DeadLink Watchdog uses cookies. Essential cookies keep the app running, optional ones help us improve it.',
  openGraph: {
    title: 'Cookie Policy, DeadLink Watchdog',
    description:
      'How DeadLink Watchdog uses cookies and how you can control them.',
  },
};

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow='Legal'
      title='Cookie Policy'
      updated='July 10, 2026'
      intro="We use a small number of cookies to keep DeadLink Watchdog running and to understand how it's used. This page explains what we set, why, and how you can change your mind at any time."
    >
      <LegalSection title='What is a cookie?'>
        <p>
          A cookie is a small text file a website stores on your device. Cookies
          remember things like whether you're signed in, what theme you prefer,
          or how you landed on our site.
        </p>
      </LegalSection>
      <LegalSection title='Essential cookies'>
        <p>
          These keep the product working, session, authentication, and security.
          Without them, things like staying logged in or submitting a form
          wouldn't work. You can't disable these if you want to use the app.
        </p>
      </LegalSection>
      <LegalSection title='Analytics cookies (optional)'>
        <p>
          We use privacy-respecting analytics to understand which pages get
          used, so we can spend time where it matters. No personal data is sold
          or shared with advertisers.
        </p>
      </LegalSection>
      <LegalSection title='Managing your choices'>
        <p>
          When you first visit the site, we ask whether you'd like to accept all
          cookies or only the essentials. You can clear the choice at any time
          from your browser's site data settings, and we'll ask again on your
          next visit.
        </p>
      </LegalSection>
      <LegalSection title='Contact'>
        <p>
          Questions about cookies? Email us at{' '}
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
