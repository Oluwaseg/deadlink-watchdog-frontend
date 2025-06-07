'use client';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { forgotPassword } from '../api/authApi';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await forgotPassword(data);

      if (response.success) {
        setSuccessMessage(
          'Reset password instructions have been sent to your email.'
        );
      } else {
        setErrorMessage(
          response.message || 'Something went wrong. Please try again.'
        );
      }
    } catch (error) {
      setErrorMessage('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='grid gap-6'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
              {...register('email')}
            />
            {errors.email && (
              <p className='text-sm text-destructive'>{errors.email.message}</p>
            )}
          </div>

          {errorMessage && <Alert variant='destructive'>{errorMessage}</Alert>}

          {successMessage && <Alert>{successMessage}</Alert>}

          <Button disabled={isLoading}>
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                <span>Please wait...</span>
              </div>
            ) : (
              'Send Reset Instructions'
            )}
          </Button>
        </div>
      </form>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>Or</span>
        </div>
      </div>

      <Button
        variant='outline'
        onClick={() => (window.location.href = '/auth/login')}
      >
        Back to Login
      </Button>
    </div>
  );
}
