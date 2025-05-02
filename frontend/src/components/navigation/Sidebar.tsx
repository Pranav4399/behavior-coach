'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { navigationItems, NavigationItem } from '@/config/navigation';
import { useOrganization } from '@/hooks/api/use-organizations';
import { useIsAdmin, usePlatformAdmin } from '@/lib/permission';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Sidebar component for main navigation.
 */
export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = useIsAdmin();
  const isPlatformAdmin = usePlatformAdmin();
  
  // Fetch organization details if user is authenticated and has an organizationId
  const { data: orgData, isLoading } = user?.organizationId 
    ? useOrganization(user.organizationId)
    : { data: undefined, isLoading: false };

  // Derive organization name directly from the data
  const orgName = orgData?.data?.organization?.name || 'My Organization';
  
  // Filter navigation items based on authentication and admin status
  const filteredNavigation = navigationItems.filter(item => 
    (!item.requiresAuth || (item.requiresAuth && isAuthenticated)) &&
    (!item.requiresAdmin || (item.requiresAdmin && isAdmin)) &&
    (!item.hidePlatformAdmin || (item.hidePlatformAdmin && !isPlatformAdmin))
  );
  
  // Check if a link is active
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-300 ease-in-out md:static md:z-0 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Organization Info */}
        <div className="flex h-16 items-center border-b border-border px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary"></div>
            <div className="text-sm font-medium">
              {isLoading ? 'Loading...' : orgName}
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col space-y-1 p-4">
          {filteredNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted/50 text-foreground'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${isActive(item.href) ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
} 