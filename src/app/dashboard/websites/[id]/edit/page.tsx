'use client';

import { getWebsite, updateWebsite } from '@/features/websites/api/websitesApi';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

interface WebsiteFormData {
    name: string;
    url: string;
    description?: string;
    category?: string;
    crawlFrequency?: 'daily' | 'weekly' | 'monthly';
    notificationEmail?: string;
    webhookUrl?: string;
}

export default function EditWebsitePage() {
    const router = useRouter();
    const params = useParams();
    const websiteId = params.id as string;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<WebsiteFormData>({
        name: '',
        url: '',
        description: undefined,
        category: undefined,
        crawlFrequency: undefined,
        notificationEmail: undefined,
        webhookUrl: undefined,
    });

    const { data: website, isLoading } = useQuery({
        queryKey: ['website', websiteId],
        queryFn: async () => {
            const response = await getWebsite(websiteId);
            setFormData({
                name: response.name,
                url: response.url,
                description: response.description,
                category: response.category,
                crawlFrequency: response.crawlFrequency,
                notificationEmail: response.notificationEmail,
                webhookUrl: response.webhookUrl,
            });
            return response;
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value === '' ? undefined : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await updateWebsite(websiteId, formData);
            router.push('/dashboard/websites');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!website) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-gray-500">Website not found</div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Edit Website</h1>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                        URL
                    </label>
                    <input
                        type="url"
                        name="url"
                        id="url"
                        required
                        value={formData.url}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        name="category"
                        id="category"
                        value={formData.category || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    >
                        <option value="">Select a category</option>
                        <option value="news">News</option>
                        <option value="government">Government</option>
                        <option value="business">Business</option>
                        <option value="education">Education</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="financial">Financial</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="crawlFrequency" className="block text-sm font-medium text-gray-700">
                        Crawl Frequency (Optional)
                    </label>
                    <select
                        name="crawlFrequency"
                        id="crawlFrequency"
                        value={formData.crawlFrequency || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    >
                        <option value="">No automatic crawling</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="notificationEmail" className="block text-sm font-medium text-gray-700">
                        Notification Email (Optional)
                    </label>
                    <input
                        type="email"
                        name="notificationEmail"
                        id="notificationEmail"
                        value={formData.notificationEmail || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700">
                        Webhook URL (Optional)
                    </label>
                    <input
                        type="url"
                        name="webhookUrl"
                        id="webhookUrl"
                        value={formData.webhookUrl || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
} 