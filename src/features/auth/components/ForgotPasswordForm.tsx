'use client';

import type React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertCircle, ArrowLeft, Loader2, MailCheck } from 'lucide-react';
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

    const validation = forgotPasswordSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
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
        setSuccessMessage(
          'Reset password instructions have been sent to your email.'
        );
      } else {
        setErrorMessage(
          response.message || 'Something went wrong. Please try again.'
        );
      }
    } catch (error: Error | unknown) {
      const err =
        error instanceof Error ? error : new Error('An error occurred');
      if ('code' in err) {
        setErrorMessage(`${err.code}: ${err.message || 'An error occurred.'}`);
      } else {
        setErrorMessage(
          err.message || 'An error occurred while processing your request.'
        );
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

  const isBusy = isLoading || isNavigating;

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
      {successMessage ? (
        <div className='flex flex-col items-center gap-4 rounded-xl border border-success/30 bg-success/5 p-6 text-center'>
          <span className='inline-flex h-11 w-11 items-center justify-center rounded-full bg-success/15 text-success'>
            <MailCheck className='h-5 w-5' />
          </span>
          <div className='flex flex-col gap-1'>
            <p className='text-[14px] font-semibold text-foreground'>
              Check your inbox
            </p>
            <p className='text-[13px] leading-relaxed text-muted-foreground'>
              {successMessage}
            </p>
          </div>
          <p className='font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground'>
            Didn't get it? Check spam or try again in a minute.
          </p>
        </div>
      ) : (
        <FieldGroup
          id='email'
          label='Email'
          error={errors.email}
          hint="We'll email a secure reset link"
        >
          <Input
            id='email'
            type='email'
            placeholder='you@company.com.ng'
            autoComplete='email'
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={cn(
              'h-11 rounded-lg bg-background',
              errors.email &&
                'border-destructive focus-visible:ring-destructive/40'
            )}
            disabled={isBusy}
          />
        </FieldGroup>
      )}

      {errorMessage && (
        <Alert
          variant='destructive'
          className='border-destructive/40 bg-destructive/5'
        >
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {!successMessage && (
        <Button
          type='submit'
          disabled={isBusy}
          className='h-11 w-full rounded-lg text-[13px] font-semibold tracking-tight'
        >
          {isLoading ? (
            <span className='inline-flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Sending instructions…
            </span>
          ) : isNavigating ? (
            <span className='inline-flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Redirecting…
            </span>
          ) : (
            'Send reset instructions'
          )}
        </Button>
      )}

      <div className='relative py-1'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-border/70' />
        </div>
        <div className='relative flex justify-center'>
          <span className='bg-surface px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
            remembered it?
          </span>
        </div>
      </div>

      <Link
        href='/auth/login'
        onClick={handleBackToLogin}
        className='inline-flex items-center justify-center gap-2 rounded-lg border border-border/70 bg-background/60 px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-border-strong hover:bg-muted/40'
      >
        {isNavigating ? (
          <>
            <Loader2 className='h-4 w-4 animate-spin' />
            Redirecting…
          </>
        ) : (
          <>
            <ArrowLeft className='h-4 w-4' />
            Back to sign in
          </>
        )}
      </Link>
    </form>
  );
}

function FieldGroup({
  id,
  label,
  error,
  hint,
  rightSlot,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-1.5'>
      <div className='flex items-baseline justify-between'>
        <Label
          htmlFor={id}
          className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'
        >
          {label}
        </Label>
        {rightSlot ? (
          rightSlot
        ) : hint && !error ? (
          <span className='text-[10px] text-muted-foreground/70'>{hint}</span>
        ) : null}
      </div>
      {children}
      {error && (
        <p className='inline-flex items-center gap-1 text-[11px] font-medium text-destructive'>
          <AlertCircle className='h-3 w-3' />
          {error}
        </p>
      )}
    </div>
  );
}
