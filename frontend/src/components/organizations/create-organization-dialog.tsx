'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Building2, Upload } from 'lucide-react';
import { useCreateOrganization } from '@/hooks/api/use-organizations';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DEFAULT_ORGANIZATION_SETTINGS } from '@/constants/organization';
import { Resolver } from 'react-hook-form';

const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['client', 'expert'], {
    required_error: 'Please select an organization type',
  }),
  description: z.string().optional(),
  subscriptionTier: z.enum(['basic', 'premium', 'enterprise'], {
    required_error: 'Please select a subscription tier',
  }),
  logoUrl: z.string().optional(),
  customTerminology: z.record(z.string()).optional(),
  settings: z.object({
    theme: z.enum(['light', 'dark']).default('light'),
    enableNotifications: z.boolean().default(true),
  }),
});

type FormData = z.infer<typeof createOrganizationSchema>;

export function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: createOrganization, isPending } = useCreateOrganization();
  const [customTermKeys, setCustomTermKeys] = useState<string[]>(['']);

  const form = useForm<FormData>({
    resolver: zodResolver(createOrganizationSchema) as Resolver<FormData>,
    defaultValues: {
      type: 'client',
      subscriptionTier: 'basic',
      settings: {
        theme: 'light',
        enableNotifications: true,
      },
      customTerminology: {},
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Create proper key-value pairs for custom terminology
      const customTerminology: Record<string, string> = {};
      customTermKeys.forEach((_, index) => {
        const key = data.customTerminology?.[`key${index}`];
        const value = data.customTerminology?.[`value${index}`];
        if (key && value && key.trim() !== '' && value.trim() !== '') {
          customTerminology[key] = value;
        }
      });

      // Create the submission data with the fixed custom terminology
      const submissionData = {
        ...data,
        customTerminology
      };

      console.log('Submitting organization data:', submissionData);
      const result = await createOrganization(submissionData);
      console.log('Organization created successfully:', result);
      
      setOpen(false);
      form.reset();
      toast.success('Organization created successfully');
    } catch (error) {
      console.error('Failed to create organization:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create organization. Please try again.';
      toast.error(errorMessage);
    }
  };

  const addCustomTermField = () => {
    setCustomTermKeys([...customTermKeys, '']);
  };

  const removeCustomTermField = (index: number) => {
    setCustomTermKeys(customTermKeys.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Building2 className="mr-2 h-4 w-4" />
          New Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Add a new organization to your account. Fill in the organization details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter organization name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select organization type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="client">Client Organization</SelectItem>
                          <SelectItem value="expert">Expert Practice</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Input placeholder="Enter organization description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Subscription & Logo */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Subscription & Branding</h3>
                
                <FormField
                  control={form.control}
                  name="subscriptionTier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription Tier</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subscription tier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="Enter logo URL" {...field} />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              // TODO: Implement logo upload functionality
                              toast.info('Logo upload functionality coming soon');
                            }}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Settings</h3>
                
                <FormField
                  control={form.control}
                  name="settings.theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Theme</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.enableNotifications"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <FormLabel>Enable Notifications</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Custom Terminology */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Custom Terminology</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomTermField}
                  >
                    Add Term
                  </Button>
                </div>

                {customTermKeys.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`customTerminology.key${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Term (e.g., employee)" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`customTerminology.value${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Replacement (e.g., team member)" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeCustomTermField(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Organization'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 