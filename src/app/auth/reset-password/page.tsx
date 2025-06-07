import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - DeadLink Watchdog',
  description: 'Set your new password for DeadLink Watchdog',
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  return <ResetPasswordForm token={searchParams.token} />;
}
