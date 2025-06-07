'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegister } from '../hooks/useAuth';
import type { RegisterForm } from '../types';
import { registerSchema } from '../validation/schemas';
import { AuthForm } from './AuthForm';

const fields = [
  {
    name: 'firstName',
    type: 'text' as const,
    placeholder: 'John',
    label: 'First Name',
  },
  {
    name: 'lastName',
    type: 'text' as const,
    placeholder: 'Doe',
    label: 'Last Name',
  },
  {
    name: 'email',
    type: 'email' as const,
    placeholder: 'john@example.com',
    label: 'Email',
  },
  {
    name: 'password',
    type: 'password' as const,
    placeholder: '••••••••',
    label: 'Password',
  },
];

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();

  const handleSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        // Store email for verification page
        localStorage.setItem('pendingVerificationEmail', data.email);
        router.push('/auth/verify-email');
      },
    });
  };

  const footer = (
    <div className='text-center'>
      <p className='text-sm text-muted-foreground'>
        Already have an account?{' '}
        <Link
          href='/auth/login'
          className='font-medium text-primary hover:text-primary/80 transition-colors'
        >
          Sign in
        </Link>
      </p>
    </div>
  );

  return (
    <AuthForm
      title='Create Account'
      fields={fields}
      submitText='Create Account'
      onSubmit={handleSubmit}
      isLoading={registerMutation.isPending}
      error={registerMutation.error?.message}
      success={
        registerMutation.isSuccess
          ? 'Account created! Please check your email for verification.'
          : undefined
      }
      validationSchema={registerSchema}
      footer={footer}
    />
  );
}
