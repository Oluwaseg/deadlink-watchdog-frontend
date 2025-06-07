import { z } from 'zod';

export const validateData = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((issue) => {
      const key = issue.path.join('.');
      errors[key] = issue.message;
    });
    return { isValid: false, errors, data: null };
  }

  return { isValid: true, errors: {}, data: result.data };
};

// Password schema (exported for reuse)
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long');

// Register schema
export const registerSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: passwordSchema,
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required'),
});

// Email verification schema
export const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^[0-9]+$/, 'Verification code must contain only numbers'),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email'),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Reset token is required' }),
  newPassword: passwordSchema,
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string({ required_error: 'Current password is required' }),
  newPassword: passwordSchema,
});

// Resend verification schema
export const resendVerificationSchema = z.object({
  email: z.string().email('Please provide a valid email'),
});
