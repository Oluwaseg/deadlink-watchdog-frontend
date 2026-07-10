import { ApiProvider } from '@/components/providers/api-provider';
import { JotaiProvider } from '@/components/providers/jotai-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AccessibilityButton } from '@/components/public/site/AccessibilityButton';
import { ModeToggle } from '@/components/shared/switch';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Deadlink Watchdog',
  description: 'A tool for monitoring and managing dead links on your website.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <JotaiProvider>
          <ThemeProvider
            attribute={'class'}
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <ApiProvider>
                {children}
                <Toaster />
                <AccessibilityButton />
                <ModeToggle />
              </ApiProvider>
            </QueryProvider>
          </ThemeProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
