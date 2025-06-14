import { ApiProvider } from '@/components/providers/api-provider';
import { JotaiProvider } from '@/components/providers/jotai-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
              </ApiProvider>
            </QueryProvider>
          </ThemeProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
