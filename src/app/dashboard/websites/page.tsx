'use client';

import { deleteWebsite, triggerCrawl } from '@/features/websites/api/websitesApi';
import { useWebsites } from '@/features/websites/hooks/useWebsites';
import { Pencil, Plus, RefreshCcw, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function WebsitesPage() {
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    const { data, isLoading, error: fetchError, refetch } = useWebsites(page, 10, category, isActive);

    const handleDelete = async (websiteId: string) => {
        if (!confirm('Are you sure you want to delete this website?')) return;

        try {
            await deleteWebsite(websiteId);
            refetch();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleTriggerCrawl = async (websiteId: string) => {
        try {
            await triggerCrawl(websiteId);
            refetch();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-red-500">Error loading websites: {fetchError.message}</div>
            </div>
        );
    }

    if (!data?.data?.websites) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-gray-500">No websites found</div>
            </div>
        );
    }

    const { websites, pagination } = data.data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Websites</h1>
                <Link
                    href="/dashboard/websites/new"
                    className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Website
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2"
                >
                    <option value="">All Categories</option>
                    <option value="news">News</option>
                    <option value="government">Government</option>
                    <option value="business">Business</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="financial">Financial</option>
                    <option value="other">Other</option>
                </select>

                <select
                    value={isActive === undefined ? '' : isActive.toString()}
                    onChange={(e) => setIsActive(e.target.value === '' ? undefined : e.target.value === 'true')}
                    className="rounded-md border border-gray-300 px-3 py-2"
                >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>

            {/* Websites Table */}
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
                                Health Score
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Links
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Last Crawl
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {websites.map((website) => (
                            <tr key={website.id}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {website.name}
                                            </div>
                                            <div className="text-sm text-gray-500">{website.url}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${website.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {website.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                        {website.healthScore}%
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {website.totalLinks}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {website.lastCrawledAt
                                        ? new Date(website.lastCrawledAt).toLocaleDateString()
                                        : 'Never'}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <div className="flex space-x-3">
                                        <Link
                                            href={`/dashboard/websites/${website.id}/edit`}
                                            className="text-primary hover:text-primary-dark"
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </Link>
                                        <button
                                            onClick={() => handleTriggerCrawl(website.id)}
                                            className="text-primary hover:text-primary-dark"
                                        >
                                            <RefreshCcw className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(website.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
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