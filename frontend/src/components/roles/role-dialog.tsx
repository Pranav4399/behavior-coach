'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateRole, useUpdateRole } from '@/hooks/api/use-roles';
import { Role } from '@/types/roles';
import { PERMISSIONS, RESOURCE_DISPLAY_NAMES, ACTION_DISPLAY_NAMES } from '@/lib/permissions';
import { toast } from '@/components/ui/toast/index';

const RoleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'At least one permission must be selected'),
  isDefault: z.boolean().optional(),
});

type RoleFormValues = z.infer<typeof RoleSchema>;

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role;
}

// Flatten permissions for UI display
const flattenedPermissions = Object.entries(PERMISSIONS).reduce((acc, [resource, actions]) => {
  const resourceName = RESOURCE_DISPLAY_NAMES[resource as keyof typeof RESOURCE_DISPLAY_NAMES] || resource;
  
  Object.entries(actions).forEach(([actionKey, permission]) => {
    const actionName = ACTION_DISPLAY_NAMES[actionKey.toLowerCase() as keyof typeof ACTION_DISPLAY_NAMES] || actionKey;
    acc.push({
      id: permission,
      resource,
      resourceName,
      action: actionKey,
      actionName,
      label: `${resourceName} - ${actionName}`,
    });
  });
  
  return acc;
}, [] as Array<{
  id: string;
  resource: string;
  resourceName: string;
  action: string;
  actionName: string;
  label: string;
}>);

// Group permissions by resource for UI display
const groupedPermissions = flattenedPermissions.reduce((acc, permission) => {
  const { resource, resourceName } = permission;
  if (!acc[resource]) {
    acc[resource] = {
      resourceName,
      permissions: [],
    };
  }
  acc[resource].permissions.push(permission);
  return acc;
}, {} as Record<string, { resourceName: string; permissions: typeof flattenedPermissions }>);

export default function RoleDialog({ open, onOpenChange, role }: RoleDialogProps) {
  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();
  const isPending = isCreating || isUpdating;
  
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: '',
      displayName: '',
      description: '',
      permissions: [],
      isDefault: false,
    },
  });
  
  // Reset form when dialog opens/closes or role changes
  useEffect(() => {
    if (open && role) {
      console.log('Loading role with permissions:', role.permissions);
      form.reset({
        name: role.name || '',
        displayName: role.displayName || '',
        description: role.description || '',
        permissions: role.permissions || [],
        isDefault: role.isDefault || false,
      });
    } else if (open) {
      form.reset({
        name: '',
        displayName: '',
        description: '',
        permissions: [],
        isDefault: false,
      });
    }
  }, [form, open, role]);
  
  // For debugging - log the current permissions
  useEffect(() => {
    if (open && role) {
      const currentPermissions = form.getValues('permissions');
      console.log('Current form permissions:', currentPermissions);
    }
  }, [form, open, role]);
  
  const onSubmit = (values: RoleFormValues) => {
    if (role) {
      // Update existing role
      updateRole(
        {
          id: role.id,
          data: values,
        },
        {
          onSuccess: () => {
            toast({
              title: 'Role updated',
              description: `${values.name} has been updated successfully.`,
            });
            onOpenChange(false);
          },
          onError: (error) => {
            console.error('Error updating role:', error);
            toast({
              title: 'Error',
              description: 'Failed to update the role. Please try again.',
              variant: 'destructive',
            });
          },
        }
      );
    } else {
      // Create new role
      createRole(
        values,
        {
          onSuccess: () => {
            toast({
              title: 'Role created',
              description: `${values.name} has been created successfully.`,
            });
            onOpenChange(false);
          },
          onError: (error) => {
            console.error('Error creating role:', error);
            toast({
              title: 'Error',
              description: 'Failed to create the role. Please try again.',
              variant: 'destructive',
            });
          },
        }
      );
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Create New Role'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 overflow-y-auto pr-1">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                placeholder="Enter role name"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="Enter display name"
                {...form.register('displayName')}
              />
              {form.formState.errors.displayName && (
                <p className="text-sm text-destructive">{form.formState.errors.displayName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter role description"
                className="resize-none"
                {...form.register('description')}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={form.watch('isDefault')}
                onCheckedChange={(checked) => {
                  form.setValue('isDefault', !!checked, { 
                    shouldDirty: true,
                    shouldTouch: true 
                  });
                }}
              />
              <Label
                htmlFor="isDefault"
                className="text-sm font-normal cursor-pointer"
              >
                Set as default role for new users
              </Label>
            </div>
            
            <div className="space-y-4">
              <Label>Permissions</Label>
              <div className="border rounded-md p-4 space-y-6 max-h-[350px] overflow-y-auto">
                {Object.entries(groupedPermissions).map(([resource, { resourceName, permissions }]) => {
                  // Check if all permissions in this group are selected
                  const currentPermissions = form.watch('permissions');
                  const allPermissionIds = permissions.map(p => p.id);
                  const allSelected = allPermissionIds.every(id => currentPermissions.includes(id));
                  const someSelected = allPermissionIds.some(id => currentPermissions.includes(id)) && !allSelected;
                  
                  // Handler for toggling all permissions in this group
                  const toggleAllInGroup = () => {
                    const currentValues = form.getValues('permissions');
                    if (allSelected) {
                      // Remove all permissions from this group
                      const newPermissions = currentValues.filter(
                        p => !allPermissionIds.includes(p)
                      );
                      form.setValue('permissions', newPermissions, { 
                        shouldDirty: true,
                        shouldTouch: true 
                      });
                    } else {
                      // Add all permissions from this group that aren't already selected
                      const newPermissions = [
                        ...currentValues,
                        ...allPermissionIds.filter(id => !currentValues.includes(id))
                      ];
                      form.setValue('permissions', newPermissions, { 
                        shouldDirty: true,
                        shouldTouch: true 
                      });
                    }
                  };
                  
                  return (
                    <div key={resource} className="space-y-2">
                      <div className="flex items-center justify-between top-0 bg-background py-1 z-10">
                        <h4 className="font-medium text-sm">{resourceName}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          type="button"
                          onClick={toggleAllInGroup}
                          className="h-7 text-xs"
                        >
                          {allSelected ? 'Deselect All' : someSelected ? 'Select All' : 'Select All'}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {permissions.map((permission) => {
                          // Check if this permission is in the role's permissions
                          const isChecked = currentPermissions.includes(permission.id);

                          return (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission.id}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const currentPermissionValues = form.getValues('permissions');
                                  
                                  if (checked) {
                                    form.setValue('permissions', [...currentPermissionValues, permission.id], { 
                                      shouldDirty: true,
                                      shouldTouch: true 
                                    });
                                  } else {
                                    form.setValue(
                                      'permissions',
                                      currentPermissionValues.filter((p) => p !== permission.id),
                                      { shouldDirty: true, shouldTouch: true }
                                    );
                                  }
                                }}
                              />
                              <Label
                                htmlFor={permission.id}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {permission.actionName}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              {form.formState.errors.permissions && (
                <p className="text-sm text-destructive">{form.formState.errors.permissions.message}</p>
              )}
            </div>
          </div>
        </form>
        
        <DialogFooter className="pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isPending} 
            onClick={form.handleSubmit(onSubmit)}
          >
            {isPending ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 