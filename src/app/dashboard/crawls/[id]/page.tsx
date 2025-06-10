'use client';

import { getCrawlResult } from '@/features/crawls/api/crawlsApi';
import type { CrawlResultResponse } from '@/features/crawls/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function CrawlDetailsPage() {
    const params = useParams();
    const crawlId = params.id as string;

    const { data: crawlData, isLoading, error } = useQuery({
        queryKey: ['crawl', crawlId],
        queryFn: async () => {
            const response = await getCrawlResult(crawlId);
            return response as CrawlResultResponse;
        }
    });

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
                <div className="text-red-500">
                    Error loading crawl details: {error instanceof Error ? error.message : 'An error occurred'}
                </div>
            </div>
        );
    }

    if (!crawlData?.data?.crawlResult) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-gray-500">Crawl not found</div>
            </div>
        );
    }

    const { crawlResult } = crawlData.data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Crawl Details</h1>
            </div>

            {/* Website Info */}
            <div className="rounded-lg bg-white p-4 shadow">
                <div className="text-sm font-medium text-gray-500">Website</div>
                <div className="mt-1">
                    <div className="text-lg font-semibold text-gray-900">{crawlResult.website.name}</div>
                    <div className="text-sm text-gray-500">{crawlResult.website.url}</div>
                </div>
            </div>

            {/* Crawl Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="text-sm font-medium text-gray-500">Status</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${crawlResult.status === 'completed' ? 'bg-green-100 text-green-800' :
                            crawlResult.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {crawlResult.status.toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="text-sm font-medium text-gray-500">Total Links</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">{crawlResult.totalLinksFound}</div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="text-sm font-medium text-gray-500">Broken Links</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">{crawlResult.brokenLinksFound}</div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="text-sm font-medium text-gray-500">Duration</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                        {(crawlResult.summary.crawlDuration / 1000).toFixed(1)}s
                    </div>
                </div>
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
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {crawlResult.brokenLinkRecords.map((link) => (
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 