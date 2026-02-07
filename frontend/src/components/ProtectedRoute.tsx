'use client';

import React, { ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/auth-context';
import { AuthLoading } from './AuthLoading';

interface ProtectedRouteProps {
  children: ReactElement;
  fallback?: ReactElement;
  redirectTo?: string;
}

/**
 * A higher-order component that wraps protected routes and ensures
 * the user is authenticated before accessing the route.
 */
export const ProtectedRoute = ({
  children,
  fallback = <AuthLoading />,
  redirectTo = '/login',
}: ProtectedRouteProps): ReactElement => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Show loading state while checking authentication status
  if (loading) {
    return fallback;
  }

  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    // Navigate to login page
    router.push(redirectTo);
    // Return null to avoid rendering the protected content
    return null as ReactElement;
  }

  // Render the protected content if user is authenticated
  return children;
};

export default ProtectedRoute;