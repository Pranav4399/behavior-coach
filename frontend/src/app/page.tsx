'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/hooks/useAuth'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuthState()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [isAuthenticated, loading, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-2xl font-bold">Loading...</div>
    </div>
  )
} 