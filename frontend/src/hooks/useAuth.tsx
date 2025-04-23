'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from '../lib/api/auth';
import { LoadingOverlay } from '@/components/auth/loading-overlay';
import { withMinDuration } from '@/hooks/useLoading';
import { usePermissionsStore } from '@/store/permissions';

interface User {
  id: string;
  email: string;
  name?: string;
  roleId?: string;
  organizationId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Checking authentication...');
  const [error, setError] = useState<string | null>(null);
  const { fetchPermissions, clearPermissions } = usePermissionsStore();

  const checkAuth = async () => {
    try {
      setLoadingMessage('Checking authentication...');
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        // Fetch permissions if we have a token
        await fetchPermissions();
      }
    } catch (err) {
      console.error('Error checking auth:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setLoadingMessage('Logging in...');
      setError(null);
      
      // Wrap the API call with minimum duration
      const response = await withMinDuration(
        authApi.login({ email, password })
      );
      
      setLoadingMessage('Setting up your account...');
      // Store auth data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      
      // Fetch user permissions
      setLoadingMessage('Loading your permissions...');
      await fetchPermissions();

      // Check for redirect URL
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        setLoadingMessage('Redirecting...');
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        setLoadingMessage('Taking you to dashboard...');
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, fetchPermissions]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadingMessage('Logging out...');
      
      // Wrap logout operations with minimum duration
      await withMinDuration(
        (async () => {
          // Client-side logout operations
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          // Clear permissions
          clearPermissions();
        })()
      );
      
      setLoadingMessage('Redirecting...');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router, clearPermissions]);

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    isLoading,
    loadingMessage,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
