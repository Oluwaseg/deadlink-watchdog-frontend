import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - DeadLink Watchdog',
  description: 'Reset your password for DeadLink Watchdog',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
