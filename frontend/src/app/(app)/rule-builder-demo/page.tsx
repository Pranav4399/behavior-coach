'use client';

import React, { useState } from 'react';
import RuleBuilder from '@/components/segments/rule-builder/RuleBuilder';
import { SegmentRule } from '@/types/segment';
import { createEmptyRule } from '@/types/rules';
import { Button } from '@/components/ui/button';
import { Code } from '@/components/ui/code';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  hasAttributeOptions, 
  getAttributeOptions,
  ATTRIBUTE_OPTIONS,
  CONTROL_CONFIG 
} from '@/constants/rules';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export default function RuleBuilderDemoPage() {
  const [rule, setRule] = useState<SegmentRule>(createEmptyRule());
  const [showJson, setShowJson] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  
  // Handle rule change
  const handleRuleChange = (updatedRule: SegmentRule) => {
    setRule(updatedRule);
  };
  
  // Format rule as pretty JSON
  const prettyRule = JSON.stringify(rule, null, 2);

  // Get fields with predefined options for demonstration
  const fieldsWithOptions = Object.keys(ATTRIBUTE_OPTIONS);
  const fieldsWithAdvancedControls = Object.keys(CONTROL_CONFIG);
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Rule Builder Demo</h1>
        <p className="text-muted-foreground">
          Build segment rules with context-specific controls
        </p>
      </div>

      {showAlert && (
        <Alert className="relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-2 right-2" 
            onClick={() => setShowAlert(false)}
          >
            ✕
          </Button>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Smart Controls Feature</AlertTitle>
          <AlertDescription>
            Try selecting different attributes to see context-specific controls appear automatically.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-[1fr_350px]">
        <div>
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle>Build Your Rule</CardTitle>
              <CardDescription>
                Define conditions based on worker attributes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RuleBuilder initialRule={rule} onChange={handleRuleChange} />
            </CardContent>
          </Card>
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
              <CardTitle className="text-lg">Smart Controls</CardTitle>
              <CardDescription>
                Attributes with specialized controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dropdown">
                <TabsList className="mb-4 flex w-full">
                  <TabsTrigger value="dropdown" className="flex-1">Dropdowns</TabsTrigger>
                  <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dropdown">
                  <div className="text-sm space-y-2">
                    <p className="font-medium">Attributes with dropdown options:</p>
                    <ul className="list-disc pl-4 space-y-1 max-h-[200px] overflow-y-auto">
                      <li>Gender</li>
                      <li>Employment Status</li>
                      <li>Employment Type</li>
                      <li>Department</li>
                      <li>Job Title</li>
                      <li>WhatsApp Opt-in Status</li>
                      <li>Preferred Language (Indian languages)</li>
                      <li>Location (Indian states)</li>
                      <li>Deactivation Reason</li>
                      <li>Age Group</li>
                      <li>Experience Level</li>
                      <li>Education Level</li>
                      <li>Salary Band</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced">
                  <div className="text-sm space-y-2">
                    <p className="font-medium">Attributes with advanced controls:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>Sliders:</strong> Wellbeing Score, Engagement Rate</li>
                      <li><strong>Numeric Range:</strong> Salary Range, Experience Period</li>
                      <li><strong>Radio Buttons:</strong> Age Group</li>
                      <li><strong>Multi-select:</strong> Tags</li>
                    </ul>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Each attribute automatically offers the most appropriate input control based on its data type and expected values.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 