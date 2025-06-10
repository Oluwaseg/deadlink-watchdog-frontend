import { useQuery } from '@tanstack/react-query';
import { getWebsites } from '../api/websitesApi';
import type { WebsitesResponse } from '../types';

export function useWebsites(
    page: number = 1,
    limit: number = 10,
    category?: string,
    isActive?: boolean
) {
    return useQuery<WebsitesResponse>({
        queryKey: ['websites', page, limit, category, isActive],
        queryFn: () => getWebsites(page, limit, category, isActive),
    });
} 