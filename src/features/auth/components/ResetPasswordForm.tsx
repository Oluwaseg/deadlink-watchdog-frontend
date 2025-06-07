'use client';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { resetPassword } from '../api/authApi';
import { passwordSchema } from '../validation/schemas';

const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await resetPassword({
        token,
        newPassword: data.newPassword,
      });

      if (response.success) {
        router.push(
          '/auth/login?message=Your password has been reset successfully. Please log in.'
        );
      } else {
        setErrorMessage(
          response.message || 'Something went wrong. Please try again.'
        );
      }
    } catch (error) {
      setErrorMessage('An error occurred while resetting your password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Alert variant='destructive'>
        Invalid or missing reset token. Please request a new password reset
        link.
      </Alert>
    );
  }

  return (
    <div className='grid gap-6'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='newPassword'>New Password</Label>
            <Input
              id='newPassword'
              type='password'
              autoComplete='new-password'
              disabled={isLoading}
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className='text-sm text-destructive'>
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <Input
              id='confirmPassword'
              type='password'
              autoComplete='new-password'
              disabled={isLoading}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className='text-sm text-destructive'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {errorMessage && <Alert variant='destructive'>{errorMessage}</Alert>}

          <Button disabled={isLoading}>
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                <span>Processing...</span>
              </div>
            ) : (
              'Reset Password'
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

      <Button variant='outline' onClick={() => router.push('/auth/login')}>
        Back to Login
      </Button>
    </div>
  );
}
