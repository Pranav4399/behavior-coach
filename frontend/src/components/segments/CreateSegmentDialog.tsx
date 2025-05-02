'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { useTestRule, useCreateSegmentWithRuleValidation } from '@/hooks/api/use-segments';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RuleBuilder } from '@/components/segments/rule-builder';
import { createEmptyRule } from '@/types/rules';
import { SegmentRule } from '@/types/segment';

interface CreateSegmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Define form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  type: z.enum(['static', 'rule_based']),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateSegmentDialog({
  open,
  onClose,
  onSuccess,
}: CreateSegmentDialogProps) {
  const { toast } = useToast();
  const createSegment = useCreateSegmentWithRuleValidation();
  const testRule = useTestRule();
  
  // Rule state
  const [ruleDefinition, setRuleDefinition] = useState<SegmentRule>(createEmptyRule());
  const [isRuleValid, setIsRuleValid] = useState(true);
  const [ruleError, setRuleError] = useState<string | null>(null);
  const [hasRuleConditions, setHasRuleConditions] = useState(false);
  const [isTestingRule, setIsTestingRule] = useState(false);
  const [testResult, setTestResult] = useState<{
    matchCount: number;
    totalWorkers: number;
    matchPercentage: number;
  } | null>(null);
  
  // Set up form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'static',
    },
  });

  // Get current form values
  const segmentType = form.watch('type');
  
  // Function to count conditions in a rule
  const countConditions = (rule: SegmentRule): number => {
    return rule.conditions.reduce((count, condition) => {
      if ('type' in condition) {
        return count + countConditions(condition as SegmentRule);
      }
      return count + 1;
    }, 0);
  };
  
  // Handle dialog open/close
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    } else {
      // Reset states when dialog opens (replaces the first useEffect)
      setRuleDefinition(createEmptyRule());
      setIsRuleValid(true);
      setRuleError(null);
      setTestResult(null);
      setHasRuleConditions(false);
    }
  };

  // Handle rule updates from RuleBuilder
  const handleRuleChange = (updatedRule: SegmentRule) => {
    setRuleDefinition(updatedRule);
    setIsRuleValid(true); // Reset validation
    setRuleError(null);
    setTestResult(null); // Clear test results when rule changes
    
    // Update hasRuleConditions (replaces the second useEffect)
    setHasRuleConditions(countConditions(updatedRule) > 0);
  };
  
  // Test the current rule against workers
  const handleTestRule = async () => {
    try {
      setIsTestingRule(true);
      const response = await testRule.mutateAsync({ rule: ruleDefinition, limit: 100 });
      setTestResult({
        matchCount: response.data.matchCount,
        totalWorkers: response.data.totalWorkers,
        matchPercentage: response.data.matchPercentage,
      });
      setIsTestingRule(false);
    } catch (error) {
      setIsTestingRule(false);
      setRuleError('Failed to test rule. Please check the rule syntax.');
      setIsRuleValid(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // For rule-based segments, validate that we have a rule with conditions
      if (values.type === 'rule_based' && (!hasRuleConditions)) {
        setRuleError('Rule-based segments must have at least one condition.');
        setIsRuleValid(false);
        return;
      }
      
      // Include rule definition for rule-based segments
      const segmentData = {
        name: values.name,
        description: values.description,
        type: values.type,
        ...(values.type === 'rule_based' ? { ruleDefinition } : {}),
      };
      
      await createSegment.mutateAsync(segmentData);
      
      toast({
        title: 'Segment created',
        description: 'The segment was created successfully.',
      });
      
      // Reset form
      form.reset();
      setRuleDefinition(createEmptyRule());
      setTestResult(null);
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Close dialog
      onClose();
    } catch (error) {
      // Check for validation error
      const errorMessage = error instanceof Error ? error.message : 'Failed to create segment';
      
      // If it's a rule validation error, display it in the form
      if (errorMessage.includes('Rule validation failed')) {
        setRuleError(errorMessage.replace('Rule validation failed: ', ''));
        setIsRuleValid(false);
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={segmentType === 'rule_based' ? "sm:max-w-[800px] max-h-[90vh] overflow-y-auto" : "sm:max-w-[500px]"}>
        <DialogHeader>
          <DialogTitle>Create New Segment</DialogTitle>
          <DialogDescription>
            Create a segment to group workers based on specific criteria.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Segment name" {...field} />
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
                    <Textarea
                      placeholder="Describe the purpose of this segment"
                      {...field}
                    />
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
                  <FormLabel>Segment Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a segment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="static">
                        Static (Manual)
                      </SelectItem>
                      <SelectItem value="rule_based">
                        Rule-based (Dynamic)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Static segments require manual worker assignment. Rule-based segments automatically include matching workers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {segmentType === 'rule_based' && (
              <div className="space-y-4">
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-medium mb-2">Define Segment Rules</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Build rules to determine which workers are automatically included in this segment.
                  </p>
                </div>
                
                {!isRuleValid && ruleError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Invalid Rule</AlertTitle>
                    <AlertDescription>
                      {ruleError}
                    </AlertDescription>
                  </Alert>
                )}
                
                <RuleBuilder 
                  initialRule={ruleDefinition} 
                  onChange={handleRuleChange} 
                />
                
                {testResult && (
                  <Alert variant="default" className="mt-4">
                    <AlertTitle>Rule Test Results</AlertTitle>
                    <AlertDescription>
                      This rule would match {testResult.matchCount} out of {testResult.totalWorkers} workers 
                      ({(testResult.matchPercentage * 100).toFixed(1)}%).
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestRule}
                    disabled={isTestingRule || !hasRuleConditions}
                    className="mr-2"
                  >
                    {isTestingRule ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      'Test Rule'
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createSegment.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSegment.isPending || (segmentType === 'rule_based' && !hasRuleConditions)}>
                {createSegment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Segment'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 