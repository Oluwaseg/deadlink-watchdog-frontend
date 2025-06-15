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
import { AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { resetPassword } from '../api/authApi';
import { resetPasswordSchema } from '../validation/schemas';

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
  token: string;
};

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: '',
    token
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setErrors({});

    // Validate form data
    const validation = resetPasswordSchema.safeParse(formData);
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
      setErrorMessage('');
      setSuccessMessage('');

      const response = await resetPassword({
        ...formData,
        token
      });

      if (response.success) {
        setSuccessMessage('Password reset successfully! Redirecting to sign in...');
        setTimeout(() => {
          setIsNavigating(true);
          router.push('/auth/login');
        }, 1500);
      } else {
        setErrorMessage(response.message || 'Something went wrong. Please try again.');
      }
    } catch (error: Error | unknown) {
      const err = error instanceof Error ? error : new Error('An error occurred');
      if ('code' in err) {
        setErrorMessage(`${err.code}: ${err.message || 'An error occurred.'}`);
      } else {
        setErrorMessage(err.message || 'An error occurred while resetting your password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    router.push('/auth/login');
  };

  if (!token) {
    return (
      <div className='w-full'>
        <Card className='border-0 shadow-none lg:shadow-lg lg:border'>
          <CardContent className='pt-6'>
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                Invalid or missing reset token. Please request a new password reset link.
              </AlertDescription>
            </Alert>
            <div className='mt-4 text-center'>
              <Link
                href='/auth/login'
                onClick={handleBackToLogin}
                className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors'
              >
                {isNavigating ? (
                  <>
                    <div className='h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
                    Redirecting...
                  </>
                ) : (
                  <>
                    <ArrowLeft className='h-3 w-3' />
                    Back to Sign In
                  </>
                )}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <Card className='border-0 shadow-none lg:shadow-lg lg:border'>
        <CardHeader className='space-y-1 text-center pb-6'>
          <CardTitle className='text-2xl font-bold text-foreground'>
            Reset Password
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='newPassword'>New Password</Label>
              <Input
                id='newPassword'
                type='password'
                placeholder='••••••••'
                value={formData.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                className={errors.newPassword ? 'border-destructive' : ''}
                disabled={isLoading || isNavigating}
              />
              {errors.newPassword && (
                <p className='text-sm text-destructive flex items-center gap-1'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='••••••••'
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? 'border-destructive' : ''}
                disabled={isLoading || isNavigating}
              />
              {errors.confirmPassword && (
                <p className='text-sm text-destructive flex items-center gap-1'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {errorMessage && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className='border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200'>
                <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
                <AlertDescription className='text-green-800 dark:text-green-200'>
                  {successMessage}
                </AlertDescription>
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
                  Resetting Password...
                </div>
              ) : isNavigating ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent'></div>
                  Redirecting...
                </div>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>

          <div className='text-center'>
            <Link
              href='/auth/login'
              onClick={handleBackToLogin}
              className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors'
            >
              {isNavigating ? (
                <>
                  <div className='h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
                  Redirecting...
                </>
              ) : (
                <>
                  <ArrowLeft className='h-3 w-3' />
                  Back to Sign In
                </>
              )}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
