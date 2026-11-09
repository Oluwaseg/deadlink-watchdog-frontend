export interface FeedbackRecord {
  id: string;
  triedProduct: 'regularly' | 'once_or_twice' | 'not_yet';
  usefulFeature:
    | 'monitoring'
    | 'alerts'
    | 'reports'
    | 'crawling'
    | 'collaboration';
  frustration: string | null;
  usageFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  wouldPay: 'yes' | 'maybe' | 'free_only' | 'unsure';
  createdAt: string;
}

export interface FeedbackListResponse {
  success: boolean;
  data: {
    feedback: FeedbackRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface FeedbackDetailResponse {
  success: boolean;
  data: { feedback: FeedbackRecord };
}

export type FeedbackSubmission = Omit<
  FeedbackRecord,
  'id' | 'createdAt' | 'frustration'
> & { frustration?: string };
