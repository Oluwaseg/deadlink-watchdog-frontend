'use client';

import { ModeToggle } from '@/components/shared/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { logout } from '@/features/auth/api/authApi';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import {
  Activity,
  AlertCircle,
  BarChart3,
  ChevronDown,
  Globe,
  LogOut,
  Search,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Websites', href: '/dashboard/websites', icon: Globe },
  { name: 'Broken Links', href: '/dashboard/broken-links', icon: AlertCircle },
  { name: 'Crawls', href: '/dashboard/crawls', icon: Search },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useCurrentUser();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-2 py-2'>
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
            <Shield className='size-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden'>
            <span className='truncate font-semibold'>DeadLink</span>
            <span className='truncate text-xs'>WATCHDOG</span>
          </div>
          <div className='group-data-[collapsible=icon]:hidden'>
            <ModeToggle />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                    >
                      <NextLink href={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </NextLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                    >
                      <NextLink href={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </NextLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status Section - Only show when expanded */}
        <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
          <SidebarGroupLabel>System Status</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className='rounded-lg border bg-background p-3'>
              <div className='flex items-center gap-2 mb-2'>
                <Activity className='h-4 w-4 text-primary' />
                <span className='text-sm font-medium'>All Systems Online</span>
              </div>
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span>Uptime: 99.9%</span>
                <div className='flex items-center gap-1'>
                  <div className='h-2 w-2 rounded-full bg-primary animate-pulse' />
                  <span>Live</span>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarFallback className='rounded-lg bg-primary text-primary-foreground'>
                      {user?.firstName?.[0] || user?.email?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {user?.firstName || 'User'}
                    </span>
                    <span className='truncate text-xs'>{user?.email}</span>
                  </div>
                  <ChevronDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <NextLink
                    href='/dashboard/profile'
                    className='flex items-center w-full'
                  >
                    <User className='mr-2 h-4 w-4' />
                    Profile
                  </NextLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <NextLink
                    href='/dashboard/settings'
                    className='flex items-center w-full'
                  >
                    <Settings className='mr-2 h-4 w-4' />
                    Settings
                  </NextLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className='text-destructive'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
