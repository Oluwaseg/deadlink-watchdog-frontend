'use client';

import { useAuthState, useLogout, useCurrentUser } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/shared/switch';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const authState = useAuthState();
  const logoutMutation = useLogout();
  const currentUserQuery = useCurrentUser();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authState.isAuthenticated, router]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push('/auth/login');
      },
    });
  };

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                DeadLink Watchdog - Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                variant="outline"
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
            
            {/* User Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-medium">
                      {authState.user?.firstName} {authState.user?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium">{authState.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email Verified</p>
                    <p className="font-medium">
                      {authState.user?.emailVerified ? (
                        <span className="text-green-600">✅ Verified</span>
                      ) : (
                        <span className="text-red-600">❌ Not Verified</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                    <p className="font-medium">{authState.user?.role}</p>
                  </div>
                </div>
              </div>

              {/* Current User Query Status */}
              <div>
                <h3 className="text-lg font-semibold mb-2">API Status</h3>
                {currentUserQuery.isLoading && <p>Loading user data...</p>}
                {currentUserQuery.error && (
                  <p className="text-red-600">Error: {currentUserQuery.error.message}</p>
                )}
                {currentUserQuery.data && (
                  <p className="text-green-600">✅ Connected to API</p>
                )}
              </div>

              {/* Token Info */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Authentication</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access Token: {authState.accessToken?.slice(0, 20)}...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
