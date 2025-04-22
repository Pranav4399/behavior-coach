'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';

const PUBLIC_PATHS = ['/login', '/register', '/reset-password'];

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Allow access to public paths without authentication
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    // Skip auth check for public paths
    if (isPublicPath) {
      // If user is authenticated and tries to access public paths, redirect to dashboard
      if (!isLoading && isAuthenticated) {
        router.push('/dashboard');
      }
      return;
    }

    if (!isLoading && !isAuthenticated) {
      // Store the attempted URL to redirect back after login
      localStorage.setItem('redirectAfterLogin', pathname);
      router.push('/login');
      return;
    }

    if (!isLoading && requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized');
      return;
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router, pathname, isPublicPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  // Allow rendering of public paths without authentication
  if (isPublicPath) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
} 