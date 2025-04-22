'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme';
import { UserProfileDropdown } from './UserProfileDropdown';

interface NavbarProps {
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

/**
 * Navbar component for the top navigation bar.
 * Includes logo, mobile menu toggle, and user menu.
 */
export default function Navbar({ toggleSidebar, isSidebarOpen }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          {/* Mobile sidebar toggle */}
          <button
            type="button"
            className="mr-2 inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted/50 md:hidden"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* Logo and brand name */}
          <Link href="/dashboard" className="flex items-center">
            <div className="mr-2 h-8 w-8 rounded bg-primary"></div>
            <span className="hidden font-bold text-lg sm:inline-block">Behavior Coach</span>
          </Link>
        </div>
        
        {/* Right side navigation items */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle button */}
          <ThemeToggle />
          
          {/* Notifications button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted/50 relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
          </button>
          
          {/* User profile dropdown */}
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
} 