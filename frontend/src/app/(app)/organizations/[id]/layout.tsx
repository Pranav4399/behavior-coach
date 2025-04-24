'use client';

import { useState, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useOrganization } from '@/hooks/api/use-organizations';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { ORGANIZATION_TYPE_COLORS } from '@/constants/organization';

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const organizationId = params.id as string;
  const { data, isLoading } = useOrganization(organizationId);
  const organization = data?.data?.organization;
  const [activeTab, setActiveTab] = useState<string>('profile');

  // Determine the active tab based on the current path
  useEffect(() => {
    if (pathname.includes('/users')) {
      setActiveTab('users');
    } else {
      setActiveTab('profile');
    }
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'profile') {
      router.push(`/organizations/${organizationId}`);
    } else {
      router.push(`/organizations/${organizationId}/${value}`);
    }
  };

  // Prefetch the users page to minimize loading time when switching tabs
  useEffect(() => {
    // Prefetch the users route to ensure fast navigation
    router.prefetch(`/organizations/${organizationId}/users`);
  }, [organizationId, router]);

  return (
    <div className="space-y-8">
      <div className="border-b pb-5">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="h-5 w-5" />
          <h1 className="text-3xl font-bold">
            {isLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              organization?.name || 'Organization Details'
            )}
          </h1>
          {organization && (
            <Badge className={ORGANIZATION_TYPE_COLORS[organization.type]}>
              {organization.type}
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div>{children}</div>
    </div>
  );
} 