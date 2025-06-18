import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminDashboard } from '@/features/admin/components/AdminDashboard';
import { Analytics } from '@/features/admin/components/Analytics';
import { QueueStats } from '@/features/admin/components/QueueStats';
import { UsersTable } from '@/features/admin/components/UsersTable';
import { WebsitesModerationTable } from '@/features/admin/components/WebsitesModerationTable';

export default function AdminPage() {
    return (
        <div className="container mx-auto py-6">
            <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="moderation">Moderation</TabsTrigger>
                    <TabsTrigger value="queue">Queue</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <AdminDashboard />
                </TabsContent>
                <TabsContent value="users">
                    <UsersTable />
                </TabsContent>
                <TabsContent value="moderation">
                    <WebsitesModerationTable />
                </TabsContent>
                <TabsContent value="queue">
                    <QueueStats />
                </TabsContent>
                <TabsContent value="analytics">
                    <Analytics />
                </TabsContent>
            </Tabs>
        </div>
    );
} 