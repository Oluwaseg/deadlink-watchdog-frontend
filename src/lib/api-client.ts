import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { AuthTokens } from './auth-session';
import { configureAuthSession, refreshAuthSession } from './auth-session';
import { getAccessToken } from './auth-storage';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const AUTH_REQUESTS_WITHOUT_REFRESH = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify-email',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/resend-verification',
];

export interface ApiClientOptions {
  baseURL?: string;
  onTokenRefresh?: (tokens: AuthTokens) => void;
  onAuthError?: () => void;
}

export class ApiClient {
  private readonly client: AxiosInstance;

  constructor(options: ApiClientOptions = {}) {
    this.client = axios.create({
      baseURL: options.baseURL || '',
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    configureAuthSession({
      onTokenRefresh: options.onTokenRefresh,
      onAuthError: options.onAuthError,
    });

    this.client.interceptors.request.use((config) => {
      const token = getAccessToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const request = error.config as RetryableRequestConfig | undefined;
        const requestUrl = request?.url ?? '';
        const isAuthRequestWithoutRefresh = AUTH_REQUESTS_WITHOUT_REFRESH.some(
          (path) => requestUrl.includes(path)
        );

        if (isAuthRequestWithoutRefresh) return Promise.reject(error);

        if (error.response?.status !== 401 || !request || request._retry) {
          return Promise.reject(error);
        }

        const currentToken = getAccessToken();
        const requestAuthorization = request.headers.get('Authorization');
        if (currentToken && requestAuthorization !== `Bearer ${currentToken}`) {
          request._retry = true;
          request.headers.Authorization = `Bearer ${currentToken}`;
          return this.client(request);
        }

        request._retry = true;

        try {
          const tokens = await refreshAuthSession(
            request.baseURL ?? this.client.defaults.baseURL ?? ''
          );
          request.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return this.client(request);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    );
  }

  async request<T = unknown>(
    endpoint: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> {
    const response = await this.client.request<T>({
      ...options,
      url: endpoint,
    });
    return response.data;
  }

  get<T = unknown>(endpoint: string, options?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', data });
  }

  put<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', data });
  }

  delete<T = unknown>(
    endpoint: string,
    options?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', data });
  }
}

let apiClientInstance: ApiClient | null = null;

export const createApiClient = (options: ApiClientOptions = {}): ApiClient => {
  apiClientInstance = new ApiClient(options);
  return apiClientInstance;
};

export const getApiClient = (): ApiClient => {
  if (!apiClientInstance) {
    throw new Error('API client not initialized. Call createApiClient first.');
  }
  return apiClientInstance;
};
