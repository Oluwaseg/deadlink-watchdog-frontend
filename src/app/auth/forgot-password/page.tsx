import AuthLayout from '@/components/auth/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

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
