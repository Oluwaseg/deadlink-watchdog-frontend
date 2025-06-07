'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { createApiClient } from '@/lib/api-client';
import { 
  accessTokenAtom, 
  refreshTokenAtom, 
  loginAtom, 
  logoutAtom 
} from '@/lib/auth-atoms';

interface ApiProviderProps {
  children: React.ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const accessToken = useAtomValue(accessTokenAtom);
  const refreshToken = useAtomValue(refreshTokenAtom);
  const login = useSetAtom(loginAtom);
  const logout = useSetAtom(logoutAtom);

  useEffect(() => {
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
  }, [accessToken, refreshToken, login, logout]);

  return <>{children}</>;
}
