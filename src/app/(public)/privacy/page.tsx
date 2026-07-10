import { LegalPage, LegalSection } from '@/components/public/site/LegalPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy, DeadLink Watchdog',
  description:
    'How DeadLink Watchdog collects, uses, and protects your data. Written in plain language, not legalese.',
  openGraph: {
    title: 'Privacy Policy, DeadLink Watchdog',
    description:
      'How DeadLink Watchdog collects, uses, and protects your data.',
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow='Legal'
      title='Privacy Policy'
      updated='July 10, 2026'
      intro="We keep this short because privacy shouldn't need a law degree. Here's what we collect, why, and what we don't do with it."
    >
      <LegalSection title='What we collect'>
        <p>
          When you create an account we store your email and a hashed password.
          When you add a site to monitor, we store the URL, your monitoring
          preferences, and the results of each crawl (which links returned which
          status codes). Nothing more.
        </p>
      </LegalSection>
      <LegalSection title='How we use it'>
        <p>
          We use your data to run the monitoring you asked for, send you alerts
          when links break, and show you your health score. We use aggregated,
          anonymised usage to figure out what to build next.
        </p>
      </LegalSection>
      <LegalSection title="What we don't do">
        <p>
          We don't sell your data. We don't share it with advertisers. We don't
          use your monitored sites as training data for anything. If we ever
          change that, we'll ask you first.
        </p>
      </LegalSection>
      <LegalSection title='Where your data lives'>
        <p>
          Your data is stored on managed cloud infrastructure with encryption at
          rest and in transit. Access is limited to the small team that keeps
          the service running.
        </p>
      </LegalSection>
      <LegalSection title='Your rights'>
        <p>
          You can export your data or delete your account at any time from your
          dashboard. If you'd rather email us, we'll handle it within 7 days.
        </p>
      </LegalSection>
      <LegalSection title='Contact'>
        <p>
          Privacy questions or requests, email{' '}
          <a
            href='mailto:privacy@deadlinkwatchdog.com'
            className='text-primary hover:underline'
          >
            privacy@deadlinkwatchdog.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
