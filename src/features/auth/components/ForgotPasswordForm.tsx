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
import { forgotPassword } from '../api/authApi';
import { forgotPasswordSchema } from '../validation/schemas';

type ForgotPasswordFormData = {
  email: string;
};

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
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
    const validation = forgotPasswordSchema.safeParse(formData);
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

      const response = await forgotPassword(formData);

      if (response.success) {
        setSuccessMessage('Reset password instructions have been sent to your email.');
      } else {
        setErrorMessage(response.message || 'Something went wrong. Please try again.');
      }
    } catch (error: Error | unknown) {
      const err = error instanceof Error ? error : new Error('An error occurred');
      if ('code' in err) {
        setErrorMessage(`${err.code}: ${err.message || 'An error occurred.'}`);
      } else {
        setErrorMessage(err.message || 'An error occurred while processing your request.');
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

  return (
    <div className='w-full'>
      <Card className='border-0 shadow-none lg:shadow-lg lg:border'>
        <CardHeader className='space-y-1 text-center pb-6'>
          <CardTitle className='text-2xl font-bold text-foreground'>
            Forgot Password
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            Enter your email address and we&apos;ll send you instructions to reset your password
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
                  Sending Instructions...
                </div>
              ) : isNavigating ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent'></div>
                  Redirecting...
                </div>
              ) : (
                'Send Reset Instructions'
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
