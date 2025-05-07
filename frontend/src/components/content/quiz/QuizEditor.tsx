import React, { useState } from 'react';
import { PlusCircle, Trash, MessageSquare, Clock, Settings, Check, X, Info } from 'lucide-react';
import { QuizQuestion, QuizQuestionOption } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { generateUniqueId } from '@/utils/common';

interface QuizEditorProps {
  questions: QuizQuestion[];
  scoringType?: string;
  onQuestionsChange: (questions: QuizQuestion[]) => void;
  onScoringTypeChange: (scoringType: string) => void;
  error?: string;
}

/**
 * QuizEditor - Component for creating and editing quiz content
 * 
 * Features:
 * - Add, edit, and remove questions
 * - Add, edit, and remove answer options
 * - Mark correct answers
 * - Set question explanations
 * - Configure quiz settings (scoring type)
 * - Optimized for WhatsApp delivery
 */
const QuizEditor: React.FC<QuizEditorProps> = ({
  questions,
  scoringType = 'standard',
  onQuestionsChange,
  onScoringTypeChange,
  error
}) => {
  const [activeTab, setActiveTab] = useState<string>('questions');
  const [previewQuestion, setPreviewQuestion] = useState<number>(0);
  
  // Create a new empty question
  const createNewQuestion = (): QuizQuestion => ({
    id: generateUniqueId(),
    text: '',
    options: [
      { id: generateUniqueId(), text: '', isCorrect: true },
      { id: generateUniqueId(), text: '', isCorrect: false }
    ],
    explanation: '',
    points: 1
  });
  
  // Create a new empty option
  const createNewOption = (isCorrect: boolean = false): QuizQuestionOption => ({
    id: generateUniqueId(),
    text: '',
    isCorrect
  });
  
  // Add a new question
  const handleAddQuestion = () => {
    onQuestionsChange([...questions, createNewQuestion()]);
  };
  
  // Remove a question
  const handleRemoveQuestion = (questionId: string) => {
    onQuestionsChange(questions.filter(q => q.id !== questionId));
  };
  
  // Update a question
  const handleUpdateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    onQuestionsChange(
      questions.map(q => 
        q.id === questionId 
          ? { ...q, ...updates }
          : q
      )
    );
  };
  
  // Add a new option to a question
  const handleAddOption = (questionId: string) => {
    // Limit to maximum 5 options for WhatsApp usability
    const question = questions.find(q => q.id === questionId);
    if (question && question.options.length >= 5) {
      return; // Don't add more than 5 options
    }
    
    onQuestionsChange(
      questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: [...q.options, createNewOption()]
            }
          : q
      )
    );
  };
  
  // Remove an option from a question
  const handleRemoveOption = (questionId: string, optionId: string) => {
    onQuestionsChange(
      questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options.filter(o => o.id !== optionId)
            }
          : q
      )
    );
  };
  
  // Update an option
  const handleUpdateOption = (questionId: string, optionId: string, updates: Partial<QuizQuestionOption>) => {
    onQuestionsChange(
      questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options.map(o => 
                o.id === optionId 
                  ? { ...o, ...updates }
                  : o
              )
            }
          : q
      )
    );
  };
  
  // Set the correct option (single correct answer mode)
  const handleSetCorrectOption = (questionId: string, optionId: string) => {
    onQuestionsChange(
      questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options.map(o => ({ 
                ...o, 
                isCorrect: o.id === optionId 
              }))
            }
          : q
      )
    );
  };
  
  // Toggle option correctness (multiple correct answers mode)
  const handleToggleCorrectOption = (questionId: string, optionId: string) => {
    onQuestionsChange(
      questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options.map(o => 
                o.id === optionId 
                  ? { ...o, isCorrect: !o.isCorrect }
                  : o
              )
            }
          : q
      )
    );
  };
  
  // Render WhatsApp message preview
  const renderWhatsAppPreview = () => {
    if (questions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No questions yet. Add questions to see preview.</p>
        </div>
      );
    }
    
    // Get current question for preview
    const question = questions[previewQuestion];
    if (!question) return null;
    
    return (
      <div className="max-w-md mx-auto">
        <div className="flex justify-between mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPreviewQuestion(prev => Math.max(0, prev - 1))}
            disabled={previewQuestion === 0}
          >
            Previous
          </Button>
          <span className="text-sm font-medium">
            Question {previewQuestion + 1} of {questions.length}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPreviewQuestion(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={previewQuestion === questions.length - 1}
          >
            Next
          </Button>
        </div>
        
        {/* WhatsApp style preview */}
        <div className="whatsapp-preview rounded-lg overflow-hidden bg-green-50 border border-green-200">
          <div className="bg-green-600 text-white text-sm font-medium p-3">
            WhatsApp Preview
          </div>
          <div className="p-4 bg-[#ece5dd] space-y-3">
            {/* Message bubble */}
            <div className="ml-auto max-w-[80%] bg-[#dcf8c6] p-3 rounded-lg shadow-sm">
              <div className="font-medium">{question.text || 'Question text will appear here'}</div>
              
              {/* Options */}
              <div className="mt-2 space-y-1 text-sm">
                {question.options.map((option, index) => (
                  <div key={option.id}>
                    {index + 1}. {option.text || `Option ${index + 1}`}
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                Please reply with the number of your answer.
              </div>
            </div>
            
            {/* User response simulation */}
            <div className="mr-auto max-w-[80%] bg-white p-3 rounded-lg shadow-sm">
              <div className="text-sm text-gray-700">
                2
              </div>
            </div>
            
            {/* Correct answer message (if applicable) */}
            <div className="ml-auto max-w-[80%] bg-[#dcf8c6] p-3 rounded-lg shadow-sm">
              <div className="text-sm">
                {question.explanation ? 
                  question.explanation : 
                  'After answering, users will see feedback or an explanation (if provided).'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="quiz-editor space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">Quiz Settings</TabsTrigger>
          <TabsTrigger value="preview">WhatsApp Preview</TabsTrigger>
        </TabsList>
        
        {/* Questions Tab */}
        <TabsContent value="questions">
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>WhatsApp Delivery Format</AlertTitle>
            <AlertDescription>
              This quiz will be delivered via WhatsApp with numbered options. Users will reply with the option number.
              For optimal experience, keep options short and limit to 5 options per question.
            </AlertDescription>
          </Alert>
          
          {questions.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-2">No Questions Yet</h3>
              <p className="text-gray-500 mb-4">Add questions to your quiz</p>
              <Button onClick={handleAddQuestion} variant="default">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id} className="quiz-question">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div className="flex items-center">
                      <CardTitle className="text-md">Question {index + 1}</CardTitle>
                      <Badge variant="outline" className="ml-2">
                        {question.options.length} options
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveQuestion(question.id)}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Question text */}
                    <div>
                      <Textarea
                        value={question.text}
                        onChange={(e) => handleUpdateQuestion(question.id, { text: e.target.value })}
                        placeholder="Enter your question..."
                        className="resize-none"
                      />
                    </div>
                    
                    {/* Question options */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Answer Options</Label>
                      {question.options.map((option, optIndex) => (
                        <div 
                          key={option.id} 
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full border bg-gray-100 flex items-center justify-center">
                            {optIndex + 1}
                          </div>
                          <div 
                            className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer
                              ${option.isCorrect 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600'}`}
                            onClick={() => handleSetCorrectOption(question.id, option.id)}
                          >
                            {option.isCorrect && <Check className="w-4 h-4" />}
                          </div>
                          <Input
                            value={option.text}
                            onChange={(e) => handleUpdateOption(question.id, option.id, { text: e.target.value })}
                            placeholder={`Option ${optIndex + 1}`}
                            className="flex-1"
                          />
                          {question.options.length > 2 && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveOption(question.id, option.id)}
                            >
                              <X className="w-4 h-4 text-gray-500" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {question.options.length < 5 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAddOption(question.id)}
                          className="mt-2"
                        >
                          <PlusCircle className="w-4 h-4 mr-1" />
                          Add Option
                        </Button>
                      )}
                      {question.options.length >= 5 && (
                        <div className="text-sm text-amber-600 mt-2">
                          Maximum 5 options allowed for WhatsApp quiz format
                        </div>
                      )}
                    </div>
                    
                    {/* Explanation */}
                    <div>
                      <Label className="text-sm font-medium">Explanation (Shown after user answers)</Label>
                      <Textarea
                        value={question.explanation || ''}
                        onChange={(e) => handleUpdateQuestion(question.id, { explanation: e.target.value })}
                        placeholder="Explain the correct answer..."
                        className="resize-none mt-1"
                      />
                    </div>
                    
                    {/* Points */}
                    <div>
                      <Label className="text-sm font-medium">Points</Label>
                      <Input
                        type="number"
                        min="1"
                        value={question.points || 1}
                        onChange={(e) => handleUpdateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                        className="w-24 mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                onClick={handleAddQuestion} 
                variant="outline" 
                className="w-full mt-4"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          )}
          
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Scoring Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Scoring Type</Label>
                  <Select
                    value={scoringType}
                    onValueChange={onScoringTypeChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a scoring type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard - Each question worth assigned points</SelectItem>
                      <SelectItem value="weighted">Weighted - Questions have different weights</SelectItem>
                      <SelectItem value="no_score">No Scoring - Feedback only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* WhatsApp Preview Tab */}
        <TabsContent value="preview">
          {renderWhatsAppPreview()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizEditor; 