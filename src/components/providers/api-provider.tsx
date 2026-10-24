'use client';

import { createApiClient } from '@/lib/api-client';
import { loginAtom, logoutAtom } from '@/lib/auth-atoms';
import { getAccessToken, getRefreshToken } from '@/lib/auth-storage';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

interface ApiProviderProps {
  children: React.ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const login = useSetAtom(loginAtom);
  const logout = useSetAtom(logoutAtom);

  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (currentUser && accessToken && refreshToken) {
        login({ user: currentUser, accessToken, refreshToken });
      }
    } catch (error) {
      console.error('Failed to restore authentication:', error);
    }

    createApiClient({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      onTokenRefresh: (tokens) => {
        try {
          const currentUser = JSON.parse(
            localStorage.getItem('user') || 'null'
          );
          if (currentUser) login({ user: currentUser, ...tokens });
        } catch (error) {
          console.error('Failed to restore user after token refresh:', error);
        }
      },
      onAuthError: () => logout(),
    });
  }, [login, logout]);

  return <>{children}</>;
}
