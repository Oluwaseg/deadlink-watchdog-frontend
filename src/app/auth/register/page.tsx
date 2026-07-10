import AuthLayout from '@/features/auth/components/AuthLayout';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout
      eyebrow='Create account'
      title='Start monitoring in minutes'
      description='Free tier includes 10 monitors and email alerts.'
    >
      <RegisterForm />
    </AuthLayout>
  );
}
