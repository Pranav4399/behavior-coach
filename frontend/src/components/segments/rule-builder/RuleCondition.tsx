'use client';

import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { 
  RuleConditionProps, 
  WorkerAttribute, 
  WORKER_ATTRIBUTE_LABELS, 
  WORKER_ATTRIBUTE_TYPES,
  ConditionOperator,
  CONDITION_OPERATOR_LABELS 
} from '@/types/rules';
import { SegmentCondition } from '@/types/segment';

const RuleCondition: React.FC<RuleConditionProps> = ({ 
  condition, 
  onUpdate, 
  onDelete 
}) => {
  // State for condition attributes
  const [attribute, setAttribute] = useState<WorkerAttribute>(condition.attribute as WorkerAttribute);
  const [operator, setOperator] = useState<ConditionOperator>(condition.operator as ConditionOperator);
  const [value, setValue] = useState<string | number | string[]>(condition.value);

  // Effect to update the parent when local state changes
  useEffect(() => {
    // Check if the condition values have actually changed before calling onUpdate
    if (
      condition.attribute !== attribute ||
      condition.operator !== operator ||
      JSON.stringify(condition.value) !== JSON.stringify(value)
    ) {
      const updatedCondition: SegmentCondition = {
        attribute,
        operator,
        value
      };
      onUpdate(updatedCondition);
    }
  }, [attribute, operator, value, onUpdate, condition]);

  // Get available operators based on attribute type
  const getAvailableOperators = () => {
    const attributeType = WORKER_ATTRIBUTE_TYPES[attribute];
    
    const operatorsByType: Record<string, ConditionOperator[]> = {
      string: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'in_list', 'not_in_list'],
      number: ['equals', 'not_equals', 'greater_than', 'less_than'],
      boolean: ['equals', 'not_equals'],
      date: ['equals', 'not_equals', 'greater_than', 'less_than'],
      array: ['contains', 'not_contains', 'in_list', 'not_in_list']
    };
    
    return operatorsByType[attributeType] || [];
  };

  // Handle attribute change
  const handleAttributeChange = (newAttribute: WorkerAttribute) => {
    setAttribute(newAttribute);
    
    // Reset operator to a valid one for this attribute type
    const validOperators = getAvailableOperators();
    if (!validOperators.includes(operator)) {
      setOperator(validOperators[0]);
    }
    
    // Reset value based on type
    const attributeType = WORKER_ATTRIBUTE_TYPES[newAttribute];
    if (attributeType === 'boolean') {
      setValue('true');
    } else if (attributeType === 'array') {
      setValue([]);
    } else {
      setValue('');
    }
  };

  // Render value input based on attribute type and operator
  const renderValueInput = () => {
    const attributeType = WORKER_ATTRIBUTE_TYPES[attribute];
    
    // For boolean type, render a select
    if (attributeType === 'boolean') {
      return (
        <Select
          value={String(value)}
          onValueChange={(val) => setValue(val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    // For array type with in_list or not_in_list operators
    if ((operator === 'in_list' || operator === 'not_in_list')) {
      // Handle array of values as comma-separated string
      const stringValue = Array.isArray(value) ? value.join(', ') : String(value);
      
      return (
        <Input
          value={stringValue}
          onChange={(e) => setValue(e.target.value.split(',').map(item => item.trim()))}
          placeholder="Comma separated values"
          className="w-full"
        />
      );
    }
    
    // For date type
    if (attributeType === 'date') {
      return (
        <Input
          type="date"
          value={String(value)}
          onChange={(e) => setValue(e.target.value)}
          className="w-[180px]"
        />
      );
    }
    
    // Default string/number input
    return (
      <Input
        type={attributeType === 'number' ? 'number' : 'text'}
        value={String(value)}
        onChange={(e) => {
          const newValue = attributeType === 'number' 
            ? parseFloat(e.target.value) 
            : e.target.value;
          setValue(newValue);
        }}
        placeholder="Enter value"
        className="w-full"
      />
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md bg-background">
      {/* Attribute selector */}
      <Select
        value={attribute}
        onValueChange={(val) => handleAttributeChange(val as WorkerAttribute)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select attribute" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(WORKER_ATTRIBUTE_LABELS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Operator selector */}
      <Select
        value={operator}
        onValueChange={(val) => setOperator(val as ConditionOperator)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent>
          {getAvailableOperators().map((op) => (
            <SelectItem key={op} value={op}>
              {CONDITION_OPERATOR_LABELS[op]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Value input */}
      {renderValueInput()}
      
      {/* Delete button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onDelete} 
        className="ml-auto"
        title="Remove condition"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
};

export default RuleCondition; 