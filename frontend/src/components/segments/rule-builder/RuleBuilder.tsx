'use client';

import React, { useState, useEffect } from 'react';
import { RuleBuilderProps, createEmptyRule } from '@/types/rules';
import RuleGroup from './RuleGroup';
import { SegmentRule } from '@/types/segment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';

const RuleBuilder: React.FC<RuleBuilderProps> = ({ 
  initialRule,
  onChange
}) => {
  // Initialize with provided rule or default empty rule
  const [rule, setRule] = useState<SegmentRule>(initialRule || createEmptyRule());
  
  // Update parent component when rule changes
  useEffect(() => {
    // Only update if initialRule is different from current rule
    if (JSON.stringify(initialRule) !== JSON.stringify(rule)) {
      onChange(rule);
    }
  }, [rule, onChange, initialRule]);
  
  // Handle rule updates from children
  const handleRuleUpdate = (updatedRule: SegmentRule) => {
    // Only update state if the rule has actually changed
    if (JSON.stringify(updatedRule) !== JSON.stringify(rule)) {
      setRule(updatedRule);
    }
  };
  
  // Count conditions in the rule (for display purposes)
  const countConditions = (ruleToCount: SegmentRule): number => {
    return ruleToCount.conditions.reduce((count, condition) => {
      // If this is a nested rule, count its conditions recursively
      if ('type' in condition && 'conditions' in condition) {
        return count + countConditions(condition as SegmentRule);
      }
      // Otherwise, it's a single condition
      return count + 1;
    }, 0);
  };
  
  const totalConditions = countConditions(rule);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CardTitle className="text-lg font-medium">Rule Builder</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                  <HelpCircle className="h-4 w-4" />
                  <span className="sr-only">Help</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">How to use the Rule Builder</h4>
                  <p className="text-sm text-muted-foreground">
                    Create conditions to specify which workers should be included in this segment.
                  </p>
                  <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Select worker attributes and operators to build conditions</li>
                    <li>Group conditions with logical operators (AND, OR, NOT)</li>
                    <li>Add nested groups for more complex rules</li>
                    <li>Use the "Add Condition" or "Add Group" buttons</li>
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Badge variant="outline">{totalConditions} condition{totalConditions !== 1 ? 's' : ''}</Badge>
        </div>
        <CardDescription>
          Build a rule to dynamically determine which workers are included in this segment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RuleGroup
          rule={rule}
          onUpdate={handleRuleUpdate}
          onDelete={() => {}} // No-op for root group (can't be deleted)
          isRoot={true}
        />
      </CardContent>
    </Card>
  );
};

export default RuleBuilder; 