'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

/**
 * Minimal navigation loader that shows a spinner during page transitions
 */
export default function NavigationLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  
  // Reset loading when pathname changes (navigation completes)
  useEffect(() => {
    setLoading(false);
  }, [pathname]);
  
  // Safety timeout to prevent stuck spinner (5 seconds)
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [loading]);
  
  // Detect link clicks for navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;
      
      // Ensure it's an internal navigation link
      const url = link.href;
      if (url && 
          url.startsWith(window.location.origin) && 
          !url.includes('#') && 
          !link.target && 
          new URL(url).pathname !== pathname) {
        setLoading(true);
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);
  
  // Render loading overlay with spinner
  if (!loading) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="flex flex-col items-center space-y-4 animate-in zoom-in-50">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading page...</p>
      </div>
    </div>
  );
} 