'use client';

import type React from 'react';

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
import { useToast } from '@/components/ui/use-toast';
import { changePassword, updateProfile } from '@/features/auth/api/authApi';
import { userAtom } from '@/lib/auth-atoms';
import { useAtomValue } from 'jotai';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Save,
  SettingsIcon,
  Shield,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { toast } = useToast();
  const user = useAtomValue(userAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      });

      toast({
        title: 'Success',
        description: response.message,
      });
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters long',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast({
        title: 'Success',
        description: response.message,
      });

      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8'>
      <div className='mx-auto max-w-4xl space-y-8'>
        {/* Header */}
        <div className='flex items-center gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground'>
            <SettingsIcon className='h-6 w-6' />
          </div>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
            <p className='text-muted-foreground'>
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Profile Overview */}
          <div className='lg:col-span-1'>
            <Card className='border-2 border-primary/10 bg-gradient-to-br from-primary/5 to-secondary/5'>
              <CardHeader className='text-center'>
                <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground'>
                  {profileData.firstName && profileData.lastName ? (
                    getInitials(profileData.firstName, profileData.lastName)
                  ) : (
                    <User className='h-8 w-8' />
                  )}
                </div>
                <CardTitle className='text-xl'>
                  {profileData.firstName && profileData.lastName
                    ? `${profileData.firstName} ${profileData.lastName}`
                    : 'User Profile'}
                </CardTitle>
                <CardDescription className='flex items-center justify-center gap-2'>
                  <Mail className='h-4 w-4' />
                  {profileData.email || 'No email set'}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <Card className='mt-6'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <Shield className='h-5 w-5 text-primary' />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Password
                  </span>
                  <span className='text-sm font-medium text-green-600'>
                    Strong
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Two-Factor Auth
                  </span>
                  <span className='text-sm font-medium text-amber-600'>
                    Coming Soon
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Last Login
                  </span>
                  <span className='text-sm font-medium'>Today</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Forms */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Profile Settings */}
            <Card className='border-2 hover:border-primary/20 transition-colors'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5 text-primary' />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and display preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className='space-y-6'>
                  <div className='grid gap-6 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='firstName'
                        className='text-sm font-medium'
                      >
                        First Name
                      </Label>
                      <Input
                        id='firstName'
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            firstName: e.target.value,
                          })
                        }
                        className='h-11'
                        placeholder='Enter your first name'
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='lastName' className='text-sm font-medium'>
                        Last Name
                      </Label>
                      <Input
                        id='lastName'
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                          })
                        }
                        className='h-11'
                        placeholder='Enter your last name'
                        required
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>Email Address</Label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                      <Input
                        value={profileData.email}
                        disabled
                        className='h-11 pl-10 bg-muted/50'
                        placeholder='Email cannot be changed'
                      />
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Contact support to change your email address
                    </p>
                  </div>
                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='w-full md:w-auto'
                    size='lg'
                  >
                    <Save className='mr-2 h-4 w-4' />
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Password Settings */}
            <Card className='border-2 hover:border-primary/20 transition-colors'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Lock className='h-5 w-5 text-primary' />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className='space-y-6'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='currentPassword'
                      className='text-sm font-medium'
                    >
                      Current Password
                    </Label>
                    <div className='relative'>
                      <Input
                        id='currentPassword'
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className='h-11 pr-10'
                        placeholder='Enter your current password'
                        required
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='newPassword'
                      className='text-sm font-medium'
                    >
                      New Password
                    </Label>
                    <div className='relative'>
                      <Input
                        id='newPassword'
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className='h-11 pr-10'
                        placeholder='Enter your new password'
                        required
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='confirmPassword'
                      className='text-sm font-medium'
                    >
                      Confirm New Password
                    </Label>
                    <div className='relative'>
                      <Input
                        id='confirmPassword'
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className='h-11 pr-10'
                        placeholder='Confirm your new password'
                        required
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                    {passwordData.confirmPassword &&
                      passwordData.newPassword !==
                      passwordData.confirmPassword && (
                        <p className='text-xs text-destructive'>
                          Passwords do not match
                        </p>
                      )}
                  </div>
                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='w-full md:w-auto'
                    size='lg'
                  >
                    <Lock className='mr-2 h-4 w-4' />
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
