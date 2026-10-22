export interface Website {
  id: string;
  name: string;
  url: string;
  description?: string;
  category?: string;
  crawlFrequency?: 'daily' | 'weekly' | 'monthly';
  notificationEmail?: string;
  webhookUrl?: string;
  isActive: boolean;
  healthScore: number;
  totalLinks: number;
  brokenLinks?: number;
  lastCrawledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteFormData {
  name: string;
  url: string;
  description?: string;
  category?: string;
  crawlFrequency?: 'daily' | 'weekly' | 'monthly';
  notificationEmail?: string;
  webhookUrl?: string;
}

export interface WebsiteResponse {
  success: boolean;
  data: {
    website: Website;
  };
}

export interface WebsitesResponse {
  success: boolean;
  data: {
    websites: Website[];
    pagination: {
      page: number;
      pages: number;
      total: number;
    };
  };
} 