
import { ALL_PERMISSIONS, IS_PLATFORM_ADMIN } from "@/constants/permissions";
import { usePermissionsStore } from "@/store/permissions";

/**
 * Check if a user has a specific permission
 * @param userPermissions The user's permissions array
 * @param permission The permission to check
 * @returns boolean indicating if the user has the permission
 */
export function useHasPermission(permission: string): boolean {
  const { permissions } = usePermissionsStore();
  if (!permissions || !Array.isArray(permissions)) return false;

  return permissions.includes(permission);
}
/**
 * Hook to check if the current user is a platform admin based on permissions
 * @returns boolean indicating if the user is a platform admin
 */
export function usePlatformAdmin(): boolean {
  const { permissions } = usePermissionsStore();

  if (!permissions || !Array.isArray(permissions)) return false;

  return (
    ALL_PERMISSIONS.every((permission) => permissions.includes(permission)) &&
    permissions.includes(IS_PLATFORM_ADMIN)
  );
}

/**
 * Hook to check if the current user is an org admin based on permissions
 * @returns boolean indicating if the user is an org admin
 */
export function useOrgAdmin(): boolean {
  const { permissions } = usePermissionsStore();
  const isPlatformAdmin = usePlatformAdmin();
  
  if (!permissions || !Array.isArray(permissions)) return false;
  
  // If they're a platform admin, they're not an org admin
  if (isPlatformAdmin) return false;

  return (
    ALL_PERMISSIONS.every((permission) => permissions.includes(permission)) &&
    !permissions.includes(IS_PLATFORM_ADMIN)
  );
}

/**
 * Check if the current user has admin privileges (platform admin or org admin)
 * @returns boolean indicating if the user has admin privileges
 */
export function useIsAdmin(): boolean {
  const isPlatformAdmin = usePlatformAdmin();
  const isOrgAdmin = useOrgAdmin();
  
  return isPlatformAdmin || isOrgAdmin;
}

/**
 * Hook to differentiate between platform admin and org admin
 * @returns An object with isPlatformAdmin and isOrgAdmin flags
 */
export function useAdminType(): {
  isPlatformAdmin: boolean;
  isOrgAdmin: boolean;
} {
  const isPlatformAdmin = usePlatformAdmin();
  const isOrgAdmin = useOrgAdmin();

  return {
    isPlatformAdmin,
    isOrgAdmin,
  };
}
