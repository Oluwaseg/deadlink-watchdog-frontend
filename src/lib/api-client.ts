export interface ApiClientOptions {
  baseURL?: string;
  getToken?: () => string | null;
  getRefreshToken?: () => string | null;
  onTokenRefresh?: (newTokens: {
    accessToken: string;
    refreshToken: string;
  }) => void;
  onAuthError?: () => void;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class ApiClient {
  private baseURL: string;
  private onTokenRefresh?: (newTokens: {
    accessToken: string;
    refreshToken: string;
  }) => void;
  private onAuthError?: () => void;
  private isRefreshing = false;
  private refreshPromise: Promise<RefreshTokenResponse> | null = null;
  private tokenCookieName = 'accessToken-deadlink-watchdog';
  private refreshTokenCookieName = 'refreshToken-deadlink-watchdog';

  constructor(options: ApiClientOptions) {
    this.baseURL = options.baseURL || '';
    this.onTokenRefresh = options.onTokenRefresh;
    this.onAuthError = options.onAuthError;
  }

  private async refreshAccessToken(): Promise<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  private getToken(): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${this.tokenCookieName}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  private getRefreshToken(): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${this.refreshTokenCookieName}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add auth header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Make the request
    let response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Handle 401 - try to refresh token
    if (response.status === 401 && token && this.getRefreshToken()) {
      try {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshPromise = this.refreshAccessToken();
        }

        const newTokens = await this.refreshPromise!;
        this.onTokenRefresh?.(newTokens);

        // Retry the original request with new token
        headers.Authorization = `Bearer ${newTokens.accessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });

        this.isRefreshing = false;
        this.refreshPromise = null;
      } catch {
        this.isRefreshing = false;
        this.refreshPromise = null;
        this.onAuthError?.();
        throw new Error('Authentication failed');
      }
    }

    // Handle other errors
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}`,
        status: response.status,
      }));
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  get<T = unknown>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T = unknown>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

let apiClientInstance: ApiClient | null = null;

export const createApiClient = (options: ApiClientOptions): ApiClient => {
  apiClientInstance = new ApiClient(options);
  return apiClientInstance;
};

export const getApiClient = (): ApiClient => {
  if (!apiClientInstance) {
    throw new Error('API client not initialized. Call createApiClient first.');
  }
  return apiClientInstance;
};
