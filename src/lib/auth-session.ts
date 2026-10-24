import axios from 'axios';
import {
  clearAuthTokens,
  getRefreshToken,
  setAuthTokens,
} from './auth-storage';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  data?: { tokens?: AuthTokens };
  tokens?: AuthTokens;
  accessToken?: string;
  refreshToken?: string;
}

interface AuthSessionHandlers {
  onTokenRefresh?: (tokens: AuthTokens) => void;
  onAuthError?: () => void;
}

let refreshPromise: Promise<AuthTokens> | null = null;
let handlers: AuthSessionHandlers = {};

export function configureAuthSession(nextHandlers: AuthSessionHandlers): void {
  handlers = nextHandlers;
}

async function performRefresh(baseURL: string): Promise<AuthTokens> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await axios.post<RefreshResponse>(
    `${baseURL}/api/auth/refresh`,
    { refreshToken },
    { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
  );
  const tokens =
    response.data.data?.tokens ?? response.data.tokens ?? response.data;

  if (
    typeof tokens.accessToken !== 'string' ||
    typeof tokens.refreshToken !== 'string'
  ) {
    throw new Error('Invalid token refresh response');
  }

  const refreshedTokens = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
  setAuthTokens(refreshedTokens);
  handlers.onTokenRefresh?.(refreshedTokens);
  return refreshedTokens;
}

export function refreshAuthSession(baseURL: string): Promise<AuthTokens> {
  if (!refreshPromise) {
    refreshPromise = performRefresh(baseURL)
      .catch((error: unknown) => {
        clearAuthTokens();
        handlers.onAuthError?.();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}
