import { ModeToggle } from '@/components/shared/switch';
import { BarChart3, Bell, Search, Shield } from 'lucide-react';
import type React from 'react';
import { Suspense } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-background'>
      <div className='grid lg:grid-cols-2 min-h-screen'>
        {/* Left Side - Branding */}
        <div className='hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-8 relative overflow-hidden'>
          {/* Background Pattern */}
          <div className='absolute inset-0 bg-gradient-to-br from-primary to-primary/80'></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

          <div className='relative z-10'>
            {/* Logo */}
            <div className='flex items-center space-x-3 mb-12'>
              <div className='h-10 w-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center'>
                <Search className='h-6 w-6 text-primary-foreground' />
              </div>
              <span className='text-2xl font-bold'>DeadLink Watchdog</span>
            </div>

            {/* Main Content */}
            <div className='max-w-md'>
              <h1 className='text-4xl font-bold mb-6 leading-tight'>
                Monitor Nigerian Websites with Confidence
              </h1>
              <p className='text-xl text-primary-foreground/90 mb-8 leading-relaxed'>
                Join thousands of businesses keeping their websites healthy
                across Nigeria&apos;s digital landscape.
              </p>

              {/* Features */}
              <div className='space-y-4'>
                {[
                  {
                    icon: Shield,
                    title: 'Secure & Reliable',
                    description: 'Enterprise-grade security for your data',
                  },
                  {
                    icon: BarChart3,
                    title: 'Real-time Analytics',
                    description:
                      'Get instant insights into your website health',
                  },
                  {
                    icon: Bell,
                    title: 'Smart Alerts',
                    description: 'Never miss a broken link again',
                  },
                ].map((feature, index) => (
                  <div key={index} className='flex items-start space-x-3'>
                    <div className='h-8 w-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0 mt-1'>
                      <feature.icon className='h-4 w-4 text-primary-foreground' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-primary-foreground mb-1'>
                        {feature.title}
                      </h3>
                      <p className='text-sm text-primary-foreground/80'>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className='relative z-10'>
            <div className='flex items-center space-x-2 text-primary-foreground/80'>
              <span className='text-2xl'>🇳🇬</span>
              <span className='text-sm'>
                Made for Nigeria&apos;s Digital Future
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className='flex flex-col'>
          {/* Header */}
          <header className='border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='px-6 lg:px-8'>
              <div className='flex justify-between items-center h-16'>
                <div className='flex items-center lg:hidden'>
                  <div className='flex items-center space-x-2'>
                    <div className='h-8 w-8 rounded-lg bg-primary flex items-center justify-center'>
                      <Search className='h-5 w-5 text-primary-foreground' />
                    </div>
                    <span className='text-xl font-bold text-foreground'>
                      DeadLink Watchdog
                    </span>
                  </div>
                </div>
                <div className='ml-auto'>
                  <ModeToggle />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className='flex-1 flex items-center justify-center p-6 lg:p-8'>
            <div className='w-full max-w-md'>
              <Suspense>{children}</Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
