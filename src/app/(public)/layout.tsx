'use client';
import { CookieConsent } from '@/components/public/site/CookieConsent';
import { Footer } from '@/components/public/site/Footer';
import { Navbar } from '@/components/public/site/Navbar';
import { useAuthState } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authState = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (authState.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [authState.isAuthenticated, router]);
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex-1'>{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
