'use client';

import React, { ReactNode, useState } from 'react';
import { Navbar, Sidebar } from '../navigation';
import { Toaster } from '@/components/ui/toast';
import NavigationLoader from '../navigation/NavigationLoader';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout is the main layout for authenticated pages.
 * It includes the header, sidebar, and main content area.
 */
export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        isSidebarOpen={sidebarOpen} 
      />
      
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Navigation loading spinner */}
      <NavigationLoader />
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
} 