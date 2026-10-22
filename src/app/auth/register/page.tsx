import AuthLayout from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

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
