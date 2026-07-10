import AuthLayout from '@/features/auth/components/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout
      eyebrow='Welcome back'
      title='Sign in to your watchdog'
      description='Pick up where you left off — your monitors are still running.'
    >
      <LoginForm />
    </AuthLayout>
  );
}
