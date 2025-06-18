'use client';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { moderateWebsite } from '../api/adminApi';
import { useWebsitesModeration } from '../hooks/useWebsitesModeration';

export function WebsitesModerationTable() {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useWebsitesModeration();

    const moderateMutation = useMutation({
        mutationFn: ({
            websiteId,
            action,
        }: {
            websiteId: string;
            action: 'block' | 'unblock';
        }) => moderateWebsite(websiteId, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'websites', 'moderation'] });
            toast.success('Website moderated successfully');
        },
        onError: () => {
            toast.error('Failed to moderate website');
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading websites</div>;
    }

    if (!data?.data.websites.length) {
        return <div>No websites requiring moderation</div>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.data.websites.map((website) => (
                    <TableRow key={website.id}>
                        <TableCell>{website.url}</TableCell>
                        <TableCell>{website.user.email}</TableCell>
                        <TableCell>
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${website.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {website.isActive ? 'Active' : 'Blocked'}
                            </span>
                        </TableCell>
                        <TableCell>{website.reports}</TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        moderateMutation.mutate({
                                            websiteId: website.id,
                                            action: website.isActive ? 'block' : 'unblock',
                                        })
                                    }
                                >
                                    {website.isActive ? 'Block' : 'Unblock'}
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
} 