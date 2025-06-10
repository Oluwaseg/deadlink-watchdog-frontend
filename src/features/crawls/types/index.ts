export interface CrawlSummary {
    jobId: string;
    errors: string[];
    scheduledBy: string;
    crawlDuration: number;
}

export interface CrawlResult {
    id: string;
    websiteId: string;
    userId: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    startedAt: string;
    completedAt: string;
    totalLinksFound: number;
    totalLinksChecked: number;
    brokenLinksFound: number;
    redirectsFound: number;
    timeoutsFound: number;
    averageResponseTime: number;
    errorMessage: string | null;
    crawlDepth: number;
    userAgent: string;
    summary: CrawlSummary;
    createdAt: string;
    updatedAt: string;
    website: {
        id: string;
        name: string;
        url: string;
        category: string;
    };
    brokenLinkRecords: CrawlBrokenLink[];
}

export interface CrawlBrokenLink {
    id: string;
    websiteId: string;
    crawlResultId: string;
    url: string;
    sourceUrl: string;
    linkText: string;
    statusCode: number;
    errorType: string;
    errorMessage: string | null;
    responseTime: number;
    redirectChain: string[];
    isFixed: boolean;
    fixedAt: string | null;
    firstDetectedAt: string;
    lastCheckedAt: string;
    checkCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CrawlResultResponse {
    success: boolean;
    data: {
        crawlResult: CrawlResult;
    };
}

export interface CrawlsResponse {
    success: boolean;
    data: {
        crawls: CrawlResult[];
        pagination: {
            page: number;
            pages: number;
            total: number;
        };
    };
} 