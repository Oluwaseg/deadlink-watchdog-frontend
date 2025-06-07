'use client';

import type React from 'react';

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
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { ZodTypeAny } from 'zod';
import { validateData } from '../validation/schemas';

interface FormField {
  name: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  label: string;
}

interface AuthFormProps {
  title: string;
  fields: FormField[];
  submitText: string;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  error?: string;
  success?: string;
  validationSchema: ZodTypeAny;
  footer?: React.ReactNode;
}

export function AuthForm({
  title,
  fields,
  submitText,
  onSubmit,
  isLoading = false,
  error,
  success,
  validationSchema,
  footer,
}: AuthFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validation = validateData(validationSchema, formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onSubmit(validation.data);
  };

  return (
    <div className='w-full'>
      <Card className='border-0 shadow-none lg:shadow-lg lg:border'>
        <CardHeader className='space-y-1 text-center pb-6'>
          <CardTitle className='text-2xl font-bold text-foreground'>
            {title}
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            Enter your information to create your account
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Handle first name and last name in a grid for better layout */}
            {fields.some((field) => field.name === 'firstName') ? (
              <div className='grid grid-cols-2 gap-4'>
                {fields
                  .filter(
                    (field) =>
                      field.name === 'firstName' || field.name === 'lastName'
                  )
                  .map((field) => (
                    <div key={field.name} className='space-y-2'>
                      <Label
                        htmlFor={field.name}
                        className='text-sm font-medium text-foreground'
                      >
                        {field.label}
                      </Label>
                      <Input
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        className={`${
                          errors[field.name]
                            ? 'border-destructive focus-visible:ring-destructive'
                            : 'border-border focus-visible:ring-primary'
                        }`}
                        disabled={isLoading}
                      />
                      {errors[field.name] && (
                        <p className='text-sm text-destructive flex items-center gap-1'>
                          <AlertCircle className='h-3 w-3' />
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            ) : null}

            {/* Other fields */}
            {fields
              .filter(
                (field) =>
                  field.name !== 'firstName' && field.name !== 'lastName'
              )
              .map((field) => (
                <div key={field.name} className='space-y-2'>
                  <Label
                    htmlFor={field.name}
                    className='text-sm font-medium text-foreground'
                  >
                    {field.label}
                  </Label>
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`${
                      errors[field.name]
                        ? 'border-destructive focus-visible:ring-destructive'
                        : 'border-border focus-visible:ring-primary'
                    }`}
                    disabled={isLoading}
                  />
                  {errors[field.name] && (
                    <p className='text-sm text-destructive flex items-center gap-1'>
                      <AlertCircle className='h-3 w-3' />
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

            <Button
              type='submit'
              disabled={isLoading}
              className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'
              size='lg'
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent'></div>
                  Creating Account...
                </div>
              ) : (
                submitText
              )}
            </Button>

            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className='border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200'>
                <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
                <AlertDescription className='text-green-800 dark:text-green-200'>
                  {success}
                </AlertDescription>
              </Alert>
            )}
          </form>

          {footer && (
            <div className='pt-4 border-t border-border'>{footer}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
