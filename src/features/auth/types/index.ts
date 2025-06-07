// Auth types matching your backend
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  emailVerified: boolean;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens?: AuthTokens;
    requiresVerification?: boolean;
  };
}

// Form types
export interface RegisterForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface VerifyEmailForm {
  email: string;
  code: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  token: string;
  newPassword: string;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
}

export interface ResendVerificationForm {
  email: string;
}
