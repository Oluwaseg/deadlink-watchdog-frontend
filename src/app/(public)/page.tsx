import { CTASection } from '@/components/public/site/sections/CTASection';
import { ContactSection } from '@/components/public/site/sections/ContactSection';
import { FeatureGrid } from '@/components/public/site/sections/FeatureGrid';
import { HeroSection } from '@/components/public/site/sections/HeroSection';
import { HowItWorksSection } from '@/components/public/site/sections/HowItWorksSection';
import { NigeriaSection } from '@/components/public/site/sections/NigeriaSection';
import { PricingPreview } from '@/components/public/site/sections/PricingPreview';
import { ProblemSection } from '@/components/public/site/sections/ProblemSection';
import { SocialProofSection } from '@/components/public/site/sections/SocialProofSection';
import { SupportSection } from '@/components/public/site/sections/SupportSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DeadLink Watchdog',
  description:
    'Monitor your website for broken links. Simple, reliable link monitoring tuned for Nigerian websites.',
  openGraph: {
    title: 'DeadLink Watchdog',
    description:
      'Monitor your website for broken links. Simple, reliable link monitoring tuned for Nigerian websites.',
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeatureGrid />
      <NigeriaSection />
      <SocialProofSection />
      <PricingPreview />
      <SupportSection />
      <ContactSection />
      <CTASection />
    </>
  );
}
