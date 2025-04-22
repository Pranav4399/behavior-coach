import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2 h-8 w-8 rounded bg-primary"></div>
            <span className="font-bold text-lg">Behavior Coach</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button asChild variant="default">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero */}
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
              Behavior Coach UI Demo
            </h1>
            <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
              This is a demo of the UI components and routes for the Behavior Coach application.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/dashboard">View Dashboard Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Feature cards */}
        <section className="container py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Auth Routes */}
            <Card>
              <CardHeader>
                <CardTitle>Authentication Routes</CardTitle>
                <CardDescription>Public routes for user authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/register">Register</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/forgot-password">Forgot Password</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/reset-password">Reset Password</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/verify-email">Verify Email</Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* App Routes */}
            <Card>
              <CardHeader>
                <CardTitle>App Routes</CardTitle>
                <CardDescription>Protected routes for authenticated users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/organizations">Organizations</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/users">Users</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/settings">Settings</Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Component Demo */}
            <Card>
              <CardHeader>
                <CardTitle>UI Components</CardTitle>
                <CardDescription>Built with shadcn/ui</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The UI is built using shadcn/ui, a collection of reusable components built with Radix UI and Tailwind CSS.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                  <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">
                    Learn More
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Behavior Coach. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  )
}
