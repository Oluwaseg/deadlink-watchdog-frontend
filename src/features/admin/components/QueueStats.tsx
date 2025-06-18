'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useQueueStats } from '../hooks/useQueueStats';

interface Job {
    id: string;
    name: string;
    status: string;
    createdAt: string;
}

export function QueueStats() {
    const { data: response, isLoading, error } = useQueueStats();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading queue stats</div>;
    }

    if (!response?.data?.stats) {
        return null;
    }

    const { stats, activeJobs } = response.data;

    // Calculate totals with safe fallbacks
    const totalActive = (stats.crawl?.active || 0) + (stats.notification?.active || 0);
    const totalPending = (stats.crawl?.waiting || 0) + (stats.notification?.waiting || 0);
    const totalCompleted = (stats.crawl?.completed || 0) + (stats.notification?.completed || 0);
    const totalFailed = (stats.crawl?.failed || 0) + (stats.notification?.failed || 0);

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalActive + totalPending + totalCompleted + totalFailed}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCompleted}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed Jobs</CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalFailed}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Active Jobs */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {!activeJobs?.length ? (
                            <p className="text-sm text-muted-foreground">No active jobs</p>
                        ) : (
                            activeJobs.map((job: Job) => (
                                <div
                                    key={job.id}
                                    className="flex items-center justify-between rounded-lg border p-2"
                                >
                                    <div>
                                        <p className="font-medium">{job.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Status: {job.status}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(job.createdAt).toLocaleDateString()}
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