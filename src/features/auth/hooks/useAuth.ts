import {
  accessTokenAtom,
  authStateAtom,
  loginAtom,
  logoutAtom,
  updateUserAtom,
} from '@/lib/auth-atoms';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import * as authApi from '../api/authApi';

// Custom hooks
export const useAuthState = () => {
  return useAtomValue(authStateAtom);
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.registerUser,
    onSuccess: (data) => {
      console.log('Registration successful:', data.message);
    },
  });
};

export const useVerifyEmail = () => {
  const login = useSetAtom(loginAtom);

  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (data) => {
      console.log('Email verification response:', data);
      // Verification always returns tokens according to backend
      if (data.data && data.data.tokens) {
        console.log('Logging in user after verification:', data.data.user);
        login({
          user: data.data.user,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
        });
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
      // Store auth data in atoms
      if (data.data && data.data.tokens) {
        login({
          user: data.data.user,
          accessToken: data.data.tokens.accessToken,
          refreshToken: data.data.tokens.refreshToken,
        });
      }

      // Invalidate any user-specific queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const logout = useSetAtom(logoutAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Optional: Call logout endpoint if you have one
      // await authApi.logout();
    },
    onSuccess: () => {
      logout();
      // Clear all cached data
      queryClient.clear();
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: (data) => {
      console.log('Verification email sent:', data.message);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data) => {
      console.log('Forgot password request successful:', data.message);
    },
    onError: (error) => {
      console.error('Forgot password request failed:', error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (data) => {
      console.log('Password reset successful:', data.message);
    },
    onError: (error) => {
      console.error('Password reset failed:', error);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: (data) => {
      console.log('Password changed successfully:', data.message);
    },
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

// Hook to get current user (with automatic token injection)
export const useCurrentUser = () => {
  const accessToken = useAtomValue(accessTokenAtom);

  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: authApi.getCurrentUser,
    enabled: !!accessToken, // Only run if we have a token
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if it's an auth error
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
