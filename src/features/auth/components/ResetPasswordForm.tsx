'use client';

import type React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
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
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: '',
    token,
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

    const validation = resetPasswordSchema.safeParse(formData);
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

      const response = await resetPassword({
        ...formData,
        token,
      });

      if (response.success) {
        setSuccessMessage(
          'Password reset successfully! Redirecting to sign in...'
        );
        setTimeout(() => {
          setIsNavigating(true);
          router.push('/auth/login');
        }, 1500);
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
          err.message || 'An error occurred while resetting your password.'
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

  if (!token) {
    return (
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center'>
          <span className='inline-flex h-11 w-11 items-center justify-center rounded-full bg-destructive/15 text-destructive'>
            <ShieldAlert className='h-5 w-5' />
          </span>
          <div className='flex flex-col gap-1'>
            <p className='text-[14px] font-semibold text-foreground'>
              Reset link is invalid
            </p>
            <p className='text-[13px] leading-relaxed text-muted-foreground'>
              This link is missing or expired. Request a fresh one to continue.
            </p>
          </div>
        </div>

        <Link
          href='/auth/forgot-password'
          className='inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-[13px] font-semibold tracking-tight text-primary-foreground transition-colors hover:bg-primary/90'
        >
          Request new reset link
        </Link>

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
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
      <FieldGroup
        id='newPassword'
        label='New password'
        error={errors.newPassword}
        hint='Min 8 chars, mix letters & numbers'
      >
        <div className='relative'>
          <Input
            id='newPassword'
            type={showNew ? 'text' : 'password'}
            placeholder='••••••••'
            autoComplete='new-password'
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            className={cn(
              'h-11 rounded-lg bg-background pr-11',
              errors.newPassword &&
                'border-destructive focus-visible:ring-destructive/40'
            )}
            disabled={isBusy}
          />
          <button
            type='button'
            onClick={() => setShowNew((v) => !v)}
            disabled={isBusy}
            aria-label={showNew ? 'Hide password' : 'Show password'}
            className='absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            {showNew ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </button>
        </div>
      </FieldGroup>

      <FieldGroup
        id='confirmPassword'
        label='Confirm password'
        error={errors.confirmPassword}
      >
        <div className='relative'>
          <Input
            id='confirmPassword'
            type={showConfirm ? 'text' : 'password'}
            placeholder='••••••••'
            autoComplete='new-password'
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className={cn(
              'h-11 rounded-lg bg-background pr-11',
              errors.confirmPassword &&
                'border-destructive focus-visible:ring-destructive/40'
            )}
            disabled={isBusy}
          />
          <button
            type='button'
            onClick={() => setShowConfirm((v) => !v)}
            disabled={isBusy}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
            className='absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            {showConfirm ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </button>
        </div>
      </FieldGroup>

      {errorMessage && (
        <Alert
          variant='destructive'
          className='border-destructive/40 bg-destructive/5'
        >
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className='border-success/40 bg-success/10'>
          <CheckCircle2 className='h-4 w-4 text-success' />
          <AlertDescription className='text-foreground'>
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type='submit'
        disabled={isBusy}
        className='h-11 w-full rounded-lg text-[13px] font-semibold tracking-tight'
      >
        {isLoading ? (
          <span className='inline-flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Resetting password…
          </span>
        ) : isNavigating ? (
          <span className='inline-flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Redirecting…
          </span>
        ) : (
          'Reset password'
        )}
      </Button>

      <div className='relative py-1'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-border/70' />
        </div>
        <div className='relative flex justify-center'>
          <span className='bg-surface px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
            or
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
