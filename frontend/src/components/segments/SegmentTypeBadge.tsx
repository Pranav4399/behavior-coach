'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SegmentTypeBadgeProps {
  type: 'static' | 'rule_based';
}

export default function SegmentTypeBadge({ type }: SegmentTypeBadgeProps) {
  if (type === 'static') {
    return (
      <Badge variant="outline" className="bg-slate-100 text-slate-800">
        Static
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-blue-100 text-blue-800">
      Rule-based
    </Badge>
  );
} 