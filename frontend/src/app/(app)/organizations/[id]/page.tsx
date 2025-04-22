'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useOrganization } from '@/hooks/api/use-organizations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Bell, Sun, Moon, Globe, Building2 } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Organization, OrganizationSettings } from '@/types/organization';
import { SUBSCRIPTION_COLORS, ORGANIZATION_TYPE_COLORS, DEFAULT_ORGANIZATION_SETTINGS } from '@/constants/organization';

type SubscriptionTier = 'basic' | 'premium' | 'enterprise';

function OrganizationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-24" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  settings: z.object({
    theme: z.enum(['light', 'dark']),
    enableNotifications: z.boolean(),
  }) satisfies z.ZodType<OrganizationSettings>,
  customTerminology: z.record(z.string()),
});

type FormData = z.infer<typeof organizationSchema>;

export default function OrganizationProfilePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const organizationId = params.id as string;
  const { data, isLoading, error } = useOrganization(organizationId);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const organization = data?.data?.organization as Organization | undefined;

  const form = useForm<FormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      description: '',
      website: '',
      settings: DEFAULT_ORGANIZATION_SETTINGS,
      customTerminology: {},
    },
  });

  useEffect(() => {
    if (organization) {
      form.reset({
        name: organization.name,
        description: organization.description || '',
        website: organization.website || '',
        settings: {
          theme: organization.settings?.theme || DEFAULT_ORGANIZATION_SETTINGS.theme,
          enableNotifications: organization.settings?.enableNotifications ?? DEFAULT_ORGANIZATION_SETTINGS.enableNotifications,
        },
        customTerminology: organization.customTerminology || {},
      });
    }
  }, [organization, form]);

  const onSubmit = async (formData: FormData) => {
    try {
      await apiClient(`/organizations/${organizationId}`, {
        method: 'PUT',
        body: formData,
      });
      await queryClient.invalidateQueries({ queryKey: ['organizations', organizationId] });
      setIsEditing(false);
      toast.success('Organization updated successfully');
    } catch (error) {
      toast.error('Failed to update organization');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiClient(`/organizations/${organizationId}`, {
        method: 'DELETE',
      });
      toast.success('Organization deleted successfully');
      router.push('/organizations');
    } catch (error) {
      toast.error('Failed to delete organization');
      setIsDeleting(false);
    }
  };

  if (isLoading) return <OrganizationSkeleton />;
  if (error) return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
      Failed to load organization details
    </div>
  );
  if (!organization) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Organization Profile</h1>
        <Button 
          variant={isEditing ? "secondary" : "default"}
          onClick={() => {
            if (isEditing) {
              form.reset();
            }
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-32 bg-primary/5 rounded-lg">
                <Image
                  src="/globe.svg"
                  alt={`${organization.name} logo`}
                  fill
                  className="object-contain p-6"
                  priority
                />
              </div>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-2">
                <Badge className={ORGANIZATION_TYPE_COLORS[organization.type]}>
                  {organization.type}
                </Badge>
                <Badge className={SUBSCRIPTION_COLORS[organization.subscriptionTier]}>
                  {organization.subscriptionTier}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground">
                Created {formatDistanceToNow(new Date(organization.createdAt))} ago
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="settings.theme"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Theme</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Choose your preferred theme
                        </div>
                      </div>
                      <FormControl>
                        <Select
                          disabled={!isEditing}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center">
                                <Sun className="mr-2 h-4 w-4" />
                                Light
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center">
                                <Moon className="mr-2 h-4 w-4" />
                                Dark
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="settings.enableNotifications"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Notifications</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Enable or disable organization notifications
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!isEditing}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Custom Terminology */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Terminology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm text-muted-foreground mb-4">
                Customize key terms used in the platform to match your organization's language.
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customTerminology.client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Term</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || 'Client'}
                          readOnly={!isEditing}
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customTerminology.coach"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coach Term</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || 'Coach'}
                          readOnly={!isEditing}
                          className={!isEditing ? 'bg-muted' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  type="button"
                  variant="destructive" 
                  className="w-full"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Organization'}
                </Button>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
} 