import { useAuth } from '@/hooks/useAuth';
import { useOrganization, useOrganizations } from '@/hooks/api/use-organizations';
import { canViewAllOrganizations } from '@/lib/permissions';

/**
 * Custom hook that fetches organizations data based on user role and permissions
 * - For platform admins: fetches all organizations
 * - For regular users: fetches only their own organization
 */
export function useOrganizationsData() {
  const { user } = useAuth();
  const organizationId = user?.organizationId;
  const userRole = user?.role;
  
  // Determine if the user can view all organizations
  const canViewAll = canViewAllOrganizations(userRole);
  
  // For platform admins, fetch all organizations
  const allOrgsQuery = useOrganizations();
  
  // For regular users, fetch only their organization
  const userOrgQuery = organizationId 
    ? useOrganization(organizationId)
    : { data: undefined, isLoading: false, error: undefined };
  
  // Return data based on permissions
  if (canViewAll) {
    return {
      organizations: allOrgsQuery.data?.data?.organizations || [],
      isLoading: allOrgsQuery.isLoading,
      error: allOrgsQuery.error,
      isSingleOrg: false
    };
  } else {
    // Format single organization as an array for consistent interface
    const organizations = userOrgQuery.data?.data?.organization
      ? [userOrgQuery.data.data.organization]
      : [];
    
    return {
      organizations,
      isLoading: userOrgQuery.isLoading,
      error: userOrgQuery.error,
      isSingleOrg: true
    };
  }
} 