'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  RuleGroupProps,
  LogicalOperator,
  LOGICAL_OPERATOR_LABELS,
  createEmptyCondition,
  createEmptyRule
} from '@/types/rules';
import RuleCondition from './RuleCondition';
import { SegmentCondition, SegmentRule } from '@/types/segment';
import { PlusCircle, Trash2, Group } from 'lucide-react';

const RuleGroup: React.FC<RuleGroupProps> = ({ 
  rule, 
  onUpdate, 
  onDelete,
  isRoot = false
}) => {
  // Handle logical operator change
  const handleOperatorChange = (value: LogicalOperator) => {
    // Only update if the value has changed
    if (rule.type !== value) {
      onUpdate({
        ...rule,
        type: value
      });
    }
  };

  // Handle condition update
  const handleConditionUpdate = (index: number, updatedCondition: SegmentCondition) => {
    // Deep equality check to prevent unnecessary updates
    if (JSON.stringify(rule.conditions[index]) !== JSON.stringify(updatedCondition)) {
      const updatedConditions = [...rule.conditions];
      updatedConditions[index] = updatedCondition;
      
      onUpdate({
        ...rule,
        conditions: updatedConditions
      });
    }
  };

  // Handle condition deletion
  const handleConditionDelete = (index: number) => {
    // Don't allow deleting the last condition in the root group
    if (isRoot && rule.conditions.length <= 1) {
      return;
    }
    
    const updatedConditions = rule.conditions.filter((_, i) => i !== index);
    
    onUpdate({
      ...rule,
      conditions: updatedConditions
    });
  };

  // Handle nested rule update
  const handleRuleUpdate = (index: number, updatedRule: SegmentRule) => {
    // Deep equality check to prevent unnecessary updates
    if (JSON.stringify(rule.conditions[index]) !== JSON.stringify(updatedRule)) {
      const updatedConditions = [...rule.conditions];
      updatedConditions[index] = updatedRule;
      
      onUpdate({
        ...rule,
        conditions: updatedConditions
      });
    }
  };

  // Handle nested rule deletion (same as condition deletion)
  const handleRuleDelete = (index: number) => {
    handleConditionDelete(index);
  };

  // Add a new condition
  const handleAddCondition = () => {
    const newCondition = createEmptyCondition();
    // Check if this exact empty condition already exists to prevent unnecessary updates
    const conditionExists = rule.conditions.some(cond => 
      !('type' in cond) && 
      cond.attribute === newCondition.attribute && 
      cond.operator === newCondition.operator && 
      cond.value === newCondition.value
    );
    
    if (!conditionExists) {
      onUpdate({
        ...rule,
        conditions: [...rule.conditions, newCondition]
      });
    }
  };

  // Add a new rule group
  const handleAddGroup = () => {
    // Create a new empty rule group
    const newGroup = createEmptyRule();
    
    // Only update if we don't already have an identical empty group
    onUpdate({
      ...rule,
      conditions: [...rule.conditions, newGroup]
    });
  };

  return (
    <div className={`p-4 border rounded-md ${isRoot ? 'bg-background' : 'bg-muted/20'}`}>
      {/* Group header with operator selector */}
      <div className="flex items-center mb-4">
        <Select
          value={rule.type}
          onValueChange={(val) => handleOperatorChange(val as LogicalOperator)}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select logical operator" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(LOGICAL_OPERATOR_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Delete group button (not shown for root group) */}
        {!isRoot && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onDelete}
            className="ml-auto"
            title="Remove group"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
      
      {/* Conditions or nested groups */}
      <div className="space-y-3">
        {rule.conditions.map((condition, index) => {
          // Check if this is a nested rule or a condition
          const isRule = 'type' in condition && 'conditions' in condition;
          
          if (isRule) {
            return (
              <RuleGroup
                key={index}
                rule={condition as SegmentRule}
                onUpdate={(updatedRule) => handleRuleUpdate(index, updatedRule)}
                onDelete={() => handleRuleDelete(index)}
              />
            );
          }
          
          return (
            <RuleCondition
              key={index}
              condition={condition as SegmentCondition}
              onUpdate={(updatedCondition) => handleConditionUpdate(index, updatedCondition)}
              onDelete={() => handleConditionDelete(index)}
            />
          );
        })}
      </div>
      
      {/* Actions for adding new conditions or groups */}
      <div className="flex mt-4 space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddCondition}
          className="text-xs"
          type='button'
        >
          <PlusCircle className="mr-1 h-3 w-3" />
          Add Condition
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddGroup}
          className="text-xs"
          type='button'
        >
          <Group className="mr-1 h-3 w-3" />
          Add Group
        </Button>
      </div>
    </div>
  );
};

export default RuleGroup; 