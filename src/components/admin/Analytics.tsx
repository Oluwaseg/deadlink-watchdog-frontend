'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { Activity, Globe, Users } from 'lucide-react';
import { useState } from 'react';
import {
  useUserAnalytics,
  useWebsiteAnalytics,
} from '../../hooks/use-analytics';

type AnalyticsPeriod = 7 | 30 | 90;

const chartColors = {
  green: '#16836b',
  red: '#d9534f',
  amber: '#d18b16',
  grid: '#e5e7eb',
  label: '#64748b',
};

function formatDay(value: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

const chartBase = {
  animationDuration: 350,
  grid: { left: 42, right: 18, top: 24, bottom: 32 },
  tooltip: { trigger: 'axis' as const },
  xAxis: {
    type: 'category' as const,
    boundaryGap: false,
    axisTick: { show: false },
    axisLine: { lineStyle: { color: chartColors.grid } },
    axisLabel: { color: chartColors.label, hideOverlap: true },
  },
  yAxis: {
    type: 'value' as const,
    minInterval: 1,
    splitLine: { lineStyle: { color: chartColors.grid } },
    axisLabel: { color: chartColors.label },
  },
};

export function Analytics() {
  const [period, setPeriod] = useState<AnalyticsPeriod>(30);
  const { data: websiteAnalytics, isLoading: isLoadingWebsites } =
    useWebsiteAnalytics({ period });
  const { data: userAnalytics, isLoading: isLoadingUsers } = useUserAnalytics({
    period,
  });

  if (isLoadingWebsites || isLoadingUsers) {
    return (
      <section className='space-y-4' aria-labelledby='platform-analytics-title'>
        <h2 id='platform-analytics-title' className='text-lg font-semibold'>
          Platform analytics
        </h2>
        <p className='text-sm text-muted-foreground'>Loading analytics…</p>
      </section>
    );
  }
  if (!websiteAnalytics?.data || !userAnalytics?.data) return null;

  const { websitesByCategory, websitesByStatus, newWebsiteCount, crawlsByDay } =
    websiteAnalytics.data;
  const { totalUsers, activeUsers, newUserCount, userGrowth } =
    userAnalytics.data;
  const activeUsersPercentage = totalUsers
    ? Math.round((activeUsers / totalUsers) * 100)
    : 0;
  const dayLabels = userGrowth.map((item) => formatDay(item.date));

  const userGrowthOptions: EChartsOption = {
    ...chartBase,
    xAxis: { ...chartBase.xAxis, data: dayLabels },
    yAxis: { ...chartBase.yAxis, min: 0 },
    series: [
      {
        name: 'New users',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: userGrowth.map((item) => item.count),
        lineStyle: { width: 3, color: chartColors.green },
        areaStyle: { color: 'rgba(22, 131, 107, 0.12)' },
      },
    ],
  };

  const crawlOutcomeOptions: EChartsOption = {
    ...chartBase,
    xAxis: { ...chartBase.xAxis, data: dayLabels, boundaryGap: true },
    yAxis: { ...chartBase.yAxis, min: 0 },
    series: [
      {
        name: 'Completed',
        type: 'bar',
        stack: 'crawls',
        data: crawlsByDay.map((item) => item.completed),
        itemStyle: { color: chartColors.green, borderRadius: [3, 3, 0, 0] },
      },
      {
        name: 'Failed',
        type: 'bar',
        stack: 'crawls',
        data: crawlsByDay.map((item) => item.failed),
        itemStyle: { color: chartColors.red, borderRadius: [3, 3, 0, 0] },
      },
    ],
  };

  const brokenLinksOptions: EChartsOption = {
    ...chartBase,
    xAxis: { ...chartBase.xAxis, data: dayLabels },
    yAxis: { ...chartBase.yAxis, min: 0 },
    series: [
      {
        name: 'Broken links',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: crawlsByDay.map((item) => item.brokenLinks),
        lineStyle: { width: 3, color: chartColors.red },
        areaStyle: { color: 'rgba(217, 83, 79, 0.10)' },
      },
    ],
  };

  const healthOptions: EChartsOption = {
    ...chartBase,
    xAxis: { ...chartBase.xAxis, data: dayLabels },
    yAxis: {
      ...chartBase.yAxis,
      min: 0,
      max: 100,
      axisLabel: {
        color: chartColors.label,
        formatter: (value: number) => `${value}%`,
      },
    },
    series: [
      {
        name: 'Average crawl health',
        type: 'line',
        smooth: true,
        showSymbol: false,
        connectNulls: false,
        data: crawlsByDay.map((item) => item.averageHealth),
        lineStyle: { width: 3, color: chartColors.amber },
        areaStyle: { color: 'rgba(209, 139, 22, 0.12)' },
      },
    ],
  };

  return (
    <section className='space-y-4' aria-labelledby='platform-analytics-title'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 id='platform-analytics-title' className='text-lg font-semibold'>
            Platform analytics
          </h2>
          <p className='text-sm text-muted-foreground'>
            Daily activity and crawl quality
          </p>
        </div>
        <Select
          value={String(period)}
          onValueChange={(value) => setPeriod(Number(value) as AnalyticsPeriod)}
        >
          <SelectTrigger className='w-36' aria-label='Analytics time range'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='7'>Last 7 days</SelectItem>
            <SelectItem value='30'>Last 30 days</SelectItem>
            <SelectItem value='90'>Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid gap-4 xl:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>User growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactECharts
              option={userGrowthOptions}
              opts={{ renderer: 'canvas' }}
              style={{ height: 260, width: '100%' }}
              notMerge
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crawl outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactECharts
              option={crawlOutcomeOptions}
              opts={{ renderer: 'canvas' }}
              style={{ height: 260, width: '100%' }}
              notMerge
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Broken links found per day</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactECharts
              option={brokenLinksOptions}
              opts={{ renderer: 'canvas' }}
              style={{ height: 260, width: '100%' }}
              notMerge
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average crawl health</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactECharts
              option={healthOptions}
              opts={{ renderer: 'canvas' }}
              style={{ height: 260, width: '100%' }}
              notMerge
            />
          </CardContent>
        </Card>
      </div>

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
              {newWebsiteCount} added in the last {period} days
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
              <span className='font-medium'>{newUserCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
