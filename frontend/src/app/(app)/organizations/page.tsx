'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, ExternalLink, Bell, Sun, Moon } from 'lucide-react';
import { CreateOrganizationDialog } from '@/components/organizations/create-organization-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useOrganizationsData } from '@/hooks/api/use-organizations-data';
import { useAuth } from '@/hooks/useAuth';
import { canCreateOrganization } from '@/lib/permissions';

const subscriptionColors = {
  basic: 'bg-blue-100 text-blue-800',
  premium: 'bg-purple-100 text-purple-800',
  enterprise: 'bg-green-100 text-green-800',
} as const;

const typeColors = {
  client: 'bg-orange-100 text-orange-800',
  expert: 'bg-cyan-100 text-cyan-800',
} as const;

function OrganizationSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-16 bg-primary/10" />
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrganizationsPage() {
  const { organizations, isLoading, error, isSingleOrg } = useOrganizationsData();
  const { user } = useAuth();
  
  // Check if the user has permission to create organizations
  const canCreate = canCreateOrganization(user?.role);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isSingleOrg ? 'My Organization' : 'All Organizations'}
        </h1>
        {canCreate && <CreateOrganizationDialog />}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          Failed to load organizations
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: isSingleOrg ? 1 : 6 }).map((_, i) => (
            <OrganizationSkeleton key={i} />
          ))
        ) : organizations?.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No Organizations</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {canCreate ? 'Get started by creating your first organization.' : 'No organizations found.'}
              </p>
              {canCreate && <CreateOrganizationDialog />}
            </Card>
          </div>
        ) : (
          organizations?.map((org) => (
            <Card key={org.id} className="overflow-hidden flex flex-col">
              <div className="relative h-24 bg-primary/5">
                <Image
                  src="/globe.svg"
                  alt={`${org.name} logo`}
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{org.name}</span>
                  <div className="flex gap-2">
                    {org.settings?.enableNotifications && (
                      <Bell className="h-4 w-4 text-muted-foreground" />
                    )}
                    {org.settings?.theme === 'dark' ? (
                      <Moon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Sun className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge className={typeColors[org.type]}>
                    {org.type}
                  </Badge>
                  <Badge className={subscriptionColors[org.subscriptionTier]}>
                    {org.subscriptionTier}
                  </Badge>
                  {org.settings?.isPlatformAdmin && (
                    <Badge variant="destructive">Admin</Badge>
                  )}
                </div>
                {Object.keys(org.customTerminology).length > 0 && (
                  <div className="mb-4 text-xs text-muted-foreground">
                    <p className="font-medium">Custom Terminology:</p>
                    {Object.entries(org.customTerminology).map(([key, value]) => (
                      <p key={key}>
                        {key}: <span className="font-medium">{value}</span>
                      </p>
                    ))}
                  </div>
                )}
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-xs text-muted-foreground">
                    Created {formatDistanceToNow(new Date(org.createdAt))} ago
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/organizations/${org.id}`}>
                      View
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 