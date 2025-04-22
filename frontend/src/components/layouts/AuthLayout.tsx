'use client';

import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * AuthLayout is used for unauthenticated pages like login, registration,
 * and password reset.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full border-b border-border bg-card py-4">
        <div className="container flex items-center px-4 sm:px-6">
          <div className="flex items-center">
            {/* Logo will go here */}
            <div className="mr-2 h-8 w-8 bg-primary rounded"></div>
            <span className="font-bold text-lg">Behavior Coach</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </main>
      
      <footer className="py-4 border-t border-border bg-card">
        <div className="container px-4 sm:px-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Behavior Coach. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 