'use client';

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useDashboardOverview } from '@/features/dashboard/hooks/useDashboard';
import type { CrawlActivity, Website } from '@/features/dashboard/types';
import { AlertTriangle, BarChart, Check, ClipboardCheck, Globe, Link as LucideLink, User2Icon } from 'lucide-react';

import Link from 'next/link';
interface StatCard {
  name: string;
  value: number;
  icon: React.ElementType;
  href: string;
}

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardOverview();
  const { data: user } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-red-500">Error loading dashboard: {error.message}</div>
      </div>
    );
  }

  if (!data?.data?.overview) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  const { overview, topIssues, recentActivity } = data.data;

  const stats: StatCard[] = [
    {
      name: 'Total Websites',
      value: overview.totalWebsites,
      icon: BarChart,
      href: '/dashboard/websites',
    },
    {
      name: 'Active Websites',
      value: overview.activeWebsites,
      icon: AlertTriangle,
      href: '/dashboard/websites?status=active',
    },
    {
      name: 'Total Crawls',
      value: overview.totalCrawls,
      icon: Globe,
      href: '/dashboard/crawls',
    },
    {
      name: 'Recent Crawls',
      value: overview.recentCrawls,
      icon: LucideLink,
      href: '/dashboard/crawls?period=recent',
    },
    {
      name: 'Total Broken Links',
      value: overview.totalBrokenLinks,
      icon: ClipboardCheck,
      href: '/dashboard/broken-links',
    },
    {
      name: 'Recent Broken Links',
      value: overview.recentBrokenLinks,
      icon: Check,
      href: '/dashboard/broken-links?period=recent',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.firstName || user?.email}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon
                    className="h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.value.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Health Score */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Overall Health Score</h2>
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="mb-4 flex h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                style={{ width: `${overview.averageHealthScore}%` }}
                className="flex flex-col justify-center bg-primary text-center text-white shadow-none"
              ></div>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-900">
                {overview.averageHealthScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Issues */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Top Issues</h2>
        <div className="mt-4 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Website
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Health Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Broken Links
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {topIssues.map((website: Website) => (
                <tr key={website.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {website.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {website.healthScore}%
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {website.brokenLinks}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4">
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity: CrawlActivity) => (
              <li key={activity.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <User2Icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {activity.website.name}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {activity.status} - {activity.brokenLinksFound} broken links
                      found
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
