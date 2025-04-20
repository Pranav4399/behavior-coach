'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import {
  login as loginApi,
  register as registerApi,
  getCurrentUser,
  logout as logoutApi,
  requestPasswordReset as requestPasswordResetApi,
  resetPassword as resetPasswordApi,
  type LoginCredentials,
  type RegisterData,
} from '@/lib/api/endpoints/auth'
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
} from '@/store/auth/authSlice'
import { type RootState } from '@/store'
import { useRouter } from 'next/navigation'

// Hook to get authentication state from Redux
export const useAuthState = () => {
  return useSelector((state: RootState) => state.auth)
}

// Hook for login
export const useLogin = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      dispatch(loginStart())
      return loginApi(credentials)
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data))
      router.push('/dashboard')
    },
    onError: (error: any) => {
      dispatch(loginFailure(error.message || 'Login failed'))
    },
  })
}

// Hook for registration
export const useRegister = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      dispatch(loginStart())
      return registerApi(data)
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data))
      router.push('/dashboard')
    },
    onError: (error: any) => {
      dispatch(loginFailure(error.message || 'Registration failed'))
    },
  })
}

// Hook for logout
export const useLogout = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      dispatch(logoutAction())
      router.push('/login')
    },
  })
}

// Hook to get current user data
export const useCurrentUser = () => {
  const { isAuthenticated, user } = useAuthState()

  return useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: getCurrentUser,
    enabled: isAuthenticated && !user, // Only fetch if authenticated but no user data
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for password reset request
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (email: string) => requestPasswordResetApi(email),
  })
}

// Hook for password reset
export const useResetPassword = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      resetPasswordApi(token, password),
    onSuccess: () => {
      router.push('/login?resetSuccess=true')
    },
  })
} 