'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { User, PhoneCall, Briefcase, Activity } from 'lucide-react';
import { useCreateWorker } from '@/hooks/api/use-workers';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/useAuth';
import { WorkerCreateData, Gender, EmploymentStatus, EmploymentType } from '@/types/worker';
import { DatePicker } from '@/components/ui/date-picker';
import {
  GENDER_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  DEPARTMENT_OPTIONS,
  JOB_TITLE_OPTIONS,
  LOCATION_COUNTRY_OPTIONS,
  LOCATION_STATE_OPTIONS,
  PREFERRED_LANGUAGE_OPTIONS
} from '@/constants/formOptions';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


import { Badge } from '@/components/ui/badge';

interface CreateWorkerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateWorkerDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreateWorkerDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const createWorker = useCreateWorker();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  // Initialize form with default values
  const form = useForm<WorkerCreateData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      externalId: '',
      isActive: true,
      employmentStatus: 'active',
      gender: undefined,
      dateOfBirth: undefined,
      primaryPhoneNumber: '',
      emailAddress: '',
      locationCity: '',
      locationStateProvince: '',
      locationCountry: 'IN',
      preferredLanguage: 'hi',
      jobTitle: '',
      department: '',
      team: '',
      employmentType: undefined
    },
    mode: 'onChange'
  });

  // Form submission handler
  const onSubmit = async (data: WorkerCreateData) => {
    setApiError(null); // Reset any previous errors
    
    try {
      // Validate date of birth (should not be in the future)
      if (data.dateOfBirth) {
        const dob = new Date(data.dateOfBirth);
        const today = new Date();
        if (dob > today) {
          form.setError('dateOfBirth', {
            type: 'manual',
            message: 'Date of birth cannot be in the future'
          });
          return;
        }
      }

      // Keep payload simple and directly aligned with API expectations
      // Use the same type as the form data to ensure compatibility
      const payload: WorkerCreateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        externalId: data.externalId || '',
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        isActive: Boolean(data.isActive),
        employmentStatus: data.employmentStatus || 'active',
        tags,
        
        // Contact fields
        primaryPhoneNumber: data.primaryPhoneNumber,
        emailAddress: data.emailAddress,
        locationCity: data.locationCity,
        locationStateProvince: data.locationStateProvince,
        locationCountry: data.locationCountry || 'India',
        preferredLanguage: data.preferredLanguage || 'en-IN',
        
        // Employment fields
        jobTitle: data.jobTitle || '',
        department: data.department || '',
        team: data.team || '',
        employmentType: data.employmentType,
        
        // Organization context
        organizationId: user?.organizationId
      };

      // Filter out any empty strings to allow backend defaults
      Object.keys(payload).forEach(key => {
        const typedKey = key as keyof WorkerCreateData;
        if (payload[typedKey] === '') {
          delete payload[typedKey];
        }
      });
      
      await createWorker.mutateAsync(payload);
      
      toast({
        title: 'Success',
        description: 'Worker created successfully',
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Worker creation error:', error);
      
      // Handle different types of errors
      if (error instanceof Error) {
        // Set API error for display in the form
        setApiError(error.message);
        
        // Try to extract more specific field errors if available
        const errorData = (error as any).response?.data;
        if (errorData?.errors) {
          // If the API returns field-specific errors, set them on the form
          Object.entries(errorData.errors).forEach(([field, message]) => {
            if (field in form.getValues()) {
              form.setError(field as any, {
                type: 'manual',
                message: Array.isArray(message) ? message[0] : message as string
              });
            }
          });
        }
      }
      
      toast({
        title: 'Error Creating Worker',
        description: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle tag input
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Check if all mandatory fields are filled
  const isFormValid = form.formState.isValid;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-xl">
        <DialogHeader className="pb-4 border-b mb-6">
          <DialogTitle className="text-2xl font-bold">Create New Worker</DialogTitle>
          <DialogDescription className="text-base mt-2 text-muted-foreground">
            Add a new worker to your organization.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* API Error Alert */}
            {apiError && (
              <div className="bg-destructive/15 p-4 rounded-md border border-destructive mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-destructive mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-destructive">Error creating worker</h3>
                    <div className="mt-1 text-sm text-destructive/90">
                      {apiError}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <Accordion type="multiple" defaultValue={["basic", "contact", "employment", "status"]} className="w-full space-y-4">
              {/* Basic Information */}
              <AccordionItem value="basic" className="border rounded-lg overflow-hidden shadow-sm">
                <AccordionTrigger className="px-4 py-3 text-base font-medium bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <span>Basic Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-4 pb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      rules={{ required: 'First name is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      rules={{ required: 'Last name is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="externalId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <Input placeholder="EMP-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      rules={{ 
                        required: 'Date of birth is required',
                        validate: (value) => {
                          if (!value) return true;
                          const date = new Date(value);
                          const today = new Date();
                          return date <= today || 'Date of birth cannot be in the future';
                        }
                      }}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Date of Birth*</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value ? new Date(field.value) : null}
                              onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : null)}
                              placeholder="Select date of birth"
                              showYearDropdown
                              showMonthDropdown
                              yearDropdownItemNumber={100}
                              maxDate={new Date()}
                              dateFormat="MMMM d, yyyy"
                              error={!!form.formState.errors.dateOfBirth}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      rules={{ required: 'Gender is required' }}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Gender*</FormLabel>
                          <Select
                            onValueChange={(value: Gender) => field.onChange(value)}
                            value={field.value as Gender}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GENDER_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="col-span-1 md:col-span-2">
                      <FormLabel className="mb-2">Tags</FormLabel>
                      {tags.length > 0 && <div className="flex gap-2 flex-wrap mb-2 min-h-8 p-1">
                        {tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary"
                            className="gap-1 py-1 px-2"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>}
                      <Input
                        placeholder="Type and press Enter to add tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                      />
                      <FormDescription className="text-xs text-muted-foreground mt-2">
                        Press Enter to add multiple tags
                      </FormDescription>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Contact Information */}
              <AccordionItem value="contact" className="border rounded-lg overflow-hidden shadow-sm">
                <AccordionTrigger className="px-4 py-3 text-base font-medium bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center">
                    <PhoneCall className="h-5 w-5 mr-2 text-primary" />
                    <span>Contact Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-4 pb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="primaryPhoneNumber"
                      rules={{ 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
                          message: 'Please enter a valid Indian phone number'
                        }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailAddress"
                      rules={{ 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address*</FormLabel>
                          <FormControl>
                            <Input placeholder="example@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locationCity"
                      rules={{ required: 'City is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City*</FormLabel>
                          <FormControl>
                            <Input placeholder="Mumbai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locationStateProvince"
                      rules={{ required: 'State is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State*</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value || ''}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {LOCATION_STATE_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locationCountry"
                      rules={{ required: 'Country is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country*</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value || 'IN'}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {LOCATION_COUNTRY_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="preferredLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Language</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value || 'hi'}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PREFERRED_LANGUAGE_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Employment Information */}
              <AccordionItem value="employment" className="border rounded-lg overflow-hidden shadow-sm">
                <AccordionTrigger className="px-4 py-3 text-base font-medium bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    <span>Employment Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-4 pb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select job title" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {JOB_TITLE_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {DEPARTMENT_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="team"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter team" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employmentType"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Employment Type</FormLabel>
                          <Select
                            onValueChange={(value: EmploymentType) => field.onChange(value)}
                            value={field.value as EmploymentType}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Status Information */}
              <AccordionItem value="status" className="border rounded-lg overflow-hidden shadow-sm">
                <AccordionTrigger className="px-4 py-3 text-base font-medium bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    <span>Status</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-4 pb-3">
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active Status</FormLabel>
                            <FormDescription>
                              Is this worker currently active?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employmentStatus"
                      rules={{ required: 'Employment status is required' }}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Employment Status*</FormLabel>
                          <Select
                            onValueChange={(value: EmploymentStatus) => field.onChange(value)}
                            value={field.value as EmploymentStatus}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <DialogFooter className="pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createWorker.isPending || !isFormValid}
              >
                {createWorker.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⊚</span>
                    Creating...
                  </>
                ) : (
                  'Create Worker'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
