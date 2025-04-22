'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { LoadingOverlay } from '@/components/auth/loading-overlay';
import { ANIMATION_DURATION } from '@/config/constants';

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Utility function to ensure minimum loading duration
const withMinDuration = async <T,>(
  promise: Promise<T>,
  minDuration: number = ANIMATION_DURATION.PAGE_TRANSITION
): Promise<T> => {
  const startTime = Date.now();
  const [result] = await Promise.all([
    promise,
    new Promise(resolve => setTimeout(resolve, minDuration))
  ]);
  
  const elapsed = Date.now() - startTime;
  if (elapsed < minDuration) {
    await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
  }
  
  return result;
};

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const startLoading = useCallback((message: string = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const value = {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

// Export the withMinDuration utility for use in components
export { withMinDuration }; 