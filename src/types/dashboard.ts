export interface Website {
  id: string;
  name: string;
  url: string;
  healthScore: number;
  totalLinks: number;
  brokenLinks: number;
}

export interface CrawlActivity {
  id: string;
  status: string;
  brokenLinksFound: number;
  totalLinksChecked: number;
  createdAt: string;
  website: {
    name: string;
    url: string;
  };
}

export interface DashboardOverview {
  totalWebsites: number;
  activeWebsites: number;
  totalCrawls: number;
  recentCrawls: number;
  totalBrokenLinks: number;
  recentBrokenLinks: number;
  averageHealthScore: number;
}

export interface DashboardData {
  success: boolean;
  data: {
    overview: DashboardOverview;
    topIssues: Website[];
    recentActivity: CrawlActivity[];
  };
} 