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
import { AlertCircle, ArrowLeft, CheckCircle, Mail } from 'lucide-react';
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
    <div className='flex justify-center gap-3'>
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
          className={`
            w-12 h-14 text-center text-xl font-bold rounded-lg border-2 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/20
            ${error
              ? 'border-destructive bg-destructive/5 text-destructive'
              : activeIndex === index
                ? 'border-primary bg-primary/5 text-primary'
                : value[index]
                  ? 'border-primary/60 bg-primary/5 text-foreground'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/40'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
          `}
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
      const err = error instanceof Error ? error : new Error('Failed to resend verification email');
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

  return (
    <div className='w-full'>
      <Card className='border-0 shadow-none lg:shadow-lg lg:border'>
        <CardHeader className='space-y-1 text-center pb-6'>
          <CardTitle className='text-2xl font-bold text-foreground'>
            Verify Your Email
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            {email ? (
              <>
                We sent a verification code to <strong>{email}</strong>
              </>
            ) : (
              'Enter your verification code'
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <form onSubmit={handleVerify} className='space-y-4'>
            <div className='space-y-4'>
              <OTPInput
                length={6}
                value={code}
                onChange={setCode}
                disabled={verifyEmailMutation.isPending}
              />

              {errorMessage && (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className='border-green-500 text-green-500'>
                  <CheckCircle className='h-4 w-4' />
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className='space-y-2'>
              <Button
                type='submit'
                className='w-full'
                disabled={!code || verifyEmailMutation.isPending}
              >
                {verifyEmailMutation.isPending && (
                  <Mail className='mr-2 h-4 w-4 animate-spin' />
                )}
                Verify Email
              </Button>

              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={handleResend}
                disabled={isResending || !email}
              >
                {isResending && <Mail className='mr-2 h-4 w-4 animate-spin' />}
                Resend Verification Code
              </Button>

              <Button
                variant='ghost'
                className='w-full'
                onClick={handleBackToLogin}
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
