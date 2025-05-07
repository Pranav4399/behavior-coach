import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { ContentType, ContentFormState } from '@/types/content';
import { contentTypeRequiresMedia, getRequiredMediaType } from '@/types/contentMedia';
import { MediaAsset } from '@/types/mediaAsset';

// Validation schema type
export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidation?: (value: any, formData: ContentFormState) => string | null;
    errorMessage?: string;
  };
}

// Content form props
export interface ContentFormProps {
  initialValues: ContentFormState;
  contentType: ContentType;
  media?: MediaAsset | null;
  onSubmit: (values: ContentFormState) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitError?: string;
  validationSchema?: ValidationSchema;
  renderFields?: (formState: ContentFormState, handleChange: HandleChange, errors: Record<string, string>) => React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
}

// Type for onChange handler
type HandleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;

// Default validation schemas by content type
const getDefaultValidationSchema = (contentType: ContentType): ValidationSchema => {
  // Base schema - apply to all content types
  const baseSchema: ValidationSchema = {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
      errorMessage: 'Title is required and must be between 3 and 100 characters'
    },
    description: {
      maxLength: 500,
      errorMessage: 'Description must be less than 500 characters'
    }
  };

  // Type-specific schema extensions
  switch (contentType) {
    case ContentType.TEXT:
      return {
        ...baseSchema,
        text: {
          required: true,
          minLength: 10,
          errorMessage: 'Content text is required and must be at least 10 characters'
        }
      };

    case ContentType.IMAGE:
      return {
        ...baseSchema,
        altText: {
          required: true,
          errorMessage: 'Alt text is required for accessibility'
        }
      };

    case ContentType.VIDEO:
    case ContentType.AUDIO:
      return {
        ...baseSchema,
        caption: {
          required: true,
          errorMessage: 'Caption is required for accessibility'
        }
      };

    case ContentType.REFLECTION:
      return {
        ...baseSchema,
        promptText: {
          required: true,
          minLength: 10,
          errorMessage: 'Prompt text is required and must be at least 10 characters'
        }
      };

    case ContentType.QUIZ:
      return {
        ...baseSchema,
        questions: {
          customValidation: (questions, _) => {
            if (!questions || !Array.isArray(questions) || questions.length === 0) {
              return 'At least one question is required';
            }
            return null;
          }
        }
      };

    case ContentType.TEMPLATE:
      return {
        ...baseSchema,
        templateText: {
          required: true,
          minLength: 10,
          errorMessage: 'Template text is required and must be at least 10 characters'
        }
      };

    default:
      return baseSchema;
  }
};

// Default content fields renderer
const defaultFieldsRenderer = (
  formState: ContentFormState,
  handleChange: HandleChange,
  errors: Record<string, string>
) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">Title*</label>
      <Input
        name="title"
        placeholder="Enter a title"
        value={formState.title}
        onChange={handleChange}
      />
      {errors.title && (
        <p className="mt-1 text-sm text-red-500">{errors.title}</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Description</label>
      <Textarea
        name="description"
        placeholder="Enter a description (optional)"
        value={formState.description || ''}
        onChange={handleChange}
      />
      {errors.description && (
        <p className="mt-1 text-sm text-red-500">{errors.description}</p>
      )}
    </div>
  </div>
);

/**
 * ContentForm - Reusable form component with validation for content types
 */
const ContentForm: React.FC<ContentFormProps> = ({
  initialValues,
  contentType,
  media = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitError = '',
  validationSchema: customValidationSchema,
  renderFields = defaultFieldsRenderer,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  className = '',
}) => {
  // Local state
  const [formState, setFormState] = useState<ContentFormState>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Combine default validation with custom validation
  const validationSchema = {
    ...getDefaultValidationSchema(contentType),
    ...customValidationSchema
  };
  
  // Check if media is required but not provided
  useEffect(() => {
    if (contentTypeRequiresMedia(contentType) && !media) {
      setErrors(prev => ({
        ...prev,
        media: `A ${getRequiredMediaType(contentType)} file is required for this content type`
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.media;
        return newErrors;
      });
    }
  }, [contentType, media]);
  
  // Handle input changes
  const handleChange: HandleChange = (e) => {
    const { name, value } = e.target;
    
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate the field if it has been touched
    validateField(name, value);
  };
  
  // Validate a single field
  const validateField = (name: string, value: any) => {
    const fieldSchema = validationSchema[name];
    
    if (!fieldSchema) {
      return;
    }
    
    let error: string | null = null;
    
    // Check required
    if (fieldSchema.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      error = fieldSchema.errorMessage || `${name} is required`;
    }
    
    // Check minLength for strings
    if (!error && typeof value === 'string' && fieldSchema.minLength && value.length < fieldSchema.minLength) {
      error = fieldSchema.errorMessage || `${name} must be at least ${fieldSchema.minLength} characters`;
    }
    
    // Check maxLength for strings
    if (!error && typeof value === 'string' && fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
      error = fieldSchema.errorMessage || `${name} must be less than ${fieldSchema.maxLength} characters`;
    }
    
    // Check pattern for strings
    if (!error && typeof value === 'string' && fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
      error = fieldSchema.errorMessage || `${name} has an invalid format`;
    }
    
    // Check custom validation
    if (!error && fieldSchema.customValidation) {
      error = fieldSchema.customValidation(value, formState);
    }
    
    // Update errors state
    setErrors(prev => {
      if (error) {
        return { ...prev, [name]: error };
      } else {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
    });
  };
  
  // Validate all fields
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};
    const allFields = Object.keys(validationSchema);
    
    // Check media requirement
    if (contentTypeRequiresMedia(contentType) && !media) {
      newErrors.media = `A ${getRequiredMediaType(contentType)} file is required for this content type`;
      isValid = false;
    }
    
    // Validate each field according to its schema
    allFields.forEach(fieldName => {
      const fieldSchema = validationSchema[fieldName];
      const value = formState[fieldName as keyof ContentFormState];
      
      // Check required
      if (fieldSchema.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        newErrors[fieldName] = fieldSchema.errorMessage || `${fieldName} is required`;
        isValid = false;
        return;
      }
      
      // Check minLength for strings
      if (typeof value === 'string' && fieldSchema.minLength && value.length < fieldSchema.minLength) {
        newErrors[fieldName] = fieldSchema.errorMessage || `${fieldName} must be at least ${fieldSchema.minLength} characters`;
        isValid = false;
        return;
      }
      
      // Check maxLength for strings
      if (typeof value === 'string' && fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
        newErrors[fieldName] = fieldSchema.errorMessage || `${fieldName} must be less than ${fieldSchema.maxLength} characters`;
        isValid = false;
        return;
      }
      
      // Check pattern for strings
      if (typeof value === 'string' && fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
        newErrors[fieldName] = fieldSchema.errorMessage || `${fieldName} has an invalid format`;
        isValid = false;
        return;
      }
      
      // Check custom validation
      if (fieldSchema.customValidation) {
        const customError = fieldSchema.customValidation(value, formState);
        if (customError) {
          newErrors[fieldName] = customError;
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(validationSchema).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    // Validate all fields
    if (validateForm()) {
      onSubmit(formState);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-6">
        {/* Render fields (default or custom) */}
        {renderFields(formState, handleChange, errors)}
        
        {/* Media requirement error */}
        {errors.media && (
          <Alert variant="destructive">
            <AlertDescription>{errors.media}</AlertDescription>
          </Alert>
        )}
        
        {/* Submit error */}
        {submitError && (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}
        
        {/* Form actions */}
        <div className="flex justify-between pt-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
          )}
          
          <Button 
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
          >
            {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ContentForm; 