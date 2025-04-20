'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  inviteUser,
  type User,
  type CreateUserData,
  type UpdateUserData,
} from '@/lib/api/endpoints/users'

// Hook to fetch all users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  })
}

// Hook to fetch a specific user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  })
}

// Hook to create a user
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateUserData) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// Hook to update a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', id] })
    },
  })
}

// Hook to delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// Hook to invite a user
export const useInviteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { email: string; role: string }) => inviteUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
} 