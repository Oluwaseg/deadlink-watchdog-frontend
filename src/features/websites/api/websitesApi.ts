import { getApiClient } from '@/lib/api-client';
import type { Website, WebsitesResponse } from '../types';

const API_BASE = '/api/websites';

// Get websites with pagination and filters
export async function getWebsites(
    page: number = 1,
    limit: number = 10,
    category?: string,
    isActive?: boolean
): Promise<WebsitesResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (category) {
        params.append('category', category);
    }

    if (isActive !== undefined) {
        params.append('isActive', isActive.toString());
    }

    return getApiClient().get(`${API_BASE}?${params.toString()}`);
}

// Get a specific website
export async function getWebsite(id: string): Promise<Website> {
    return getApiClient().get(`${API_BASE}/${id}`);
}

// Create a new website
export async function createWebsite(data: Omit<Website, 'id' | 'createdAt' | 'updatedAt'>): Promise<Website> {
    return getApiClient().post(API_BASE, data);
}

// Update a website
export async function updateWebsite(id: string, data: Partial<Website>): Promise<Website> {
    return getApiClient().put(`${API_BASE}/${id}`, data);
}

// Delete a website
export async function deleteWebsite(id: string): Promise<void> {
    return getApiClient().delete(`${API_BASE}/${id}`);
}

// Trigger manual crawl for a website
export async function triggerCrawl(id: string, crawlDepth?: number): Promise<void> {
    const params = new URLSearchParams();
    if (crawlDepth) {
        params.append('crawlDepth', crawlDepth.toString());
    }
    return getApiClient().post(`${API_BASE}/${id}/crawl?${params.toString()}`);
}

// Get broken links for a website
export async function getWebsiteBrokenLinks(
    id: string,
    page: number = 1,
    limit: number = 10,
    errorType?: string,
    isFixed?: boolean
): Promise<{
    brokenLinks: Array<{
        id: string;
        url: string;
        errorType: string;
        statusCode?: number;
        isFixed: boolean;
        lastChecked: string;
    }>;
    pagination: {
        page: number;
        pages: number;
        total: number;
    };
}> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (errorType) {
        params.append('errorType', errorType);
    }

    if (isFixed !== undefined) {
        params.append('isFixed', isFixed.toString());
    }

    return getApiClient().get(`${API_BASE}/${id}/broken-links?${params.toString()}`);
} 