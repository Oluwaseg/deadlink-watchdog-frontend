'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { resendVerification } from '../api/authApi';
import { useLogin } from '../hooks/useAuth';
import { loginSchema } from '../validation/schemas';

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setEmailNotVerified(false);
    setResendStatus('idle');
    setResendMessage('');

    // Validate form data
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    try {
      setIsLoading(true);
      loginMutation.mutate(formData, {
        onSuccess: (response) => {
          if (response.success) {
            setIsNavigating(true);
            router.push('/dashboard');
          } else {
            setErrorMessage(response.message || 'Request failed');
          }
        },
        onError: (error: Error | unknown) => {
          const err = error instanceof Error ? error : new Error('An error occurred');
          if ('code' in err && err.code === 'EMAIL_NOT_VERIFIED') {
            setEmailNotVerified(true);
            setUnverifiedEmail(formData.email);
            setErrorMessage(err.message || 'Please verify your email before logging in.');
          } else {
            setErrorMessage(err.message || 'Request failed');
          }
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendStatus('loading');
    setResendMessage('');
    try {
      const res = await resendVerification({ email: unverifiedEmail });
      if (res.success) {
        setResendStatus('success');
        setResendMessage(res.message || 'Verification email sent! Please check your inbox.');
        // Store email for the verify page
        localStorage.setItem('pendingVerificationEmail', unverifiedEmail);
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/auth/verify-email');
        }, 1200);
      } else {
        setResendStatus('error');
        setResendMessage(res.message || 'Failed to send verification email.');
      }
    } catch (err: Error | unknown) {
      setResendStatus('error');
      const error = err instanceof Error ? err : new Error('Failed to send verification email');
      setResendMessage(error.message);
    }
  };

  return (
    <div className='w-full'>
      <Card className='border-0 shadow-none lg:shadow-lg lg:border'>
        <CardHeader className='space-y-1 text-center pb-6'>
          <CardTitle className='text-2xl font-bold text-foreground'>Sign In</CardTitle>
          <CardDescription className='text-muted-foreground'>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='name@example.com'
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                disabled={isLoading || isNavigating}
              />
              {errors.email && (
                <p className='text-sm text-destructive flex items-center gap-1'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.email}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={errors.password ? 'border-destructive' : ''}
                disabled={isLoading || isNavigating}
              />
              {errors.password && (
                <p className='text-sm text-destructive flex items-center gap-1'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.password}
                </p>
              )}
            </div>

            {emailNotVerified && (
              <Alert variant='destructive' className='flex flex-col gap-2'>
                <MailCheck className='h-4 w-4 text-yellow-500' />
                <AlertDescription>
                  Please verify your email before logging in.
                </AlertDescription>
                <Button
                  type='button'
                  onClick={handleResendVerification}
                  disabled={resendStatus === 'loading'}
                  className='w-fit mt-2 bg-yellow-500 hover:bg-yellow-600 text-white'
                >
                  {resendStatus === 'loading' ? (
                    <span className='flex items-center gap-2'>
                      <Loader2 className='h-4 w-4 animate-spin' /> Sending...
                    </span>
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>
                {resendStatus === 'success' && (
                  <span className='text-green-600 text-sm'>{resendMessage}</span>
                )}
                {resendStatus === 'error' && (
                  <span className='text-destructive text-sm'>{resendMessage}</span>
                )}
              </Alert>
            )}

            {errorMessage && (!emailNotVerified || resendStatus === 'error') && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <Button
              type='submit'
              disabled={isLoading || isNavigating}
              className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'
              size='lg'
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent'></div>
                  Signing In...
                </div>
              ) : isNavigating ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent'></div>
                  Redirecting...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className='text-center'>
            <Link
              href='/auth/forgot-password'
              className='text-sm font-medium text-primary hover:text-primary/80 transition-colors'
            >
              Forgot your password?
            </Link>
          </div>
          <div className='text-center'>
            <span className='text-sm text-muted-foreground'>
              Don&apos;t have an account?{' '}
              <Link
                href='/auth/register'
                className='font-medium text-primary hover:text-primary/80 transition-colors'
              >
                Sign up
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
