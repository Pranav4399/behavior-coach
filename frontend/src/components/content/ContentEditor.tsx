import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  ContentStatus, 
  ContentType, 
  ContentWithDetails, 
  ContentFormState,
} from '@/types/content';
import { MediaAsset } from '@/types/mediaAsset';
import { contentTypeRequiresMedia, getRequiredMediaType } from '@/types/contentMedia';
import { MediaSelector } from '@/components/media';
import { MediaUploader } from '@/components/media';
import { 
  useTextContent,
  useImageContent,
  useVideoContent,
  useAudioContent,
  useDocumentContent,
  useQuizContent,
  useReflectionContent,
  useTemplateContent,
  useUpdateContent,
  useUpdateTypeSpecificContent,
  getContent
} from '@/hooks/api/use-content';
import { getThumbnailUrl, formatFileSize } from '@/utils/media';
import { QuizQuestion } from '@/types/content';
import WhatsAppPreview from './WhatsAppPreview';
import QuizEditor from './quiz/QuizEditor';

interface ContentEditorProps {
  initialContent?: ContentWithDetails;
  contentType: ContentType;
  organizationId: string;
  userId?: string;
  onSave?: (content: ContentWithDetails) => void;
  onCancel?: () => void;
  className?: string;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  initialContent,
  contentType,
  organizationId,
  userId,
  onSave,
  onCancel,
  className = '',
}) => {
  // Editor state
  const [formState, setFormState] = useState<ContentFormState>({
    title: initialContent?.title || '',
    description: initialContent?.description || '',
    status: initialContent?.status || ContentStatus.DRAFT,
    type: contentType,
    tagIds: initialContent?.tags?.map(tag => tag.id) || [],
  });
  
  // Media state
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(() => {
    if (!initialContent) return null;
    
    // Cast to any to access potentially nested mediaAsset objects
    const contentAny = initialContent as any;
    
    // Then check in the type-specific content
    switch (contentType) {
      case ContentType.IMAGE:
        return contentAny.imageContent?.mediaAsset || null;
      case ContentType.VIDEO:
        return contentAny.videoContent?.mediaAsset || null;
      case ContentType.AUDIO:
        return contentAny.audioContent?.mediaAsset || null;
      case ContentType.DOCUMENT:
        return contentAny.documentContent?.mediaAsset || null;
      default:
        return null;
    }
  });
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [isMediaUploaderOpen, setIsMediaUploaderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form state from initialContent's type-specific data
  useEffect(() => {
    switch (contentType) {
      case ContentType.TEXT:
        const textData = initialContent?.textContent;
        if (textData) {
          setFormState(prev => ({
            ...prev,
            text: textData.text || '',
            formatting: textData.formatting
          }));
        }
        break;
      case ContentType.IMAGE:
        const imageData = initialContent?.imageContent;
        if (imageData) {
          setFormState(prev => ({
            ...prev,
            altText: imageData.altText || undefined,
            caption: imageData.caption || undefined
          }));
        }
        break;
      case ContentType.VIDEO:
        const videoData = initialContent?.videoContent;
        if (videoData) {
          setFormState(prev => ({
            ...prev,
            caption: videoData.caption || undefined,
            transcript: videoData.transcript || undefined
          }));
        }
        break;
      case ContentType.AUDIO:
        const audioData = initialContent?.audioContent;
        if (audioData) {
          setFormState(prev => ({
            ...prev,
            caption: audioData.caption || undefined,
            transcript: audioData.transcript || undefined
          }));
        }
        break;
      case ContentType.DOCUMENT:
        const documentData = initialContent?.documentContent;
        if (documentData) {
          // Document type may use description in both places
          setFormState(prev => ({
            ...prev,
            description: documentData.description || prev.description
          }));
        }
        break;
      case ContentType.REFLECTION:
        const reflectionData = initialContent?.reflectionContent;
        if (reflectionData) {
          setFormState(prev => ({
            ...prev,
            promptText: reflectionData.promptText || '',
            guidanceText: reflectionData.guidanceText || undefined
          }));
        }
        break;
      case ContentType.QUIZ:
        const quizData = initialContent?.quizContent;
        if (quizData) {
          setFormState(prev => ({
            ...prev,
            questions: quizData.questions || [],
            scoringType: quizData.scoringType || undefined,
          }));
        }
        break;
      case ContentType.TEMPLATE:
        const templateData = initialContent?.templateContent;
        if (templateData) {
          setFormState(prev => ({
            ...prev,
            templateText: templateData.templateText || '',
            variables: templateData.variables || [],
            channel: templateData.channel || undefined
          }));
        }
        break;
    }
  }, [initialContent, contentType]);
  
  // Mutations
  const updateContentMutation = useUpdateContent();
  const updateTypeSpecificContentMutation = useUpdateTypeSpecificContent();
  const textContentMutation = useTextContent();
  const imageContentMutation = useImageContent();
  const videoContentMutation = useVideoContent();
  const audioContentMutation = useAudioContent();
  const documentContentMutation = useDocumentContent();
  const quizContentMutation = useQuizContent();
  const reflectionContentMutation = useReflectionContent();
  const templateContentMutation = useTemplateContent();
  
  // Derived state
  const isEditing = !!initialContent;
  const isLoading = 
    updateContentMutation.isPending ||
    updateTypeSpecificContentMutation.isPending ||
    textContentMutation.isPending || 
    imageContentMutation.isPending || 
    videoContentMutation.isPending || 
    audioContentMutation.isPending || 
    documentContentMutation.isPending || 
    quizContentMutation.isPending || 
    reflectionContentMutation.isPending || 
    templateContentMutation.isPending;
  const requiresMedia = contentTypeRequiresMedia(contentType);
  const requiredMediaType = getRequiredMediaType(contentType);
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (requiresMedia && !selectedMedia) {
      newErrors.media = `A ${requiredMediaType} file is required for this content type`;
    }
    
    // Add type-specific validation
    switch (contentType) {
      case ContentType.TEXT:
        if (!formState.text?.trim()) {
          newErrors.text = 'Text content is required';
        }
        break;
        
      case ContentType.QUIZ:
        if (!formState.questions || formState.questions.length === 0) {
          newErrors.questions = 'At least one question is required';
        }
        break;
        
      case ContentType.REFLECTION:
        if (!formState.promptText?.trim()) {
          newErrors.promptText = 'Prompt text is required';
        }
        break;
        
      case ContentType.TEMPLATE:
        if (!formState.templateText?.trim()) {
          newErrors.templateText = 'Template text is required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle media selection
  const handleMediaSelect = (media: MediaAsset) => {
    setSelectedMedia(media);
    setIsMediaSelectorOpen(false);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.media;
      return newErrors;
    });
  };
  
  // Handle media upload
  const handleMediaUpload = (media: MediaAsset) => {
    setSelectedMedia(media);
    setIsMediaUploaderOpen(false);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.media;
      return newErrors;
    });
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      setActiveTab('editor'); // Switch to editor tab if there are errors
      return;
    }
    
    try {
      let result;
      
      if (isEditing && initialContent) {
        // First update the base content properties
        await updateContentMutation.mutateAsync({
          id: initialContent.id,
          data: {
            title: formState.title,
            description: formState.description,
            status: formState.status,
            tagIds: formState.tagIds,
          },
        });
        
        // Then update the type-specific data
        let typeSpecificData = {};
        
        switch (contentType) {
          case ContentType.TEXT:
            typeSpecificData = {
              text: formState.text,
              formatting: formState.formatting
            };
            break;
          
          case ContentType.IMAGE:
            typeSpecificData = {
              mediaAssetId: selectedMedia?.id,
              altText: formState.altText,
              caption: formState.caption
            };
            break;
          
          case ContentType.VIDEO:
            typeSpecificData = {
              mediaAssetId: selectedMedia?.id,
              caption: formState.caption,
              transcript: formState.transcript
            };
            break;
          
          case ContentType.AUDIO:
            typeSpecificData = {
              mediaAssetId: selectedMedia?.id,
              caption: formState.caption,
              transcript: formState.transcript
            };
            break;
          
          case ContentType.DOCUMENT:
            typeSpecificData = {
              mediaAssetId: selectedMedia?.id,
              description: formState.description
            };
            break;
          
          case ContentType.QUIZ:
            typeSpecificData = {
              questions: formState.questions,
              scoringType: formState.scoringType,
            };
            break;
          
          case ContentType.REFLECTION:
            typeSpecificData = {
              promptText: formState.promptText,
              guidanceText: formState.guidanceText
            };
            break;
            
          case ContentType.TEMPLATE:
            typeSpecificData = {
              templateText: formState.templateText,
              variables: formState.variables || [],
              channel: formState.channel || ''
            };
            break;
            
          default:
            throw new Error(`Content type ${contentType} is not supported yet`);
        }
        
        // Update the type-specific data
        await updateTypeSpecificContentMutation.mutateAsync({
          id: initialContent.id,
          data: typeSpecificData,
        });
        
        // Fetch the updated content
        result = await getContent(initialContent.id, organizationId);
      } else {
        // Create new content using the same hooks but without contentId
        const baseData = {
          title: formState.title,
          description: formState.description,
          type: contentType,
          status: formState.status || ContentStatus.DRAFT,
          organizationId,
          createdById: userId,
        };
        
        // Create content based on type
        switch (contentType) {
          case ContentType.TEXT:
            result = await textContentMutation.mutateAsync({
              data: {
                ...baseData,
                text: formState.text,
                formatting: formState.formatting
              }
            });
            break;
          
          case ContentType.IMAGE:
            result = await imageContentMutation.mutateAsync({
              data: {
                ...baseData,
                mediaAssetId: selectedMedia?.id || '',
                altText: formState.altText,
                caption: formState.caption
              }
            });
            break;
          
          case ContentType.VIDEO:
            result = await videoContentMutation.mutateAsync({
              data: {
                ...baseData,
                mediaAssetId: selectedMedia?.id || '',
                caption: formState.caption,
                transcript: formState.transcript
              }
            });
            break;
          
          case ContentType.AUDIO:
            result = await audioContentMutation.mutateAsync({
              data: {
                ...baseData,
                mediaAssetId: selectedMedia?.id || '',
                caption: formState.caption,
                transcript: formState.transcript
              }
            });
            break;
          
          case ContentType.DOCUMENT:
            result = await documentContentMutation.mutateAsync({
              data: {
                ...baseData,
                mediaAssetId: selectedMedia?.id || '',
                description: formState.description
              }
            });
            break;
          
          case ContentType.QUIZ:
            result = await quizContentMutation.mutateAsync({
              data: {
                ...baseData,
                questions: formState.questions || [],
                scoringType: (formState.scoringType as 'standard' | 'weighted' | 'no_score') || 'standard',
                timeLimit: formState.timeLimit
              }
            });
            break;
          
          case ContentType.REFLECTION:
            result = await reflectionContentMutation.mutateAsync({
              data: {
                ...baseData,
                promptText: formState.promptText,
                guidanceText: formState.guidanceText
              }
            });
            break;
            
          case ContentType.TEMPLATE:
            result = await templateContentMutation.mutateAsync({
              data: {
                ...baseData,
                templateText: formState.templateText,
                variables: formState.variables || [],
                channel: formState.channel || ''
              }
            });
            break;
            
          default:
            throw new Error(`Direct creation of ${contentType} content is not implemented yet`);
        }
      }
      
      if (onSave && result?.content) {
        onSave(result.content);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: `Failed to save content: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
    }
  };
  
  // Render editor for specific content type
  const renderTypeSpecificEditor = () => {
    switch (contentType) {
      case ContentType.TEXT:
        return (
          <div className="space-y-4">
            <div>
              <Textarea 
                name="text"
                placeholder="Enter your text content here..."
                value={formState.text || ''}
                onChange={handleInputChange}
                className="min-h-[200px]"
              />
              {errors.text && (
                <p className="mt-1 text-sm text-red-500">{errors.text}</p>
              )}
            </div>
          </div>
        );
        
      case ContentType.IMAGE:
      case ContentType.VIDEO:
      case ContentType.AUDIO:
      case ContentType.DOCUMENT:
        return (
          <div className="space-y-4">
            {renderMediaSection()}
            
            <div>
              <label className="block text-sm font-medium mb-1">Caption</label>
              <Input 
                name="caption"
                placeholder="Add a caption..."
                value={formState.caption || ''}
                onChange={handleInputChange}
              />
            </div>
            
            {(contentType === ContentType.VIDEO || contentType === ContentType.AUDIO) && (
              <div>
                <label className="block text-sm font-medium mb-1">Transcript</label>
                <Textarea 
                  name="transcript"
                  placeholder="Add a transcript..."
                  value={formState.transcript || ''}
                  onChange={handleInputChange}
                  className="min-h-[150px]"
                />
              </div>
            )}
            
            {contentType === ContentType.IMAGE && (
              <div>
                <label className="block text-sm font-medium mb-1">Alt Text</label>
                <Input 
                  name="altText"
                  placeholder="Describe the image for accessibility..."
                  value={formState.altText || ''}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
        );

      case ContentType.QUIZ:
        return <QuizEditor 
          questions={formState.questions || []}
          scoringType={formState.scoringType || 'standard'}
          onQuestionsChange={(questions: QuizQuestion[]) => {
            setFormState(prev => ({ ...prev, questions }));
            // Clear error when questions are changed
            if (errors.questions) {
              setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.questions;
                return newErrors;
              });
            }
          }}
          onScoringTypeChange={(scoringType: string) => {
            setFormState(prev => ({ ...prev, scoringType }));
          }}
          error={errors.questions}
        />;
        
      // For other content types, a placeholder message is shown
      // In a complete implementation, specialized editors would be added for each type
      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              {`The ${contentType} editor will be implemented in a future update. 
              For now, you can create the content with basic information.`}
            </p>
          </div>
        );
    }
  };
  
  // Render media selection/upload section
  const renderMediaSection = () => {
    if (!requiresMedia) {
      return null;
    }
    
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium">Media Asset</label>
        
        {selectedMedia ? (
          <div className="border rounded-md p-4">
            <div className="flex items-center space-x-4">
              <img 
                src={getThumbnailUrl(selectedMedia)} 
                alt={selectedMedia.fileName}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-grow">
                <p className="font-medium">{selectedMedia.fileName}</p>
                <p className="text-sm text-gray-500">
                  {selectedMedia.type} • {formatFileSize(selectedMedia.fileSize)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsMediaSelectorOpen(true)}
                >
                  Change
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-dashed rounded-md p-6">
            <div className="text-center space-y-4">
              <div className="text-gray-500">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                {`This content requires a ${requiredMediaType} file. Upload or select an existing one.`}
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => setIsMediaUploaderOpen(true)}>
                  Upload New
                </Button>
                <Button variant="outline" onClick={() => setIsMediaSelectorOpen(true)}>
                  Select Existing
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {errors.media && (
          <p className="text-sm text-red-500">{errors.media}</p>
        )}
      </div>
    );
  };
  
  return (
    <div className={`${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Content' : 'Create New Content'}</CardTitle>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="editor" className="m-0">
            <CardContent className="space-y-6 pt-6">
              {/* Basic content information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input 
                    name="title"
                    placeholder="Enter a title for your content"
                    value={formState.title}
                    onChange={handleInputChange}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea 
                    name="description"
                    placeholder="Add a brief description (optional)"
                    value={formState.description || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              {/* Type-specific editors */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Content</h3>
                {renderTypeSpecificEditor()}
              </div>
              
              {/* Error message */}
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="preview" className="m-0">
            <CardContent className="pt-0">
              <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-semibold">{formState.title || 'Untitled Content'}</h2>
                
                {formState.description && (
                  <p className="text-gray-600">{formState.description}</p>
                )}
                
                {/* WhatsApp Preview with fixed height and scrollable content */}
                <div className="flex justify-center">
                  <WhatsAppPreview 
                    content={{
                      id: initialContent?.id || '',
                      title: formState.title,
                      description: formState.description || '',
                      type: contentType,
                      status: formState.status || ContentStatus.DRAFT,
                      createdAt: initialContent?.createdAt || new Date().toISOString(),
                      updatedAt: initialContent?.updatedAt || new Date().toISOString(),
                      organizationId: organizationId,
                      typeSpecificData: (() => {
                        switch (contentType) {
                          case ContentType.TEXT:
                            return formState.text ? {
                              id: initialContent?.textContent?.id || '',
                              contentId: initialContent?.id || '',
                              text: formState.text,
                              formatting: formState.formatting
                            } : undefined;
                          case ContentType.IMAGE:
                            return selectedMedia ? {
                              id: initialContent?.imageContent?.id || '',
                              contentId: initialContent?.id || '',
                              mediaAssetId: selectedMedia.id,
                              altText: formState.altText,
                              caption: formState.caption
                            } : undefined;
                          case ContentType.VIDEO:
                            return selectedMedia ? {
                              id: initialContent?.videoContent?.id || '',
                              contentId: initialContent?.id || '',
                              mediaAssetId: selectedMedia.id,
                              caption: formState.caption,
                              transcript: formState.transcript
                            } : undefined;
                          case ContentType.AUDIO:
                            return selectedMedia ? {
                              id: initialContent?.audioContent?.id || '',
                              contentId: initialContent?.id || '',
                              mediaAssetId: selectedMedia.id,
                              caption: formState.caption,
                              transcript: formState.transcript
                            } : undefined;
                          case ContentType.DOCUMENT:
                            return selectedMedia ? {
                              id: initialContent?.documentContent?.id || '',
                              contentId: initialContent?.id || '',
                              mediaAssetId: selectedMedia.id,
                              description: formState.description
                            } : undefined;
                          case ContentType.REFLECTION:
                            return formState.promptText ? {
                              id: initialContent?.reflectionContent?.id || '',
                              contentId: initialContent?.id || '',
                              promptText: formState.promptText,
                              guidanceText: formState.guidanceText
                            } : undefined;
                          case ContentType.TEMPLATE:
                            return formState.templateText ? {
                              id: initialContent?.templateContent?.id || '',
                              contentId: initialContent?.id || '',
                              templateText: formState.templateText,
                              variables: formState.variables || [],
                              channel: formState.channel || ''
                            } : undefined;
                          default:
                            return undefined;
                        }
                      })()
                    }}
                    mediaAsset={selectedMedia}
                    message={contentType === ContentType.TEXT ? formState.text : undefined}
                    caption={formState.caption}
                    transcript={formState.transcript}
                    altText={formState.altText}
                  />
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
          
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Spinner className="mr-2 h-4 w-4" />}
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Media selector dialog */}
      <Dialog open={isMediaSelectorOpen} onOpenChange={setIsMediaSelectorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <MediaSelector 
            organizationId={organizationId}
            onSelect={handleMediaSelect}
            onCancel={() => setIsMediaSelectorOpen(false)}
            allowedTypes={requiredMediaType ? [requiredMediaType] : undefined}
            userId={userId}
          />
        </DialogContent>
      </Dialog>
      
      {/* Media uploader dialog */}
      <Dialog open={isMediaUploaderOpen} onOpenChange={setIsMediaUploaderOpen}>
        <DialogContent>
          <MediaUploader 
            organizationId={organizationId}
            onUploadComplete={handleMediaUpload}
            onUploadError={(error) => console.error('Upload error:', error)}
            uploadedById={userId}
            allowedTypes={requiredMediaType ? [`${requiredMediaType}/*`] : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentEditor;