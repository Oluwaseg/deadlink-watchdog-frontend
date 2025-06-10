'use client';

import { useCrawls } from '@/features/crawls/hooks/useCrawls';
import type { CrawlResult } from '@/features/crawls/types';
import {
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'completed':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'failed':
            return <Clock className="h-5 w-5 text-red-500" />;
        case 'in_progress':
            return <AlertCircle className="h-5 w-5 text-blue-500" />;
        default:
            return <XCircle className="h-5 w-5 text-gray-500" />;
    }
};

export default function CrawlsPage() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<string>('');
    const [websiteId, setWebsiteId] = useState<string>('');

    const { data, isLoading, error } = useCrawls(page, 10, status, websiteId);

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
                <div className="text-red-500">Error loading crawls: {error.message}</div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const { crawls: crawlResults, pagination } = data.data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Crawl History</h1>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2"
                >
                    <option value="">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="in_progress">In Progress</option>
                </select>

                <input
                    type="text"
                    placeholder="Website ID"
                    value={websiteId}
                    onChange={(e) => setWebsiteId(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2"
                />
            </div>

            {/* Crawls Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Website
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Links Checked
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Response Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {crawlResults.map((crawl: CrawlResult) => (
                            <tr key={crawl.id}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {crawl.website.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {crawl.website.url}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center">
                                        {getStatusIcon(crawl.status)}
                                        <span className="ml-2 text-sm text-gray-900">
                                            {crawl.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {crawl.totalLinksChecked}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {crawl.averageResponseTime}ms
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {new Date(crawl.createdAt).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <Link
                                        href={`/dashboard/crawls/${crawl.id}`}
                                        className="text-primary hover:text-primary-dark"
                                    >
                                        View Details
                                    </Link>
                                    {crawl.status === 'failed' && (
                                        <button
                                            onClick={() => {
                                                // TODO: Implement retry functionality
                                            }}
                                            className="ml-4 text-primary hover:text-primary-dark"
                                        >
                                            Retry
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Showing page {page} of {pagination.pages}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                        disabled={page === pagination.pages}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
} 