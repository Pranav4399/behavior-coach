import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EmploymentStatus } from '@/types/worker';

interface WorkerStatusBadgeProps {
  status: EmploymentStatus | 'inactive';
}

export default function WorkerStatusBadge({ status }: WorkerStatusBadgeProps) {
  let variant: "default" | "destructive" | "outline" | "secondary" = "outline";
  let displayLabel: string;
  
  switch (status) {
    case 'active':
      variant = 'default';
      displayLabel = 'Active';
      break;
    case 'inactive':
      variant = 'secondary';
      displayLabel = 'Inactive';
      break;
    case 'on_leave':
      variant = 'outline';
      displayLabel = 'On Leave';
      break;
    case 'terminated':
      variant = 'destructive';
      displayLabel = 'Terminated';
      break;
    default:
      displayLabel = status;
      variant = 'outline';
  }
  
  return (
    <Badge variant={variant}>
      {displayLabel}
    </Badge>
  );
} 