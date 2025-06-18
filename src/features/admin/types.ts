export interface AdminStats {
  totalUsers: number;
  totalWebsites: number;
  totalCrawls: number;
  totalBrokenLinks: number;
  activeWebsites: number;
  recentUsers: Array<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
  }>;
  queueStats: {
    crawl: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
      delayed: number;
    };
    notification: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
      delayed: number;
    };
  };
}

export interface AdminStatsResponse {
  success: boolean;
  data: AdminStats;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface Website {
  id: string;
  url: string;
  isActive: boolean;
  isFlagged: boolean;
  reports: number;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface WebsitesModerationResponse {
  success: boolean;
  data: {
    websites: Website[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface QueueStats {
  crawl: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  };
  notification: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  };
}

export interface QueueResponse {
  success: boolean;
  data: {
    stats: QueueStats;
    activeJobs: Array<{
      id: string;
      name: string;
      status: string;
      createdAt: string;
    }>;
  };
}

export interface WebsiteAnalytics {
  success: boolean;
  data: {
    totalWebsites: number;
    activeWebsites: number;
    websitesByCategory: Record<string, number>;
    websitesByStatus: {
      active: number;
      inactive: number;
    };
    newWebsites: Array<{
      id: string;
      url: string;
      category: string;
      isActive: boolean;
      createdAt: string;
    }>;
  };
}

export interface UserAnalytics {
  success: boolean;
  data: {
    totalUsers: number;
    activeUsers: number;
    usersByRole: {
      user: number;
      admin: number;
    };
    newUsers: Array<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      createdAt: string;
    }>;
  };
} 