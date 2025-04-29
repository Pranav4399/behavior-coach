'use client';

import React, { useState } from 'react';
import { RuleBuilder } from '@/components/segments/rule-builder';
import { SegmentRule } from '@/types/segment';
import { createEmptyRule } from '@/types/rules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code } from '@/components/ui/code';

export default function RuleBuilderDemoPage() {
  const [rule, setRule] = useState<SegmentRule>(createEmptyRule());
  const [showJson, setShowJson] = useState(false);

  const handleRuleChange = (updatedRule: SegmentRule) => {
    setRule(updatedRule);
  };

  const prettyRule = JSON.stringify(rule, null, 2);

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Rule Builder Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates the Rule Builder component for creating segment rules.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div>
          <RuleBuilder initialRule={rule} onChange={handleRuleChange} />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Rule Preview</CardTitle>
              <CardDescription>
                Current rule definition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="mb-4 w-full" 
                onClick={() => setShowJson(!showJson)}
              >
                {showJson ? 'Hide JSON' : 'Show JSON'}
              </Button>
              
              {showJson && (
                <Code className="overflow-auto max-h-[300px] w-full">
                  {prettyRule}
                </Code>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="list-disc pl-4 space-y-2">
                <li>Use the rule builder to create conditions based on worker attributes</li>
                <li>Group conditions with logical operators (AND, OR, NOT)</li>
                <li>Add nested groups for more complex rules</li>
                <li>See the JSON output to understand the rule structure</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 