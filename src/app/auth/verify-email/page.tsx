import AuthLayout from '@/features/auth/components/AuthLayout';
import { VerifyEmailForm } from '@/features/auth/components/VerifyEmailForm';

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      eyebrow='One last step'
      title='Verify your email'
      description='Enter the 6-digit code we just sent to confirm this is really you.'
    >
      <VerifyEmailForm />
    </AuthLayout>
  );
}
