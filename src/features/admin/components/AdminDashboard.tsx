'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertCircle, Globe, Link2, Users } from 'lucide-react';
import { useAdminStats } from '../hooks/useAdminStats';
import { StatsCard } from './StatsCard';

export function AdminDashboard() {
    const { data: response, isLoading, error } = useAdminStats();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading admin stats</div>;
    }

    if (!response?.data) {
        return null;
    }

    const stats = response.data;

    // Calculate total queue stats with optional chaining
    const crawlStats = stats.queueStats?.crawl || { active: 0, waiting: 0, completed: 0 };
    const notificationStats = stats.queueStats?.notification || { active: 0, waiting: 0, completed: 0 };

    const totalActive = crawlStats.active + notificationStats.active;
    const totalPending = crawlStats.waiting + notificationStats.waiting;
    const totalCompleted = crawlStats.completed + notificationStats.completed;

    // Calculate percentage only if totalWebsites is not zero
    const activePercentage = stats.totalWebsites > 0
        ? Math.round((stats.activeWebsites / stats.totalWebsites) * 100)
        : 0;

    // Get recent users with null check
    const recentUsers = stats.recentUsers || [];

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Total Websites"
                    value={stats.totalWebsites}
                    icon={<Globe className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Active Websites"
                    value={stats.activeWebsites}
                    description={`${activePercentage}% of total`}
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Broken Links"
                    value={stats.totalBrokenLinks}
                    icon={<Link2 className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Total Crawls"
                    value={stats.totalCrawls}
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Queue Status"
                    value={`${totalActive} active`}
                    description={`${totalPending} pending, ${totalCompleted} completed`}
                    icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            {/* Recent Users Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentUsers.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recent users</p>
                        ) : (
                            recentUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 