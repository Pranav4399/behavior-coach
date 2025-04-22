import React from 'react'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Left side - content */}
        <main className="flex flex-1 items-center justify-center">
          {children}
        </main>
        
        {/* Right side - image/branding */}
        <div className="hidden w-1/2 bg-muted lg:block">
          <div className="flex h-full items-center justify-center">
            <div className="px-12 text-center">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold">Behavior Coach</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Transform behaviors and achieve your goals with our coaching platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 