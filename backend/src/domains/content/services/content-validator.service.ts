import { 
  ContentType,
  CreateContentDto,
  TextContent,
  ImageContent,
  VideoContent,
  AudioContent,
  DocumentContent,
  QuizContent,
  ReflectionContent,
  TemplateContent
} from '../models/content.model';
import { 
  CreateTextContentDto,
  CreateImageContentDto,
  CreateVideoContentDto,
  CreateAudioContentDto,
  CreateDocumentContentDto,
  CreateQuizContentDto,
  CreateReflectionContentDto,
  CreateTemplateContentDto
} from './content.service';

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Service for validating different content types
 */
export class ContentValidatorService {
  /**
   * Validate content based on its type
   * @param baseContent Base content data
   * @param typeSpecificContent Type-specific content data
   * @returns Validation result
   */
  validateContent(
    baseContent: CreateContentDto,
    typeSpecificContent: any
  ): ValidationResult {
    // Validate base content first
    const baseResult = this.validateBaseContent(baseContent);
    if (!baseResult.isValid) {
      return baseResult;
    }

    // Validate type-specific content
    switch (baseContent.type) {
      case ContentType.TEXT:
        return this.validateTextContent(typeSpecificContent as CreateTextContentDto);
      case ContentType.IMAGE:
        return this.validateImageContent(typeSpecificContent as CreateImageContentDto);
      case ContentType.VIDEO:
        return this.validateVideoContent(typeSpecificContent as CreateVideoContentDto);
      case ContentType.AUDIO:
        return this.validateAudioContent(typeSpecificContent as CreateAudioContentDto);
      case ContentType.DOCUMENT:
        return this.validateDocumentContent(typeSpecificContent as CreateDocumentContentDto);
      case ContentType.QUIZ:
        return this.validateQuizContent(typeSpecificContent as CreateQuizContentDto);
      case ContentType.REFLECTION:
        return this.validateReflectionContent(typeSpecificContent as CreateReflectionContentDto);
      case ContentType.TEMPLATE:
        return this.validateTemplateContent(typeSpecificContent as CreateTemplateContentDto);
      default:
        return {
          isValid: false,
          errors: [`Unsupported content type: ${baseContent.type}`]
        };
    }
  }

  /**
   * Validate base content fields
   * @param content Base content data
   * @returns Validation result
   */
  private validateBaseContent(content: CreateContentDto): ValidationResult {
    const errors: string[] = [];

    if (!content.title || content.title.trim() === '') {
      errors.push('Title is required');
    } else if (content.title.length > 255) {
      errors.push('Title must be 255 characters or less');
    }

    if (content.description && content.description.length > 1000) {
      errors.push('Description must be 1000 characters or less');
    }

    if (!content.organizationId) {
      errors.push('Organization ID is required');
    }

    if (!Object.values(ContentType).includes(content.type)) {
      errors.push(`Invalid content type: ${content.type}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate text content
   * @param content Text content data
   * @returns Validation result
   */
  private validateTextContent(content: CreateTextContentDto): ValidationResult {
    const errors: string[] = [];

    if (!content.text || content.text.trim() === '') {
      errors.push('Text content is required');
    }

    // Optional formatting validation could be added here

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate image content
   * @param content Image content data
   * @returns Validation result
   */
  private validateImageContent(content: CreateImageContentDto): ValidationResult {
    const errors: string[] = [];

    if (!content.mediaAssetId) {
      errors.push('Media asset ID is required for image content');
    }

    if (content.altText && content.altText.length > 500) {
      errors.push('Alt text must be 500 characters or less');
    }

    if (content.caption && content.caption.length > 1000) {
      errors.push('Caption must be 1000 characters or less');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate video content
   * @param content Video content data
   * @returns Validation result
   */
  private validateVideoContent(content: CreateVideoContentDto): ValidationResult {
    const errors: string[] = [];

    if (!content.mediaAssetId) {
      errors.push('Media asset ID is required for video content');
    }

    if (content.caption && content.caption.length > 1000) {
      errors.push('Caption must be 1000 characters or less');
    }

    if (content.duration !== undefined && (isNaN(content.duration) || content.duration < 0)) {
      errors.push('Duration must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate audio content
   * @param content Audio content data
   * @returns Validation result
   */
  private validateAudioContent(content: CreateAudioContentDto): ValidationResult {
    const errors: string[] = [];

    if (!content.mediaAssetId) {
      errors.push('Media asset ID is required for audio content');
    }

    if (content.caption && content.caption.length > 1000) {
      errors.push('Caption must be 1000 characters or less');
    }

    if (content.duration !== undefined && (isNaN(content.duration) || content.duration < 0)) {
      errors.push('Duration must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate document content
   * @param content Document content data
   * @returns Validation result
   */
  private validateDocumentContent(content: CreateDocumentContentDto): ValidationResult {
    const errors: string[] = [];

    if (!content.mediaAssetId) {
      errors.push('Media asset ID is required for document content');
    }

    if (content.description && content.description.length > 1000) {
      errors.push('Description must be 1000 characters or less');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate quiz content
   * @param content Quiz content data
   * @returns Validation result
   */
  private validateQuizContent(content: CreateQuizContentDto): ValidationResult {
    const errors: string[] = [];

    if (!content.questions || !Array.isArray(content.questions) || content.questions.length === 0) {
      errors.push('At least one question is required for quiz content');
      return {
        isValid: false,
        errors
      };
    }

    // Validate each question
    content.questions.forEach((question, index) => {
      if (!question.text) {
        errors.push(`Question ${index + 1} is missing text`);
      }

      if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
        errors.push(`Question ${index + 1} must have at least two options`);
      } else {
        // Check that at least one option is marked as correct
        const hasCorrectOption = question.options.some((option: { isCorrect: boolean }) => option.isCorrect === true);
        if (!hasCorrectOption) {
          errors.push(`Question ${index + 1} must have at least one correct option`);
        }
      }
    });

    if (content.timeLimit !== undefined && (isNaN(content.timeLimit) || content.timeLimit < 0)) {
      errors.push('Time limit must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate reflection content
   * @param content Reflection content data
   * @returns Validation result
   */
  private validateReflectionContent(content: CreateReflectionContentDto): ValidationResult {
    const errors: string[] = [];

    if (!content.promptText || content.promptText.trim() === '') {
      errors.push('Prompt text is required for reflection content');
    }

    if (content.promptText && content.promptText.length > 2000) {
      errors.push('Prompt text must be 2000 characters or less');
    }

    if (content.guidanceText && content.guidanceText.length > 5000) {
      errors.push('Guidance text must be 5000 characters or less');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate template content
   * @param content Template content data
   * @returns Validation result
   */
  private validateTemplateContent(content: CreateTemplateContentDto): ValidationResult {
    const errors: string[] = [];

    if (!content.templateText || content.templateText.trim() === '') {
      errors.push('Template text is required for template content');
    }

    if (!content.channel || content.channel.trim() === '') {
      errors.push('Channel is required for template content');
    }

    if (!content.variables || typeof content.variables !== 'object') {
      errors.push('Variables must be a valid object for template content');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate type-specific content update data
   * @param contentType Content type
   * @param updateData Update data
   * @returns Validation result
   */
  validateTypeSpecificUpdate(contentType: ContentType, updateData: any): ValidationResult {
    switch (contentType) {
      case ContentType.TEXT:
        return this.validateTextContentUpdate(updateData);
      case ContentType.IMAGE:
        return this.validateImageContentUpdate(updateData);
      case ContentType.VIDEO:
        return this.validateVideoContentUpdate(updateData);
      case ContentType.AUDIO:
        return this.validateAudioContentUpdate(updateData);
      case ContentType.DOCUMENT:
        return this.validateDocumentContentUpdate(updateData);
      case ContentType.QUIZ:
        return this.validateQuizContentUpdate(updateData);
      case ContentType.REFLECTION:
        return this.validateReflectionContentUpdate(updateData);
      case ContentType.TEMPLATE:
        return this.validateTemplateContentUpdate(updateData);
      default:
        return {
          isValid: false,
          errors: [`Unsupported content type for update: ${contentType}`]
        };
    }
  }

  /**
   * Validate text content update data
   * @param updateData Update data
   * @returns Validation result
   */
  private validateTextContentUpdate(updateData: Partial<TextContent>): ValidationResult {
    const errors: string[] = [];

    if (updateData.text !== undefined && (updateData.text === null || updateData.text.trim() === '')) {
      errors.push('Text content cannot be empty');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate image content update data
   * @param updateData Update data
   * @returns Validation result
   */
  private validateImageContentUpdate(updateData: Partial<ImageContent>): ValidationResult {
    const errors: string[] = [];

    if (updateData.mediaAssetId !== undefined && !updateData.mediaAssetId) {
      errors.push('Media asset ID cannot be empty for image content');
    }

    if (updateData.altText && updateData.altText.length > 500) {
      errors.push('Alt text must be 500 characters or less');
    }

    if (updateData.caption && updateData.caption.length > 1000) {
      errors.push('Caption must be 1000 characters or less');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate video content update data
   * @param updateData Update data
   * @returns Validation result
   */
  private validateVideoContentUpdate(updateData: Partial<VideoContent>): ValidationResult {
    const errors: string[] = [];

    if (updateData.mediaAssetId !== undefined && !updateData.mediaAssetId) {
      errors.push('Media asset ID cannot be empty for video content');
    }

    if (updateData.caption && updateData.caption.length > 1000) {
      errors.push('Caption must be 1000 characters or less');
    }

    if (updateData.duration !== undefined && updateData.duration !== null && 
        (isNaN(Number(updateData.duration)) || Number(updateData.duration) < 0)) {
      errors.push('Duration must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate audio content update data
   * @param updateData Update data
   * @returns Validation result
   */
  private validateAudioContentUpdate(updateData: Partial<AudioContent>): ValidationResult {
    const errors: string[] = [];

    if (updateData.mediaAssetId !== undefined && !updateData.mediaAssetId) {
      errors.push('Media asset ID cannot be empty for audio content');
    }

    if (updateData.caption && updateData.caption.length > 1000) {
      errors.push('Caption must be 1000 characters or less');
    }

    if (updateData.duration !== undefined && updateData.duration !== null && 
        (isNaN(Number(updateData.duration)) || Number(updateData.duration) < 0)) {
      errors.push('Duration must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate document content update data
   * @param updateData Update data
   * @returns Validation result
   */
  private validateDocumentContentUpdate(updateData: Partial<DocumentContent>): ValidationResult {
    const errors: string[] = [];

    if (updateData.mediaAssetId !== undefined && !updateData.mediaAssetId) {
      errors.push('Media asset ID cannot be empty for document content');
    }

    if (updateData.description && updateData.description.length > 1000) {
      errors.push('Description must be 1000 characters or less');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate quiz content update data
   * @param updateData Update data
   * @returns Validation result
   */
  private validateQuizContentUpdate(updateData: Partial<QuizContent>): ValidationResult {
    const errors: string[] = [];

    if (updateData.questions !== undefined) {
      if (!Array.isArray(updateData.questions) || updateData.questions.length === 0) {
        errors.push('At least one question is required for quiz content');
      } else {
        // Validate each question
        updateData.questions.forEach((question, index) => {
          if (!question.text) {
            errors.push(`Question ${index + 1} is missing text`);
          }

          if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
            errors.push(`Question ${index + 1} must have at least two options`);
          } else {
            // Check that at least one option is marked as correct
            const hasCorrectOption = question.options.some((option: { isCorrect: boolean }) => option.isCorrect === true);
            if (!hasCorrectOption) {
              errors.push(`Question ${index + 1} must have at least one correct option`);
            }
          }
        });
      }
    }

    if (updateData.timeLimit !== undefined && updateData.timeLimit !== null && 
        (isNaN(Number(updateData.timeLimit)) || Number(updateData.timeLimit) < 0)) {
      errors.push('Time limit must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate reflection content update data
   * @param updateData Update data
   * @returns Validation result
   */
  private validateReflectionContentUpdate(updateData: Partial<ReflectionContent>): ValidationResult {
    const errors: string[] = [];

    if (updateData.promptText !== undefined && (updateData.promptText === null || updateData.promptText.trim() === '')) {
      errors.push('Prompt text cannot be empty for reflection content');
    }

    if (updateData.promptText && updateData.promptText.length > 2000) {
      errors.push('Prompt text must be 2000 characters or less');
    }

    if (updateData.guidanceText && updateData.guidanceText.length > 5000) {
      errors.push('Guidance text must be 5000 characters or less');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate template content update data
   * @param updateData Update data
   * @returns Validation result
   */
  private validateTemplateContentUpdate(updateData: Partial<TemplateContent>): ValidationResult {
    const errors: string[] = [];

    if (updateData.templateText !== undefined && (updateData.templateText === null || updateData.templateText.trim() === '')) {
      errors.push('Template text cannot be empty');
    }

    if (updateData.channel !== undefined && (updateData.channel === null || updateData.channel.trim() === '')) {
      errors.push('Channel cannot be empty for template content');
    }

    if (updateData.variables !== undefined && typeof updateData.variables !== 'object') {
      errors.push('Variables must be a valid object for template content');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 