'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthForm } from './AuthForm';
import { useLogin } from '../hooks/useAuth';
import { loginSchema } from '../validation/schemas';
import type { LoginForm } from '../types';

const fields = [
  { name: 'email', type: 'email' as const, placeholder: 'john@example.com', label: 'Email' },
  { name: 'password', type: 'password' as const, placeholder: '••••••••', label: 'Password' },
];

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();

  const handleSubmit = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        router.push('/dashboard'); // Redirect to dashboard after login
      },
    });
  };

  const footer = (
    <div className="space-y-3">
      <div className="text-center">
        <Link 
          href="/auth/forgot-password" 
          className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Forgot your password?
        </Link>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link 
            href="/auth/register" 
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );

  return (
    <AuthForm
      title="Sign In"
      fields={fields}
      submitText="Sign In"
      onSubmit={handleSubmit}
      isLoading={loginMutation.isPending}
      error={loginMutation.error?.message}
      validationSchema={loginSchema}
      footer={footer}
    />
  );
}
