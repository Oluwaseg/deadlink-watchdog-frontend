export interface BrokenLink {
  id: string;
  url: string;
  sourceUrl: string;
  errorType: string;
  statusCode: number | null;
  isFixed: boolean;
  fixedAt: string | null;
  createdAt: string;
}

export interface ErrorSummary {
  errorType: string;
  count: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface BrokenLinksResponse {
  success: boolean;
  data: {
    summary: ErrorSummary[];
    recentBrokenLinks: BrokenLink[];
    pagination: Pagination;
  };
}
