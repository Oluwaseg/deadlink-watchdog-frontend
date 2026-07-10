// @ts-nocheck -- Next.js code; typechecked in local project, not this preview
'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MailCheck,
  RefreshCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useResendVerification, useVerifyEmail } from '../hooks/useAuth';

// OTP Input Component
interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

function OTPInput({
  length,
  value,
  onChange,
  disabled = false,
  error = false,
}: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleChange = (index: number, inputValue: string) => {
    // Only allow numbers
    const numericValue = inputValue.replace(/[^0-9]/g, '');

    if (numericValue.length <= 1) {
      const newValue = value.split('');
      newValue[index] = numericValue;
      const updatedValue = newValue.join('').slice(0, length);
      onChange(updatedValue);

      // Move to next input if value entered
      if (numericValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
        setActiveIndex(index + 1);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
        setActiveIndex(index - 1);
      } else {
        // Clear current input
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/[^0-9]/g, '')
      .slice(0, length);
    onChange(pastedData);

    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
    setActiveIndex(nextIndex);
  };

  return (
    <div className='flex items-center justify-center gap-2 sm:gap-2.5'>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type='text'
          inputMode='numeric'
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setActiveIndex(index)}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          className={cn(
            'h-14 w-11 sm:w-12 rounded-lg border text-center font-mono text-xl font-semibold tabular-nums transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary/30',
            error
              ? 'border-destructive/60 bg-destructive/5 text-destructive'
              : activeIndex === index
                ? 'border-foreground bg-background text-foreground shadow-sm'
                : value[index]
                  ? 'border-border-strong bg-background text-foreground'
                  : 'border-border bg-background/50 text-muted-foreground hover:border-border-strong',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        />
      ))}
    </div>
  );
}

export function VerifyEmailForm() {
  const router = useRouter();
  const verifyEmailMutation = useVerifyEmail();
  const resendVerificationMutation = useResendVerification();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  // Effect to check for stored email from both registration and login flows
  useEffect(() => {
    const storedEmail =
      localStorage.getItem('pending_verification_email') ||
      localStorage.getItem('pendingVerificationEmail');

    if (storedEmail) {
      setEmail(storedEmail);
      // Don't remove the email immediately, wait for successful verification
      // We'll clean it up after verification succeeds
    }
  }, []); // Remove router dependency

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !code) {
      setErrorMessage('Please provide both email and verification code.');
      return;
    }

    try {
      verifyEmailMutation.mutate(
        { email, code },
        {
          onSuccess: (response) => {
            if (response.success) {
              setSuccessMessage(
                'Email verified successfully! Redirecting to dashboard...'
              );
              // Clean up stored emails only after successful verification
              localStorage.removeItem('pending_verification_email');
              localStorage.removeItem('pendingVerificationEmail');
              // The useVerifyEmail hook will handle cookies and navigation
            } else {
              setErrorMessage(response.message || 'Verification failed');
            }
          },
          onError: (error) => {
            setErrorMessage(
              error?.message || 'Failed to verify email. Please try again.'
            );
          },
        }
      );
    } catch {
      setErrorMessage('An error occurred during verification.');
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setErrorMessage('');

    try {
      await resendVerificationMutation.mutateAsync({ email });
      setSuccessMessage(
        'Verification email resent successfully! Please check your inbox.'
      );
    } catch (error: Error | unknown) {
      const err =
        error instanceof Error
          ? error
          : new Error('Failed to resend verification email');
      setErrorMessage(err.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    // Clean up stored emails when manually going back to login
    localStorage.removeItem('pending_verification_email');
    localStorage.removeItem('pendingVerificationEmail');
    router.push('/auth/login');
  };

  const isVerifying = verifyEmailMutation.isPending;
  const isBusy = isVerifying || isResending;
  const hasError = Boolean(errorMessage);

  return (
    <form onSubmit={handleVerify} className='flex flex-col gap-6'>
      {/* Email chip */}
      <div className='flex flex-col items-center gap-3'>
        <span className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm'>
          <MailCheck className='h-5 w-5' />
        </span>
        {email ? (
          <div className='flex flex-col items-center gap-1'>
            <span className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
              code sent to
            </span>
            <span className='max-w-[280px] truncate rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[12px] font-medium text-foreground'>
              {email}
            </span>
          </div>
        ) : (
          <span className='text-[12px] text-muted-foreground'>
            Enter your verification code
          </span>
        )}
      </div>

      {/* OTP */}
      <div className='flex flex-col items-center gap-2'>
        <Label className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
          Verification code
        </Label>
        <OTPInput
          length={6}
          value={code}
          onChange={setCode}
          disabled={isBusy}
          error={hasError}
        />
        <p className='text-[11px] text-muted-foreground/80'>
          Paste is supported · numbers only
        </p>
      </div>

      {/* Alerts */}
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
        <Alert className='border-success/40 bg-success/5 text-success'>
          <CheckCircle2 className='h-4 w-4' />
          <AlertDescription className='text-success'>
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Submit */}
      <Button
        type='submit'
        disabled={isVerifying}
        className='h-11 w-full rounded-lg text-[13px] font-semibold tracking-tight'
      >
        {isVerifying ? (
          <span className='inline-flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Verifying…
          </span>
        ) : (
          'Verify email'
        )}
      </Button>

      {/* Resend */}
      <div className='flex flex-col items-center gap-2'>
        <span className='text-[12px] text-muted-foreground'>
          Didn't receive the code?
        </span>
        <button
          type='button'
          onClick={handleResend}
          disabled={isResending}
          className='inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground underline-offset-4 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isResending ? (
            <Loader2 className='h-3.5 w-3.5 animate-spin' />
          ) : (
            <RefreshCw className='h-3.5 w-3.5' />
          )}
          Resend verification code
        </button>
      </div>

      {/* Divider */}
      <div className='relative py-1'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-border/70' />
        </div>
        <div className='relative flex justify-center'>
          <span className='bg-surface px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
            wrong account?
          </span>
        </div>
      </div>

      <button
        type='button'
        onClick={handleBackToLogin}
        className='inline-flex items-center justify-center gap-2 rounded-lg border border-border/70 bg-background/60 px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-border-strong hover:bg-muted/40'
      >
        <ArrowLeft className='h-4 w-4' />
        Back to sign in
      </button>
    </form>
  );
}
