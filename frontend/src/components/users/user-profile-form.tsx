'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '@/types/user';
import { useRoles } from '@/hooks/api/use-roles';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  roleId: z.string().min(1, { message: 'Please select a role' }),
  status: z.enum(['active', 'inactive', 'pending']),
});

type FormValues = z.infer<typeof formSchema>;

interface UserProfileFormProps {
  user: User;
  onSave: (data: FormValues) => void;
  onCancel: () => void;
  isPending: boolean;
  organizationId?: string;
}

export function UserProfileForm({ user, onSave, onCancel, isPending, organizationId }: UserProfileFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email,
      roleId: user.roleId || '',
      status: user.status || 'active',
    },
  });

  const { data: rolesData, isLoading: isLoadingRoles } = useRoles(organizationId);

  const roles = rolesData?.data?.roles || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled={true} placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isLoadingRoles}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select a role"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingRoles ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading roles...</span>
                    </div>
                  ) : roles.length > 0 ? (
                    roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.displayName || role.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No roles available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isLoadingRoles}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 