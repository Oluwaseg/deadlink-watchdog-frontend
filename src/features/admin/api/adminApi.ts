import { getApiClient } from '@/lib/api-client';
import type {
  AdminStatsResponse,
  QueueResponse,
  UserAnalytics,
  UsersResponse,
  WebsiteAnalytics,
  WebsitesModerationResponse
} from '../types';

const API_BASE = '/api/admin';

// Get system-wide statistics
export const getAdminStats = () => {
    return getApiClient().get<AdminStatsResponse>(`${API_BASE}/stats`);
};

// Get all users with pagination and filtering
export const getUsers = ({ page = 1, limit = 20, role }: { page?: number; limit?: number; role?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    if (role) queryParams.append('role', role);
    return getApiClient().get<UsersResponse>(`${API_BASE}/users?${queryParams.toString()}`);
};

// Update user status
export const updateUserStatus = (userId: string, status: 'active' | 'suspended') => {
    return getApiClient().put(`${API_BASE}/users/${userId}/status`, { status });
};

// Update user role
export const updateUserRole = (userId: string, role: 'user' | 'admin') => {
    return getApiClient().put(`${API_BASE}/users/${userId}/role`, { role });
};

// Get websites requiring moderation
export const getWebsitesModeration = ({ page = 1, limit = 20, status }: { page?: number; limit?: number; status?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (limit) queryParams.append('limit', limit.toString());
    if (status) queryParams.append('status', status);
    return getApiClient().get<WebsitesModerationResponse>(`${API_BASE}/websites/moderation?${queryParams.toString()}`);
};

// Moderate a website
export const moderateWebsite = (websiteId: string, action: 'block' | 'unblock') => {
    return getApiClient().put(`${API_BASE}/websites/${websiteId}/moderate`, { action });
};

// Get queue statistics and jobs
export const getQueueStats = () => {
    return getApiClient().get<QueueResponse>(`${API_BASE}/queue`);
};

// Get website analytics
export const getWebsiteAnalytics = (period: string = '7d') => {
    return getApiClient().get<WebsiteAnalytics>(`${API_BASE}/analytics/websites?period=${period}`);
};

// Get user analytics
export const getUserAnalytics = (period: string = '7d') => {
    return getApiClient().get<UserAnalytics>(`${API_BASE}/analytics/users?period=${period}`);
}; 