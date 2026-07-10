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
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useRegister } from '../hooks/useAuth';
import type { RegisterForm as RegisterFormType } from '../types';
import { registerSchema } from '../validation/schemas';

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [isNavigating, setIsNavigating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormType>({
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

    const validation = registerSchema.safeParse(formData);
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
        const err =
          error instanceof Error ? error : new Error('An error occurred');
        if ('code' in err) {
          setErrorMessage(err.message || 'An error occurred.');
        } else {
          setErrorMessage(err.message || 'Request failed');
        }
      },
    });
  };

  const handleBackToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    router.push('/auth/login');
  };

  const isBusy = registerMutation.isPending || isNavigating;

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <FieldGroup id='firstName' label='First name' error={errors.firstName}>
          <Input
            id='firstName'
            placeholder='Ada'
            autoComplete='given-name'
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className={cn(
              'h-11 rounded-lg bg-background',
              errors.firstName &&
                'border-destructive focus-visible:ring-destructive/40'
            )}
            disabled={isBusy}
          />
        </FieldGroup>

        <FieldGroup id='lastName' label='Last name' error={errors.lastName}>
          <Input
            id='lastName'
            placeholder='Lovelace'
            autoComplete='family-name'
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className={cn(
              'h-11 rounded-lg bg-background',
              errors.lastName &&
                'border-destructive focus-visible:ring-destructive/40'
            )}
            disabled={isBusy}
          />
        </FieldGroup>
      </div>

      <FieldGroup id='email' label='Work email' error={errors.email}>
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
        hint='At least 8 characters, mix of letters & numbers.'
      >
        <div className='relative'>
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••'
            autoComplete='new-password'
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
        <Alert className='border-success/40 bg-success/10 text-success'>
          <CheckCircle2 className='h-4 w-4 text-success' />
          <AlertDescription className='text-success'>
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type='submit'
        disabled={isBusy}
        className='h-11 w-full rounded-lg text-[13px] font-semibold tracking-tight'
      >
        {registerMutation.isPending ? (
          <span className='inline-flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Creating account…
          </span>
        ) : isNavigating ? (
          <span className='inline-flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Redirecting…
          </span>
        ) : (
          'Create account'
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
        className='group inline-flex items-center justify-center gap-2 rounded-lg border border-border/70 bg-background/60 px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-border-strong hover:bg-muted/40'
      >
        {isNavigating ? (
          <>
            <Loader2 className='h-4 w-4 animate-spin' />
            Redirecting…
          </>
        ) : (
          <>
            <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-0.5' />
            Already have an account? Sign in
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
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
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
        {hint && !error && (
          <span className='text-[10px] text-muted-foreground/70'>{hint}</span>
        )}
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
