'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Globe, Users } from 'lucide-react';
import { useUserAnalytics, useWebsiteAnalytics } from '../hooks/useAnalytics';

export function Analytics() {
  const { data: websiteAnalytics, isLoading: isLoadingWebsites } =
    useWebsiteAnalytics();
  const { data: userAnalytics, isLoading: isLoadingUsers } = useUserAnalytics();

  if (isLoadingWebsites || isLoadingUsers) {
    return <div>Loading analytics...</div>;
  }

  if (!websiteAnalytics?.data || !userAnalytics?.data) {
    return <div>No analytics data available</div>;
  }

  const { totalWebsites, websitesByCategory, websitesByStatus, newWebsites } =
    websiteAnalytics.data;
  const { totalUsers, activeUsers, newUsers } = userAnalytics.data;

  // Calculate active users percentage
  const activeUsersPercentage = Math.round((activeUsers / totalUsers) * 100);

  return (
    <div className='space-y-4'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Websites
            </CardTitle>
            <Globe className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalWebsites}</div>
            <p className='text-xs text-muted-foreground'>
              {newWebsites.length} new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalUsers}</div>
            <p className='text-xs text-muted-foreground'>
              {newUsers.length} new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Users</CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{activeUsers}</div>
            <p className='text-xs text-muted-foreground'>
              {activeUsersPercentage}% of total users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Website Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Website Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {Object.entries(websitesByCategory).map(([category, count]) => (
              <div
                key={category}
                className='flex items-center justify-between rounded-lg border p-2'
              >
                <div>
                  <p className='font-medium'>{category}</p>
                  <p className='text-sm text-muted-foreground'>
                    {count} websites
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Website Status */}
      <Card>
        <CardHeader>
          <CardTitle>Website Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex items-center justify-between rounded-lg border p-2'>
              <div>
                <p className='font-medium'>Active Websites</p>
                <p className='text-sm text-muted-foreground'>
                  {websitesByStatus.active} websites
                </p>
              </div>
            </div>
            <div className='flex items-center justify-between rounded-lg border p-2'>
              <div>
                <p className='font-medium'>Inactive Websites</p>
                <p className='text-sm text-muted-foreground'>
                  {websitesByStatus.inactive} websites
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
