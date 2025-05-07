'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useOrganization } from '@/hooks/api/use-organizations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Organization, OrganizationSettings, OrganizationResponse } from '@/types/organization';
import { SUBSCRIPTION_COLORS, ORGANIZATION_TYPE_COLORS, DEFAULT_ORGANIZATION_SETTINGS } from '@/constants/organization';
import { ApiResponse } from '@/types/common';

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
  const [customTermPairs, setCustomTermPairs] = useState<number[]>([]);

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

  useEffect(() => {
    if (isEditing) {
      setCustomTermPairs([0]);
    } else {
      setCustomTermPairs([]);
    }
  }, [isEditing]);

  const addCustomTermPair = () => {
    const nextIndex = Math.max(...customTermPairs, 0) + 1;
    setCustomTermPairs([...customTermPairs, nextIndex]);
  };

  const removeCustomTermPair = (index: number) => {
    setCustomTermPairs(customTermPairs.filter(i => i !== index));
    
    const currentTerminology = form.getValues().customTerminology;
    delete currentTerminology[`key${index}`];
    delete currentTerminology[`value${index}`];
    form.setValue('customTerminology', currentTerminology);
  };

  const onSubmit = async (formData: FormData) => {
    try {
      // Validate that no key-value pairs are incomplete
      let hasIncompleteTerms = false;
      
      customTermPairs.forEach(index => {
        const key = formData.customTerminology[`key${index}`];
        const value = formData.customTerminology[`value${index}`];
        
        if ((key && !value) || (!key && value)) {
          hasIncompleteTerms = true;
        }
      });
      
      // Check existing terminology entries
      Object.entries(formData.customTerminology)
        .filter(([k]) => !k.startsWith('key') && !k.startsWith('value'))
        .forEach(([_, value]) => {
          if (!value || value.trim() === '') {
            hasIncompleteTerms = true;
          }
        });
      
      if (hasIncompleteTerms) {
        toast.error('Both original term and replacement term must be provided for all entries');
        return;
      }
      
      const customTerminology: Record<string, string> = {};
      
      // Process new term pairs
      customTermPairs.forEach(index => {
        const key = formData.customTerminology[`key${index}`];
        const value = formData.customTerminology[`value${index}`];
        
        if (key && value && key.trim() !== '' && value.trim() !== '') {
          customTerminology[key] = value as string;
        }
        
        delete formData.customTerminology[`key${index}`];
        delete formData.customTerminology[`value${index}`];
      });
      
      // Process existing terminology that might be in the form
      Object.entries(formData.customTerminology)
        .filter(([k]) => !k.startsWith('key') && !k.startsWith('value') && !k.startsWith('original_'))
        .forEach(([key, value]) => {
          if (key && value && key.trim() !== '' && value.trim() !== '') {
            customTerminology[key] = value as string;
          }
        });
      
      const submissionData = {
        ...formData,
        customTerminology
      };

      await apiClient<ApiResponse<OrganizationResponse>>(`/organizations/${organizationId}`, {
        method: 'PUT',
        body: submissionData,
      });
      
      // Refresh the data from the server
      await queryClient.invalidateQueries({ queryKey: ['organizations', organizationId] });
      
      // Rather than manually updating the form, we'll fetch the latest data in the useEffect
      setIsEditing(false);
      toast.success('Organization updated successfully');
    } catch (error: any) {
      console.error('Failed to update organization:', error);
      
      const errorMessage = error?.response?.data?.message || error?.message;
      
      if (errorMessage && errorMessage.includes('already exists')) {
        form.setError('name', {
          type: 'manual',
          message: 'An organization with this name already exists'
        });
        toast.error('An organization with this name already exists');
      } else {
        toast.error(errorMessage || 'Failed to update organization. Please try again.');
      }
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Custom Terminology</CardTitle>
                <CardDescription>
                  Define alternative terms used throughout the platform.
                </CardDescription>
              </div>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomTermPair}
                >
                  Add Term
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!isEditing && 
               Object.entries(organization.customTerminology || {})
                .filter(([key]) => key !== 'term1' && key !== 'replacement1')
                .length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No custom terminology defined.</p>
                  {!isEditing && (
                    <p className="text-sm mt-2">Edit profile to add custom terms.</p>
                  )}
                </div>
              )}
              
              {!isEditing && (
                <div className="space-y-3">
                  {Object.entries(organization.customTerminology || {})
                    .filter(([key]) => key !== 'term1' && key !== 'replacement1')
                    .map(([term, replacement]) => (
                      <div key={term} className="flex items-center rounded-md border p-3">
                        <div className="min-w-[120px] font-medium">{term}</div>
                        <div className="mx-3 text-sm text-muted-foreground">→</div>
                        <div>{replacement as string}</div>
                      </div>
                    ))}
                </div>
              )}
              
              {isEditing && (
                <div className="space-y-3">
                  {Object.entries(organization.customTerminology || {})
                    .filter(([key]) => key !== 'term1' && key !== 'replacement1')
                    .map(([term, replacement], idx) => (
                      <div key={`existing-${idx}`} className="flex items-center gap-3">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`customTerminology.original_${idx}`}
                            defaultValue={term}
                            render={({ field }) => (
                              <FormItem className="m-0">
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="Original term"
                                    defaultValue={term}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex-none text-muted-foreground">→</div>
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`customTerminology.${term}`}
                            render={({ field }) => (
                              <FormItem className="m-0">
                                <FormControl>
                                  <Input {...field} placeholder="Replacement term" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newTerminology = { ...form.getValues().customTerminology };
                            delete newTerminology[term];
                            delete newTerminology[`original_${idx}`];
                            form.setValue('customTerminology', newTerminology);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  
                  {customTermPairs.map((index) => (
                    <div key={`new-${index}`} className="flex items-center gap-3">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`customTerminology.key${index}`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Original term" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex-none text-muted-foreground">→</div>
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`customTerminology.value${index}`}
                          render={({ field }) => (
                            <FormItem className="m-0">
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Replacement term" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCustomTermPair(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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