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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
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
            ${
              error
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
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerification();
  const [email, setEmail] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [otpValue, setOtpValue] = React.useState('');
  const [otpError, setOtpError] = React.useState('');

  // Get email from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('pendingVerificationEmail');
      setEmail(storedEmail);
      setIsLoading(false);

      if (!storedEmail) {
        router.push('/auth/register');
      }
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    if (otpValue.length !== 6) {
      setOtpError('Please enter the complete 6-digit code');
      return;
    }

    setOtpError('');
    verifyMutation.mutate(
      { email, code: otpValue },
      {
        onSuccess: () => {
          localStorage.removeItem('pendingVerificationEmail');
          router.push('/dashboard');
        },
        onError: (error) => {
          console.error('Verification failed:', error);
          setOtpError('Invalid verification code. Please try again.');
        },
      }
    );
  };

  const handleResend = () => {
    if (email) {
      resendMutation.mutate({ email });
    }
  };

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    if (otpError) {
      setOtpError('');
    }
  };

  // Show loading while checking for email
  if (isLoading) {
    return (
      <div className='w-full max-w-md mx-auto text-center'>
        <div className='flex items-center justify-center space-x-2'>
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  // Show redirecting message if no email
  if (!email) {
    return (
      <div className='w-full max-w-md mx-auto text-center'>
        <p className='text-muted-foreground'>
          No verification email found. Redirecting to registration...
        </p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <Card className='border-0 shadow-none lg:shadow-lg lg:border'>
        <CardHeader className='space-y-1 text-center pb-6'>
          <div className='mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center'>
            <Mail className='h-8 w-8 text-primary' />
          </div>
          <CardTitle className='text-2xl font-bold text-foreground'>
            Verify Your Email
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            We sent a 6-digit verification code to
            <br />
            <span className='font-semibold text-foreground'>{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-4'>
              <div className='text-center'>
                <label className='text-sm font-medium text-foreground mb-4 block'>
                  Enter verification code
                </label>
                <OTPInput
                  length={6}
                  value={otpValue}
                  onChange={handleOtpChange}
                  disabled={verifyMutation.isPending}
                  error={!!otpError || !!verifyMutation.error}
                />
                {otpError && (
                  <p className='mt-2 text-sm text-destructive flex items-center justify-center gap-1'>
                    <AlertCircle className='h-3 w-3' />
                    {otpError}
                  </p>
                )}
              </div>
            </div>

            <Button
              type='submit'
              disabled={verifyMutation.isPending || otpValue.length !== 6}
              className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'
              size='lg'
            >
              {verifyMutation.isPending ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent'></div>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </Button>

            {verifyMutation.error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  {verifyMutation.error.message}
                </AlertDescription>
              </Alert>
            )}

            {verifyMutation.isSuccess && (
              <Alert className='border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200'>
                <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
                <AlertDescription className='text-green-800 dark:text-green-200'>
                  Email verified successfully! Redirecting...
                </AlertDescription>
              </Alert>
            )}
          </form>

          {/* Resend Section */}
          <div className='pt-4 border-t border-border space-y-4'>
            <div className='text-center'>
              <p className='text-sm text-muted-foreground mb-3'>
                Didn&apos;t receive the code?
              </p>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={handleResend}
                disabled={resendMutation.isPending}
                className='border-primary/20 text-primary hover:bg-primary/5'
              >
                {resendMutation.isPending ? (
                  <div className='flex items-center gap-2'>
                    <div className='h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
                    Sending...
                  </div>
                ) : (
                  'Resend Code'
                )}
              </Button>
              {resendMutation.isSuccess && (
                <p className='text-sm text-green-600 dark:text-green-400 mt-2 flex items-center justify-center gap-1'>
                  <CheckCircle className='h-3 w-3' />
                  New code sent to {email}!
                </p>
              )}
            </div>

            <div className='text-center'>
              <Link
                href='/auth/login'
                className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors'
              >
                <ArrowLeft className='h-3 w-3' />
                Back to Sign In
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
