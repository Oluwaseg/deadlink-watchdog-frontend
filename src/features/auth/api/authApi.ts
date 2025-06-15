import { getApiClient } from '@/lib/api-client';
import type {
  AuthResponse,
  ChangePasswordForm,
  ForgotPasswordForm,
  LoginForm,
  RegisterForm,
  ResendVerificationForm,
  ResetPasswordForm,
  User,
  VerifyEmailForm,
} from '../types';

const API_BASE = '/api/auth';

// Register user
export const registerUser = async (
  data: RegisterForm
): Promise<AuthResponse> => {
  const apiClient = getApiClient();
  return apiClient.post(`${API_BASE}/register`, data);
};

// Login user
export const loginUser = async (data: LoginForm): Promise<AuthResponse> => {
  const apiClient = getApiClient();
  return apiClient.post(`${API_BASE}/login`, data);
};

// Verify email
export const verifyEmail = async (
  data: VerifyEmailForm
): Promise<AuthResponse> => {
  const apiClient = getApiClient();
  return apiClient.post(`${API_BASE}/verify-email`, data);
};

// Resend verification email
export const resendVerification = async (
  data: ResendVerificationForm
): Promise<{ success: boolean; message: string }> => {
  const apiClient = getApiClient();
  return apiClient.post(`${API_BASE}/resend-verification`, data);
};

// Refresh token
export const refreshToken = async (
  refreshToken: string
): Promise<AuthResponse> => {
  const apiClient = getApiClient();
  return apiClient.post(`${API_BASE}/refresh`, { refreshToken });
};

// Get current user
export const getCurrentUser = async (): Promise<{
  success: boolean;
  data: { user: User };
}> => {
  const apiClient = getApiClient();
  return apiClient.get(`${API_BASE}/me`);
};

// Update profile
export const updateProfile = async (
  data: Partial<Pick<User, 'firstName' | 'lastName' | 'email'>>
): Promise<{ success: boolean; message: string; data: { user: User } }> => {
  const apiClient = getApiClient();
  return apiClient.put(`${API_BASE}/profile`, data);
};

// Change password
export const changePassword = async (
  data: ChangePasswordForm
): Promise<{ success: boolean; message: string }> => {
  const apiClient = getApiClient();
  return apiClient.put(`${API_BASE}/change-password`, data);
};

// Forgot password
export const forgotPassword = async (
  data: ForgotPasswordForm
): Promise<{ success: boolean; message: string }> => {
  const apiClient = getApiClient();
  return apiClient.post(`${API_BASE}/forgot-password`, data);
};

// Reset password
export const resetPassword = async (
  data: ResetPasswordForm
): Promise<{ success: boolean; message: string }> => {
  const apiClient = getApiClient();
  return apiClient.post(`${API_BASE}/reset-password`, data);
};

// Logout
export const logout = async (): Promise<void> => {
  // Clear all auth-related items from localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('auth-state');

  // Clear cookies with proper attributes
  document.cookie =
    'accessToken-deadlink-watchdog=; path=/; secure; samesite=strict; max-age=0';
  document.cookie =
    'refreshToken-deadlink-watchdog=; path=/; secure; samesite=strict; max-age=0';
};
