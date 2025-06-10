'use client';

import { createApiClient } from '@/lib/api-client';
import {
  accessTokenAtom,
  loginAtom,
  logoutAtom,
  refreshTokenAtom
} from '@/lib/auth-atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';

interface ApiProviderProps {
  children: React.ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const accessToken = useAtomValue(accessTokenAtom);
  const refreshToken = useAtomValue(refreshTokenAtom);
  const login = useSetAtom(loginAtom);
  const logout = useSetAtom(logoutAtom);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Skip initialization if tokens are null and we haven't initialized yet
    // This prevents the API client from being initialized with null tokens
    if (!accessToken && !refreshToken && !isInitialized.current) {
      return;
    }

    // Initialize API client with token management
    createApiClient({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      getToken: () => accessToken,
      getRefreshToken: () => refreshToken,
      onTokenRefresh: (newTokens) => {
        // Update tokens in Jotai atoms when refreshed
        const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (currentUser) {
          login({
            user: currentUser,
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          });
        }
      },
      onAuthError: () => {
        // Clear auth state when auth fails
        logout();
      },
    });

    isInitialized.current = true;
  }, [accessToken, refreshToken, login, logout]);

  return <>{children}</>;
}
