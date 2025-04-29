'use client';

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Download, 
  AlertCircle, 
  Check, 
  X,
  Info,
  RefreshCw,
  DownloadCloud,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '@/components/ui/alert';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/toast';
import { 
  useWorkerCsvUpload, 
  useWorkerCsvValidate, 
  useWorkerCsvTemplate, 
  useWorkerCsvSample 
} from '@/hooks/api/use-workers';
import { CsvValidationError, WorkerCsvValidationResponse } from '@/types/worker';

const WorkerCsvUpload: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'create' | 'update'>('create');
  const [isDragActive, setIsDragActive] = useState(false);
  const [validationResult, setValidationResult] = useState<WorkerCsvValidationResponse | null>(null);
  const [uploadStep, setUploadStep] = useState<'select' | 'validate' | 'review' | 'upload' | 'complete'>('select');
  const [errors, setErrors] = useState<CsvValidationError[]>([]);
  const [errorFilter, setErrorFilter] = useState<'all' | 'errors' | 'warnings'>('all');

  // CSV API hooks
  const csvUpload = useWorkerCsvUpload();
  const csvValidate = useWorkerCsvValidate();
  const csvTemplate = useWorkerCsvTemplate();
  const csvSample = useWorkerCsvSample();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a CSV file',
          variant: 'destructive'
        });
        return;
      }
      setFile(selectedFile);
      setValidationResult(null);
      setUploadStep('validate');
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files?.length) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type !== 'text/csv' && !droppedFile.name.endsWith('.csv')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a CSV file',
          variant: 'destructive'
        });
        return;
      }
      setFile(droppedFile);
      setValidationResult(null);
      setUploadStep('validate');
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  // Handle template download
  const handleTemplateDownload = async () => {
    try {
      await csvTemplate.download();
      toast({
        title: 'Template downloaded',
        description: 'CSV template has been downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: (error as Error).message || 'Failed to download template',
        variant: 'destructive'
      });
    }
  };

  // Handle sample download
  const handleSampleDownload = async () => {
    try {
      await csvSample.download();
      toast({
        title: 'Sample downloaded',
        description: 'CSV sample has been downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: (error as Error).message || 'Failed to download sample',
        variant: 'destructive'
      });
    }
  };

  // Validate the CSV file
  const handleValidate = async () => {
    if (!file) return;

    try {
      const result = await csvValidate.mutateAsync({ file });
      setValidationResult(result);
      setErrors(result.errors);
      setUploadStep('review');
    } catch (error) {
      toast({
        title: 'Validation failed',
        description: (error as Error).message || 'Failed to validate CSV file',
        variant: 'destructive'
      });
    }
  };

  // Upload the CSV file
  const handleUpload = async (dryRun = false) => {
    if (!file) return;

    try {
      const result = await csvUpload.mutateAsync({ file, mode, dryRun });
      
      if (dryRun) {
        toast({
          title: 'Dry run successful',
          description: `${result.count} workers validated and ready for ${mode}`,
        });
      } else {
        setUploadStep('complete');
        toast({
          title: 'Upload successful',
          description: result.message || `${result.count} workers ${mode === 'create' ? 'created' : 'updated'} successfully`,
        });
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: (error as Error).message || 'Failed to upload CSV file',
        variant: 'destructive'
      });
    }
  };

  // Filter errors based on severity
  const filteredErrors = errors.filter(error => {
    if (errorFilter === 'all') return true;
    if (errorFilter === 'errors') return error.severity === 'error';
    if (errorFilter === 'warnings') return error.severity === 'warning';
    return true;
  });

  // Reset the form
  const handleReset = () => {
    setFile(null);
    setValidationResult(null);
    setUploadStep('select');
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render severity badge
  const renderSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="secondary">Warning</Badge>;
      case 'info':
        return <Badge variant="secondary">Info</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CSV Import</h1>
          <p className="text-muted-foreground">
            Upload a CSV file to bulk import or update workers
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleTemplateDownload}
          >
            <FileText className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <Button
            variant="outline"
            onClick={handleSampleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Sample
          </Button>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>CSV Upload Wizard</CardTitle>
          <CardDescription>
            Follow these steps to import or update workers from a CSV file
          </CardDescription>
          <Progress 
            value={
              uploadStep === 'select' ? 25 :
              uploadStep === 'validate' ? 50 :
              uploadStep === 'review' ? 75 :
              uploadStep === 'complete' ? 100 : 0
            } 
            className="h-2 mt-4"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {uploadStep === 'select' && (
            <>
              <div className="flex justify-center mb-4">
                <Select value={mode} onValueChange={(value: 'create' | 'update') => setMode(value)}>
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create">Create new workers</SelectItem>
                    <SelectItem value="update">Update existing workers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <UploadCloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Drag and drop your CSV file here</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  or click the button below to browse
                </p>
                <div className="max-w-xs mx-auto">
                  <Input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-file"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Select CSV File
                  </Button>
                </div>
              </div>

              {mode === 'update' && (
                <Alert variant="default">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Update mode requires that your CSV contains an identifier (External ID, Email, or Phone Number) 
                    to match existing workers. Workers without a match will be skipped.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {uploadStep === 'validate' && file && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <h3 className="font-medium">{file.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Validation</AlertTitle>
                <AlertDescription>
                  Click validate to check your CSV file for errors before importing. 
                  This step helps identify issues without making any changes to your data.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                >
                  Back
                </Button>
                <Button
                  onClick={handleValidate}
                  disabled={csvValidate.isPending}
                >
                  {csvValidate.isPending && (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Validate CSV
                </Button>
              </div>
            </div>
          )}

          {uploadStep === 'review' && validationResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Total Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{validationResult.totalRecords}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Valid Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-500">{validationResult.validRecords}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Errors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-500">{validationResult.errorStats.error}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Warnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-yellow-500">{validationResult.errorStats.warning}</p>
                  </CardContent>
                </Card>
              </div>

              {validationResult.errors.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Validation Issues</h3>
                    <Select value={errorFilter} onValueChange={(value: 'all' | 'errors' | 'warnings') => setErrorFilter(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter issues" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Issues</SelectItem>
                        <SelectItem value="errors">Errors Only</SelectItem>
                        <SelectItem value="warnings">Warnings Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <ScrollArea className="h-80 rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Row</TableHead>
                          <TableHead className="w-24">Severity</TableHead>
                          <TableHead className="w-32">Column</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead className="w-24">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredErrors.map((error, index) => (
                          <TableRow key={index}>
                            <TableCell>{error.row}</TableCell>
                            <TableCell>{renderSeverityBadge(error.severity)}</TableCell>
                            <TableCell>{error.column}</TableCell>
                            <TableCell>
                              {error.message}
                              {error.suggestedFix && (
                                <p className="text-xs text-green-600 mt-1">
                                  Suggestion: {error.suggestedFix}
                                </p>
                              )}
                            </TableCell>
                            <TableCell>
                              {error.value !== undefined 
                                ? String(error.value).substring(0, 20) 
                                : <span className="text-muted-foreground italic">empty</span>
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              ) : (
                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertTitle>Validation Successful</AlertTitle>
                  <AlertDescription>
                    No issues found. Your CSV file is ready to be imported.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setUploadStep('validate')}
                >
                  Back
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUpload(true)}
                  disabled={csvUpload.isPending}
                >
                  {csvUpload.isPending && (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Dry Run
                </Button>
                <Button
                  onClick={() => handleUpload(false)}
                  disabled={
                    csvUpload.isPending || 
                    (validationResult.errorStats.error > 0) ||
                    (validationResult.validRecords === 0)
                  }
                >
                  {csvUpload.isPending && (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {mode === 'create' ? 'Import Workers' : 'Update Workers'}
                </Button>
              </div>
            </div>
          )}

          {uploadStep === 'complete' && (
            <div className="text-center py-8">
              <div className="bg-green-100 dark:bg-green-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Upload Complete</h2>
              <p className="text-muted-foreground mb-6">
                Your CSV file has been processed successfully.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleReset}
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload Another File
                </Button>
                <Button
                  onClick={() => window.location.href = '/workers'}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Workers
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerCsvUpload; 