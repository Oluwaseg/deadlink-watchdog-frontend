'use client';

import { DashboardSidebar } from '@/components/layout/sidebar';
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
import { Activity, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const href = '/' + segments.slice(0, i + 1).join('/');
    const isLast = i === segments.length - 1;

    // Format segment name with better handling for special cases
    let name = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Handle special cases
    if (segment === 'broken-links') name = 'Broken Links';

    breadcrumbs.push({
      name,
      href,
      isLast,
    });
  }

  return breadcrumbs;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
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
            <div className='hidden md:flex items-center gap-2'>
              <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                <Activity className='h-3 w-3 text-primary' />
                <span>Live</span>
              </div>
              <Badge variant='outline' className='text-xs'>
                All Systems Online
              </Badge>
            </div>
            <button className='relative rounded-md p-2 hover:bg-accent'>
              <Bell className='h-4 w-4' />
              <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-primary' />
            </button>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
