'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { useAuthState } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, loading } = useAuthState()
  const pathname = usePathname()
  console.log(isAuthenticated, "isAuthenticated");
  // If not authenticated, redirect to login

  if (loading) {
    return null;
  }

  if (!true) {
    redirect('/login')
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-lg font-semibold">Behavior Coach</h1>
        </div>
        <nav className="space-y-1 p-4">
          <NavItem href="/dashboard" active={pathname === '/dashboard'}>
            Dashboard
          </NavItem>
          <NavItem href="/organizations" active={pathname.startsWith('/organizations')}>
            Organizations
          </NavItem>
          <NavItem href="/users" active={pathname.startsWith('/users')}>
            Users
          </NavItem>
          <NavItem href="/settings" active={pathname.startsWith('/settings')}>
            Settings
          </NavItem>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Header */}
        <header className="flex h-16 items-center border-b bg-card px-6">
          <div className="flex flex-1 items-center justify-end">
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
        active
          ? 'bg-primary/10 text-primary'
          : 'text-foreground hover:bg-accent/50'
      }`}
    >
      {children}
    </a>
  )
}

function UserMenu() {
  return (
    <button className="flex items-center gap-2">
      <span className="text-sm font-medium">User</span>
      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        U
      </div>
    </button>
  )
} 