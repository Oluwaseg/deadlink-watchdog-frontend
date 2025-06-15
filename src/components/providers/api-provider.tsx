'use client';

import { createApiClient } from '@/lib/api-client';
import {
  accessTokenAtom,
  loginAtom,
  logoutAtom,
  refreshTokenAtom,
} from '@/lib/auth-atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

interface ApiProviderProps {
  children: React.ReactNode;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

function getCookieValue(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const accessToken = useAtomValue(accessTokenAtom);
  const refreshToken = useAtomValue(refreshTokenAtom);
  const login = useSetAtom(loginAtom);
  const logout = useSetAtom(logoutAtom);

  useEffect(() => {
    const cookieAccessToken = getCookieValue('accessToken-deadlink-watchdog');
    const cookieRefreshToken = getCookieValue('refreshToken-deadlink-watchdog');
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (cookieAccessToken && cookieRefreshToken && currentUser) {
      login({
        user: currentUser,
        accessToken: cookieAccessToken,
        refreshToken: cookieRefreshToken,
      });
    }

    createApiClient({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      getToken: () => accessToken,
      getRefreshToken: () => refreshToken,
      onTokenRefresh: (newTokens: TokenResponse) => {
        const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (currentUser) {
          login({
            user: currentUser,
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          });
        }
      },
      onAuthError: () => logout(),
    });
  }, [accessToken, refreshToken, login, logout]);

  return <>{children}</>;
}
