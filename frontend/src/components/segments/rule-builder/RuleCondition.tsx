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


import {
  hasAttributeOptions,
  getAttributeOptions,
  hasSpecializedControl,
  getControlConfig
} from '@/constants/rules';

// UI components for specialized controls
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
    
    // If this attribute has a specialized control, adjust available operators
    if (hasSpecializedControl(attribute)) {
      const controlConfig = getControlConfig(attribute);
      
      switch (controlConfig?.type) {
        case 'slider':
        case 'range':
          return ['equals', 'not_equals', 'greater_than', 'less_than'];
        case 'radio':
          return ['equals', 'not_equals'];
        case 'multi-select':
          return ['contains', 'not_contains', 'in_list', 'not_in_list'];
        case 'date-range':
          return ['greater_than', 'less_than'];
        default:
          // Use standard operators for the data type
          break;
      }
    }
    
    return operatorsByType[attributeType] || [];
  };

  // Handle attribute change
  const handleAttributeChange = (newAttribute: WorkerAttribute) => {
    setAttribute(newAttribute);
    
    // Reset operator to a valid one for this attribute type
    const validOperators = getAvailableOperators();
    if (!validOperators.includes(operator)) {
      setOperator(validOperators[0] as ConditionOperator);
    }
    
    // Reset value based on type
    const attributeType = WORKER_ATTRIBUTE_TYPES[newAttribute];
    
    // If this has a specialized control, set an appropriate default value
    if (hasSpecializedControl(newAttribute)) {
      const controlConfig = getControlConfig(newAttribute);
      
      switch (controlConfig?.type) {
        case 'slider':
        case 'range':
          setValue(controlConfig.min || 0);
          break;
        case 'radio':
          if (controlConfig.options && controlConfig.options.length > 0) {
            setValue(controlConfig.options[0].value);
          } else {
            setValue('');
          }
          break;
        case 'multi-select':
          setValue([]);
          break;
        default:
          setValue('');
      }
    } else if (attributeType === 'boolean') {
      setValue('true');
    } else if (attributeType === 'array') {
      setValue([]);
    } else if (hasAttributeOptions(newAttribute)) {
      // Set default to first option if it's a field with predefined options
      const options = getAttributeOptions(newAttribute);
      if (options.length > 0) {
        setValue(options[0].value);
      } else {
        setValue('');
      }
    } else {
      setValue('');
    }
  };

  // Render specialized controls for different attribute types
  const renderSpecializedControl = () => {
    const controlConfig = getControlConfig(attribute);
    
    if (!controlConfig) return null;
    
    switch (controlConfig.type) {
      case 'slider':
        return (
          <div className="w-full">
            <Slider
              value={[Number(value)]}
              min={controlConfig.min || 0}
              max={controlConfig.max || 100}
              step={controlConfig.step || 1}
              onValueChange={(vals: number[]) => setValue(vals[0])}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{controlConfig.min || 0}</span>
              <span>Current: {value}</span>
              <span>{controlConfig.max || 100}</span>
            </div>
          </div>
        );
        
      case 'range':
        return (
          <div className="w-full grid gap-2">
            <div className="flex space-x-2">
              <Input
                type="number"
                value={String(value)}
                onChange={(e) => setValue(parseFloat(e.target.value))}
                min={controlConfig.min}
                max={controlConfig.max}
                step={controlConfig.step}
                className="w-full"
              />
              {controlConfig.format && (
                <span className="flex items-center text-sm text-muted-foreground">{controlConfig.format}</span>
              )}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{controlConfig.format} {controlConfig.min}</span>
              <span>{controlConfig.format} {controlConfig.max}</span>
            </div>
          </div>
        );
        
      case 'radio':
        return (
          <RadioGroup
            value={String(value)}
            onValueChange={(val) => setValue(val)}
            className="flex flex-col space-y-1"
          >
            {controlConfig.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`radio-${option.value}`} />
                <Label htmlFor={`radio-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
        
      case 'multi-select':
        const selectedValues = Array.isArray(value) ? value : [String(value)];
        
        return (
          <div className="grid grid-cols-2 gap-2">
            {controlConfig.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`checkbox-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue([...selectedValues, option.value]);
                    } else {
                      setValue(selectedValues.filter(v => v !== option.value));
                    }
                  }}
                />
                <Label htmlFor={`checkbox-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };

  // Render value input based on attribute type and operator
  const renderValueInput = () => {
    // First check if this attribute has a specialized control
    if (hasSpecializedControl(attribute)) {
      const specializedControl = renderSpecializedControl();
      if (specializedControl) {
        return specializedControl;
      }
    }
    
    const attributeType = WORKER_ATTRIBUTE_TYPES[attribute];
    
    // Check if this attribute has predefined options
    if (hasAttributeOptions(attribute)) {
      const options = getAttributeOptions(attribute);
      
      return (
        <Select
          value={String(value)}
          onValueChange={(val) => setValue(val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
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
              {CONDITION_OPERATOR_LABELS[op as ConditionOperator]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Value input */}
      <div className="flex-1 min-w-[180px]">
        {renderValueInput()}
      </div>
      
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