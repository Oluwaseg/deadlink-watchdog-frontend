import AuthLayout from '@/components/auth/AuthLayout';
import { VerifyEmailForm } from '@/components/auth/VerifyEmailForm';

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
