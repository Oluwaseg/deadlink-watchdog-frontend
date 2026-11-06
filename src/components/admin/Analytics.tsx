'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Globe, Users } from 'lucide-react';
import {
  useUserAnalytics,
  useWebsiteAnalytics,
} from '../../hooks/use-analytics';

export function Analytics() {
  const { data: websiteAnalytics, isLoading: isLoadingWebsites } =
    useWebsiteAnalytics();
  const { data: userAnalytics, isLoading: isLoadingUsers } = useUserAnalytics();

  if (isLoadingWebsites || isLoadingUsers) return null;
  if (!websiteAnalytics?.data || !userAnalytics?.data) return null;

  const { websitesByCategory, websitesByStatus, newWebsites } =
    websiteAnalytics.data;
  const { totalUsers, activeUsers, newUsers } = userAnalytics.data;
  const activeUsersPercentage = totalUsers
    ? Math.round((activeUsers / totalUsers) * 100)
    : 0;

  return (
    <section className='space-y-4' aria-labelledby='platform-analytics-title'>
      <h2 id='platform-analytics-title' className='text-lg font-semibold'>
        Platform analytics
      </h2>
      <div className='grid gap-4 lg:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Website categories</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(websitesByCategory).length === 0 ? (
              <p className='text-sm text-muted-foreground'>No websites yet</p>
            ) : (
              <div className='space-y-2'>
                {Object.entries(websitesByCategory).map(([category, count]) => (
                  <div
                    key={category}
                    className='flex justify-between gap-4 text-sm'
                  >
                    <span className='capitalize'>{category}</span>
                    <span className='font-medium'>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Website status</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between text-sm'>
              <span className='flex items-center gap-2 text-muted-foreground'>
                <Globe className='size-4' /> Active
              </span>
              <span className='font-medium'>{websitesByStatus.active}</span>
            </div>
            <div className='flex items-center justify-between text-sm'>
              <span className='flex items-center gap-2 text-muted-foreground'>
                <Activity className='size-4' /> Inactive
              </span>
              <span className='font-medium'>{websitesByStatus.inactive}</span>
            </div>
            <div className='border-t pt-3 text-sm text-muted-foreground'>
              {newWebsites.length} added in the last 30 days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User activity</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between text-sm'>
              <span className='flex items-center gap-2 text-muted-foreground'>
                <Users className='size-4' /> Active users
              </span>
              <span className='font-medium'>
                {activeUsers} ({activeUsersPercentage}%)
              </span>
            </div>
            <div className='flex items-center justify-between border-t pt-3 text-sm'>
              <span className='text-muted-foreground'>
                New in the last 30 days
              </span>
              <span className='font-medium'>{newUsers.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
