'use client';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuthState } from '@/hooks/use-auth';
import { loginAtom } from '@/lib/auth-atoms';
import { getCookie } from '@/lib/cookie-utils';
import { useSetAtom } from 'jotai';
import { Activity, Bell } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  return segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const name = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return { name, href, isLast: index === segments.length - 1 };
  });
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuthState();
  const login = useSetAtom(loginAtom);
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = () => {
      if (!isAuthenticated) {
        const accessToken = getCookie('accessToken-deadlink-watchdog');
        const refreshToken = getCookie('refreshToken-deadlink-watchdog');
        const userJson = localStorage.getItem('user');

        if (accessToken && refreshToken && userJson) {
          try {
            const storedUser = JSON.parse(userJson);
            login({ user: storedUser, accessToken, refreshToken });
            return;
          } catch (error) {
            console.error('Failed to restore authentication:', error);
          }
        }

        router.replace('/auth/login');
        return;
      }

      if (user?.role !== 'admin') {
        router.replace('/dashboard');
        return;
      }

      setIsLoading(false);
    };

    checkAdminAuth();
  }, [isAuthenticated, user, login, router]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className='group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={breadcrumb.href} className='flex items-center'>
                    {index > 0 && <BreadcrumbSeparator className='mx-2' />}
                    <BreadcrumbItem>
                      {breadcrumb.isLast ? (
                        <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={breadcrumb.href}>
                          {breadcrumb.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className='ml-auto flex items-center gap-2 px-4'>
            <div className='hidden items-center gap-2 md:flex'>
              <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                <Activity className='h-3 w-3 text-primary' />
                <span>Live</span>
              </div>
              <Badge variant='outline' className='text-xs'>
                All Systems Online
              </Badge>
            </div>
            <button
              type='button'
              aria-label='Notifications'
              className='relative rounded-md p-2 hover:bg-accent'
            >
              <Bell className='h-4 w-4' />
              <span className='absolute right-1 top-1 h-2 w-2 rounded-full bg-primary' />
            </button>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
