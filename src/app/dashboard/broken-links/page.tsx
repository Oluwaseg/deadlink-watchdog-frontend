'use client';

import { useBrokenLinks } from '@/features/broken-links/hooks/useBrokenLinks';
import type { BrokenLink, ErrorSummary } from '@/features/broken-links/types';
import { useState } from 'react';

export default function BrokenLinksPage() {
    const [page, setPage] = useState(1);
    const [errorType, setErrorType] = useState<string>('');
    const [isFixed, setIsFixed] = useState<boolean | undefined>(undefined);

    const { data, isLoading, error } = useBrokenLinks(page, 20, errorType, isFixed);

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
                <div className="text-red-500">Error loading broken links: {error instanceof Error ? error.message : 'An error occurred'}</div>
            </div>
        );
    }

    if (!data?.data?.recentBrokenLinks) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-gray-500">No broken links found</div>
            </div>
        );
    }

    const { recentBrokenLinks, summary } = data.data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Broken Links</h1>
            </div>

            {/* Error Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {summary.map((item: ErrorSummary) => (
                    <div key={item.errorType} className="rounded-lg bg-white p-4 shadow">
                        <div className="text-sm font-medium text-gray-500">{item.errorType.replace(/_/g, ' ').toUpperCase()}</div>
                        <div className="mt-1 text-2xl font-semibold text-gray-900">{item.count}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <select
                    value={errorType}
                    onChange={(e) => setErrorType(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2"
                >
                    <option value="">All Error Types</option>
                    <option value="404_not_found">404 Not Found</option>
                    <option value="500_server_error">500 Server Error</option>
                    <option value="timeout">Timeout</option>
                </select>
            </div>

            {/* Broken Links Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                URL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Source
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Error Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Found On
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {recentBrokenLinks.map((link: BrokenLink) => (
                            <tr key={link.id}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm text-gray-900">{link.url}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm text-gray-500">{link.sourceUrl}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-red-100 text-red-800">
                                        {link.errorType.replace(/_/g, ' ').toUpperCase()}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {link.statusCode}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {new Date(link.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 