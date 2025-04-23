'use client';

import { useState } from 'react';
import { useRoles, useDeleteRole, useAdminRoles } from '@/hooks/api/use-roles';
import { Role } from '@/types/roles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import RoleDialog from './role-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/toast/index';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlatformAdmin } from '@/lib/permission';

export default function RoleList() {
  const isPlatformAdmin = usePlatformAdmin();
  const { data, isLoading, error } = isPlatformAdmin ? useAdminRoles() : useRoles();
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | undefined>(undefined);
  
  const roles = data?.data?.roles || [];
  
  const handleCreateClick = () => {
    setSelectedRole(undefined);
    setDialogOpen(true);
  };
  
  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setDialogOpen(true);
  };
  
  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (!roleToDelete) return;
    
    deleteRole({ 
      id: roleToDelete.id,
      organizationId: isPlatformAdmin ? roleToDelete.organizationId : undefined
    }, {
      onSuccess: () => {
        toast({
          title: 'Role deleted',
          description: `${roleToDelete.name} has been deleted successfully.`,
        });
        setDeleteDialogOpen(false);
        setRoleToDelete(undefined);
      },
      onError: (error) => {
        console.error('Error deleting role:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete the role. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };
  
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Failed to load roles. Please try again.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Roles</h2>
        <Button onClick={handleCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : roles.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <CardTitle className="mb-2">No Roles Found</CardTitle>
            <CardDescription className="mb-4">
              Get started by creating your first role.
            </CardDescription>
            <Button onClick={handleCreateClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </Card>
        ) : (
          roles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{role.name}</CardTitle>
                  {role.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
                {role.description && (
                  <CardDescription>{role.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Permissions:</div>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.length > 0 ? (
                      <Badge variant="outline" className="text-xs">
                        {`${role.permissions.length} permission${role.permissions.length === 1 ? '' : 's'}`}
                      </Badge>
                    ) : (
                      <div className="text-sm text-muted-foreground">No permissions assigned</div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleEditClick(role)}>
                  <Pencil className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(role)}
                  disabled={role.isDefault || isDeleting}
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      <RoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={selectedRole}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              "{roleToDelete?.name}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 