'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { changePassword, updateProfile } from '@/features/auth/api/authApi';
import { userAtom } from '@/lib/auth-atoms';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

export default function SettingsPage() {
    const { toast } = useToast();
    const user = useAtomValue(userAtom);
    const [isLoading, setIsLoading] = useState(false);

    // Profile form state
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

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
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update profile',
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
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to change password',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="grid gap-6">
                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>
                            Update your personal information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={profileData.firstName}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, firstName: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={profileData.lastName}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, lastName: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    value={user?.email}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Update Profile'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Separator />

                {/* Password Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>
                            Update your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            currentPassword: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            newPassword: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Changing...' : 'Change Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 