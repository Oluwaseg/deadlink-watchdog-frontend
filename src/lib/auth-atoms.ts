import { User } from '@/types';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { clearAuthTokens } from './auth-storage';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// Regular atoms for tokens (not persisted to localStorage)
export const accessTokenAtom = atom<string | null>(null);
export const refreshTokenAtom = atom<string | null>(null);
export const userAtom = atomWithStorage<User | null>('user', null);

// Derived atom for authentication status
export const isAuthenticatedAtom = atom((get) => {
  const token = get(accessTokenAtom);
  const user = get(userAtom);
  return !!(token && user);
});

// Combined auth state atom
export const authStateAtom = atom((get) => ({
  user: get(userAtom),
  accessToken: get(accessTokenAtom),
  refreshToken: get(refreshTokenAtom),
  isAuthenticated: get(isAuthenticatedAtom),
}));

// Auth actions
export const loginAtom = atom(
  null,
  (
    get,
    set,
    {
      user,
      accessToken,
      refreshToken,
    }: {
      user: User;
      accessToken: string;
      refreshToken: string;
    }
  ) => {
    set(userAtom, user);
    set(accessTokenAtom, accessToken);
    set(refreshTokenAtom, refreshToken);
  }
);

export const logoutAtom = atom(null, (get, set) => {
  // Clear Jotai atoms
  set(userAtom, null);
  set(accessTokenAtom, null);
  set(refreshTokenAtom, null);

  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('auth-state');
  }
  clearAuthTokens();
});

export const updateUserAtom = atom(null, (get, set, user: User) => {
  set(userAtom, user);
});
