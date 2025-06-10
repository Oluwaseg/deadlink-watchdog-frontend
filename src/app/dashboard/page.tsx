'use client';

import type React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useDashboardOverview } from '@/features/dashboard/hooks/useDashboard';
import type { CrawlActivity, Website } from '@/features/dashboard/types';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart,
  Check,
  ClipboardCheck,
  Clock,
  Globe,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

interface StatCard {
  name: string;
  value: number;
  icon: React.ElementType;
  href: string;
  change?: number;
  changeType?: 'increase' | 'decrease';
}

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardOverview();
  const { data: user } = useCurrentUser();

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          <p className='text-sm text-muted-foreground'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardContent className='flex flex-col items-center gap-4 p-6'>
            <AlertCircle className='h-12 w-12 text-destructive' />
            <div className='text-center'>
              <h3 className='font-semibold'>Error Loading Dashboard</h3>
              <p className='text-sm text-muted-foreground mt-1'>
                {error.message}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.data?.overview) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardContent className='flex flex-col items-center gap-4 p-6'>
            <BarChart className='h-12 w-12 text-muted-foreground' />
            <div className='text-center'>
              <h3 className='font-semibold'>No Data Available</h3>
              <p className='text-sm text-muted-foreground mt-1'>
                Start by adding your first website to monitor
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { overview, topIssues, recentActivity } = data.data;

  const stats: StatCard[] = [
    {
      name: 'Total Websites',
      value: overview.totalWebsites,
      icon: Globe,
      href: '/dashboard/websites',
      change: 12,
      changeType: 'increase',
    },
    {
      name: 'Active Websites',
      value: overview.activeWebsites,
      icon: Activity,
      href: '/dashboard/websites?status=active',
      change: 8,
      changeType: 'increase',
    },
    {
      name: 'Total Crawls',
      value: overview.totalCrawls,
      icon: BarChart,
      href: '/dashboard/crawls',
      change: 23,
      changeType: 'increase',
    },
    {
      name: 'Recent Crawls',
      value: overview.recentCrawls,
      icon: Clock,
      href: '/dashboard/crawls?period=recent',
      change: 5,
      changeType: 'decrease',
    },
    {
      name: 'Total Broken Links',
      value: overview.totalBrokenLinks,
      icon: AlertTriangle,
      href: '/dashboard/broken-links',
      change: 15,
      changeType: 'decrease',
    },
    {
      name: 'Recent Broken Links',
      value: overview.recentBrokenLinks,
      icon: ClipboardCheck,
      href: '/dashboard/broken-links?period=recent',
      change: 3,
      changeType: 'decrease',
    },
  ];

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-secondary';
    return 'text-destructive';
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 80) return 'bg-primary/10';
    if (score >= 60) return 'bg-secondary/10';
    return 'bg-destructive/10';
  };

  return (
    <div className='space-y-8'>
      {/* Header Section */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Welcome back, {user?.firstName || user?.email}! Here&apos;s
            what&apos;s happening with your websites.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='outline' className='border-primary/30 text-primary'>
            <Activity className='mr-1 h-3 w-3' />
            Live Monitoring
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href} className='group'>
            <Card className='transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 group-hover:border-primary/20'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                      <stat.icon className='h-6 w-6' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>
                        {stat.name}
                      </p>
                      <p className='text-2xl font-bold'>
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {stat.change && (
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        stat.changeType === 'increase'
                          ? 'text-primary'
                          : 'text-secondary'
                      }`}
                    >
                      <TrendingUp
                        className={`h-3 w-3 ${
                          stat.changeType === 'decrease' ? 'rotate-180' : ''
                        }`}
                      />
                      {stat.change}%
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Health Score */}
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <BarChart className='h-4 w-4' />
              </div>
              Overall Health Score
            </CardTitle>
            <CardDescription>
              Average health across all monitored websites
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='text-center'>
              <div
                className={`text-4xl font-bold ${getHealthScoreColor(
                  overview.averageHealthScore
                )}`}
              >
                {overview.averageHealthScore}%
              </div>
              <p className='text-sm text-muted-foreground'>Current Score</p>
            </div>
            <Progress value={overview.averageHealthScore} className='h-3' />
            <div
              className={`rounded-lg p-3 ${getHealthScoreBg(
                overview.averageHealthScore
              )}`}
            >
              <p className='text-xs font-medium'>
                {overview.averageHealthScore >= 80
                  ? 'Excellent! Your websites are performing well.'
                  : overview.averageHealthScore >= 60
                  ? 'Good performance with room for improvement.'
                  : 'Attention needed. Consider reviewing broken links.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Top Issues */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive'>
                <AlertTriangle className='h-4 w-4' />
              </div>
              Top Issues
            </CardTitle>
            <CardDescription>
              Websites that need immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {topIssues.length > 0 ? (
                topIssues.map((website: Website) => (
                  <div
                    key={website.id}
                    className='flex items-center justify-between rounded-lg border p-4'
                  >
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-10 w-10'>
                        <AvatarFallback className='bg-muted'>
                          {website.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-medium'>{website.name}</p>
                        <p className='text-sm text-muted-foreground'>
                          {website.brokenLinks} broken links found
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Badge
                        variant={
                          website.healthScore >= 80
                            ? 'default'
                            : website.healthScore >= 60
                            ? 'secondary'
                            : 'destructive'
                        }
                        className='font-mono'
                      >
                        {website.healthScore}%
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className='flex flex-col items-center gap-2 py-8 text-center'>
                  <Check className='h-8 w-8 text-primary' />
                  <p className='font-medium'>No critical issues found</p>
                  <p className='text-sm text-muted-foreground'>
                    All your websites are performing well!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary'>
              <Clock className='h-4 w-4' />
            </div>
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest crawl activities and monitoring updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity: CrawlActivity) => (
                <div
                  key={activity.id}
                  className='flex items-center gap-4 rounded-lg border p-4'
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <Globe className='h-5 w-5' />
                  </div>
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium'>{activity.website.name}</p>
                      <Badge variant='outline' className='text-xs'>
                        {activity.status}
                      </Badge>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {activity.brokenLinksFound} broken links found during
                      crawl
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-medium'>
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {new Date(activity.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex flex-col items-center gap-2 py-8 text-center'>
                <Activity className='h-8 w-8 text-muted-foreground' />
                <p className='font-medium'>No recent activity</p>
                <p className='text-sm text-muted-foreground'>
                  Activity will appear here once you start monitoring websites
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
