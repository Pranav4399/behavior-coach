'use client'

import React from 'react'
import Link from 'next/link'
import { useUsers } from '@/hooks/useUsers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

export default function UsersPage() {
  const { data: users, isLoading } = useUsers()

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage users in your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/users/invite">Invite User</Link>
          </Button>
          <Button asChild>
            <Link href="/users/create">Create User</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users?.length ? (
          users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle>{user.name || user.email}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Role:</span>
                    <span>{user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge 
                      variant={
                        user.status === 'active' 
                          ? 'success' 
                          : user.status === 'pending' 
                            ? 'warning' 
                            : 'destructive'
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Created:</span>
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                  {user.lastLogin && (
                    <div className="flex justify-between">
                      <span className="font-medium">Last Login:</span>
                      <span>{formatDate(user.lastLogin)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/users/${user.id}`}>View</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/users/${user.id}/edit`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <h3 className="text-lg font-medium">No users found</h3>
            <p className="text-muted-foreground">
              Add some users to your organization
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 