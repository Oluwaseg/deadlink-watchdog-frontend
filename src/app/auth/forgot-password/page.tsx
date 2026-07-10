import AuthLayout from '@/features/auth/components/AuthLayout';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      eyebrow='Account recovery'
      title='Forgot your password?'
      description="Drop your email and we'll send a secure link to reset it — usually in under a minute."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
