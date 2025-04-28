'use client';

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { WorkerFilterOptions } from '@/types/worker';

interface WorkerFiltersProps {
  filters?: WorkerFilterOptions;
  onFiltersChange: (filters: WorkerFilterOptions) => void;
}

export default function WorkerFilters({ filters, onFiltersChange }: WorkerFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters?.searchTerm || '');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const form = useForm<WorkerFilterOptions>({
    defaultValues: {
      searchTerm: filters?.searchTerm || '',
      employmentStatus: filters?.employmentStatus,
      department: filters?.department || '',
      team: filters?.team || '',
      hiredAfter: filters?.hiredAfter,
      hiredBefore: filters?.hiredBefore,
      tags: filters?.tags || [],
    }
  });
  
  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      onFiltersChange({
        ...filters,
        searchTerm: value
      });
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };
  
  // Handle filter form submission
  const handleFilterSubmit = (data: WorkerFilterOptions) => {
    onFiltersChange({
      ...data,
      searchTerm: searchTerm
    });
    setIsFiltersOpen(false);
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    form.reset({
      searchTerm: '',
      employmentStatus: undefined,
      department: '',
      team: '',
      hiredAfter: undefined,
      hiredBefore: undefined,
      tags: [],
    });
    setSearchTerm('');
    onFiltersChange({});
    setIsFiltersOpen(false);
  };
  
  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.employmentStatus) count++;
    if (filters?.department) count++;
    if (filters?.team) count++;
    if (filters?.hiredAfter) count++;
    if (filters?.hiredBefore) count++;
    if (filters?.tags?.length) count += filters.tags.length;
    return count;
  };
  
  return (
    <div className="flex flex-1 items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search workers..."
          className="w-full pl-8"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              onFiltersChange({
                ...filters,
                searchTerm: '',
              });
            }}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-4" align="end">
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(handleFilterSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="employmentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Any status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Input
                        placeholder="Any department"
                        {...field}
                      />
                    </FormControl>
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
                      <Input
                        placeholder="Any team"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel>Hire Date Range</FormLabel>
                <div className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name="hiredAfter"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="w-full justify-start text-left font-normal"
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>From</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date: Date | undefined) => {
                                if (date) {
                                  field.onChange(format(date, "yyyy-MM-dd"));
                                } else {
                                  field.onChange(undefined);
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hiredBefore"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="w-full justify-start text-left font-normal"
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>To</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date: Date | undefined) => {
                                if (date) {
                                  field.onChange(format(date, "yyyy-MM-dd"));
                                } else {
                                  field.onChange(undefined);
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
                <Button type="submit">
                  Apply Filters
                </Button>
              </div>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
} 