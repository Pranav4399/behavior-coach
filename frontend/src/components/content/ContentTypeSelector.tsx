import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentType } from '@/types/content';
import { contentTypeRequiresMedia, getRequiredMediaType } from '@/types/contentMedia';

interface ContentTypeCardProps {
  type: ContentType;
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const ContentTypeCard: React.FC<ContentTypeCardProps> = ({
  type,
  title,
  description,
  icon,
  selected,
  onClick,
}) => {
  const mediaType = getRequiredMediaType(type);
  
  return (
    <Card
      className={`relative p-4 cursor-pointer transition-all hover:shadow-md ${
        selected ? 'border-2 border-primary bg-primary/5' : 'border border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 text-gray-500">
          {icon}
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{title}</h3>
            {mediaType && (
              <Badge variant="outline" className="ml-2 text-xs capitalize">
                Requires {mediaType}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
      
      {selected && (
        <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </Card>
  );
};

export interface ContentTypeSelectorProps {
  selectedType: ContentType | null;
  onTypeSelect: (type: ContentType) => void;
  availableTypes?: ContentType[];
  className?: string;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
  availableTypes = Object.values(ContentType),
  className = '',
}) => {
  // Icons for each content type
  const contentTypeIcons: Record<ContentType, React.ReactNode> = {
    [ContentType.TEXT]: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    [ContentType.IMAGE]: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    [ContentType.VIDEO]: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    [ContentType.AUDIO]: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    [ContentType.DOCUMENT]: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    [ContentType.QUIZ]: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    [ContentType.REFLECTION]: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    [ContentType.TEMPLATE]: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  };
  
  // Descriptions for each content type
  const contentTypeDescriptions: Record<ContentType, string> = {
    [ContentType.TEXT]: 'Simple text content with rich formatting options.',
    [ContentType.IMAGE]: 'Image content with optional caption and alt text.',
    [ContentType.VIDEO]: 'Video content with optional captions and transcripts.',
    [ContentType.AUDIO]: 'Audio content like podcasts or voice messages.',
    [ContentType.DOCUMENT]: 'PDF or other document file types.',
    [ContentType.QUIZ]: 'Interactive questions with multiple choice answers.',
    [ContentType.REFLECTION]: 'Prompts for users to reflect and respond to.',
    [ContentType.TEMPLATE]: 'Reusable templates with variable placeholders.',
  };
  
  // Display names for each content type
  const contentTypeNames: Record<ContentType, string> = {
    [ContentType.TEXT]: 'Text',
    [ContentType.IMAGE]: 'Image',
    [ContentType.VIDEO]: 'Video',
    [ContentType.AUDIO]: 'Audio',
    [ContentType.DOCUMENT]: 'Document',
    [ContentType.QUIZ]: 'Quiz',
    [ContentType.REFLECTION]: 'Reflection',
    [ContentType.TEMPLATE]: 'Template',
  };
  
  return (
    <div className={`${className}`}>
      <h2 className="text-lg font-semibold mb-4">Select Content Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableTypes.map((type) => (
          <ContentTypeCard
            key={type}
            type={type}
            title={contentTypeNames[type]}
            description={contentTypeDescriptions[type]}
            icon={contentTypeIcons[type]}
            selected={selectedType === type}
            onClick={() => onTypeSelect(type)}
          />
        ))}
      </div>
      
      {selectedType && contentTypeRequiresMedia(selectedType) && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">
              This content type requires a {getRequiredMediaType(selectedType)} file. 
              You'll be prompted to upload or select media in the next step.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentTypeSelector; 