'use client';

import AuthLayout from '@/features/auth/components/AuthLayout';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  return (
    <AuthLayout
      eyebrow='Set a new password'
      title='Choose a strong new password'
      description="Pick something you haven't used before. We'll sign you in right after."
    >
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}
