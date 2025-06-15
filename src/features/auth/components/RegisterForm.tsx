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
import { useRegister } from '../hooks/useAuth';
import type { RegisterForm } from '../types';
import { registerSchema } from '../validation/schemas';

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [isNavigating, setIsNavigating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
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
    const validation = registerSchema.safeParse(formData);
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
      registerMutation.mutate(formData, {
        onSuccess: (response) => {
          if (response.success) {
            setSuccessMessage(
              'Account created successfully! Redirecting to verification page...'
            );
          } else {
            setErrorMessage(response.message || 'Request failed');
          }
        },
        onError: (error: Error | unknown) => {
          const err = error instanceof Error ? error : new Error('An error occurred');
          if ('code' in err) {
            setErrorMessage(err.message || 'An error occurred.');
          } else {
            setErrorMessage(err.message || 'Request failed');
          }
        },
      });
    } catch {
      setErrorMessage('An error occurred while creating your account.');
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
            Create an Account
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            Enter your information to create your account
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  placeholder='John'
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-destructive' : ''}
                  disabled={registerMutation.isPending || isNavigating}
                />
                {errors.firstName && (
                  <p className='text-sm text-destructive flex items-center gap-1'>
                    <AlertCircle className='h-3 w-3' />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  placeholder='Doe'
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-destructive' : ''}
                  disabled={registerMutation.isPending || isNavigating}
                />
                {errors.lastName && (
                  <p className='text-sm text-destructive flex items-center gap-1'>
                    <AlertCircle className='h-3 w-3' />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='name@example.com'
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                disabled={registerMutation.isPending || isNavigating}
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
                disabled={registerMutation.isPending || isNavigating}
              />
              {errors.password && (
                <p className='text-sm text-destructive flex items-center gap-1'>
                  <AlertCircle className='h-3 w-3' />
                  {errors.password}
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
              disabled={registerMutation.isPending || isNavigating}
              className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'
              size='lg'
            >
              {registerMutation.isPending ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent'></div>
                  Creating Account...
                </div>
              ) : isNavigating ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent'></div>
                  Redirecting...
                </div>
              ) : (
                'Create Account'
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
                  Already have an account? Sign in
                </>
              )}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
