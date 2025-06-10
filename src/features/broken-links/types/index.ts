export interface BrokenLink {
    id: string;
    url: string;
    sourceUrl: string;
    errorType: string;
    statusCode: number;
    createdAt: string;
}

export interface ErrorSummary {
    errorType: string;
    count: number;
}

export interface BrokenLinksResponse {
    success: boolean;
    data: {
        summary: ErrorSummary[];
        recentBrokenLinks: BrokenLink[];
    };
} 