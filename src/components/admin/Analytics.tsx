'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import {
  Activity,
  BarChart3,
  Globe,
  HeartPulse,
  Link2Off,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import {
  useUserAnalytics,
  useWebsiteAnalytics,
} from '../../hooks/use-analytics';

type AnalyticsPeriod = 7 | 30 | 90;

const chartColors = {
  green: '#11706a', // theme teal
  red: '#d9534f',
  amber: '#c9962b', // theme gold
  grid: '#e7ecea',
  label: '#6b7a78',
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

// Presentational wrapper for every chart panel
function ChartPanel({
  title,
  subtitle,
  icon,
  tone = 'primary',
  className = '',
  delay = 0,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  tone?: 'primary' | 'accent' | 'destructive';
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  const chip =
    tone === 'accent'
      ? 'bg-secondary-soft text-secondary'
      : tone === 'destructive'
        ? 'bg-destructive/10 text-destructive'
        : 'bg-primary-soft text-primary';
  return (
    <div
      className={`group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-border-strong hover:shadow-elegant animate-fade-up ${className}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className='mb-2 flex items-start justify-between gap-3'>
        <div>
          <h3 className='font-display text-base font-semibold'>{title}</h3>
          <p className='text-xs text-muted-foreground'>{subtitle}</p>
        </div>
        <span
          className={`grid size-9 place-items-center rounded-xl ${chip} [&_svg]:size-4`}
        >
          {icon}
        </span>
      </div>
      {children}
    </div>
  );
}

const periods: AnalyticsPeriod[] = [7, 30, 90];

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
        <h2
          id='platform-analytics-title'
          className='font-display text-xl font-semibold'
        >
          Platform analytics
        </h2>
        <div className='grid gap-4 xl:grid-cols-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='h-80 animate-pulse rounded-2xl bg-surface-muted'
            />
          ))}
        </div>
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

  const maxCategory = Math.max(
    1,
    ...Object.values(websitesByCategory).map(Number)
  );
  const statusTotal = websitesByStatus.active + websitesByStatus.inactive;
  const activeSitePct = statusTotal
    ? (websitesByStatus.active / statusTotal) * 100
    : 0;

  return (
    <section className='space-y-5' aria-labelledby='platform-analytics-title'>
      {/* Header + period switch */}
      <div className='flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4'>
        <div>
          <p className='text-[11px] font-medium uppercase tracking-[0.16em] text-secondary'>
            Insights
          </p>
          <h2
            id='platform-analytics-title'
            className='font-display text-2xl font-semibold tracking-tight'
          >
            Platform analytics
          </h2>
          <p className='text-sm text-muted-foreground'>
            Daily activity and crawl quality
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {/* Segmented control — calls the same setPeriod */}
          <div
            role='tablist'
            aria-label='Analytics time range'
            className='hidden rounded-xl border border-border bg-surface-muted p-1 sm:flex'
          >
            {periods.map((p) => (
              <button
                key={p}
                role='tab'
                aria-selected={period === p}
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                  period === p
                    ? 'bg-primary text-primary-foreground shadow-elegant'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {p}d
              </button>
            ))}
          </div>
          <div className='sm:hidden'>
            <Select
              value={String(period)}
              onValueChange={(value) =>
                setPeriod(Number(value) as AnalyticsPeriod)
              }
            >
              <SelectTrigger
                className='w-36 rounded-xl'
                aria-label='Analytics time range'
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='7'>Last 7 days</SelectItem>
                <SelectItem value='30'>Last 30 days</SelectItem>
                <SelectItem value='90'>Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bento chart grid */}
      <div className='grid gap-4 lg:grid-cols-3'>
        <ChartPanel
          className='lg:col-span-2'
          title='User growth'
          subtitle={`New sign-ups · last ${period} days`}
          icon={<TrendingUp />}
        >
          <ReactECharts
            option={userGrowthOptions}
            opts={{ renderer: 'canvas' }}
            style={{ height: 280, width: '100%' }}
            notMerge
          />
        </ChartPanel>

        {/* User activity spotlight */}
        <div
          className='relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground shadow-elegant animate-fade-up'
          style={{ animationDelay: '60ms', animationFillMode: 'both' }}
        >
          <div
            aria-hidden
            className='pointer-events-none absolute inset-0 bg-dot opacity-20 mask-radial-fade'
          />
          <div className='relative flex h-full flex-col'>
            <div className='flex items-center justify-between'>
              <h3 className='font-display text-base font-semibold'>
                User activity
              </h3>
              <span className='grid size-9 place-items-center rounded-xl bg-primary-foreground/10'>
                <Users className='size-4' />
              </span>
            </div>
            <div className='my-6 flex flex-1 flex-col items-center justify-center'>
              <div
                className='grid size-36 place-items-center rounded-full'
                style={{
                  background: `conic-gradient(var(--secondary) ${activeUsersPercentage * 3.6}deg, color-mix(in oklab, var(--primary-foreground) 15%, transparent) 0deg)`,
                }}
              >
                <div className='grid size-28 place-items-center rounded-full bg-primary text-center'>
                  <div>
                    <p className='font-display text-3xl font-semibold font-mono-data'>
                      {activeUsersPercentage}%
                    </p>
                    <p className='text-[10px] uppercase tracking-[0.14em] text-primary-foreground/70'>
                      active
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <div className='rounded-xl bg-primary-foreground/10 p-3'>
                <p className='text-[11px] text-primary-foreground/70'>
                  Active users
                </p>
                <p className='font-display text-xl font-semibold font-mono-data'>
                  {activeUsers}
                </p>
              </div>
              <div className='rounded-xl bg-primary-foreground/10 p-3'>
                <p className='text-[11px] text-primary-foreground/70'>
                  New in the last 30 days
                </p>
                <p className='font-display text-xl font-semibold font-mono-data'>
                  {newUserCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ChartPanel
          delay={120}
          title='Crawl outcomes'
          subtitle='Completed vs failed per day'
          icon={<BarChart3 />}
        >
          <ReactECharts
            option={crawlOutcomeOptions}
            opts={{ renderer: 'canvas' }}
            style={{ height: 240, width: '100%' }}
            notMerge
          />
        </ChartPanel>

        <ChartPanel
          delay={180}
          tone='destructive'
          title='Broken links found per day'
          subtitle='Daily discoveries'
          icon={<Link2Off />}
        >
          <ReactECharts
            option={brokenLinksOptions}
            opts={{ renderer: 'canvas' }}
            style={{ height: 240, width: '100%' }}
            notMerge
          />
        </ChartPanel>

        <ChartPanel
          delay={240}
          tone='accent'
          title='Average crawl health'
          subtitle='Score out of 100%'
          icon={<HeartPulse />}
        >
          <ReactECharts
            option={healthOptions}
            opts={{ renderer: 'canvas' }}
            style={{ height: 240, width: '100%' }}
            notMerge
          />
        </ChartPanel>
      </div>

      {/* Website breakdown */}
      <div className='grid gap-4 lg:grid-cols-5'>
        <ChartPanel
          className='lg:col-span-3'
          delay={300}
          title='Website categories'
          subtitle='Distribution across categories'
          icon={<Globe />}
        >
          {Object.keys(websitesByCategory).length === 0 ? (
            <p className='py-8 text-center text-sm text-muted-foreground'>
              No websites yet
            </p>
          ) : (
            <div className='mt-3 space-y-3'>
              {Object.entries(websitesByCategory).map(
                ([category, count], i) => (
                  <div key={category} className='space-y-1.5'>
                    <div className='flex justify-between gap-4 text-sm'>
                      <span className='capitalize'>{category}</span>
                      <span className='font-medium font-mono-data'>
                        {count}
                      </span>
                    </div>
                    <div className='h-2 overflow-hidden rounded-full bg-surface-muted'>
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${i % 2 === 0 ? 'bg-primary' : 'bg-secondary'}`}
                        style={{
                          width: `${(Number(count) / maxCategory) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </ChartPanel>

        <ChartPanel
          className='lg:col-span-2'
          delay={360}
          tone='accent'
          title='Website status'
          subtitle='Monitoring state'
          icon={<Activity />}
        >
          <div className='mt-3 flex h-3 overflow-hidden rounded-full bg-surface-muted'>
            <span
              className='bg-primary transition-all duration-700'
              style={{ width: `${activeSitePct}%` }}
            />
            <span
              className='bg-border-strong transition-all duration-700'
              style={{ width: `${statusTotal ? 100 - activeSitePct : 0}%` }}
            />
          </div>
          <div className='mt-4 grid grid-cols-2 gap-3'>
            <div className='rounded-xl border border-border p-3'>
              <span className='flex items-center gap-2 text-xs text-muted-foreground'>
                <Globe className='size-3.5 text-primary' /> Active
              </span>
              <p className='mt-1 font-display text-2xl font-semibold font-mono-data'>
                {websitesByStatus.active}
              </p>
            </div>
            <div className='rounded-xl border border-border p-3'>
              <span className='flex items-center gap-2 text-xs text-muted-foreground'>
                <Activity className='size-3.5' /> Inactive
              </span>
              <p className='mt-1 font-display text-2xl font-semibold font-mono-data'>
                {websitesByStatus.inactive}
              </p>
            </div>
          </div>
          <div className='mt-4 rounded-xl bg-secondary-soft px-3 py-2.5 text-sm text-secondary'>
            {newWebsiteCount} added in the last {period} days
          </div>
        </ChartPanel>
      </div>
    </section>
  );
}
