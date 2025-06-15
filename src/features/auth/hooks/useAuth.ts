import {
  accessTokenAtom,
  authStateAtom,
  loginAtom,
  logoutAtom,
  updateUserAtom,
} from '@/lib/auth-atoms';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import * as authApi from '../api/authApi';
import { User } from '../types';

export const useAuthState = () => {
  return useAtomValue(authStateAtom);
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.registerUser,
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem(
          'pending_verification_email',
          data.data.user.email
        );
        router.push('/auth/verify-email');
      }
    },
  });
};

export const useVerifyEmail = () => {
  const login = useSetAtom(loginAtom);

  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (data) => {
      if (data.data && data.data.tokens) {
        document.cookie = `accessToken-deadlink-watchdog=${data.data.tokens.accessToken}; path=/; secure; samesite=strict; max-age=3600`;
        document.cookie = `refreshToken-deadlink-watchdog=${data.data.tokens.refreshToken}; path=/; secure; samesite=strict; max-age=86400`;

        login({
          user: data.data.user,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
        });

        window.location.href = '/dashboard';
      } else {
        console.error('No tokens in verification response:', data);
      }
    },
    onError: (error) => {
      console.error('Email verification failed:', error);
    },
  });
};

export const useLogin = () => {
  const login = useSetAtom(loginAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.loginUser,
    onSuccess: (data) => {
      if (data.data && data.data.tokens) {
        document.cookie = `accessToken-deadlink-watchdog=${data.data.tokens.accessToken}; path=/; secure; samesite=strict; max-age=3600`;
        document.cookie = `refreshToken-deadlink-watchdog=${data.data.tokens.refreshToken}; path=/; secure; samesite=strict; max-age=86400`;

        login({
          user: data.data.user,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
        });

        queryClient.invalidateQueries({ queryKey: ['user'] });
        window.location.href = '/dashboard';
      }
    },
  });
};

export const useLogout = () => {
  const logout = useSetAtom(logoutAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await authApi.logout();
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      window.location.href = '/auth/login';
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: (data) => console.log('Verification email sent:', data.message),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data) =>
      console.log('Forgot password request successful:', data.message),
    onError: (error) => console.error('Forgot password request failed:', error),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (data) =>
      console.log('Password reset successful:', data.message),
    onError: (error) => console.error('Password reset failed:', error),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: (data) =>
      console.log('Password changed successfully:', data.message),
  });
};

export const useUpdateProfile = () => {
  const updateUser = useSetAtom(updateUserAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      updateUser(data.data.user);
      queryClient.invalidateQueries({ queryKey: ['user', 'current'] });
    },
  });
};

export const useCurrentUser = () => {
  const accessToken = useAtomValue(accessTokenAtom);

  return useQuery<{ success: boolean; data: { user: User } }>({
    queryKey: ['user', 'current'] as const,
    queryFn: authApi.getCurrentUser,
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: { message?: string }) => {
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
