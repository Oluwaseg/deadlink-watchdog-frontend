import { useQuery } from '@tanstack/react-query';
import { getBrokenLinks } from '../api/brokenLinksApi';

export const useBrokenLinks = (page: number = 1, limit: number = 20, errorType?: string, isFixed?: boolean) => {
    return useQuery({
        queryKey: ['brokenLinks', page, limit, errorType, isFixed],
        queryFn: () => getBrokenLinks({ page, limit, errorType, isFixed }),
    });
}; 