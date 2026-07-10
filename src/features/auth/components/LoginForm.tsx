'use client';

import type React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  MailCheck,
} from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
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

    const validation = loginSchema.safeParse(formData);
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

    setIsLoading(true);
    loginMutation.mutate(formData, {
      onSuccess: (response) => {
        setIsLoading(false);
        if (response.success) {
          setIsNavigating(true);
          router.push('/dashboard');
        } else {
          setErrorMessage(response.message || 'Request failed');
        }
      },
      onError: (error: Error | unknown) => {
        setIsLoading(false);
        const err =
          error instanceof Error ? error : new Error('An error occurred');
        if ('code' in err && err.code === 'EMAIL_NOT_VERIFIED') {
          setEmailNotVerified(true);
          setUnverifiedEmail(formData.email);
          setErrorMessage(
            err.message || 'Please verify your email before logging in.'
          );
        } else {
          setErrorMessage(err.message || 'Request failed');
        }
      },
    });
  };

  const handleResendVerification = async () => {
    setResendStatus('loading');
    setResendMessage('');
    try {
      const res = await resendVerification({ email: unverifiedEmail });
      if (res.success) {
        setResendStatus('success');
        setResendMessage(
          res.message || 'Verification email sent! Please check your inbox.'
        );
        localStorage.setItem('pendingVerificationEmail', unverifiedEmail);
        setTimeout(() => {
          router.push('/auth/verify-email');
        }, 1200);
      } else {
        setResendStatus('error');
        setResendMessage(res.message || 'Failed to send verification email.');
      }
    } catch (err: Error | unknown) {
      setResendStatus('error');
      const error =
        err instanceof Error
          ? err
          : new Error('Failed to send verification email');
      setResendMessage(error.message);
    }
  };

  const isBusy = isLoading || isNavigating;

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
      <FieldGroup id='email' label='Email' error={errors.email}>
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

      <FieldGroup
        id='password'
        label='Password'
        error={errors.password}
        rightSlot={
          <Link
            href='/auth/forgot-password'
            className='font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground'
          >
            Forgot?
          </Link>
        }
      >
        <div className='relative'>
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••'
            autoComplete='current-password'
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className={cn(
              'h-11 rounded-lg bg-background pr-11',
              errors.password &&
                'border-destructive focus-visible:ring-destructive/40'
            )}
            disabled={isBusy}
          />
          <button
            type='button'
            onClick={() => setShowPassword((v) => !v)}
            disabled={isBusy}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className='absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </button>
        </div>
      </FieldGroup>

      {emailNotVerified && (
        <Alert className='border-warning/40 bg-warning/10'>
          <MailCheck className='h-4 w-4 text-warning' />
          <AlertDescription className='flex flex-col gap-3'>
            <span>Please verify your email before logging in.</span>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={handleResendVerification}
              disabled={resendStatus === 'loading'}
              className='w-fit'
            >
              {resendStatus === 'loading' ? (
                <span className='inline-flex items-center gap-2'>
                  <Loader2 className='h-3.5 w-3.5 animate-spin' />
                  Sending…
                </span>
              ) : (
                'Resend verification email'
              )}
            </Button>
            {resendStatus === 'success' && (
              <span className='inline-flex items-center gap-1.5 text-[12px] text-success'>
                <CheckCircle2 className='h-3.5 w-3.5' />
                {resendMessage}
              </span>
            )}
            {resendStatus === 'error' && (
              <span className='inline-flex items-center gap-1.5 text-[12px] text-destructive'>
                <AlertCircle className='h-3.5 w-3.5' />
                {resendMessage}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (!emailNotVerified || resendStatus === 'error') && (
        <Alert
          variant='destructive'
          className='border-destructive/40 bg-destructive/5'
        >
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{errorMessage}</AlertDescription>
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
            Signing in…
          </span>
        ) : isNavigating ? (
          <span className='inline-flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Redirecting…
          </span>
        ) : (
          'Sign in'
        )}
      </Button>

      <div className='relative py-1'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-border/70' />
        </div>
        <div className='relative flex justify-center'>
          <span className='bg-surface px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
            new here
          </span>
        </div>
      </div>

      <Link
        href='/auth/register'
        className='inline-flex items-center justify-center gap-2 rounded-lg border border-border/70 bg-background/60 px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-border-strong hover:bg-muted/40'
      >
        Create an account
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
