'use client';

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useOrganizationsData } from '@/hooks/api/use-organizations-data'
import { useUsers } from '@/hooks/api/use-users'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { BadgeCheck, Building, Calendar, Mail, UserPlus, Users, Settings, ExternalLink, BarChart4 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { SubscriptionTier } from '@/types/organization'
import { User } from '@/types/user'
import { usePlatformAdmin } from '@/lib/permission'

export default function DashboardPage() {
  const { user } = useAuth()
  const { organizations, isLoading: orgLoading, isSingleOrg } = useOrganizationsData()
  const organization = organizations[0] // Non-platform admins only have access to their own org
  const isPlatformAdmin = usePlatformAdmin()
  const { data: usersData, isLoading: usersLoading } = useUsers(
    !isPlatformAdmin && organization ? { organizationId: organization.id } : undefined
  )
  
  const userCount = usersData?.data?.users?.length || 0
  const activeUsers = usersData?.data?.users?.filter((u: User) => u.status === 'active')?.length || 0
  const pendingUsers = usersData?.data?.users?.filter((u: User) => u.status === 'pending')?.length || 0

  const getSubscriptionBadgeColor = (tier: SubscriptionTier): string => {
    switch(tier) {
      case 'basic': return 'bg-gray-500'
      case 'premium': return 'bg-amber-500'
      case 'enterprise': return 'bg-violet-600'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'PPP')
    } catch (e) {
      return 'N/A'
    }
  }

  if (orgLoading || usersLoading) {
    return <DashboardSkeleton isPlatformAdmin={isPlatformAdmin} />
  }

  if (!isPlatformAdmin && !organization) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Card>
          <CardContent className="pt-6">
            <p>No organization data available. Please contact an administrator.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {isPlatformAdmin ? (
        // Platform admin dashboard
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Organizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{organizations.length}</div>
                  <Building className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Organization Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-500">Client</Badge>
                      <span className="text-lg">
                        {organizations.filter(org => org.type === 'client').length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500">Expert</Badge>
                      <span className="text-lg">
                        {organizations.filter(org => org.type === 'expert').length}
                      </span>
                    </div>
                  </div>
                  <BarChart4 className="h-6 w-6 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Organizations Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Name</th>
                      <th className="text-left py-2 px-4">Type</th>
                      <th className="text-left py-2 px-4">Subscription</th>
                      <th className="text-left py-2 px-4">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.slice(0, 5).map(org => (
                      <tr key={org.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4 font-medium">{org.name}</td>
                        <td className="py-2 px-4 capitalize">{org.type}</td>
                        <td className="py-2 px-4">
                          <Badge className={getSubscriptionBadgeColor(org.subscriptionTier)}>
                            {org.subscriptionTier.charAt(0).toUpperCase() + org.subscriptionTier.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-2 px-4">{formatDate(org.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {organizations.length > 5 && (
                  <div className="mt-4 text-right">
                    <p className="text-sm text-muted-foreground">
                      Showing 5 of {organizations.length} organizations
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        // Regular user dashboard
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{organization.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4" />
                        <span className="capitalize">{organization.type} Organization</span>
                      </div>
                    </CardDescription>
                  </div>
                  <Badge className={getSubscriptionBadgeColor(organization.subscriptionTier)}>
                    <BadgeCheck className="mr-1 h-3 w-3" />
                    {organization.subscriptionTier.charAt(0).toUpperCase() + organization.subscriptionTier.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {organization.description && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                      <p>{organization.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Created On</h3>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatDate(organization.createdAt)}</span>
                      </div>
                    </div>
                    
                    {organization.website && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Website</h3>
                        <div className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a 
                            href={organization.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {organization.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{userCount}</div>
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{activeUsers}</div>
                    <Users className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Pending Invitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{pendingUsers}</div>
                    <Mail className="h-6 w-6 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Quick action buttons will be implemented later.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardSkeleton({ isPlatformAdmin = false }: { isPlatformAdmin?: boolean }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {isPlatformAdmin ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/4 mt-1" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    </div>
  )
} 