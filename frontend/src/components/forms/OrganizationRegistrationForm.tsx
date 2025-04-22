'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormInput } from '@/components/ui/form-input';
import { Button } from '@/components/ui/button';

const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface OrganizationRegistrationFormProps {
  type: 'client' | 'expert';
  onSubmit: (data: OrganizationFormData) => Promise<void>;
  isLoading?: boolean;
}

export function OrganizationRegistrationForm({
  type,
  onSubmit,
  isLoading = false
}: OrganizationRegistrationFormProps) {
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema)
  });

  const handleFormSubmit = async (data: OrganizationFormData) => {
    try {
      setError(null);
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <FormInput
          label="Organization Name"
          {...register('name')}
          error={errors.name?.message}
          placeholder={`Enter your ${type === 'client' ? 'company' : 'practice'} name`}
          required
        />

        <FormInput
          label="Email Address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="Enter your work email"
          required
        />

        <FormInput
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
          placeholder="Create a password"
          required
        />

        <FormInput
          label="Confirm Password"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          placeholder="Confirm your password"
          required
        />
      </div>

      {error && (
        <div className="text-sm text-red-500 mt-2">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : `Create ${type === 'client' ? 'Company' : 'Practice'} Account`}
      </Button>
    </form>
  );
} 