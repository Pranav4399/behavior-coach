'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Loader2, User, PhoneCall, Briefcase, Activity } from 'lucide-react';
import { useUpdateWorker } from '@/hooks/api/use-workers';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/useAuth';
import { Worker, WorkerUpdateData, Gender, OptInStatus, EmploymentStatus, EmploymentType, DeactivationReason } from '@/types/worker';
import { DatePicker } from '@/components/ui/date-picker';

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
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface EditWorkerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  worker: Worker;
}

export default function EditWorkerDialog({
  open,
  onClose,
  onSuccess,
  worker,
}: EditWorkerDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const updateWorker = useUpdateWorker(worker.id);
  const [tags, setTags] = useState<string[]>(worker.tags || []);
  const [tagInput, setTagInput] = useState('');

  // Initialize form with worker data
  const form = useForm<WorkerUpdateData>({
    defaultValues: {
      firstName: worker.firstName,
      lastName: worker.lastName,
      externalId: worker.externalId || '',
      isActive: worker.isActive,
      employmentStatus: worker.employment?.employmentStatus || 'active',
      whatsappOptInStatus: worker.contact?.whatsappOptInStatus || 'pending',
      communicationConsent: worker.contact?.communicationConsent || false,
      gender: worker.gender || undefined,
      employmentType: worker.employment?.employmentType || undefined,
      dateOfBirth: worker.dateOfBirth || undefined,
      primaryPhoneNumber: worker.contact?.primaryPhoneNumber || '',
      emailAddress: worker.contact?.emailAddress || '',
      locationCity: worker.contact?.locationCity || '',
      locationStateProvince: worker.contact?.locationStateProvince || '',
      locationCountry: worker.contact?.locationCountry || 'India',
      preferredLanguage: worker.contact?.preferredLanguage || 'en-IN',
      jobTitle: worker.employment?.jobTitle || '',
      department: worker.employment?.department || '',
      team: worker.employment?.team || '',
      hireDate: worker.employment?.hireDate || undefined,
      deactivationReason: worker.deactivationReason || undefined,
    },
    mode: 'onChange'
  });

  // Form submission handler
  const onSubmit = async (data: WorkerUpdateData) => {
    try {
      // Validate dates (should not be in the future)
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

      // Add tags to the form data
      const workerData: WorkerUpdateData = {
        ...data,
        tags,
      };

      // Filter out any empty strings to allow backend defaults
      Object.keys(workerData).forEach(key => {
        const typedKey = key as keyof WorkerUpdateData;
        if (workerData[typedKey] === '') {
          delete workerData[typedKey];
        }
      });
      
      await updateWorker.mutateAsync(workerData);
      
      toast({
        title: 'Success',
        description: 'Worker updated successfully',
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Worker update error:', error);
      toast({
        title: 'Error',
        description: `Failed to update worker: ${error instanceof Error ? error.message : 'Unknown error'}`,
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

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-xl">
        <DialogHeader className="pb-4 border-b mb-6">
          <DialogTitle className="text-2xl font-bold">Edit Worker</DialogTitle>
          <DialogDescription className="text-base mt-2 text-muted-foreground">
            Update worker information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="non_binary">Non-binary</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer_not_say">Prefer not to say</SelectItem>
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
                      <FormDescription>
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
                            <Input placeholder="Maharashtra" {...field} />
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
                            <Input placeholder="India" defaultValue="India" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredLanguage"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Preferred Language</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="en-IN">English</SelectItem>
                              <SelectItem value="hi">Hindi</SelectItem>
                              <SelectItem value="mr">Marathi</SelectItem>
                              <SelectItem value="gu">Gujarati</SelectItem>
                              <SelectItem value="bn">Bengali</SelectItem>
                              <SelectItem value="ta">Tamil</SelectItem>
                              <SelectItem value="te">Telugu</SelectItem>
                              <SelectItem value="kn">Kannada</SelectItem>
                              <SelectItem value="ml">Malayalam</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="whatsappOptInStatus"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>WhatsApp Opt-in Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="opted_in">Opted In</SelectItem>
                              <SelectItem value="opted_out">Opted Out</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
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
                            <Input placeholder="Enter job title" {...field} />
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
                            <Input placeholder="Enter department" {...field} />
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
                      name="hireDate"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Hire Date</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value ? new Date(field.value) : null}
                              onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : null)}
                              placeholder="Select hire date"
                              showYearDropdown
                              showMonthDropdown
                              maxDate={new Date()}
                              dateFormat="MMMM d, yyyy"
                              error={!!form.formState.errors.hireDate}
                            />
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
                              <SelectItem value="full_time">Full Time</SelectItem>
                              <SelectItem value="part_time">Part Time</SelectItem>
                              <SelectItem value="contractor">Contractor</SelectItem>
                              <SelectItem value="temporary">Temporary</SelectItem>
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
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="on_leave">On Leave</SelectItem>
                              <SelectItem value="terminated">Terminated</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!form.watch('isActive') && (
                      <FormField
                        control={form.control}
                        name="deactivationReason"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Deactivation Reason</FormLabel>
                            <Select
                              onValueChange={(value: DeactivationReason) => field.onChange(value)}
                              value={field.value as DeactivationReason}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select reason" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="voluntary_resignation">Voluntary Resignation</SelectItem>
                                <SelectItem value="performance_issues">Performance Issues</SelectItem>
                                <SelectItem value="policy_violation">Policy Violation</SelectItem>
                                <SelectItem value="redundancy">Redundancy</SelectItem>
                                <SelectItem value="retirement">Retirement</SelectItem>
                                <SelectItem value="end_of_contract">End of Contract</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
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
                disabled={updateWorker.isPending}
              >
                {updateWorker.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 